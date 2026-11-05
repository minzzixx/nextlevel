import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { ProfileForm } from "./profile-form";

async function Profile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile, error } = await supabase.from("profiles").select("nickname").eq("id", user.id).single();
  if (error || !profile) return <p role="alert">프로필을 불러오지 못했습니다.</p>;

  return <ProfileForm email={user.email ?? ""} nickname={profile.nickname} userId={user.id} />;
}

export default function MyPage() {
  return (
    <main className="account-page">
      <section className="account-panel" aria-labelledby="account-title">
        <span className="eyebrow">DONGBAEK VILLAGE</span>
        <h1 id="account-title">마이페이지</h1>
        <Suspense fallback={<p>프로필을 불러오는 중입니다.</p>}><Profile /></Suspense>
      </section>
    </main>
  );
}

