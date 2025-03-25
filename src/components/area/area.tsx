import { Area as TArea } from "@/types/area";
import { Task } from "../task/task";

interface AreaProps {
  area: TArea;
}

export const Area = (props: AreaProps) => {
  const {
    area: { title, tasks },
  } = props;

  const settingsBtnHandler = (evt: React.MouseEvent<HTMLButtonElement>) => {
    console.log(evt.currentTarget, "pressed");
  };

  return (
    <div className="m-1 p-2 orbitron-400">
      <div className="flex flex-auto">
        <h2 className="flex-2">{title}</h2>
        <button className="flex-0" onClick={settingsBtnHandler}>
          <span className="material-symbols-outlined">steppers</span>
        </button>
        {/* <div className="flex-1">Task Area Settings</div> */}
      </div>
      <ul className="taskList">
        {tasks.map((task) => (
          <li key={task.id} className="taskContainer ">
            <Task task={task} />
          </li>
        ))}
        <div className="text-center hover:bg-[#1c1c1c] ">+</div>
      </ul>
    </div>
  );
};
