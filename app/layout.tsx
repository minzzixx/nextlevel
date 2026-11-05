import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "동백마을 × A2O Lite | 일상에 피어나는 작은 만남",
  description: "동백숲의 색과 마을의 다정한 마음을 담은 콜라보 컬렉션. 동백마을 이야기와 출시 예정 제품을 만나보세요.",
  icons: { icon: "/camellia.svg" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="ko" data-scroll-behavior="smooth"><body>{children}</body></html>;
}

