import Image from "next/image";
import { SiteHeader } from "./site-header";
export function AuthScreen({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="main" className="auth-layout">
        <div className="auth-art">
          <Image
            src="/images/receipt-desk.webp"
            alt="A receipt captured at a bright, organized desk"
            fill
            sizes="50vw"
          />
          <div className="auth-art-copy">
            <span className="eyebrow">A LITTLE MORE CLARITY</span>
            <h2 style={{ marginTop: 15 }}>
              Good things start
              <br />
              with a little order.
            </h2>
            <p>Your receipts, records, and next steps. All in one place.</p>
          </div>
        </div>
        <section className="auth-content">
          <div className="auth-form">{children}</div>
        </section>
      </main>
    </>
  );
}
