// app/services/appwrite.server.ts
import { Client, Account } from "node-appwrite";

const endpoint = process.env.APPWRITE_ENDPOINT!;
const projectId = process.env.APPWRITE_PROJECT_ID!;
const apiKey = process.env.APPWRITE_API_KEY!; // API key with sessions.write scope

if (!endpoint || !projectId || !apiKey) {
  throw new Error("Missing APPWRITE_ENDPOINT / APPWRITE_PROJECT_ID / APPWRITE_API_KEY");
}

// Admin client (API key) for creating sessions, etc.
export function createAdminClient() {
  const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
  return { client, account: new Account(client), projectId };
}

// Session client built from the session cookie (per request, per user)
export function createSessionClient(sessionSecret: string) {
  const client = new Client().setEndpoint(endpoint).setProject(projectId).setSession(sessionSecret);
  return { client, account: new Account(client), projectId };
}

// Helpers to read/clear the Appwrite session cookie
export function getSessionCookieName(pid = projectId) {
  return `a_session_${pid}`;
}

export function readSessionSecretFromRequest(request: Request) {
  const cookie = request.headers.get("Cookie") || "";
  const name = `${getSessionCookieName()}=`;
  const parts = cookie.split(";").map((c) => c.trim());
  const hit = parts.find((c) => c.startsWith(name));
  return hit ? decodeURIComponent(hit.slice(name.length)) : null;
}

export function buildSetSessionCookie(sessionSecret: string, expiresISO: string) {
  const expires = new Date(expiresISO).toUTCString();
  const secure = process.env.NODE_ENV === "production"; // allow cookies on http://localhost in dev
  const parts = [
    `${getSessionCookieName()}=${encodeURIComponent(sessionSecret)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    secure ? "Secure" : "",
    `Expires=${expires}`,
  ].filter(Boolean);
  return parts.join("; ");
}

export function buildClearSessionCookie() {
  return `${getSessionCookieName()}=; Path=/; HttpOnly; SameSite=Strict; Secure; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}