"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { goods, type GoodsItem, type GoodsPhoto } from "./goods";

const categories = ["전체", "패션", "소품"] as const;

function Photo({ photo, large = false }: { photo: GoodsPhoto; large?: boolean }) {
  if (!photo) return <div className="goods-placeholder"><span aria-hidden="true">✿</span><span>상품 사진 준비 중</span></div>;
  if ("crop" in photo) {
    const [x, y, width, height] = photo.crop;
    return <div className="goods-crop" style={{ aspectRatio: `${width} / ${height}` }}>
      <Image src={photo.src} alt={photo.alt} width={1448} height={1086} unoptimized style={{
        width: `${1448 / width * 100}%`, height: `${1086 / height * 100}%`,
        left: `${-x / width * 100}%`, top: `${-y / height * 100}%`,
      }} />
    </div>;
  }
  return <Image src={photo.src} alt={photo.alt} fill sizes={large ? "(max-width: 660px) 90vw, 570px" : "(max-width: 660px) 44vw, (max-width: 1000px) 29vw, 18vw"} className={photo.contain ? "photo-contain" : "photo-cover"} />;
}

export function GoodsGallery() {
  const [category, setCategory] = useState<(typeof categories)[number]>("전체");
  const [active, setActive] = useState<GoodsItem | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const visibleGoods = goods.filter((item) => category === "전체" || item.category === category);

  return <>
    <div className="goods-filter" role="group" aria-label="굿즈 분류">
      {categories.map((name) => <button key={name} type="button" aria-pressed={category === name} onClick={() => setCategory(name)}>{name}</button>)}
    </div>
    <div className="goods" aria-label={`${category} 굿즈 ${visibleGoods.length}종`}>
      {visibleGoods.map((item) => <article key={item.id}><button className="goods-card" type="button" onClick={(event) => {
        trigger.current = event.currentTarget;
        setActive(item);
        dialog.current?.showModal();
        if (dialog.current) dialog.current.scrollTop = 0;
      }}>
        <div className="product-art goods-photo">
          <Photo photo={item.photo} />
          {item.limited && <span className="limited-badge">한정판</span>}
        </div>
        <div className="product-copy">
          <span className="eyebrow">{item.category}</span><h3>{item.name}</h3><span className="card-link">자세히 보기 <span aria-hidden="true">↗</span></span>
        </div>
      </button></article>)}
    </div>
    <dialog ref={dialog} className="notify-dialog goods-dialog" aria-labelledby="goods-title" onClose={() => trigger.current?.focus({ preventScroll: true })} onClick={(event) => {
      if (event.target === event.currentTarget) dialog.current?.close();
    }}>
      {active && <div className="goods-detail">
        <button className="close" onClick={() => dialog.current?.close()} aria-label="상품 상세 닫기" autoFocus>×</button>
        <span className="eyebrow">{active.category} · 출시 예정</span>
        <h2 id="goods-title">{active.name}</h2>
        <div className="goods-photo detail-photo">
          <Photo photo={active.detail ?? active.photo} large />
          {active.limited && <span className="limited-badge">한정판</span>}
        </div>
        <dl><dt>이렇게 써요</dt><dd>{active.usage}</dd><dt>디자인 이야기</dt><dd>{active.story}</dd></dl>
      </div>}
    </dialog>
  </>;
}

