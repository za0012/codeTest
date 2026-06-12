import { supabase } from "../supabase";

// 사용방법: const { user, member } = await checkIsOwner(studyId);
// await checkIsOwner(studyId);
export const checkIsOwner = async (studyId: number) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("로그인 필요");

  const { data, error } = await supabase
    .from("study_members")
    .select("id, role")
    .eq("study_id", studyId)
    .eq("user_id", user.id)
    .single();
  if (error || data.role !== "스터디장") throw new Error("스터디장만 가능해요");

  return { user, member: data };
};

export const getMyStudyInfo = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // 1. study_members에서 study_id만 먼저 조회
  const { data: member, error: memberError } = await supabase
    .from("study_members")
    .select("study_id")
    .eq("user_id", user.id)
    .single();

  if (memberError || !member) return null;

  // 2. study_id로 studies 따로 조회
  const { data: study, error: studyError } = await supabase
    .from("studies")
    .select("*")
    .eq("id", member.study_id)
    .single();

  if (studyError) return null;

  return study;
};

export const getMyMemberInfo = async () => {
  const { data, error } = await supabase
    .from("study_members")
    .select("*")
    .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
    .single();
  if (error) return null; // 스터디 없으면 null → 스터디 생성/참여 페이지로
  return data;
};

// 스터디 생성
export const createStudy = async (name: string, description: string) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("로그인 필요");

  // metadata에서 꺼내기
  const memberName = user.user_metadata.name;
  const emoji = user.user_metadata.emoji;

  const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

  const { data: study, error } = await supabase
    .from("studies")
    .insert({ name, description, emoji: "🐹", invite_code: inviteCode })
    .select()
    .single();
  if (error) throw error;

  await supabase.from("study_members").insert({
    study_id: study.id,
    user_id: user.id,
    name: memberName,
    emoji,
    role: "스터디장",
  });

  return study;
};

// 초대코드로 스터디 참여
export const joinStudy = async (inviteCode: string) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("로그인 필요");

  // metadata에서 꺼내기
  const name = user.user_metadata.name;
  const emoji = user.user_metadata.emoji;

  const { data: study, error } = await supabase
    .from("studies")
    .select("id")
    .eq("invite_code", inviteCode.toUpperCase())
    .single();
  if (error) throw new Error("존재하지 않는 초대 코드예요");

  await supabase.from("study_members").insert({
    study_id: study.id,
    user_id: user.id,
    name,
    emoji,
    role: "멤버",
  });

  return study;
};

// 스터디 정보 조회
// export const getStudyMembers = async (studyId: number | undefined) => {
//   const { data, error } = await supabase
//     .from("study_members")
//     .select("*")
//     .eq("study_id", studyId); // study_id로 필터
//   if (error) throw error;
//   return data;
// };

export const getStudyMembers = async (studyId: number) => {
  const { data, error } = await supabase
    .from("study_members")
    .select("*")
    .eq("study_id", studyId)
    .order("role", { ascending: true }); // 스터디장 먼저
  if (error) throw error;
  return data;
};

// 초대 코드 재발급
export const regenerateInviteCode = async (studyId: number) => {
  const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  const { data, error } = await supabase
    .from("studies")
    .update({ invite_code: newCode })
    .eq("id", studyId)
    .select("invite_code")
    .single();
  if (error) throw error;
  return data.invite_code;
};

// 스터디장 위임
export const transferOwnership = async (
  studyId: number,
  targetMemberId: number,
) => {
  const { member: me } = await checkIsOwner(studyId);

  // 트랜잭션처럼 처리 (둘 다 업데이트)
  const [{ error: e1 }, { error: e2 }] = await Promise.all([
    supabase.from("study_members").update({ role: "멤버" }).eq("id", me.id),
    supabase
      .from("study_members")
      .update({ role: "스터디장" })
      .eq("id", targetMemberId),
  ]);
  if (e1 || e2) throw new Error("위임 중 오류가 발생했어요");
};

// 멤버 강퇴 (스터디장만)
export const kickMember = async (studyId: number, targetMemberId: number) => {
  await checkIsOwner(studyId);

  const { error } = await supabase
    .from("study_members")
    .delete()
    .eq("id", targetMemberId);
  if (error) throw error;
};

// 스터디 정보 조회할 때 delete_scheduled_at 있으면 팝업 띄우기
export const getStudyInfo = async (studyId: number) => {
  const { data, error } = await supabase
    .from("studies")
    .select("*")
    .eq("id", studyId)
    .single();
  if (error) throw error;
  return data;
};
