"use client";
import { Task as TTask } from "@/types/task";
import { useRouter } from "next/router";
import { useState } from "react";
import { createTask } from "@/api/createTask";

interface TaskProps {
  task: TTask;
}

export const Task = (props: TaskProps) => {
  const router = useRouter();
  const {
    task: { id, tags, text, taskOwner, createdAt },
  } = props;
  const projectid = router.query;
  const [isEditing, setIsEditing] = useState(false);
  const [initialText, setInitialText] = useState(text);
  const [initialTags, setInitialTags] = useState(tags);

  const clickHandler = () => {
    setIsEditing(!isEditing);
    console.log(router.query);
    console.log(id);
  };

  const saveHandler = async () => {
    const text = initialText;
    const tags = initialTags;

    const taskData = {
      projectid,
      task: {
        id,
        tags,
        text,
        taskOwner,
        createdAt,
      },
    };

    try {
      // setErrorMessage(null);
      createTask(taskData);
    } catch (error) {
      console.error((error as Error).message);
      // setErrorMessage((error as Error).message)
    }
    // const response = await fetch("/api/tasks", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(taskData),
    // });

    // if (response.ok) {
    //   const savedTask = await response.json();
    //   console.log("Задача сохранена:", savedTask);
    //   setIsEditing(false);
    // } else {
    //   console.error("Ошибка при сохранении задачи");
    // }
  };

  const deleteHandler = async () => {};

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
              // value={initialTags.join(", ")}
              value={initialTags}
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
            {/* <div>Tags: {initialTags.join(", ")}</div> */}
            <div>Tags: {initialTags}</div>
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
