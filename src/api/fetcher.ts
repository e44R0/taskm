import { NextRouter } from 'next/router';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetcher = async <T extends object = any>({
  // unknown
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

      console.log('Error:', Error);
      return Promise.reject(new Error(`Ошибка: ${response.status}`));
    }

    return response.json() as Promise<T>;
  } catch (error) {
    console.error('Ошибка:', error);
    return Promise.reject(error);
  }
};
