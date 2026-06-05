import { supabase } from "@/lib/supabase";

// 내 정보 수정
export const updateMyMemberInfo = async (
  memberId: number,
  updates: {
    name?: string;
    emoji?: string;
    bio?: string;
    tier?: string;
    tier_color?: string;
    tier_bg?: string;
    favorite_tag?: string;
  },
) => {
  const { data, error } = await supabase
    .from("study_members")
    .update(updates)
    .eq("id", memberId)
    .select()
    .single();
  if (error) throw error;
  return data;
};
