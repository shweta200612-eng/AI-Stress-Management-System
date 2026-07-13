export const DEMO_EMAIL = "demo@bloom.app";
export const DEMO_PASSWORD = "demo123";
const DEMO_SESSION_KEY = "bloom-demo-session";

export function isDemoSession(): boolean {
  return typeof window !== "undefined" && localStorage.getItem(DEMO_SESSION_KEY) === "true";
}

export function setDemoSession(active: boolean) {
  if (typeof window === "undefined") return;
  if (active) localStorage.setItem(DEMO_SESSION_KEY, "true");
  else localStorage.removeItem(DEMO_SESSION_KEY);
}

export function isDemoCredentials(email: string, password: string): boolean {
  return email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD;
}
