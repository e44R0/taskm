import classes from './projcet.module.css';
import { FE } from '@/types/frontend';
import { Area } from '../area/area';
import { CSSProperties } from 'react';
import { createArea } from '@/api/create-area';

interface ProjectProps {
  project: FE.ProjectWithAreas;
  updateProjectWithArea: (
    area: FE.Area,
    action: 'add' | 'update' | 'delete'
  ) => void;
  updateTaskInProject: (task: FE.Task) => void;
}
export const Project = ({
  project,
  updateProjectWithArea,
  updateTaskInProject,
}: ProjectProps) => {
  console.log('project:', project);
  const areasLength = project?.areas?.length + 1 || 1;
  const styles = {
    '--columns-number': areasLength,
  } as CSSProperties;

  const addNewAreaHandler = async () => {
    try {
      createArea({ projectId: project.id }).then((newArea) => {
        updateProjectWithArea(newArea, 'add');
      });
    } catch (error) {
      console.error('Ошибка при добавлении нового таска:', error);
    }
  };

  return (
    <>
      <div className={classes.projectLayout} style={styles}>
        {project?.areas?.map((area) => (
          <Area
            key={area.id}
            area={area}
            updateTaskInProject={updateTaskInProject}
          />
        ))}
        <div className="text-center hover:bg-[#1c1c1c] max-h-10 mt-11 p-2">
          <button onClick={addNewAreaHandler}>+</button>
        </div>
      </div>
    </>
  );
};
