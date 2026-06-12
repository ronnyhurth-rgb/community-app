import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function App() {
  const [profile, setProfile] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async (user) => {
    try {
      setLoading(true);
      
      // 1. Profil abrufen
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(profileData);

      // 2. Alle User abrufen
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*');

      if (usersError) throw usersError;
      setAllUsers(usersData || []);
      
    } catch (err) {
      console.error("Fehler:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initialen Session-Check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchData(session.user);
      } else {
        setLoading(false);
      }
    });

    // Listener für Login/Logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchData(session.user);
      } else {
        setProfile(null);
        setAllUsers([]);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div>Lade Daten...</div>;

  return (
    <div style={{ maxWidth: '400px', margin: '20px auto', fontFamily: 'sans-serif' }}>
      {!profile ? (
        <button onClick={() => supabase.auth.signInWithOAuth({ 
          provider: 'google',
          options: { redirectTo: window.location.origin }
        })}>
          Mit Google einloggen
        </button>
      ) : (
        <div>
          <h1>Community</h1>
          <p>Eingeloggt als: {profile.username || "User"}</p>
          <hr />
          <h3>Alle registrierten Profile:</h3>
          {allUsers.length > 0 ? (
            <ul>
              {allUsers.map(u => (
                <li key={u.id}>{u.username || "Kein Name definiert"}</li>
              ))}
            </ul>
          ) : (
            <p>Noch keine Profile in der Datenbank gefunden.</p>
          )}
          <button onClick={() => supabase.auth.signOut()}>Logout</button>
        </div>
      )}
    </div>
  );
}