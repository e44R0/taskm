import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="antialiased selection:bg-gray-700 selection:text-white orbitron-400">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
