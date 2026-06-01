// lib/api/problems.ts

import type { PlatformType } from "@/constants/problem";
import { supabase } from "../supabase";

// 스터디 문제 전체 조회
// export const getProblems = async (studyId: number) => {
//   const { data, error } = await supabase
//     .from("problems")
//     .select("*, study_members(name, emoji)")
//     .eq("study_id", studyId)
//     .order("date", { ascending: false });
//   if (error) throw error;
//   return data;
// };

// export const getProblems = async (
//   studyId: number,
//   filters?: {
//     platform?: string;
//     difficulty?: string;
//     tag?: string;
//     memberId?: number;
//     search?: string;
//   },
// ) => {
//   let query = supabase
//     .from("problems")
//     .select("*, study_members(name, emoji)")
//     .eq("study_id", studyId)
//     .order("date", { ascending: false });

//   if (filters?.platform && filters.platform !== "all") {
//     query = query.eq("platform", filters.platform);
//   }

//   if (filters?.difficulty && filters.difficulty !== "all") {
//     query = query.eq("difficulty", filters.difficulty);
//   }

//   if (filters?.tag && filters.tag !== "all") {
//     query = query.contains("tags", [filters.tag]);
//   }

//   if (filters?.memberId) {
//     query = query.eq("member_id", filters.memberId);
//   }

//   if (filters?.search) {
//     query = query.or(
//       `title.ilike.%${filters.search}%,number.ilike.%${filters.search}%`,
//     );
//   }

//   const { data, error } = await query;
//   if (error) throw error;
//   return data;
// };

export const getProblems = async (
  studyId: number,
  filters?: {
    platform?: string;
    difficulty?: string;
    tag?: string;
    memberName?: string; // ← memberId 대신 name으로 받고
    search?: string;
  },
) => {
  let query = supabase
    .from("problems")
    .select("*, study_members(name, emoji)")
    .eq("study_id", studyId)
    .order("date", { ascending: false });

  console.log("memberNamememberName", filters?.memberName);

  if (filters?.platform && filters.platform !== "all") {
    query = query.eq("platform", filters.platform);
  }

  if (filters?.difficulty && filters.difficulty !== "all") {
    query = query.eq("difficulty", filters.difficulty);
  }

  if (filters?.tag && filters.tag !== "all") {
    query = query.contains("tags", [filters.tag]);
  }

  if (filters?.memberName) {
    // study_members에서 name으로 id 먼저 조회
    const { data: member } = await supabase
      .from("study_members")
      .select("id")
      .eq("name", filters.memberName)
      .eq("study_id", studyId)
      .single();

    if (member) {
      query = query.eq("member_id", member.id);
    }
  }

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;

  // ...
};

// 문제 상세 조회
export const getProblemById = async (id: number) => {
  const { data, error } = await supabase
    .from("problems")
    .select("*, study_members(name, emoji)")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};

// 문제 추가
export const addProblem = async (problem: {
  study_id: number;
  member_id: number;
  title: string;
  platform: PlatformType;
  difficulty: string;
  tags: string[];
  date: string;
  solution: string;
  memo?: string;
  time_spent: number;
  url: string;
}) => {
  const { data, error } = await supabase
    .from("problems")
    .insert(problem)
    .select()
    .single();
  if (error) throw error;
  return data;
};

// 문제 수정
export const updateProblem = async (
  id: number,
  updates: {
    title?: string;
    number?: string;
    platform?: string;
    difficulty?: string;
    tags?: string[];
    date?: string;
    solution?: string;
    memo?: string;
    time_spent?: number;
    url?: string;
  },
) => {
  const { data, error } = await supabase
    .from("problems")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

// 문제 삭제
export const deleteProblem = async (id: number) => {
  const { error } = await supabase.from("problems").delete().eq("id", id);
  if (error) throw error;
};

// 멤버별 문제 조회
export const getProblemsByMember = async (memberId: number) => {
  const { data, error } = await supabase
    .from("problems")
    .select("*")
    .eq("member_id", memberId)
    .order("date", { ascending: false });
  if (error) throw error;
  return data;
};

// 날짜별 문제 조회 (대시보드 캘린더용)
export const getProblemsByDate = async (studyId: number, date: string) => {
  const { data, error } = await supabase
    .from("problems")
    .select("*, study_members(name, emoji)")
    .eq("study_id", studyId)
    .eq("date", date);
  if (error) throw error;
  return data;
};
