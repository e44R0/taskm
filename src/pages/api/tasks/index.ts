import type { NextApiRequest, NextApiResponse } from "next";
import { projects } from "@/mocks/projects";
import { Task } from "@/types/task";

type UpdatedTask = {
  projectid: { id: string };
  task: Task;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  if (req.method === "POST") {
    const newTask: UpdatedTask = req.body;
    console.log("НА СТОРОНЕ СЕРВЕРА: данные получены!", newTask);

    const project = projects.find(
      (project) => project.id === newTask.projectid.id
    );

    if (!project) {
      return res.status(404).json("Проект не найден");
    }
    project.areas.forEach((area) =>
      area.tasks.forEach((task) => {
        if (task.id === newTask.task.id) {
          task.text = newTask.task.text;
          task.tags = newTask.task.tags;
          task.taskOwner = newTask.task.taskOwner;
          task.createdAt = newTask.task.createdAt;
        }
      })
    );

    res.status(200).json("Данные обновлены");
  } else {
    res.status(405).end();
  }
}
