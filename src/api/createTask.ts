export const createTask = async (taskData: object) => {
  const response = await fetch("/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  });

  const result = await response.json();
  if (response.ok) {
    console.log("Задача сохранена:", result);
    return result;
  } else {
    // { error: "..." }
    throw new Error(
      `API error: ${response.statusText} — ${response.status}: ${result?.message}`
    );
  }
};
