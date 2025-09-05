// app/services/auth.server.ts
import { json, redirect } from "@remix-run/node";
import {
  createAdminClient,
  createSessionClient,
  readSessionSecretFromRequest,
} from "~/services/appwrite.server";
import {
  buildClearSessionCookie,
  readSessionSecretFromRequest as readSecret,
} from "./appwrite.server";
import { buildSetSessionCookie as buildSessionCookie } from "./appwrite.server";

// Return current user or null (server-side only)
export async function getUser(request: Request) {
  const secret = readSessionSecretFromRequest(request);
  if (!secret) return null;
  try {
    const { account } = createSessionClient(secret);
    return await account.get(); // Appwrite Account
  } catch {
    return null;
  }
}

// Throw 401/redirect if not authenticated
export async function requireUser(request: Request) {
  const user = await getUser(request);
  if (!user) throw redirect("/login"); // or json({error:"Unauthorized"},{status:401})
  return user;
}

// Email/password login: returns { setCookieHeader, user }
export async function loginWithEmailPassword(email: string, password: string) {
  const { account } = createAdminClient();
  // 1) Create a user session using the admin (API key) client
  const session = await account.createEmailPasswordSession(email, password);

  // 2) Build the browser cookie from the session
  const cookie = new Headers();
  cookie.append("Set-Cookie", buildSessionCookie(session.secret, session.expire));

  // 3) Use a session client (user session) to fetch the user, NOT the API key client
  const { account: sessionAccount } = createSessionClient(session.secret);
  const user = await sessionAccount.get();

  return { setCookieHeader: cookie.get("Set-Cookie")!, user };
}

// Clear cookie and close the current session at Appwrite
export async function logout(request: Request) {
  const secret = readSecret(request);
  if (secret) {
    try {
      const { account } = createSessionClient(secret);
      await account.deleteSession("current");
    } catch {
      // ignore
    }
  }
  return buildClearSessionCookie();
}

// small internal to avoid circular import above
