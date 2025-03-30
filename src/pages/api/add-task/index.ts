import type { NextApiRequest, NextApiResponse } from "next";
import projects from "@/mocks/projects.json";
// import { Project } from "@/types/project";
import fs from "fs";
import path from "path";
import { Task } from "@/types/task";
import {getStoragePath} from "../../../../utils/utils";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Task | { message: string }>
) {
  if (req.method === "POST") {
    console.log("Запрошен проект дял добавления карты: ", req.body);
    const id = req.body.id;
    const areaId = req.body.area;

    if (typeof id !== "string") {
      return res
        .status(400)
        .json({ message: "Некорректный идентификатор проекта" });
    }

    const project = projects.find((project) => project.id === id);
    // const area = project?.areas.find();

    // const index = area?.update-task.findIndex()
    // areas.update-task[index] = updatedTask

    let totalTasks = 0;
    if (project) {
      totalTasks = project.areas.reduce((total, area) => {
        return total + area.tasks.length;
      }, 0);

      const newTask = {
        id: `task${totalTasks + 1}`,
        tags: ["select tag"],
        text: "Enter ur text here",
        taskOwner: "Bob",
        createdAt: new Date().toISOString().split("T")[0],
      };

      projects.forEach((project) => {
        if (project.id === id) {
          project.areas.forEach((area) => {
            if (area.id === areaId) {
              area.tasks.push(newTask);
            }
          });
        }
      });

      const filePath:string = getStoragePath();
      console.log("filePath: ", filePath);

      fs.writeFile(filePath, JSON.stringify(projects, null, 2), (err) => {
        if (err) {
          console.error("Ошибка при записи в файл:", err);
          return res
            .status(500)
            .json({ message: "Ошибка при сохранении данных" });
        }
        res.status(200).json(newTask);
      });
    } else {
      return res.status(404).json({ message: "Проект не найден" });
    }

  } else {
    res.status(404).json({ message: "Выбран неверный метод" });
  }
}
