import { NextResponse } from "next/server";
import { signoutAction } from "@/lib/auth/actions";

/**
 * POST /api/auth/signout — clear the session cookie and redirect to login.
 *
 * Plain HTML form posts hit this route (works without JS, matches the
 * topbar's sign-out button which is wrapped in `<form>`).
 */
export async function POST() {
  await signoutAction();
  // signoutAction throws redirect — line below is unreachable, kept for types.
  return NextResponse.redirect(new URL("/admin/login", "http://localhost"));
}
