import localFont from "next/font/local";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

const wordmarkFont = localFont({
  src: "../public/fonts/Pacifico-Regular.ttf",
  weight: "400",
  display: "swap",
});

export function SiteHeader({ account, launch }: { account: ReactNode; launch?: ReactNode }) {
  return (
    <header className="header account-header">
      <Link href="/" className={`header-wordmark ${wordmarkFont.className}`}>
        <Image className="header-logo" src="/dongbaek/bloom-your-way.png" width={54} height={36} alt="" />
        <span>Bloom Your Way</span>
      </Link>
      <nav aria-label="메인 메뉴">
        <Link href="/#collection">콜라보 컬렉션</Link>
        <Link href="/#story">마을 이야기</Link>
        <Link href="/#forest">숲속의 만남</Link>
      </nav>
      <div className="header-actions">
        {account}
        {launch}
      </div>
    </header>
  );
}

