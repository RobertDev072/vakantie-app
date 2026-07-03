// Generates the PWA / iOS home-screen icons as plain PNGs, no dependencies.
// Design: diagonal green gradient background with a warm sun and a wave line.
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "icons");
mkdirSync(outDir, { recursive: true });

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, "ascii");
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function encodePNG(width, height, rgba) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type RGBA
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  const ihdr = chunk("IHDR", ihdrData);

  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0; // no filter
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const idat = chunk("IDAT", deflateSync(raw, { level: 9 }));
  const iend = chunk("IEND", Buffer.alloc(0));
  return Buffer.concat([signature, ihdr, idat, iend]);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}
function mix(c1, c2, t) {
  return [lerp(c1[0], c2[0], t), lerp(c1[1], c2[1], t), lerp(c1[2], c2[2], t)];
}
function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}

function drawIcon(size) {
  const rgba = Buffer.alloc(size * size * 4);
  const bgTop = [0, 168, 107]; // #00a86b
  const bgBottom = [4, 106, 72]; // #046a48
  const sun = [255, 200, 87]; // #ffc857
  const white = [255, 255, 255];

  const sunCx = size * 0.5;
  const sunCy = size * 0.38;
  const sunR = size * 0.2;
  const waveY = size * 0.72;
  const waveAmp = size * 0.035;
  const waveHalfThickness = size * 0.045;
  const edgeSoft = Math.max(1, size * 0.006);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = x / size;
      const ny = y / size;
      let color = mix(bgTop, bgBottom, clamp01((nx + ny) / 2));

      // sun (antialiased circle)
      const dSun = Math.hypot(x - sunCx, y - sunCy) - sunR;
      if (dSun < edgeSoft) {
        const a = clamp01(0.5 - dSun / (2 * edgeSoft));
        color = mix(color, sun, a);
      }

      // wave band (antialiased, sinusoidal center line)
      const centerY = waveY + Math.sin((x / size) * Math.PI * 2 * 1.5) * waveAmp;
      const dWave = Math.abs(y - centerY) - waveHalfThickness;
      if (dWave < edgeSoft) {
        const a = clamp01(0.5 - dWave / (2 * edgeSoft)) * 0.92;
        color = mix(color, white, a);
      }

      const i = (y * size + x) * 4;
      rgba[i] = Math.round(color[0]);
      rgba[i + 1] = Math.round(color[1]);
      rgba[i + 2] = Math.round(color[2]);
      rgba[i + 3] = 255;
    }
  }
  return rgba;
}

const sizes = [
  { size: 180, name: "apple-touch-icon.png" },
  { size: 192, name: "icon-192.png" },
  { size: 512, name: "icon-512.png" },
];

for (const { size, name } of sizes) {
  const rgba = drawIcon(size);
  const png = encodePNG(size, size, rgba);
  writeFileSync(join(outDir, name), png);
  console.log("wrote", name, `(${size}x${size}, ${png.length} bytes)`);
}
