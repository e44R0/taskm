import { FE } from '@/types/frontend';
import { DTO } from '@/types/transfer';

export const updateTask = async (data: FE.Task): Promise<FE.Task> => {
  const response = await fetch('/api/update-task', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result: DTO.TaskData = await response.json();
  if (response.ok) {
    console.log('Задача сохранена:', result);
    return result.data as FE.Task;
  } else {
    // { error: "..." }
    throw new Error(
      `API error: ${response.statusText} — ${response.status}: ${result?.message}`
    );
  }
};
