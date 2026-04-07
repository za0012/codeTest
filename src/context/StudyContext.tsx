import { createContext, useContext, useState, type ReactNode } from "react";
import { MEMBERS, PROBLEMS, type Member, type Problem } from "../data/mockData";

interface StudyContextType {
  problems: Problem[];
  members: Member[];
  addProblem: (problem: Omit<Problem, "id">) => void;
  updateProblem: (problem: Problem) => void;
  deleteProblem: (id: number) => void;
  currentUserId: number;
}

const StudyContext = createContext<StudyContextType | null>(null);

export function StudyProvider({ children }: { children: ReactNode }) {
  const [problems, setProblems] = useState<Problem[]>(PROBLEMS);
  const currentUserId = 1;

  const addProblem = (problem: Omit<Problem, "id">) => {
    setProblems((prev) => [
      ...prev,
      { ...problem, id: Math.max(...prev.map((p) => p.id), 0) + 1 },
    ]);
  };

  const updateProblem = (problem: Problem) => {
    setProblems((prev) => prev.map((p) => (p.id === problem.id ? problem : p)));
  };

  const deleteProblem = (id: number) => {
    setProblems((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <StudyContext
      value={{
        problems,
        members: MEMBERS,
        addProblem,
        updateProblem,
        deleteProblem,
        currentUserId,
      }}
    >
      {children}
    </StudyContext>
  );
}

export function useStudy() {
  return useContext(StudyContext);
}
