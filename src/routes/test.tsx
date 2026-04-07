import { createFileRoute } from "@tanstack/react-router";
import { Problems } from "../pages/problems/Problems";

export const Route = createFileRoute("/test")({
  component: Problems,
});
