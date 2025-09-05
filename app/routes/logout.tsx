// app/routes/logout.tsx
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { logout } from "~/services/auth.server";

export async function action({ request }: ActionFunctionArgs) {
  const clearCookie = await logout(request);
  return redirect("/login", { headers: { "Set-Cookie": clearCookie } });
}