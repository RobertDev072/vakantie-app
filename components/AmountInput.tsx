"use client";

import { useEffect, useRef, useState } from "react";

// Staat zowel komma als punt toe als decimaalteken (NL-toetsenbord-vriendelijk) en
// houdt tijdens het typen de ruwe tekst aan, zodat "10," niet meteen wordt
// teruggezet naar "10" voordat je de decimalen kunt intypen.
function sanitize(raw: string): string {
  let v = raw.replace(/[^0-9,.]/g, "");
  const firstSep = v.search(/[,.]/);
  if (firstSep !== -1) {
    v = v.slice(0, firstSep + 1) + v.slice(firstSep + 1).replace(/[,.]/g, "");
  }
  return v;
}

function toNumber(text: string): number {
  const n = parseFloat(text.replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

export default function AmountInput({
  value,
  onChange,
  className,
  min = 0,
  placeholder,
}: {
  value: number;
  onChange: (n: number) => void;
  className?: string;
  min?: number;
  placeholder?: string;
}) {
  const [text, setText] = useState(() => String(value));
  const focused = useRef(false);

  useEffect(() => {
    if (!focused.current) setText(String(value));
  }, [value]);

  return (
    <input
      type="text"
      inputMode="decimal"
      placeholder={placeholder}
      className={className}
      value={text}
      onFocus={() => {
        focused.current = true;
      }}
      onChange={(e) => {
        const clean = sanitize(e.target.value);
        setText(clean);
        onChange(toNumber(clean));
      }}
      onBlur={() => {
        focused.current = false;
        const n = Math.max(min, toNumber(text));
        setText(String(n));
        onChange(n);
      }}
    />
  );
}
