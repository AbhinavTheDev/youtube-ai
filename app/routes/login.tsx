// app/routes/login.tsx
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
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
    return json({ error: e?.message || "Invalid credentials." }, { status: 401 });
  }
}

export default function Login() {
  const actionData = useActionData<typeof action>();
  const nav = useNavigation();
  const busy = nav.state === "submitting";
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-sm bg-white shadow rounded p-6">
        <h1 className="text-xl font-semibold mb-4">Sign in</h1>
        <Form method="post" className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1" htmlFor="email">Email</label>
            <input className="w-full border rounded px-3 py-2" id="email" name="email" type="email" required />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1" htmlFor="password">Password</label>
            <input className="w-full border rounded px-3 py-2" id="password" name="password" type="password" required />
          </div>
          {actionData?.error && <p className="text-red-600 text-sm">{actionData.error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full bg-red-600 text-white rounded px-4 py-2 hover:bg-red-700 disabled:opacity-50"
          >
            {busy ? "Signing in..." : "Sign in"}
          </button>
        </Form>
      </div>
    </div>
  );
}