"use client";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { setPassword } from "@/app/login/actions";
import { AuthScreen } from "@/components/auth-screen";
function PasswordInner() {
  const params = useSearchParams();
  const raw = params.get("next") || "/dashboard";
  const next =
    raw.startsWith("/") && !raw.startsWith("//") ? raw : "/dashboard";
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <AuthScreen>
      <span className="eyebrow">YOUR ACCOUNT</span>
      <h1>
        Make yourself
        <br />
        at home.
      </h1>
      <p>Choose a password for a quicker sign-in next time.</p>
      <form
        action={async (form) => {
          setBusy(true);
          setNotice("");
          const result = await setPassword(form);
          if (result?.message) setNotice(result.message);
          setBusy(false);
        }}
      >
        <input type="hidden" name="next" value={next} />
        <div className="field">
          <label htmlFor="password">New password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="At least 8 characters"
          />
        </div>
        {notice && (
          <p role="alert" className="notice error">
            {notice}
          </p>
        )}
        <button disabled={busy} className="button primary full">
          {busy ? "Saving…" : "Save password and continue →"}
        </button>
      </form>
      <div className="auth-footer">
        <Link href={next}>Skip for now →</Link>
      </div>
    </AuthScreen>
  );
}
export default function SetPassword() {
  return (
    <Suspense>
      <PasswordInner />
    </Suspense>
  );
}
