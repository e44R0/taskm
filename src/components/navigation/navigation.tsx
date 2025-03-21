import Image from "next/image";
import Link from "next/link";
import styles from "./navigation.module.css";
import { useState } from "react";

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
  const variant = variants[navOpen ? "expanded" : "collapsed"];

  return (
    <div className={navOpen ? styles.navigationOpen : styles.navigationClose}>
      <div className={styles.userInfo}>
        <Image
          src="/favicon.ico"
          width={navOpen ? "128" : "12"}
          height={navOpen ? "128" : "12"}
          alt="avatar"
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
            <Link href="/LogOut">Log Out</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
