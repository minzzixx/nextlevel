"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { createClient } from "@/utils/supabase/client";

const minimumPasswordLength = 6;

export function AuthForm({ mode }: { mode: "signup" | "login" }) {
  const signup = mode === "signup";
  const title = signup ? "회원가입" : "로그인";
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email")).trim();
    const password = String(form.get("password"));
    const nickname = String(form.get("nickname") ?? "").trim();
    setError("");

    if (signup && !nickname) {
      setError("닉네임을 입력해 주세요.");
      return;
    }

    setBusy(true);
    try {
      const supabase = createClient();
      const result = signup
        ? await supabase.auth.signUp({ email, password, options: { data: { nickname } } })
        : await supabase.auth.signInWithPassword({ email, password });

      if (result.error || !result.data.session) {
        setError(signup ? "회원가입을 완료하지 못했습니다." : "이메일 또는 비밀번호가 틀렸습니다");
        setBusy(false);
        return;
      }

      window.location.replace("/");
    } catch {
      setError(signup ? "회원가입을 완료하지 못했습니다." : "이메일 또는 비밀번호가 틀렸습니다");
      setBusy(false);
    }
  }

  return (
    <main className="account-page">
      <section className="account-panel" aria-labelledby="account-title">
        <span className="eyebrow">DONGBAEK VILLAGE</span>
        <h1 id="account-title">{title}</h1>
        <form className="account-form" onSubmit={submit}>
          <label>이메일<input type="email" name="email" autoComplete="email" required /></label>
          <label>
            비밀번호
            <input
              type="password"
              name="password"
              autoComplete={signup ? "new-password" : "current-password"}
              minLength={signup ? minimumPasswordLength : undefined}
              aria-describedby={signup ? "signup-password-hint" : undefined}
              required
            />
            {signup && <span id="signup-password-hint">비밀번호는 {minimumPasswordLength}자 이상 입력해 주세요.</span>}
          </label>
          {signup && <label>닉네임<input name="nickname" autoComplete="nickname" required /></label>}
          {error && <p className="account-error" role="alert">{error}</p>}
          <button className="button" type="submit" disabled={busy}>{title}<span aria-hidden="true">↗</span></button>
        </form>
        <Link className="account-link" href={signup ? "/login" : "/signup"}>{signup ? "로그인" : "회원가입"}</Link>
      </section>
    </main>
  );
}

