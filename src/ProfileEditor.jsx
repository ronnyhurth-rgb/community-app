import React from 'react';
import { supabase } from './supabaseClient';

export default function ProfileEditor({ profile, setProfile, userId }) {
  
  const toggleTag = async (tag, type) => {
    // Aktuelle Liste kopieren
    const currentTags = profile[type] || [];
    const updatedTags = currentTags.includes(tag) 
      ? currentTags.filter(t => t !== tag) // Entfernen
      : [...currentTags, tag];            // Hinzufügen

    // In Datenbank speichern
    const { error } = await supabase
      .from('profiles')
      .update({ [type]: updatedTags })
      .eq('id', userId);

    if (!error) {
      // UI State aktualisieren
      setProfile({ ...profile, [type]: updatedTags });
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h4>Lifestyle anpassen:</h4>
      {['vegan', 'sportlich', 'party'].map(tag => (
        <button 
          key={tag} 
          onClick={() => toggleTag(tag, 'lifestyle_tags')}
          style={{ marginRight: '5px', background: profile.lifestyle_tags?.includes(tag) ? '#4CAF50' : '#ddd' }}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}