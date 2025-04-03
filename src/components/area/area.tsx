import { Area as TArea } from "@/types/area";
import { Task } from "../task/task";
import { useRouter } from "next/router";
import React from "react";
import { Task as TTask } from "@/types/task";
import {createTask} from "@/api/create-task";

interface AreaProps {
  area: TArea;
}

export const Area = (props: AreaProps) => {
  const {
    area: { id, title, tasks },
  } = props;
  const router = useRouter();
  const [currentTasks, setCurrentTasks] = React.useState<TTask[]>(tasks);
  const projectId = router.query.id as string;

  const settingsBtnHandler = (evt: React.MouseEvent<HTMLButtonElement>) => {
    console.log(evt.currentTarget, "pressed");
  };

  const addNewTaskHandler = async () => {
    const areaData = { projectId: projectId, areaId: id }
    console.log("addNewTask", router.query);
    try{
      createTask(areaData, setCurrentTasks).then(()=>console.log('Новая задача создана'));
    } catch (error) {
      console.error("Ошибка при добавлении нового таска:", error);
    }
  };

  const deleteTask = (taskId: string) => {
    const taskIndex = currentTasks.findIndex(task => task.taskId === taskId);
    console.log("current:", currentTasks);
    console.log("taskIndex:", taskIndex, "taskId:", taskId);


    if (taskIndex !== -1) {
      currentTasks.splice(taskIndex, 1);
      setCurrentTasks([...currentTasks]);
    }
  }

  return (
    <div className="m-1 p-2 orbitron-400">
      <div className="flex flex-auto">
        <h2 className="flex-2">{title}</h2>
        <button className="flex-0" onClick={settingsBtnHandler}>
          <span className="material-symbols-outlined">steppers</span>
        </button>
      </div>
      <ul className="taskList">
        {currentTasks.map((task) => (
          <li key={task.taskId} className="taskContainer ">
            <Task areaId={id} task={task} onDelete={() => deleteTask(task.taskId)} />
          </li>
        ))}
        <div className='text-center hover:bg-[#1c1c1c]'>
          <button className="" onClick={addNewTaskHandler}>+</button>
        </div>
      </ul>
    </div>
  );
};
