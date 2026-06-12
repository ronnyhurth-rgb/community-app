import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function App() {
  const [profile, setProfile] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async (user) => {
    try {
      setLoading(true);

      // Wir laden ALLE Profile, ohne Filter, um RLS-Fehler beim .eq() zu vermeiden
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) throw error;

      setAllUsers(data || []);
      
      // Suche das eigene Profil in der geladenen Liste
      const myProfile = data?.find((p) => p.id === user.id);
      setProfile(myProfile || null);

    } catch (err) {
      console.error("Daten-Fehler:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Session prüfen
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchData(session.user);
      } else {
        setLoading(false);
      }
    });

    // Auth-Listener
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
      <h1>Community</h1>
      
      {!profile ? (
        <button onClick={() => supabase.auth.signInWithOAuth({ 
          provider: 'google',
          options: { redirectTo: window.location.origin }
        })}>
          Mit Google einloggen
        </button>
      ) : (
        <div>
          <p>Eingeloggt als: <strong>{profile.username || "User"}</strong></p>
          <hr />
          <h3>Alle registrierten Profile ({allUsers.length}):</h3>
          <ul>
            {allUsers.map((u) => (
              <li key={u.id}>{u.username || "Kein Name definiert"}</li>
            ))}
          </ul>
          <button onClick={() => supabase.auth.signOut()}>Logout</button>
        </div>
      )}
    </div>
  );
}