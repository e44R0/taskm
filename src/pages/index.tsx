import { ProjectList } from '@/components/project-list/project-list';
import { Geist, Geist_Mono } from 'next/font/google';
import styles from './index.module.css';
import { Navigation } from '@/components/navigation/navigation';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function Home() {
  // const authState = useContext(AuthContext);

  // authState === "unauth" return null;

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
