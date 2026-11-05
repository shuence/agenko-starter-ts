import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const DEGREES = [20, 80, 140, 200, 260, 320];

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: 180,
          height: 180,
          background: "#ffffff",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* 6-petal pinwheel - each petal rotates around its inner tip at center */}
        <div style={{ position: "relative", width: 144, height: 144, display: "flex" }}>
          {DEGREES.map((deg) => (
            <div
              key={deg}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: 28,
                height: 72,
                marginLeft: -14,
                marginTop: -72,
                background: "#4f46ff",
                borderRadius: "50%",
                transform: `rotate(${deg}deg)`,
                transformOrigin: "50% 100%",
              }}
            />
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
