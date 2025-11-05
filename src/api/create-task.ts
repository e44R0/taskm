export const createTask = async (areaData: {
  projectId: string;
  areaId: string;
}) => {
  const response = await fetch('/api/add-task', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(areaData),
  });

  if (!response.ok) {
    throw new Error(`Ошибка: ${response.status}`);
  }

  return await response.json();
};
