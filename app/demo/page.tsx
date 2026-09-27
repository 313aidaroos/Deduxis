import { Suspense } from "react";
import Workspace from "@/components/workspace";
export const metadata = { title: "Explore the workspace" };
export default function Demo() {
  return (
    <Suspense
      fallback={
        <main id="main" className="empty-state">
          Opening the demo…
        </main>
      }
    >
      <Workspace demo />
    </Suspense>
  );
}
