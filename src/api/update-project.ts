export const updateProject = async (data) => {
  const response = await fetch('/api/update-project', {
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
