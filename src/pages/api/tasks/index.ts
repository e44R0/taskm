import type { NextApiRequest, NextApiResponse } from "next";
import projects from "@/mocks/projects.json";
import { Task } from "@/types/task";
import fs from "fs";
import path from "path";

type UpdatedTask = {
  projectid: { id: string };
  task: Task;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<UpdatedTask | string>
) {
  if (req.method === "POST") {
    const newTask: UpdatedTask = req.body;
    console.log("НА СТОРОНЕ СЕРВЕРА: данные получены!", newTask);

    // const project = projects.find(
    //   (project) => project.id === newTask.projectid.id
    // );

    // if (!project) {
    //   return res.status(404).json("Проект не найден");
    // }

    projects.forEach((project) =>
      project.areas.forEach((area) => {
        area.tasks.forEach((task) => {
          if (task.id === newTask.task.id) {
            task.text = newTask.task.text;
            task.tags = newTask.task.tags || task.tags;
            task.taskOwner = newTask.task.taskOwner;
            task.createdAt = newTask.task.createdAt;
          }
        });
      })
    );

    const filePath = path.join(process.cwd(), "src", "mocks", "projects.json");
    console.log("filePath: ", filePath);

    fs.writeFile(filePath, JSON.stringify(projects, null, 2), (err) => {
      if (err) {
        console.error("Ошибка при записи в файл:", err);
        return res.status(500).json("Ошибка при сохранении данных");
      }
    });

    res.status(200).json(newTask);
  } else {
    res.status(405).end();
  }
}
