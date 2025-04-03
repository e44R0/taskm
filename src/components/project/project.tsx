import classes from "./projcet.module.css";
import { Project as TProject } from "../../types/project";
import { Area } from "../area/area";
import { CSSProperties } from "react";

interface ProjectProps {
  project: TProject;
}
export const Project = ({ project }: ProjectProps) => {
  const areasLength = project?.areas?.length + 1 || 1;
  const styles = {
    "--columns-number": areasLength,
  } as CSSProperties;

  return (
    <>
      <div className={classes.projectLayout} style={styles}>
        {project?.areas?.map((area) => (
          <Area key={area.id} area={area} />
        ))}
        <div className="text-center hover:bg-[#1c1c1c] max-h-10 mt-11 p-2">
          <button>+</button>
        </div>
      </div>
    </>
  );
};
