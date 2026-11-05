import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export function SiteHeader({ account, launch }: { account: ReactNode; launch?: ReactNode }) {
  return (
    <header className="header account-header">
      <Link href="/" className="brand">
        <Image className="header-logo" src="/dongbaek/bloom-your-way.png" width={84} height={56} alt="Bloom Your Way" />
        <span>동백마을 <i>×</i> <b>A2O Lite</b></span>
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

