import { createFileRoute } from "@tanstack/react-router";
import UiTest from "../pages/uitest/UiTest";

export const Route = createFileRoute("/test2")({
  component: UiTest,
});
