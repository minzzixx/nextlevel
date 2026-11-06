import type { Metadata } from "next";
import localFont from "next/font/local";
import { LogoCursor } from "./logo-cursor";
import "./globals.css";

const headingFont = localFont({
  src: "../public/fonts/Jua-Regular.ttf",
  variable: "--font-heading",
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  title: "동백마을 | 일상에 피어나는 작은 만남",
  description: "동백숲의 색과 마을의 다정한 마음을 담은 콜라보 컬렉션. 동백마을 이야기와 출시 예정 제품을 만나보세요.",
  icons: { icon: "/camellia.svg" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="ko" className={headingFont.variable} data-scroll-behavior="smooth"><body>{children}<LogoCursor /></body></html>;
}

