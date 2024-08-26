import React from 'react';
import Link from 'next/link';
import styles from './Sidebar.module.css';

const Sidebar: React.FC = () => {
  return (
    <div className={styles.sidebar}>
      <Link href="/">
        <img src="/icons/meeting-icon.png" alt="Meeting Room" />
      </Link>
      <Link href="/schedule">
        <img src="/icons/schedule-icon.png" alt="Meeting Schedule" />
      </Link>
      <Link href="/profile">
        <img src="/icons/profile-icon.png" alt="Profile Management" />
      </Link>
      <Link href="/poll">
        <img src="/icons/poll-icon.png" alt="Poll Creation and Voting" />
      </Link>
    </div>
  );
};

export default Sidebar;