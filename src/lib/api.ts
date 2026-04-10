// lib/api.ts
import { supabase } from "./supabase";
import { type Member, type Problem,type FormData, MEMBERS } from "../data/mockData"; // 기존 타입 재사용

// 멤버 전체 조회
export const getMembers = async (): Promise<Member[]> => {
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .order("solved_count", { ascending: false });
  if (error) throw error;
  return data;
};

// 문제 전체 조회 (멤버 정보 JOIN)
export const getProblems = async (): Promise<Problem[]> => {
  const { data, error } = await supabase
    .from("problems")
    .select("*, members(name, emoji)")
    // .order("date", { ascending: false });
  if (error) throw error;
  return data;
};

// 문제 추가
export const addProblem = async (
  problem: Omit<FormData, "id" | "created_at">,
  // problem: FormData,
) => {
  problem.solver_name = MEMBERS.find((p) => p.name === data.solver_name)?.id || 1;
  const { data, error } = await supabase
    .from("problems")
    .insert(problem)
    .select()
    .single();
  if (error) throw error;
  return data;
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
