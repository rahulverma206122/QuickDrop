'use client';

import { useState } from 'react';

interface Props {
  onDownload: (code: string) => void;
  isDownloading: boolean;
}

export default function FileDownload({ onDownload, isDownloading }: Props) {
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      onDownload(code.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Enter invite code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full px-4 py-2 border rounded-md text-black"
      />
      <button
        type="submit"
        disabled={isDownloading}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isDownloading ? 'Downloading...' : 'Download'}
      </button>
    </form>
  );
}

