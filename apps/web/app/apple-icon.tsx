import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Home-screen icon: a shell-plate hexagon on (PRODUCT)RED.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#BA0C2F" }}>
        <svg width="112" height="112" viewBox="0 0 64 64" fill="none" stroke="#fff" strokeWidth="4" strokeLinejoin="round">
          <path d="M32 8 52 19.5v25L32 56 12 44.5v-25z" />
          <path d="M32 32 52 19.5M32 32 12 19.5M32 32v24" />
        </svg>
      </div>
    ),
    size,
  );
}
