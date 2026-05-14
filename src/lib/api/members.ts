// lib/api/members.ts

import { supabase } from "../supabase";

// 현재 로그인한 유저의 study_member 정보
export const getMyMemberInfo = async () => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("로그인 필요");

  const { data, error } = await supabase
    .from("study_members")
    .select("*")
    .eq("user_id", user.id)
    .single();
  if (error) throw error;
  return data;
};

// 스터디 멤버 전체 조회
export const getStudyMembers = async (studyId: number) => {
  const { data, error } = await supabase
    .from("study_members")
    .select("*")
    .eq("study_id", studyId)
    .order("role", { ascending: true }); // 스터디장 먼저
  if (error) throw error;
  return data;
};

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
