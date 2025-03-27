"use client";
import { Area as TArea } from "@/types/area";
import { Task } from "../task/task";
import { useRouter } from "next/router";

interface AreaProps {
  area: TArea;
}

export const Area = (props: AreaProps) => {
  const {
    area: { id, title, tasks },
  } = props;
  const router = useRouter();
  const projectid = router.query;

  const settingsBtnHandler = (evt: React.MouseEvent<HTMLButtonElement>) => {
    console.log(evt.currentTarget, "pressed");
  };

  const addNewTaskHandler = () => {
    fetch("/api/add-task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: projectid.id, area: id }),
    }).then(() => {
      console.log("Запрос о новом таске отправлен на сервер!", {
        id: projectid.id,
        area: id,
      });
    });
  };

  return (
    <div className="m-1 p-2 orbitron-400">
      <div className="flex flex-auto">
        <h2 className="flex-2">{title}</h2>
        <button className="flex-0" onClick={settingsBtnHandler}>
          <span className="material-symbols-outlined">steppers</span>
        </button>
      </div>
      <ul className="taskList">
        {tasks.map((task) => (
          <li key={task.id} className="taskContainer ">
            <Task task={task} />
          </li>
        ))}
        <div
          className="text-center hover:bg-[#1c1c1c]"
          onClick={addNewTaskHandler}
        >
          +
        </div>
      </ul>
    </div>
  );
};
