import { Suspense } from "react";
import { AccountMenu } from "./account-menu";
import { Home } from "./home";

export default function HomePage() {
  return <Home account={<Suspense><AccountMenu /></Suspense>} />;
}
