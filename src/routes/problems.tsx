import { createFileRoute } from "@tanstack/react-router";
import { Problems } from "../pages/Problems";

export const Route = createFileRoute("/problems")({
  component: Problems,
});
