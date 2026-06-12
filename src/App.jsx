import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function App() {
  const [profile, setProfile] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [debug, setDebug] = useState("Starte App...");

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Session prüfen
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;
      if (!session) {
        setDebug("Kein User eingeloggt.");
        setLoading(false);
        return;
      }

      setDebug(`Eingeloggt mit ID: ${session.user.id}`);

      // 2. Alle Profile laden
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) {
        setDebug(`DB-Fehler: ${error.message}`);
        throw error;
      }

      console.log("Daten aus DB:", data);
      setAllUsers(data || []);
      
      const myProfile = data?.find(p => p.id === session.user.id);
      setProfile(myProfile || null);
      setDebug(`Erfolg: ${data.length} User gefunden.`);

    } catch (err) {
      console.error("Fehler beim Laden:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchData();
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div>Lade Daten...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Community</h1>
      <div style={{ background: '#f0f0f0', padding: '10px', marginBottom: '10px' }}>
        <strong>Status:</strong> {debug}
      </div>

      {!profile ? (
        <button onClick={() => supabase.auth.signInWithOAuth({ 
          provider: 'google',
          options: { redirectTo: window.location.origin }
        })}>
          Mit Google einloggen
        </button>
      ) : (
        <div>
          <p>Eingeloggt als: {profile.username || "User ohne Name"}</p>
          <h3>Alle Profile ({allUsers.length}):</h3>
          <ul>
            {allUsers.map(u => (
              <li key={u.id}>{u.username || "Kein Name"} (ID: {u.id.substring(0,8)}...)</li>
            ))}
          </ul>
          <button onClick={() => supabase.auth.signOut()}>Logout</button>
        </div>
      )}
    </div>
  );
}