"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export function LogoutButton() {
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  async function logout() {
    setBusy(true);
    setFailed(false);
    const { error } = await createClient().auth.signOut();
    if (error) {
      setFailed(true);
      setBusy(false);
      return;
    }
    window.location.replace("/");
  }

  return (
    <>
      <button type="button" onClick={logout} disabled={busy}>로그아웃</button>
      {failed && <span className="account-menu-error" role="alert">로그아웃에 실패했습니다.</span>}
    </>
  );
}

