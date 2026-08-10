import { ImageResponse } from "next/og";
import { normalizeLocale } from "@/lib/seo";

export const alt = "Vita Food Complex — Biscuits and Flour Manufacturer in Ethiopia";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);
  const isAmharic = locale === "am";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, #0B3D1C 0%, #23B349 55%, #82D942 100%)",
          color: "white",
          padding: "72px 84px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "520px",
            height: "520px",
            borderRadius: "999px",
            right: "-130px",
            top: "-170px",
            background: "rgba(255,255,255,0.13)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "360px",
            height: "360px",
            borderRadius: "999px",
            left: "-120px",
            bottom: "-180px",
            background: "rgba(255,255,255,0.08)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            zIndex: 2,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "108px",
                height: "108px",
                borderRadius: "28px",
                background: "white",
                color: "#23B349",
                fontSize: "50px",
                fontWeight: 900,
              }}
            >
              V
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ fontSize: "38px", fontWeight: 800 }}>
                Vita Food Complex
              </div>
              <div style={{ fontSize: "22px", opacity: 0.88 }}>
                Addis Ababa, Ethiopia
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: "930px",
              gap: "18px",
            }}
          >
            <div
              style={{
                fontSize: isAmharic ? "60px" : "66px",
                lineHeight: 1.02,
                letterSpacing: "-2px",
                fontWeight: 900,
              }}
            >
              {isAmharic
                ? "ጥራት ያለው ብስኩትና ዱቄት"
                : "Premium Biscuits & Flour, Made in Ethiopia"}
            </div>
            <div style={{ fontSize: "26px", opacity: 0.9 }}>
              {isAmharic
                ? "ጣዕም • ጥራት • ንጥረ ምግብ"
                : "Flavor • Quality • Nutrition"}
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
