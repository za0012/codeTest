// lib/api/members.ts

import { supabase } from "../supabase";

// 로그인한 유저의 study_member 정보는 lib/api/study.ts 쪽 하나만 남긴다.
// 여기 있던 중복 구현은 스터디가 없을 때 throw했고 study.ts 쪽은 null을 돌려준다.
// 스터디 참여 전 사용자를 참여/생성 화면으로 보내는 흐름이 null에 걸려 있어 그쪽을 남겼다.

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
