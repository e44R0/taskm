import '@/styles/globals.css';
import '@/styles/globalicons.css';
import '@/styles/globalfonts.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/components/auth-context/auth-context';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </div>
  );
}
