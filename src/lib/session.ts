import { supabase } from "@/integrations/supabase/client";
import { DEMO_EMAIL, isDemoSession, setDemoSession } from "@/lib/demo-auth";

export async function hasActiveSession(): Promise<boolean> {
  if (isDemoSession()) return true;
  const { data } = await supabase.auth.getSession();
  return !!data.session;
}

export async function getSessionEmail(): Promise<string | null> {
  if (isDemoSession()) return DEMO_EMAIL;
  const { data } = await supabase.auth.getSession();
  return data.session?.user.email ?? null;
}

export function startDemoSession() {
  setDemoSession(true);
}

export async function signOutAll() {
  setDemoSession(false);
  await supabase.auth.signOut();
}
