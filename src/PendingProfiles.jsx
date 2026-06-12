import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export default function PendingProfiles() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  async function fetchPendingUsers() {
    // 1. Suche nach Status 'pending'
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .eq('status', 'pending');

    if (error) console.error("Fehler beim Laden:", error);
    else setUsers(data || []);
    setLoading(false);
  }

  async function handleVerify(userId) {
    // 2. Status auf 'verified' setzen
    const { error } = await supabase
      .from('profiles')
      .update({ status: 'verified' })
      .eq('id', userId);

    if (error) alert("Fehler bei Verifizierung");
    else {
      alert("Erfolgreich verifiziert!");
      fetchPendingUsers(); // Liste neu laden
    }
  }

  if (loading) return <p>Lade Profile...</p>;

  return (
    <div>
      <h2>Zu verifizierende Profile</h2>
      {users.map((user) => (
        <div key={user.id} style={{ border: '1px solid #ddd', padding: '10px', margin: '5px' }}>
          {/* Bild aus dem Storage laden */}
          <img 
            src={supabase.storage.from('avatars').getPublicUrl(user.avatar_url).data.publicUrl} 
            alt={user.full_name} 
            width="50" 
          />
          <p>{user.full_name}</p>
          <button onClick={() => handleVerify(user.id)}>Verify</button>
        </div>
      ))}
    </div>
  );
}