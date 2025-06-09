import Image from 'next/image';
import Link from 'next/link';
import styles from './navigation.module.css';
import { useState } from 'react';
import { logout } from '@/api/logout';
import { useContext } from 'react';
import { AuthContext } from '@/components/auth-context/auth-context';
import router from 'next/router';

const variants = {
  expanded: {
    width: 128,
  },
  collapsed: {
    width: 12,
    foo: <div>X</div>,
  },
};

export const Navigation = () => {
  const [navOpen, setNavOpen] = useState(true);
  const variant = variants[navOpen ? 'expanded' : 'collapsed'];
  const auth = useContext(AuthContext);

  const handleLogout = async () => {
    logout()
      .then(() => {
        console.log('Вы успешно разлогинились');
        auth.setStatus('unauthorized');
        router.push('/login');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={navOpen ? styles.navigationOpen : styles.navigationClose}>
      <div className={styles.userInfo}>
        <Image
          src="/person.png"
          width={navOpen ? '128' : '12'}
          height={navOpen ? '128' : '12'}
          alt="avatar"
          priority
        />
        <p className="mt-5">User Name</p>
      </div>
      <div className={styles.navigationMenu}>
        <ul>
          <li>
            <Link href="/Accaunt">Accaunt</Link>
          </li>
          <li>
            <Link href="/Settings">Settings</Link>
          </li>
          <li>
            <button onClick={handleLogout}>Log Out</button>
          </li>
        </ul>
      </div>
    </div>
  );
};
