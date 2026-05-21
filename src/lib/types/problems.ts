import type { memberNickname } from "./study";

export interface problemType {
  created_at: string;
  date: string;
  difficulty: string;
  id: number;
  member_id: 11;
  memo: string;
  platform: string;
  solution: string;
  study_id: number;
  study_members: memberNickname;
  tags: string[];
  time_spent: 5;
  title: string;
  url: string;
}
