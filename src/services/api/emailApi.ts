import { supabase } from "@/lib/supabaseClient";

export async function updateEmailApi(
  newEmail: string,
): Promise<{ success?: boolean; error?: string }> {
  const { error } = await supabase.auth.updateUser({ email: newEmail });

  if (error) return { error: error.message };

  return { success: true };
}
