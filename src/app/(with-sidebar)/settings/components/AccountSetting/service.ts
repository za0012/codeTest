import { supabase } from "@/lib/supabase";

// 스터디 탈퇴
export const leaveStudy = async (studyId: number) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("로그인 필요");

  const { data: member, error } = await supabase
    .from("study_members")
    .select("role")
    .eq("study_id", studyId)
    .eq("user_id", user.id)
    .single();
  if (error) throw error;
  if (member.role === "스터디장")
    throw new Error("스터디장은 위임 후 탈퇴할 수 있어요");

  const { error: deleteError } = await supabase
    .from("study_members")
    .delete()
    .eq("study_id", studyId)
    .eq("user_id", user.id);
  if (deleteError) throw deleteError;
};
