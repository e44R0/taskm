import { useRouter } from "next/router";
import { projects } from "@/mocks/projects";

import { Project } from "@/components/project/project";
// interface ProjectProps {
//   project: Project;
// }

export default function ProjectID(/*props: ProjectProps*/) {
  const router = useRouter();
  const { id } = router.query;
  console.log(id);
  const project = projects.find((project) => project.id === id);

  if (!project) {
    return null;
  }

  return (
    <div className="flex">
      <Project project={project} />
    </div>
  );
}
