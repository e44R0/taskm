import { Task as TTask } from "@/types/task";
import { useRouter } from "next/router";
import { useState } from "react";
import { updateTask} from "@/api/update-task";
import {deleteTask} from "@/api/delete-task";

interface TaskProps {
  areaId: string;
  task: TTask;
  onDelete: () => void;
}

export const Task = (props: TaskProps) => {
  const router = useRouter();
  const areaId = props.areaId;
  const {
    task: { taskId, tags, text, taskOwner, createdAt },
    onDelete,
  } = props;
  const projectId = router.query.id as string;
  const [isEditing, setIsEditing] = useState(false);
  const [initialText, setInitialText] = useState(text);
  const [initialTags , setInitialTags] = useState(tags);

  const clickHandler = () => {
    setIsEditing(!isEditing);
  };

  const saveHandler = async ():Promise<void> => {
    const taskData = {
      projectId,
      task: {
        taskId,
        tags: initialTags,
        text: initialText,
        taskOwner,
        createdAt,
      },
    };

    try {
      // setErrorMessage(null);
      updateTask(taskData).then(()=>setIsEditing(!isEditing));
    } catch (error) {
      // setErrorMessage((error as Error).message)
      console.error((error as Error).message);
    }
  };

  const deleteHandler = async () => {
    try {
      await deleteTask(projectId,areaId,taskId);
      onDelete();
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  return (
    <>
      {isEditing ? (
        <div className="task m-1 mb-3 p-2 bg-[#b4e9f0] text-black">
          <div>
            Text:
            <input
              className="pb-4"
              type="text"
              value={initialText}
              onChange={(e) => setInitialText(e.target.value)}
            />
            Tags:
            <input
              type="text"
              value={initialTags.join(", ")}
              onChange={(e) => setInitialTags(e.target.value.split(", "))}
            />
            <div className="flex justify-between mx-2 mt-2">
              <button onClick={clickHandler}>Cancel</button>
              <button onClick={deleteHandler}>Delete</button>
              <button onClick={saveHandler}>Save</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="task m-1 mb-3 p-2  bg-[#1c1c1c]" onClick={clickHandler}>
          <div>
            <div className="pb-4">{initialText}</div>
             <div>Tags: {initialTags.join(", ")}</div>
            <div className="flex justify-between">
              <div>{createdAt}</div>
              <div>{taskOwner}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
