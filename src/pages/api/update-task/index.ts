import type { NextApiRequest, NextApiResponse } from "next";
import projects from "@/mocks/projects.json";
import {TaskData} from "@/types/task";
import {getStoragePath, writeToFile} from "@/utils/utils";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<TaskData | string>
) {
  if (req.method === "POST") {
    const updatedTask: TaskData = req.body;
    // console.log("НА СТОРОНЕ СЕРВЕРА: данные получены!", updatedTask);

    let taskUpdated = false;
    projects.forEach((project) =>
      project.areas.forEach((area) => {
        area.tasks.forEach((task) => {
          if (task.taskId === updatedTask.task.taskId) {
            task.text = updatedTask.task.text;
            task.tags = updatedTask.task.tags || task.tags;
            // task.taskOwner = updatedTask.task.taskOwner;
            // task.createdAt = updatedTask.task.createdAt;
            taskUpdated = true;
          }
        });
      })
    );

    if (!taskUpdated) {
      return res.status(404).json("Задача не найдена");
    }

    writeToFile(getStoragePath(), projects, (err) => {
      if (err) {
        return res.status(500).json("Ошибка при сохранении данных");
      }
      console.log(updatedTask)
      return res.status(200).json(updatedTask);
      // Почему то все равно ругается на:
      // API resolved without sending a response for /api/update-task, this may result in stalled requests.

    });
  } else {
    return res.status(405).end(`Метод ${req.method} не разрешен`);
  }
}
