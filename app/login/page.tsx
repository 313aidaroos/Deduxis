"use client";
import Link from "next/link";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { magicLink, passwordSignIn } from "./actions";
import { SignInWithApixis } from "@/components/SignInWithApixis";

function LoginInner() {
  const params = useSearchParams();
  const next = params?.get("next") ?? "/";
  const [tab, setTab] = useState<"magic" | "password">("magic");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleMagicLink = async (form: FormData) => {
    setLoading(true);
    setMessage(null);
    const result = await magicLink(form);
    if (result?.message) {
      setMessage({ type: "success", text: result.message });
    }
    setLoading(false);
  };

  const handlePassword = async (form: FormData) => {
    setLoading(true);
    setMessage(null);
    const result = await passwordSignIn(form);
    if (result?.message) {
      setMessage({ type: "error", text: result.message });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Sign in to Deduxis</h1>
          <SignInWithApixis />
          <p className="text-gray-600 dark:text-gray-400">
            Receipt intelligence for your business
          </p>
        </div>

        <div className="flex border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setTab("magic")}
            className={`flex-1 pb-3 text-sm font-medium border-b-2 transition ${
              tab === "magic"
                ? "border-black dark:border-white"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Email me a link
          </button>
          <button
            onClick={() => setTab("password")}
            className={`flex-1 pb-3 text-sm font-medium border-b-2 transition ${
              tab === "password"
                ? "border-black dark:border-white"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Password
          </button>
        </div>

        {tab === "magic" && (
          <form action={handleMagicLink} className="space-y-6">
            <input type="hidden" name="next" value={next} />
            <div>
              <label htmlFor="magic-email" className="block text-sm font-medium mb-2">
                Email address
              </label>
              <input
                id="magic-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-black focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>

            {message && (
              <div className={`p-4 rounded ${message.type === "success" ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200" : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200"}`}>
                {message.text}
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded text-lg hover:opacity-90 transition disabled:opacity-50">
              {loading ? "Sending..." : "Email me a sign-in link"}
            </button>
          </form>
        )}

        {tab === "password" && (
          <form action={handlePassword} className="space-y-6">
            <input type="hidden" name="next" value={next} />
            <div>
              <label htmlFor="pw-email" className="block text-sm font-medium mb-2">Email address</label>
              <input id="pw-email" name="email" type="email" required autoComplete="email" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-black focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" placeholder="you@example.com" disabled={loading} />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
              <input id="password" name="password" type="password" required autoComplete="current-password" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-black focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" placeholder="Your password" disabled={loading} />
            </div>

            {message && (
              <div className={`p-4 rounded ${message.type === "success" ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200" : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200"}`}>
                {message.text}
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded text-lg hover:opacity-90 transition disabled:opacity-50">
              {loading ? "Signing in..." : "Sign in with password"}
            </button>
          </form>
        )}

        <div className="text-center">
          <Link href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:underline">← Back to home</Link>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}
