"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { setPassword } from "@/app/login/actions";

function SetPasswordInner() {
  const params = useSearchParams();
  const next = params?.get("next") ?? "/";
  const [notice, setNotice] = useState("");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">DEDUXIS · YOU ARE SIGNED IN</p>
          <h1 className="text-3xl font-bold">Choose a password</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Next time you can sign in without waiting for an email. This password works on every Apixis family site.
          </p>
        </div>

        {notice && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded">
            {notice}
          </div>
        )}

        <form
          action={async (form) => {
            const result = await setPassword(form);
            if (result?.message) setNotice(result.message);
          }}
          className="space-y-6"
        >
          <input type="hidden" name="next" value={next} />
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              New password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="min 8 characters"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-black focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
          </div>

          <button
            type="submit"
            className="w-full px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded text-lg hover:opacity-90 transition"
          >
            Save password and continue
          </button>
        </form>

        <p className="text-center text-sm">
          <Link href={next} className="text-gray-600 dark:text-gray-400 hover:underline">
            Skip for now →
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <SetPasswordInner />
    </Suspense>
  );
}
