export const deleteTask = async (projectId: string, areaId: string, taskId: string) => {
    try {
        const data = {
            projectId: projectId,
            areaId: areaId,
            taskId: taskId,
        }

        const response = await fetch("/api/delete-task", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
        } else {
            console.log('Запрсо на удаление таска отправлен!')
        }

    }catch (error) {
        console.error("Ошибка при создании задачи:", error);
        throw error; // Можно выбросить ошибку дальше, если нужно
    }
};