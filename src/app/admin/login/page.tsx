import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { site } from "@/lib/site";
import { getSession } from "@/lib/auth/session";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Newsroom · Sign in",
  description: "Sign in to the JM News newsroom.",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  // Already signed in? Skip straight to the dashboard (or honour `?next=`).
  const existing = await getSession();
  if (existing) {
    const { next } = await searchParams;
    redirect(next?.startsWith("/") ? next : "/admin");
  }
  const { next } = await searchParams;

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-surface-2 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Link href="/" aria-label={`${site.name} home`} className="inline-flex items-center gap-2.5">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-brand-600 font-display text-xl font-black text-white shadow-sm">
              JM
            </span>
            <span className="font-display text-2xl font-black tracking-tight text-fg">
              JM<span className="text-brand-600"> News</span>
            </span>
          </Link>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-extrabold text-fg">Newsroom sign in</h1>
          <p className="mt-1 text-sm text-fg-muted">
            Use your wp-admin username and a WordPress{" "}
            <span className="font-semibold text-fg">Application Password</span>.
          </p>

          <LoginForm next={next ?? "/admin"} />
        </div>

        <p className="mt-6 text-center text-sm">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-semibold text-fg-muted transition-colors hover:text-brand-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {site.name}
          </Link>
        </p>
      </div>
    </div>
  );
}
