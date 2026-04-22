// lib/api/study.ts
import { supabase } from "../supabase";

// 로그인 후 → 내 스터디 찾기 (라우팅용)
export const getMyStudy = async () => {
  const { data, error } = await supabase
    .from("study_members")
    .select("study_id, studies(id, name, emoji, description)")
    .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
    .single();
  if (error) return null; // 스터디 없으면 null → 스터디 생성/참여 페이지로
  return data;
};

// 스터디 생성
export const createStudy = async (
  name: string,
  description: string,
  emoji: string,
) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("로그인 필요");

  // 랜덤 초대코드 생성
  const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

  const { data: study, error } = await supabase
    .from("studies")
    .insert({ name, description, emoji, invite_code: inviteCode })
    .select()
    .single();
  if (error) throw error;

  // 스터디장으로 참여
  await supabase.from("study_members").insert({
    study_id: study.id,
    user_id: user.id,
    name: user.email?.split("@")[0] ?? "스터디장",
    role: "스터디장",
  });

  return study;
};

// 초대코드로 스터디 참여
export const joinStudy = async (inviteCode: string, memberName: string) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("로그인 필요");

  const { data: study, error } = await supabase
    .from("studies")
    .select("id")
    .eq("invite_code", inviteCode.toUpperCase())
    .single();
  if (error) throw new Error("존재하지 않는 초대 코드예요");

  await supabase.from("study_members").insert({
    study_id: study.id,
    user_id: user.id,
    name: memberName,
    role: "멤버",
  });

  return study;
};
