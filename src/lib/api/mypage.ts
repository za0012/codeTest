import { supabase } from "../supabase";

export const getHeatmapData = async (memberId: number) => {
  const { data, error } = await supabase
    .from("problems")
    .select("date")
    .eq("member_id", memberId);
  if (error) throw error;

  // { '2026-04-01': 2, '2026-04-02': 1, ... } 형태로 변환
  return data.reduce(
    (acc, { date }) => {
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
};
