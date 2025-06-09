import { fetcher } from '@/api/fetcher';
import { useRouter } from 'next/router';
import React, { ReactNode, useEffect, useState } from 'react';

export const AuthContext = React.createContext({
  status: 'checking',

  setStatus: (v: 'checking' | 'authorized' | 'unauthorized') => {
    console.log(v);
  },
});

export const AuthProvider = (props: { children: ReactNode }) => {
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

  return (
    <AuthContext.Provider
      value={{ status: authState, setStatus: setAuthState }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
