import { NextRouter } from 'next/router';

export const fetcher = async ({
  router,
  method,
  src,
  data,
}: {
  router: NextRouter;
  method: string;
  src: string;
  data?: object;
}) => {
  try {
    const response = await fetch(src, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      if (response.status === 401) {
        router.push('/login');
      }

      throw new Error(`Ошибка: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Ошибка:', error);
    throw error;
  }
};
