import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#171717",
          borderRadius: 36,
        }}
      >
        <div
          style={{
            width: 112,
            height: 78,
            background: "#ffffff",
            borderRadius: 20,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 24,
              background: "#e5e5e5",
              borderRadius: "20px 20px 0 0",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 18,
              top: 34,
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "#171717",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
