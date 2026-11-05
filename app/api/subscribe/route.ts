import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return Response.json({ error: "이 페이지에서 다시 신청해 주세요." }, { status: 403 });
  }
  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return Response.json({ error: "입력 내용을 확인해 주세요." }, { status: 415 });
  }
  const raw = await request.text();
  if (raw.length > 2048) return Response.json({ error: "입력 내용이 너무 깁니다." }, { status: 413 });
  let body: { email?: unknown; consent?: unknown } | null;
  try { body = JSON.parse(raw); } catch {
    return Response.json({ error: "입력 내용을 확인해 주세요." }, { status: 400 });
  }
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || body?.consent !== true) {
    return Response.json({ error: "이메일 주소와 수집·이용 동의를 확인해 주세요." }, { status: 400 });
  }
  try {
    const dir = path.join(process.cwd(), ".data", "subscribers");
    await mkdir(dir, { recursive: true, mode: 0o700 });
    const id = createHash("sha256").update(email).digest("hex");
    await writeFile(path.join(dir, id + ".json"), JSON.stringify({ email, createdAt: new Date().toISOString(), consent: true }), { flag: "wx", mode: 0o600 });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") {
      return Response.json({ error: "신청을 저장하지 못했어요. 잠시 후 다시 시도해 주세요." }, { status: 500 });
    }
  }
  return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}

