import { ImageResponse } from "next/og";
import { SITE_TAGLINE } from "@/lib/constants";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #15150f 0%, #232620 55%, #313823 100%)",
          color: "#f6f3ea",
          fontFamily: "Arial, sans-serif",
          padding: 80,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 130,
            fontWeight: 700,
            letterSpacing: -2,
            textTransform: "uppercase",
            display: "flex",
          }}
        >
          70 for 70
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 36,
            color: "#d8cdac",
            display: "flex",
          }}
        >
          {SITE_TAGLINE}
        </div>
      </div>
    ),
    { ...size },
  );
}
