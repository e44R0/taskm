import classes from "./projcet.module.css";
import { Project as TProject } from "../../types/project";
import { Area } from "../area/area";
import { CSSProperties } from "react";

interface ProjectProps {
  project: TProject;
}
export const Project = ({ project }: ProjectProps) => {
  const styles = { "--columns-number": project.areas.length } as CSSProperties;

  return (
    <div className={classes.projectLayout} style={styles}>
      {project?.areas?.map((area) => (
        <Area key={area.id} area={area} />
      ))}
    </div>
  );
};
