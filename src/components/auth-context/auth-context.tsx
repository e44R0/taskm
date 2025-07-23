import { fetcher } from '@/api/fetcher';
import { useRouter } from 'next/router';
import React, { ReactNode, useEffect, useState } from 'react';
import { UserData } from '@/types/users';

type AuthContextType = {
  status: 'checking' | 'authorized' | 'unauthorized';
  userData: UserData | null;
  setStatus: (v: 'checking' | 'authorized' | 'unauthorized') => void;
  setUserData: (data: UserData | null) => void;
};

export const AuthContext = React.createContext<AuthContextType>({
  status: 'checking',
  userData: null,
  setStatus: () => {},
  setUserData: () => {},
});

export const AuthProvider = (props: { children: ReactNode }) => {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
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