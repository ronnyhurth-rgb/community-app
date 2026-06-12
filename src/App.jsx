import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function App() {
  // 1. ZUSTAND (States) ganz oben
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // 2. FUNKTIONEN (Fetch, Send, etc.)
  const fetchData = async (user) => {
    // ... dein Code zum Laden der Profile ...
  };

  // 3. USEEFFECT (Der "Wächter" deiner App)
  useEffect(() => {
    // Session prüfen
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) fetchData(session.user);
      else setLoading(false);
    });

    // Auth-Listener (reagiert auf Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) fetchData(session.user);
      else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 4. RETURN (Was auf dem Bildschirm erscheint)
  if (loading) return <div>Lade...</div>;

  return (
    <div>
      {!profile ? (
        <button onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}>
          Login
        </button>
      ) : (
        <div>Dein Inhalt...</div>
      )}
    </div>
  );
}