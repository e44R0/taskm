import { ProjectList } from '@/components/project-list/project-list';
import { Geist, Geist_Mono } from 'next/font/google';
import styles from './index.module.css';
import { Navigation } from '@/components/navigation/navigation';
import { useContext } from 'react';
import { AuthContext } from '@/components/auth-context/auth-context';
import { useRouter } from 'next/router';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function Home() {
  const auth = useContext(AuthContext);
  const router = useRouter();

  if (auth.status == 'unauthorized') {
    router.replace('/login');
    return null;
  }

  return (
    <div className={`${geistSans.variable} ${geistMono.variable}`}>
      <main className={styles.mainPage}>
        <Navigation />
        <ProjectList />
      </main>
      <footer className=""></footer>
    </div>
  );
}
