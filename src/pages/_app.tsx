import '@/styles/globals.css';
import '@/styles/globalicons.css';
import '@/styles/globalfonts.css';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { fetcher } from '@/api/fetcher';
import { useRouter } from 'next/router';
import { Geist, Geist_Mono } from 'next/font/google';
import styles from './index.module.css';
import LoginForm from '@/components/login/login';

// import { Navigation } from '@/components/navigation/navigation';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [authState, setAuthState] = useState<
    'checking' | 'authorized' | 'unauthorized'
  >('checking');

  useEffect(() => {
    if (authState !== 'checking') {
      return;
    }
    fetcher({ method: 'GET', src: '/api/check-auth', router })
      .then(() => {
        setAuthState('authorized');
      })
      .catch((error) => {
        setAuthState('unauthorized');
        console.error(error);
      });
  }, [router, authState]);

  if (authState === 'checking') {
    return <div>Loading ...</div>;
  }

  if (authState === 'authorized') {
    return (
      <div>
        {/*<Navigation />*/}
        <Component {...pageProps} />
      </div>
    );
  }

  return (
    <div>
      <div className={`${geistSans.variable} ${geistMono.variable}`}>
        <main className={styles.LoginPage}>
          <LoginForm />
        </main>
        <footer className=""></footer>
      </div>
    </div>
  );
}
