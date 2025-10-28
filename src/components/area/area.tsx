import { FE } from '@/types/frontend';
import { Task } from '../task/task';
import React from 'react';

interface AreaProps {
  area: FE.Area;
  userRole: FE.Project['userRole'];
  updateTaskInProject: (task: FE.Task) => void;
  addNewTaskInProject: (area: FE.Area) => void;
  deleteTaskInProject: (taskId: string) => void;
}

export const Area = (props: AreaProps) => {
  const {
    area: { id, title, tasks },
    area,
    userRole,
    updateTaskInProject,
    addNewTaskInProject,
    deleteTaskInProject,
  } = props;

  const settingsBtnHandler = (evt: React.MouseEvent<HTMLButtonElement>) => {
    console.log(evt.currentTarget, 'pressed');
  };

  return (
    <div className="m-1 p-2 noto-sans-400">
      <div className="flex flex-auto">
        <h2 className="flex-2">{title}</h2>
        <button className="flex-0" onClick={settingsBtnHandler}>
          <span className="material-symbols-outlined">steppers</span>
        </button>
      </div>
      <ul className="taskList">
        {tasks.length > 0 &&
          tasks.map((task) => (
            <li key={task.taskId} className="p-1">
              <Task
                areaId={id}
                task={task}
                onDelete={() => deleteTaskInProject(task.taskId)}
                updateTaskInProject={updateTaskInProject}
              />
            </li>
          ))}
        <div className="text-center hover:bg-[#1c1c1c]">
          {(userRole === 'MODERATOR' ||
            userRole === 'OWNER' ||
            userRole === 'MEMBER') && (
            <button className="" onClick={() => addNewTaskInProject(area)}>
              +
            </button>
          )}
        </div>
      </ul>
    </div>
  );
};
