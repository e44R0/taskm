import React, { useContext, useState } from 'react';
import { login } from '@/api/login';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { AuthContext } from '../auth-context/auth-context';

export default function LoginForm() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const auth = useContext(AuthContext);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      setError('');
      login({ login: username, password: password })
        .then(() => {
          auth.setStatus('authorized');
          router.replace('/');
        })
        .catch(() => {
          setError('Неверный логин или пароль');
        });
    } else {
      setError('Пожалуйста, заполните все поля');
    }
  };

  if (auth.status === 'authorized') {
    router.replace('/');
    return null;
  }

  return (
    <div className="flex items-center justify-center h-screen w-full flex-col">
      <form
        className="flex flex-col p-6 rounded-lg shadow-lg w-full max-w-xs"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label htmlFor="username" className="block text-white">
            Login:
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="mt-1 p-2 w-full rounded"
            autoFocus
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-white">
            Password:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 p-2 w-full rounded"
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="mt-4 bg-[#1c1c1c] text-white p-2 rounded w-full hover:bg-[#2a2a2a] transition-colors"
        >
          Sign In
        </button>
      </form>
      <div className="w-full max-w-xs px-6">
        <Link
          href="/register"
          className=" bg-[#1c1c1c] text-white p-2 rounded w-full inline-block text-center hover:bg-[#2a2a2a] transition-colors"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
