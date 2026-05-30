import { useQuery } from "@tanstack/react-query";
import ProblemCard from "@/app/(with-sidebar)/problems/components/ProblemCard";
import type { Problem } from "@/lib/types/study";
import { getMySolves } from "./service";

function MySolves({ id }: { id: number }) {
  const { data, isLoading, isError } = useQuery<Problem[]>({
    queryKey: ["mySolves"],
    queryFn: () => getMySolves(id),
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error occurred</div>;

  console.log(data);

  return (
    <div>
      {data?.map((problem) => (
        <ProblemCard
          id={problem.id}
          key={problem.id}
          title={problem.title}
          tags={problem.tags}
          time_spent={problem.time_spent}
          difficulty={problem.difficulty}
          platform={problem.platform}
          date={problem.date}
          onClick={(): void => {
            throw new Error("Function not implemented.");
          }}
        />
      ))}
    </div>
  );
}

export default MySolves;
