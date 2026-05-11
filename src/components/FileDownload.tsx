// src/components/FileDownload.tsx
'use client';

import { useState } from 'react';

interface Props {
  onDownload: (code: string) => void;
  isDownloading: boolean;
}

export default function FileDownload({ onDownload, isDownloading }: Props) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      setError('Please enter an invite code.');
      return;
    }

    setError('');
    onDownload(code.trim());
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Enter 4-digit invite code"
        value={code}
        onChange={(e) => {
          setCode(e.target.value);
          setError(''); // clear error on type
        }}
        maxLength={4}
        disabled={isDownloading}
        className="w-full px-4 py-2 border rounded-md text-black disabled:opacity-50"
      />

      {/* Inline error */}
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={isDownloading || !code.trim()}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isDownloading ? 'Downloading...' : 'Download'}
      </button>
    </div>
  );
}