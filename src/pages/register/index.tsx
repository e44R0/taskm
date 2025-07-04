import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { PasswordToggleIcon } from '@/components/PasswordToggleIcon';
import { register } from '@/api/register';

export default function RegisterForm() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (username && password && email) {
      setError('');
      register({ login: username, password: password, email: email })
        .then(() => {
          router.push('/login');
        })
        .catch((err) => {
          console.log('Error:', err);
          setError(err.message);
        });
    } else {
      setError('Пожалуйста, заполните все поля');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center h-screen w-full flex-col">
      <form
        className="flex flex-col p-6 rounded-lg shadow-lg w-full max-w-xs"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label htmlFor="username" className="block text-white">
            Username:
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

        <div className="mb-4 relative">
          <label htmlFor="password" className="block text-white">
            Password:
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 p-2 w-full rounded pr-10"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-2 top-9 text-gray-400 hover:text-white"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <PasswordToggleIcon show={showPassword} />
          </button>
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-white">
            Confirm Password:
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="mt-1 p-2 w-full rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-white">
            Email:
          </label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 p-2 w-full rounded"
          />
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <button
          type="submit"
          className="mt-4 bg-[#1c1c1c] text-white p-2 rounded w-full hover:bg-[#2a2a2a] transition-colors"
        >
          Register
        </button>
      </form>

      <div className="w-full max-w-xs px-6">
        <Link
          href="/login"
          className="bg-[#1c1c1c] text-white p-2 rounded w-full inline-block text-center hover:bg-[#2a2a2a] transition-colors"
        >
          Already have an accaunt?
        </Link>
      </div>
    </div>
  );
}
