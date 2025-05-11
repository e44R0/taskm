import '@/styles/globals.css';
import '@/styles/globalicons.css';
import '@/styles/globalfonts.css';
import type { AppProps } from 'next/app';
// import { Navigation } from '@/components/navigation/navigation';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      {/*<Navigation />*/}
      <Component {...pageProps} />
    </div>
  );
}
