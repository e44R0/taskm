import { Geist, Geist_Mono } from 'next/font/google';
import styles from './index.module.css';
import LoginForm from '@/components/login/login';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function Login() {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable}`}>
      <main className={styles.LoginPage}>
        <LoginForm />
      </main>
      <footer className=""></footer>
    </div>
  );
}
