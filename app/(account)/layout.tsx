import { Suspense, type ReactNode } from "react";
import { AccountMenu } from "../account-menu";
import { SiteHeader } from "../site-header";

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader account={<Suspense><AccountMenu /></Suspense>} />
      {children}
    </>
  );
}

