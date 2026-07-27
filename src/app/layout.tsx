import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "기도편지",
  description: "사역 소식을 나누고 함께 기도로 동역해요",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body
        className="font-sans text-stone-800 antialiased bg-cover bg-center bg-no-repeat bg-fixed"
        style={{
          backgroundImage:
            "linear-gradient(rgba(250,250,249,0.88), rgba(250,250,249,0.88)), url('/images/almaty-background.jpg')",
        }}
      >
        {children}
      </body>
    </html>
  );
}
