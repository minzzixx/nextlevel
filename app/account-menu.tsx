import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { LogoutButton } from "./logout-button";

export async function AccountMenu() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <nav className="account-menu" aria-label="회원 메뉴">
        <Link href="/login">로그인</Link>
        <Link href="/signup">회원가입</Link>
      </nav>
    );
  }

  const { data: profile } = await supabase.from("profiles").select("nickname").eq("id", user.id).maybeSingle();

  return (
    <nav className="account-menu" aria-label="회원 메뉴">
      {profile && <span className="account-name">{profile.nickname}님</span>}
      <Link href="/mypage">마이페이지</Link>
      <LogoutButton />
    </nav>
  );
}

