import { ImageResponse } from "next/og";

export const alt = "Agenko Starter — chat with an agent you can audit";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const DEGREES = [20, 80, 140, 200, 260, 320];

const INK = "#0a0a0b";
const SOFT = "#3f3f46";
const MUTED = "#6b6b6b";
const FRAME_TEXT = "#6b6b6b";
const FAINT = "#a1a1aa";
const LINE = "#e2e2e6";
const ACC = "#4f46ff";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#ffffff",
          color: INK,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 28,
            left: 28,
            right: 28,
            bottom: 28,
            border: `1px solid ${LINE}`,
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              position: "relative",
              width: 72,
              height: 72,
              display: "flex",
              flexShrink: 0,
            }}
          >
            {DEGREES.map((deg) => (
              <div
                key={deg}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: 12,
                  height: 31,
                  marginLeft: -6,
                  marginTop: -31,
                  background: ACC,
                  borderRadius: "50%",
                  transform: `rotate(${deg}deg)`,
                  transformOrigin: "50% 100%",
                }}
              />
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
            <span
              style={{
                fontSize: 30,
                fontWeight: 700,
                letterSpacing: "0.14em",
              }}
            >
              AGENKO
            </span>
            <span
              style={{
                fontSize: 20,
                letterSpacing: "0.18em",
                color: MUTED,
              }}
            >
              STARTER
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 76,
              fontWeight: 600,
              letterSpacing: "-0.035em",
              lineHeight: 1.04,
              maxWidth: 900,
            }}
          >
            <span>Chat with an agent</span>
            <span>
              you can <span style={{ color: ACC }}>audit</span>.
            </span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 24,
              color: SOFT,
              maxWidth: 760,
              lineHeight: 1.4,
            }}
          >
            A receipt for every tool call. A human gate before every
            irreversible one.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `1px solid ${LINE}`,
            paddingTop: 26,
            fontSize: 18,
            letterSpacing: "0.16em",
            color: FRAME_TEXT,
          }}
        >
          <span>NEXT.JS 16 · AI SDK 7 · @AGENKO/SDK</span>
          <span style={{ color: FAINT }}>starter.agenko.app</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
