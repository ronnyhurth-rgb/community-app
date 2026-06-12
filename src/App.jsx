import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function App() {
  const [profile, setProfile] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [chatUser, setChatUser] = useState(null);
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        setProfile(data);
        const { data: users } = await supabase.from('profiles').select('*');
        setAllUsers(users || []);
      }
    };
    fetchData();
  }, []);

  const loadMessages = async (otherId) => {
    const { data } = await supabase.from('messages')
      .select('*')
      .or(`and(sender_id.eq.${profile.id},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${profile.id})`)
      .order('created_at', { ascending: true });
    setMessages(data || []);
    setChatUser({ id: otherId });
  };

  const sendMessage = async () => {
    if (!msg.trim()) return;
    await supabase.from('messages').insert({ sender_id: profile.id, receiver_id: chatUser.id, content: msg });
    setMsg('');
    loadMessages(chatUser.id);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      {!chatUser ? (
        <div>
          <h1 style={{ textAlign: 'center' }}>Community</h1>
          {allUsers.filter(u => u.id !== profile?.id).map(user => (
            <div key={user.id} onClick={() => loadMessages(user.id)} style={{ padding: '15px', background: '#fff', marginBottom: '10px', borderRadius: '12px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              User {user.id.substring(0, 6)}
            </div>
          ))}
        </div>
      ) : (
        <div>
          <button onClick={() => setChatUser(null)} style={{ marginBottom: '10px' }}>Zurück</button>
          <div style={{ height: '300px', overflowY: 'auto', background: '#f9f9f9', padding: '10px', borderRadius: '10px' }}>
            {messages.map(m => (
              <div key={m.id} style={{ textAlign: m.sender_id === profile.id ? 'right' : 'left', margin: '5px' }}>
                <span style={{ background: m.sender_id === profile.id ? '#007AFF' : '#ddd', color: m.sender_id === profile.id ? '#fff' : '#000', padding: '8px 12px', borderRadius: '15px', display: 'inline-block' }}>
                  {m.content}
                </span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', marginTop: '10px' }}>
            <input value={msg} onChange={e => setMsg(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
            <button onClick={sendMessage} style={{ marginLeft: '5px', padding: '10px 15px', background: '#007AFF', color: '#fff', border: 'none', borderRadius: '8px' }}>Senden</button>
          </div>
        </div>
      )}
    </div>
  );
}