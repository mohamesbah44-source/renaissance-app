import { ImageResponse } from "next/og";

const GOLD = "#c9a961";
const NIGHT = "#05060d";

// Soleil levant doré dans un cercle, sur fond nuit.
export function renderIcon(size: number) {
  const c = size / 2;
  const ringD = size * 0.6;
  const stroke = Math.max(2, Math.round(size * 0.018));
  const sunR = size * 0.15;
  const lineW = size * 0.48;

  return new ImageResponse(
    (
      <div
        style={{
          width: size,
          height: size,
          background: NIGHT,
          display: "flex",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: c - ringD / 2,
            top: c - ringD / 2,
            width: ringD,
            height: ringD,
            borderRadius: ringD,
            border: `${stroke}px solid ${GOLD}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: c - sunR,
            top: c - sunR,
            width: sunR * 2,
            height: sunR,
            background: GOLD,
            borderTopLeftRadius: sunR,
            borderTopRightRadius: sunR,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: c - lineW / 2,
            top: c,
            width: lineW,
            height: stroke,
            background: GOLD,
          }}
        />
      </div>
    ),
    { width: size, height: size }
  );
}
