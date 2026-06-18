import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 8,
        }}
      >
        <div
          style={{
            width: 20,
            height: 14,
            background: "#ffffff",
            borderRadius: 4,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: "#e5e5e5",
              borderRadius: "4px 4px 0 0",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 3,
              top: 6,
              width: 5,
              height: 5,
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
