import type { NextApiRequest, NextApiResponse } from "next";
// import { projects } from "@/mocks/projects.json";
import projects from "@/mocks/projects.json";
import { Project } from "@/types/project";

// export default function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<Project[]>
// ) {
//   res.status(200).json(projects);
//   console.log('отправлены:', )
// }

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Project[] | { message: string }>
) {
  if (req.method === "GET") {
    res.status(200).json(projects);
  } else {
    res.status(405).json({ message: "Метод не разрешен" });
  }
}
