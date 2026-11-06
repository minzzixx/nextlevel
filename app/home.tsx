"use client";
import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Flower } from "./village-art";
import { GoodsGallery } from "./goods-gallery";
import { SiteHeader } from "./site-header";

const art = "/dongbaek/";

function playInlineVideo(video: HTMLVideoElement | null) {
  if (video && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    void video.play().catch(() => {
      // The browser can block autoplay. The controls allow manual playback.
    });
  }
}

export function Home({ account }: { account: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [play, setPlay] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const motionStage = useRef<HTMLDivElement>(null);
  const heroTitle = useRef<HTMLHeadingElement>(null);
  const heroVideo = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const title = heroTitle.current;
    const video = heroVideo.current;
    if (!title || !video) return;

    playInlineVideo(video);
    if (!video.requestVideoFrameCallback) return;

    const bounce = title.animate([
      { offset: 0, transform: "none" },
      { offset: 0.06, transform: "translateY(2px) scale(1.02, .96)" },
      { offset: 0.14, transform: "translateY(-10px) scale(.99, 1.03)" },
      { offset: 0.25, transform: "translateY(2px) scale(1.02, .97)" },
      { offset: 0.32, transform: "translateY(-4px)" },
      { offset: 0.44, transform: "none" },
      { offset: 1, transform: "none" },
    ], { duration: 1000, easing: "ease-in-out" });
    bounce.pause();

    const syncTitle: VideoFrameRequestCallback = (_, frame) => {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        const beats = Math.max(1, Math.round(video.duration / 4));
        bounce.currentTime = ((frame.mediaTime / video.duration * beats) % 1) * 1000;
      }
      frameId = video.requestVideoFrameCallback(syncTitle);
    };

    let frameId = video.requestVideoFrameCallback(syncTitle);
    return () => {
      video.cancelVideoFrameCallback(frameId);
      bounce.cancel();
    };
  }, []);

  useEffect(() => {
    const stage = motionStage.current;
    if (!stage) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) setIsPlaying(false);
      else if (entry.intersectionRatio >= 0.45) setIsPlaying(true);
    }, { threshold: [0, 0.45] });

    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  function show() {
    if (status !== "loading") { setStatus("idle"); setMessage(""); }
    dialog.current?.showModal();
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setStatus("loading");
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.get("email"), consent: data.get("consent") === "on" }),
      });
      const body = await response.json();
      if (!response.ok) { setMessage(body.error); setStatus("error"); return; }
      setStatus("success");
    } catch {
      setMessage("연결을 확인하고 다시 시도해 주세요.");
      setStatus("error");
    }
  }

  return <>
    <SiteHeader account={account} launch={<button className="button small" onClick={show}>출시 알림받기 <span>↗</span></button>} />
    <main>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow"><i className="dot" /> A LITTLE VILLAGE, A NEW STORY</span>
          <h1 ref={heroTitle}>동백마을의 이야기,<br />당신의 <em>일상으로.</em></h1>
          <p>동백숲의 색과 마을의 다정한 마음을 담아.<br />동백마을에서 시작하는 작은 만남.</p>
          <button className="button" onClick={show}>가장 먼저 알림받기 <span>↗</span></button>
          <small className="hero-note">
            <Image src={art + "bloom-your-way.png"} width={60} height={40} alt="Bloom Your Way" />
            조금만 기다려 주세요. 곧, 꽃피울게요.
          </small>
        </div>
        <figure className="hero-art">
          <video
            className="hero-video"
            src={art + "full.mp4"}
            width={1280}
            height={720}
            muted
            loop
            playsInline
            controls
            preload="metadata"
            ref={heroVideo}
            aria-label="동백마을 캠페인 영상"
          />
          <figcaption className="hero-caption">
            <span>01 / A FILM FROM DONGBAEK VILLAGE</span>
            <div className="hero-friends">
              <Image className="hero-mint" src={art + "mint-think.png"} width={188} height={244} alt="민트 콩" />
              <Image className="hero-camellia" src={art + "camellia-hello.png"} width={260} height={267} alt="동백꽃" />
              <Image className="hero-blue" src={art + "blue-wave.png"} width={263} height={258} alt="블루 네잎" />
            </div>
          </figcaption>
        </figure>
        <a className="scroll-cue" href="#collection">SCROLL TO DISCOVER <span>↓</span></a>
      </section>
      <div className="ribbon"><span>동백의 색을 담고</span><Flower /><span>마을의 마음을 잇고</span><Flower /><span>일상에 작은 꽃을 피우다</span></div>

      <section id="collection" className="section collection">
        <div className="section-heading">
          <div><span className="eyebrow">01 — THE COLLABORATION</span><h2>곁에 두고 싶은<br />마을의 조각들.</h2></div>
          <video
            className="collection-animation"
            src={art + "collection-animation.mp4"}
            width={640}
            height={360}
            muted
            loop
            playsInline
            preload="metadata"
            ref={playInlineVideo}
            aria-label="동백마을 콜라보 캐릭터 애니메이션"
          />
          <div><p>숲에서 만난 색, 손끝에 남은 온기.<br />동백마을의 감각이 일상의 물건으로 찾아옵니다.</p><span className="tag">동백마을 · 출시 예정</span></div>
        </div>
        <GoodsGallery />
        <p className="note">굿즈 사진과 디자인 시안입니다. 출시 일정은 추후 공개됩니다.</p>
        <button className="text-button" onClick={show}>컬렉션 출시 소식 받아보기 <span>↗</span></button>
      </section>

      <section id="story" className="section story">
        <figure>
          <div className="village-frame story-frame">
            <Image
              src={art + "dreamy-forest.png"}
              width={1254}
              height={1254}
              sizes="(max-width: 660px) 88vw, 44vw"
              alt="별과 달이 떠 있는 동백숲의 마을소녀와 동백이"
              className="block h-auto w-full"
            />
          </div>
          <figcaption>마을소녀와 동백이의 숲길 산책</figcaption>
        </figure>
        <div><span className="eyebrow">02 — A WALK THROUGH THE VILLAGE</span><h2>천천히 걸을수록,<br />더 다정한 마을.</h2>
          <p>바람이 나뭇잎 사이를 지나고,<br />동백꽃 한 송이가 조용히 인사를 건네는 곳.</p>
          <p>마을소녀와 동백이를 따라 걸어보세요.<br />숲을 바라보고, 손으로 만들고, 잠시 쉬어가는 시간.<br />그 느긋함을 이번 컬렉션에 담았습니다.</p>
          <ol><li>동백숲을 걸으며 꽃과 잎의 색을 살펴봐요.</li><li>작은 꽃 모양을 빚으며 마을의 기억을 남겨요.</li><li>따뜻한 차 한 잔과 함께 잠시 쉬어가요.</li></ol>
          <a className="physical-button dungeon-button" href="/dungeon/index.html">동백마을 던전 체험하기 <span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <section id="forest" className="section forest">
        <video
          className="forest-background"
          src={art + "jeju-stone.mp4"}
          muted
          loop
          playsInline
          preload="metadata"
          ref={playInlineVideo}
          aria-hidden="true"
        />
        <span className="eyebrow">03 — WHERE OUR STORY BLOOMS</span><h2>숲에서 시작된 만남,<br />하나의 이름으로.</h2>
        <p>동백숲의 동백꽃과 민트콩 요정이 만나는 순간.<br />두 친구가 모여 콜라보 로고가 피어납니다.</p>
        <div ref={motionStage}>
          <div key={play} className={`logo-stage ${isPlaying ? "playing" : ""}`} role="img" aria-label="동백꽃 캐릭터와 민트콩 요정이 만나 동백마을 로고가 됩니다">
            <span className="orbit" /><span className="orbit other" /><span className="spark left">✧</span><span className="spark right">✧</span>
            <div className="logo-flower"><Image src={art + "camellia.png"} width={331} height={384} alt="" /></div>
            <div className="fairy"><Image src={art + "mint.png"} width={272} height={338} alt="" /></div>
            <div className="lockup"><Image src={art + "bloom-your-way.png"} width={300} height={200} alt="Bloom Your Way 원본 로고" /><small>DONGBAEK VILLAGE</small></div>
          </div>
        </div>
        <button className="replay" onClick={() => { setIsPlaying(true); setPlay((value) => value + 1); }}>↻ <span>다시 만나보기</span></button>
        <details className="motion-film"><summary className="physical-button motion-button">브랜드 모션 영상 보기</summary><video src={art + "bloom-motion.mp4"} poster={art + "bloom-your-way.png"} controls playsInline preload="none" aria-label="Bloom Your Way 브랜드 모션 영상" /></details>
      </section>

      <section className="section notify">
        <div className="notify-flower"><Image src={art + "camellia-hello.png"} width={260} height={267} alt="" /></div><span className="leaf" aria-hidden="true">❧</span>
        <span className="eyebrow">OUR NEXT CHAPTER, WITH YOU</span>
        <h2>꽃피는 소식을,<br />가장 먼저 전할게요.</h2>
        <p>동백마을 × A2O Lite의 새로운 컬렉션.<br />출시 소식을 놓치지 않도록 알림을 신청해 주세요.</p>
        <button className="button" onClick={show}>출시 알림받기 <span>↗</span></button>
      </section>
    </main>
    <footer><a href="#" className="brand"><Image src={art + "bloom-your-way.png"} width={60} height={40} alt="Bloom Your Way" />동백마을</a><p>마을의 마음이 당신의 일상에 닿기를.</p><small>DONGBAEK VILLAGE</small></footer>
    <dialog ref={dialog} className="notify-dialog" aria-labelledby="notify-title">
      <button className="close" onClick={() => dialog.current?.close()} aria-label="닫기">×</button>
      <Image className="notify-logo" src={art + "bloom-your-way.png"} width={84} height={56} alt="Bloom Your Way" />
      {status === "success" ? <div role="status"><span className="eyebrow">THANK YOU FOR JOINING</span><h2 id="notify-title">우리, 꽃필 때 만나요.</h2><p>알림 신청이 저장됐어요.<br />동백마을의 다음 이야기를 함께 기다려 주세요.</p><button className="button" onClick={() => dialog.current?.close()}>확인했어요 <span>✓</span></button></div> :
        <><span className="eyebrow">A LITTLE NOTE FOR YOU</span><h2 id="notify-title">꽃피는 소식, 받아보세요.</h2><p>콜라보 컬렉션의 출시 소식을 받을 이메일 주소를 남겨 주세요.</p>
        <form onSubmit={submit}><label htmlFor="email">이메일 주소</label><input id="email" name="email" type="email" autoComplete="email" placeholder="hello@example.com" maxLength={254} required />
        <label className="consent"><input type="checkbox" name="consent" required />출시 알림 신청을 위한 이메일 수집·이용에 동의합니다.</label>
        <p className="form-note">신청 정보는 이 서버에 저장됩니다. 이메일 발송 기능은 준비 중입니다.</p>
        {status === "error" && <p className="error" role="alert">{message}</p>}
        <button className="button" disabled={status === "loading"}>{status === "loading" ? "신청하고 있어요…" : "알림받기"} <span>↗</span></button></form></>}
    </dialog>
  </>;
}

