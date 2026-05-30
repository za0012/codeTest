import { supabase } from "@/lib/supabase";

export const getMySolves = async (memberId: number) => {
  const { data, error } = await supabase
    .from("problems")
    .select("*")
    .eq("member_id", memberId);
  if (error) throw error;

  return data;
};
