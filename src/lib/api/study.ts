// lib/api/study.ts
import { supabase } from "../supabase";

// 로그인 후 → 내 스터디 찾기 (라우팅용)
// export const getMyStudy = async () => {
//   const { data, error } = await supabase
//     .from("study_members")
//     .select("study_id, studies(id, name, emoji, description)")
//     .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
//     .single();
//   if (error) return null; // 스터디 없으면 null → 스터디 생성/참여 페이지로
//   return data;
// };

export const getMyStudy = async () => {
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

export const getMyStudyInfo = async () => {
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

// 스터디 정보 수정 (스터디장만)
export const updateStudyInfo = async (
  studyId: number,
  updates: {
    name?: string;
    description?: string;
    emoji?: string;
  },
) => {
  const { data, error } = await supabase
    .from("studies")
    .update(updates)
    .eq("id", studyId)
    .select()
    .single();
  if (error) throw error;
  return data;
};
