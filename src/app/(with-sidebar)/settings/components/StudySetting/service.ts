import { checkIsOwner } from "@/lib/api/study";
import { supabase } from "@/lib/supabase";

// 스터디 삭제 예약 (7일 후)
export const scheduleDeleteStudy = async (studyId: number) => {
  await checkIsOwner(studyId);

  const deleteAt = new Date();
  deleteAt.setDate(deleteAt.getDate() + 7);

  const { data, error } = await supabase
    .from("studies")
    .update({ delete_scheduled_at: deleteAt.toISOString() })
    .eq("id", studyId)
    .select("delete_scheduled_at")
    .single();
  if (error) throw error;
  return data;
};

// 삭제 취소
export const cancelDeleteStudy = async (studyId: number) => {
  const { error } = await supabase
    .from("studies")
    .update({ delete_scheduled_at: null })
    .eq("id", studyId);
  if (error) throw error;
};
