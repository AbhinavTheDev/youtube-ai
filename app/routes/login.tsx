// app/routes/login.tsx
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { Logo } from "assets/icons/logo";
import { getUser, loginWithEmailPassword } from "~/services/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request);
  if (user) return redirect("/");
  return json({});
}

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const email = String(form.get("email") || "");
  const password = String(form.get("password") || "");

  if (!email || !password) {
    return json({ error: "Email and password are required." }, { status: 400 });
  }

  try {
    const { setCookieHeader } = await loginWithEmailPassword(email, password);
    return redirect("/", { headers: { "Set-Cookie": setCookieHeader } });
  } catch (e: any) {
    return json(
      { error: e?.message || "Invalid credentials." },
      { status: 401 }
    );
  }
}

export default function Login() {
  const actionData = useActionData<typeof action>();
  const nav = useNavigation();
  const busy = nav.state === "submitting";
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col md:flex-row w-full h-screen overflow-hidden">
        <section className="hidden sm:flex md:w-1/2 items-center justify-center">
          <img
            src="/placeholder.webp"
            alt="illustration"
            className="w-full h-full object-cover"
          />
        </section>
        <section className="md:w-1/2 md:p-4 w-full h-full flex items-center justify-center">
          <div
            className="w-full max-w-md bg-white rounded-2xl border border-zinc-100 shadow-sm space-y-4 p-8"
            style={{ backdropFilter: "saturate(180%) blur(2px)" }}
          >
            {" "}
            <div className="flex items-center gap-3">
              <div className="w-24 h-24">
              <Logo />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Welcome back</h2>
                <p className="text-sm text-zinc-500">
                  Sign in to explore
                </p>
              </div>
            </div>
            <Form method="post" className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium text-zinc-700"
                  htmlFor="email"
                >
                  Email
                </label>
                <div className="mt-1 relative">
                  <input
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    id="email"
                    name="email"
                    type="email"
                    required
                  />
                </div>
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-zinc-700"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    id="password"
                    name="password"
                    type="password"
                    required
                  />
                </div>
              </div>
              {actionData?.error && (
                <p className="text-red-600 text-sm text-center">
                  {actionData.error}
                </p>
              )}
              <button
                type="submit"
                disabled={busy}
                className="w-full bg-red-600 text-white rounded-full px-4 py-2 hover:bg-red-700 disabled:opacity-50 transition duration-200"
              >
                {busy ? "Signing in..." : "Sign in"}
              </button>
            </Form>
          </div>
        </section>
      </div>
    </div>
  );
}
