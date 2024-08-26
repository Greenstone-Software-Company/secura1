import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/Layout.module.css';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <Link href="/" className={router.pathname === '/' ? styles.active : ''}>
          Chats
        </Link>
        <Link href="/contacts" className={router.pathname === '/contacts' ? styles.active : ''}>
          Contacts
        </Link>
        <Link href="/profile" className={router.pathname === '/profile' ? styles.active : ''}>
          Profile
        </Link>
      </nav>
      <main className={styles.main}>{children}</main>
    </div>
  );
};

export default Layout;