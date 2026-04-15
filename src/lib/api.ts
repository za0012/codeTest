// lib/api.ts
import { supabase } from "./supabase";
import { type FormData, MEMBERS, type Problem } from "../data/mockData"; // 기존 타입 재사용

// 멤버 전체 조회
// export const getMembers = async (): Promise<Member[]> => {
export const getMembers = async () => {
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw error;
  return data;
};

// 문제 전체 조회 (멤버 정보 JOIN)
// export const getProblems = async (): Promise<FormData[]> => {
export const getProblems = async () => {
  const { data, error } = await supabase
    .from("problems")
    .select("*, members(name, emoji)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
};

// 문제 추가
export const addProblem = async (
  problem: Omit<FormData, "id" | "created_at">,
  // problem: FormData,
) => {
  const { data, error } = await supabase
    .from("problems")
    .insert({
      ...problem,
      solver_name:
        MEMBERS.find((p) => problem.solver_name.includes(p.name))?.id ?? 1,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

// 문제 상세 조회
export const getProblemById = async (id: number): Promise<FormData> => {
  const { data, error } = await supabase
    .from("problems")
    .select("*, members(name, emoji)")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};

// 문제 수정
export const updateProblem = async (
  id: number,
  updates: Partial<Omit<FormData, "id" | "created_at">>,
): Promise<FormData> => {
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
export const deleteProblem = async (id: number): Promise<void> => {
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
