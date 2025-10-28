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
  addNewTaskInProject: (area: FE.Area) => void;
  deleteTaskInProject: (taskId: string) => void;
}
export const Project = ({
  project,
  updateProjectWithArea,
  updateTaskInProject,
  addNewTaskInProject,
  deleteTaskInProject,
}: ProjectProps) => {
  console.log('project:', project);
  const userRole = project.userRole;
  const areasLength = project?.areas?.length + 1 || 1;
  const styles = {
    '--columns-number': areasLength,
  } as CSSProperties;

  console.log('RENDER PROJECT', project);

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
            userRole={userRole}
            updateTaskInProject={updateTaskInProject}
            addNewTaskInProject={addNewTaskInProject}
            deleteTaskInProject={deleteTaskInProject}
          />
        ))}
        {(userRole === 'MODERATOR' ||
          userRole === 'OWNER' ||
          userRole === 'MEMBER') && (
          <div className="text-center hover:bg-[#1c1c1c] max-h-10 mt-11 p-2">
            <button onClick={addNewAreaHandler}>+</button>
          </div>
        )}
      </div>
    </>
  );
};
