import type { NextApiRequest, NextApiResponse } from "next";
import projects from "@/mocks/projects.json";
import { Task } from "@/types/task";
import {getStoragePath, writeToFile} from "@/utils/utils";
// import { randomUUID } from 'crypto';

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Task | { message: string }>
) {
    if (req.method === "POST") {
        console.log("Удаление таска для карты: ", req.body);
        const projectId = req.body.projectId;
        const areaId = req.body.areaId;
        const taskId = req.body.taskId;
        console.log("Удаление таска для карты: ", projectId, areaId, taskId);
        if (typeof projectId !== "string") {
            return res
                .status(400)
                .json({message: "Некорректный идентификатор проекта"});
        }

        const project = projects.find((project) => project.id === projectId);
        const area = project?.areas.find((area) => area.id === areaId);
        if (area) {
            const taskIndex = area.tasks.findIndex((task) => task.taskId === taskId);

            if (taskIndex !== -1) {
                area.tasks.splice(taskIndex, 1);
                console.log("Задача успешно удалена");
            } else {
                console.log("Задача не найдена");
            }
        } else {
            console.log("Область не найдена");
        }

        writeToFile(getStoragePath(), projects, (err) => {
            if (err) {
                return res.status(500).json({message: "Ошибка при сохранении данных"});
            }
            return res.status(200).json({message: "Задача была удалена на сревере"});
        });
    } else {
        res.status(404).json({message: "Выбран неверный метод"});
    }
}