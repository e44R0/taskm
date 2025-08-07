import { fetcher } from '@/api/fetcher';
import { useRouter } from 'next/router';
import React, { ReactNode, useEffect, useState } from 'react';
import { FE } from '@/types/frontend';

type AuthContextType = {
  status: 'checking' | 'authorized' | 'unauthorized';
  userData: FE.User | null;
  setStatus: (v: 'checking' | 'authorized' | 'unauthorized') => void;
  setUserData: (data: FE.User | null) => void;
};

export const AuthContext = React.createContext<AuthContextType>({
  status: 'checking',
  userData: null,
  setStatus: () => {},
  setUserData: () => {},
});

export const AuthProvider = (props: { children: ReactNode }) => {
  const router = useRouter();
  const [userData, setUserData] = useState<FE.User | null>(null);
  const [authState, setAuthState] = useState<
    'checking' | 'authorized' | 'unauthorized'
  >('checking');

  useEffect(() => {
    if (authState !== 'checking') {
      return;
    }
    fetcher({ method: 'GET', src: '/api/check-auth', router })
      .then((response) => {
        if (response.data) {
          setAuthState('authorized');
          setUserData(response.data);
        } else {
          setAuthState('unauthorized');
          setUserData(null);
        }
      })
      .catch((error) => {
        setAuthState('unauthorized');
        setUserData(null);
        console.error(error);
      });
  }, [router, authState, userData]);

  const contextValue = {
    status: authState,
    userData,
    setStatus: setAuthState,
    setUserData,
  };

  if (authState === 'checking') {
    return <div>Loading ...</div>;
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};
