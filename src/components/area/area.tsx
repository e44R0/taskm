import { FE } from '@/types/frontend';
import { Task } from '../task/task';
import { useRouter } from 'next/router';
import React from 'react';
import { createTask } from '@/api/create-task';

interface AreaProps {
  area: FE.Area;
  updateTaskInProject: (task: FE.Task) => void;
  addNewTaskInProject: (area: FE.Area) => void;
  deleteTaskInProject: (taskId: string) => void;
}

export const Area = (props: AreaProps) => {
  const {
    area: { id, title, tasks },
    area,
    updateTaskInProject,
    addNewTaskInProject,
    deleteTaskInProject,
  } = props;
  const router = useRouter();
  // const [currentTasks, setCurrentTasks] = React.useState<FE.Task[]>(tasks);
  // const projectId = router.query.id as string;
  console.log('RENDER AREA:', title, tasks);

  const settingsBtnHandler = (evt: React.MouseEvent<HTMLButtonElement>) => {
    console.log(evt.currentTarget, 'pressed');
  };

  // const addNewTaskHandler = async () => {
  //   const areaData = { projectId: projectId, areaId: id };

  //   try {
  //     createTask(areaData).then(() => console.log('Новая задача создана'));
  //   } catch (error) {
  //     console.error('Ошибка при добавлении нового таска:', error);
  //   }
  // };

  // const deleteTaskHandler = (taskId: string) => {
  //   const taskIndex = currentTasks.findIndex((task) => task.taskId === taskId);

  //   if (taskIndex !== -1) {
  //     currentTasks.splice(taskIndex, 1);
  //     setCurrentTasks([...currentTasks]);
  //   }
  // };

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
          <button className="" onClick={() => addNewTaskInProject(area)}>
            +
          </button>
        </div>
      </ul>
    </div>
  );
};
