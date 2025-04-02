import { TaskData } from '@/types/task'

export const updateTask = async (data: TaskData) => {
  const response = await fetch('/api/update-task', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const result = await response.json()
  if (response.ok) {
    console.log('Задача сохранена:', result)
    return result
  } else {
    // { error: "..." }
    throw new Error(
      `API error: ${response.statusText} — ${response.status}: ${result?.message}`
    )
  }
}
