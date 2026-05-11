import { createFileRoute } from "@tanstack/react-router";
import { Route as ConnectRoute } from "./student.connect";

const ConnectComponent = ConnectRoute.options.component!;

export const Route = createFileRoute("/student/ai-connect")({
  component: ConnectComponent,
});
