import type { NextApiRequest, NextApiResponse } from "next";
import { projects } from "@/mocks/projects";
import { Project } from "@/types/project";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Project[]>
) {
  res.status(200).json(projects);
}
