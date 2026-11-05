import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet, headers) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          const nextResponse = NextResponse.next({ request, headers: response.headers });
          for (const cookie of response.cookies.getAll()) nextResponse.cookies.set(cookie);
          for (const { name, value, options } of cookiesToSet) {
            nextResponse.cookies.set(name, value, options);
          }
          for (const [name, value] of Object.entries(headers)) {
            nextResponse.headers.set(name, value);
          }
          response = nextResponse;
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();
  if (request.nextUrl.pathname === "/mypage" && !data?.claims.sub) {
    const redirect = NextResponse.redirect(new URL("/login", request.url));
    for (const cookie of response.cookies.getAll()) redirect.cookies.set(cookie);
    redirect.headers.set("Cache-Control", "private, no-store");
    return redirect;
  }

  return response;
}

export const config = { matcher: ["/", "/login", "/signup", "/mypage"] };

