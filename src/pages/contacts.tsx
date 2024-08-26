import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import styles from '../styles/Contacts.module.css';

interface Contact {
  id: string;
  name: string;
  email: string;
}

const ContactsPage: React.FC = () => {
  const { data: session } = useSession();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchContacts = async () => {
      const res = await fetch('/api/contacts');
      const data = await res.json();
      setContacts(data);
    };
    fetchContacts();
  }, []);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <h1>Contacts</h1>
      <input
        type="text"
        placeholder="Search contacts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />
      <ul className={styles.contactList}>
        {filteredContacts.map(contact => (
          <li key={contact.id} className={styles.contactItem}>
            {contact.name} ({contact.email})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactsPage;