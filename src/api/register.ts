export const register = async (regData: {
  login: string;
  password: string;
  email: string;
}) => {
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(regData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return Promise.reject({ message: `${errorData.message}` });
    }
  } catch (error) {
    console.error('Ошибка при регистрации аккаунта:', error);
    return Promise.reject(error);
  }
};
