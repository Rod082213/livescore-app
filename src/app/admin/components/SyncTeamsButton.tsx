// src/app/admin/components/SyncTeamsButton.tsx
'use client';

import { useState } from 'react';

export function SyncTeamsButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSync = async () => {
    setLoading(true);
    setMessage('Syncing...');
    try {
      const response = await fetch('/api/teams/sync', {
        method: 'POST',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setMessage(`Sync complete! Created: ${data.created}, Updated: ${data.updated}`);
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleSync} disabled={loading}>
        {loading ? 'Syncing Teams...' : 'Sync All Teams'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}