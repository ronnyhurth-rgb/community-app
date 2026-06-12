import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function App() {
  const [profile, setProfile] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async (user) => {
    try {
      console.log("Starte Datenabruf für:", user.id);
      
      // 1. Eigenes Profil abrufen
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // 2. Alle User abrufen
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*');

      if (usersError) throw usersError;
      
      console.log("Erfolgreich geladene User:", usersData);
      setAllUsers(usersData || []);
      
    } catch (err) {
      console.error("FEHLER BEIM DATENLADEN:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) fetchData(session.user);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) fetchData(session.user);
      else {
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
          <p>Debug: {allUsers.length} User gefunden.</p>
          <div style={{ border: '1px solid #ccc', padding: '10px' }}>
            {allUsers.length > 0 ? (
              allUsers.map(u => (
                <div key={u.id} style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                  {u.username || "Kein Name"} (ID: {u.id.substring(0, 5)})
                </div>
              ))
            ) : (
              <p>Keine User in der Tabelle gefunden.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}