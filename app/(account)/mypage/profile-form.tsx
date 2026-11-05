"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createClient } from "@/utils/supabase/client";

export function ProfileForm({ email, nickname, userId }: { email: string; nickname: string; userId: string }) {
  const router = useRouter();
  const [value, setValue] = useState(nickname);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);

  async function update(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextNickname = value.trim();
    if (!nextNickname) {
      setMessage({ text: "닉네임을 입력해 주세요.", error: true });
      return;
    }

    setBusy(true);
    setMessage(null);
    const { error } = await createClient().from("profiles")
      .update({ nickname: nextNickname }).eq("id", userId).select("nickname").single();
    setBusy(false);

    if (error) {
      setMessage({ text: "닉네임을 수정하지 못했습니다.", error: true });
      return;
    }
    setValue(nextNickname);
    setMessage({ text: "닉네임을 수정했습니다.", error: false });
    router.refresh();
  }

  async function withdraw() {
    if (!window.confirm("회원 탈퇴를 진행할까요? 계정과 프로필이 삭제됩니다.")) return;

    setBusy(true);
    setMessage(null);
    const supabase = createClient();
    const { error } = await supabase.rpc("delete_own_account");
    if (error) {
      setMessage({ text: "회원 탈퇴를 완료하지 못했습니다.", error: true });
      setBusy(false);
      return;
    }

    await supabase.auth.signOut({ scope: "local" });
    window.location.replace("/");
  }

  return (
    <>
      <dl className="account-email"><dt>이메일</dt><dd>{email}</dd></dl>
      <form className="account-form" onSubmit={update}>
        <label>닉네임<input name="nickname" autoComplete="nickname" value={value} onChange={(event) => setValue(event.target.value)} required /></label>
        <button className="button" type="submit" disabled={busy}>닉네임 수정<span aria-hidden="true">↗</span></button>
      </form>
      {message && <p className={message.error ? "account-error" : "account-status"} role={message.error ? "alert" : "status"}>{message.text}</p>}
      <div className="account-withdraw">
        <button className="account-link" type="button" onClick={withdraw} disabled={busy}>회원 탈퇴</button>
      </div>
    </>
  );
}

