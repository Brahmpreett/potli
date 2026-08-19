import { supabase } from "@/integrations/supabase/client";

export async function trackEvent(
  event_name: string,
  metadata = {}
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase.from("events").insert({
    user_id: user.id,
    event_name,
    metadata,
  });
}