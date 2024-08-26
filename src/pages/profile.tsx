import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import styles from '../styles/Profile.module.css';

interface UserProfile {
  name: string;
  email: string;
  bio: string;
}

const ProfilePage: React.FC = () => {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch('/api/profile');
      const data = await res.json();
      setProfile(data);
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (profile) {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      setIsEditing(false);
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1>Profile</h1>
      {isEditing ? (
        <div>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className={styles.input}
          />
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            className={styles.input}
          />
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className={styles.textarea}
          />
          <button onClick={handleSave} className={styles.button}>Save</button>
        </div>
      ) : (
        <div>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Bio:</strong> {profile.bio}</p>
          <button onClick={() => setIsEditing(true)} className={styles.button}>Edit</button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;