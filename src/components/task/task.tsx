import { Task as TTask } from "@/types/task";

interface TaskProps {
  task: TTask;
}

export const Task = (props: TaskProps) => {
  const {
    task: { tags, text, taskOwner, createdAt },
  } = props;
  return (
    <div className="task m-1 mb-3 p-2 bg-[#1c1c1c]">
      <div>{text}</div>
      <div>{tags.join(", ")}</div>
      <div>{taskOwner}</div>
      <div>{createdAt}</div>
    </div>
  );
};
