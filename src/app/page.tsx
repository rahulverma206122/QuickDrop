'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import FileDownload from '@/components/FileDownload';
import InviteCode from '@/components/InviteCode';
import axios from 'axios';

export default function Home() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'download'>('upload');

  // Upload
  const handleFileUpload = async (files: File | File[]) => {
    setIsUploading(true);
    setInviteCode(null);

    const newFiles = Array.isArray(files) ? files : [files];
    setUploadedFiles(prev => [...prev, ...newFiles]); // keep previous + new files

    try {
      const formData = new FormData();
      [...uploadedFiles, ...newFiles].forEach(file => formData.append('file', file));

      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setInviteCode(response.data.inviteCode);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload file. Try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Remove a single file before upload
  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Download
  const handleDownload = async (code: string) => {
    setIsDownloading(true);

    try {
      const response = await axios.get(`/api/download/${code}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      const disposition = response.headers['content-disposition'];
      let filename = 'downloaded-file';
      if (disposition) {
        const match = disposition.match(/filename="(.+)"/);
        if (match) filename = match[1];
      }

      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download file. Check the invite code.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-1 md:mt-2 md:py-12 max-w-4xl">
      <header className="text-center mb-8">
        <h1 className="mt-40 md:mt-0 text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-500 to-blue-700">QuickDrop</h1>
        <p className="text-xl text-gray-600">Secure P2P File Sharing</p>
      </header>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'upload'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('upload')}
          >
            Share Files
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'download'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('download')}
          >
            Receive a File
          </button>
        </div>

        {activeTab === 'upload' ? (
          <div>
            <FileUpload onFileUpload={handleFileUpload} isUploading={isUploading} />

            {/* Selected files list */}
            {uploadedFiles.length > 0 && !isUploading && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md space-y-2">
                {uploadedFiles.map((file, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm text-gray-600">
                    <span>
                      {file.name} ({Math.round(file.size / 1024)} KB)
                    </span>
                    <button
                      onClick={() => removeFile(idx)}
                      className="text-red-500 hover:text-red-700 text-xs font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {isUploading && (
              <div className="mt-6 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                <p className="mt-2 text-gray-600">Uploading files...</p>
              </div>
            )}

            {inviteCode && !isUploading && (
              <InviteCode code={inviteCode} />
            )}
          </div>
        ) : (
          <div>
            <FileDownload onDownload={handleDownload} isDownloading={isDownloading} />
          </div>
        )}
      </div>

      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>QuickDrop &copy; {new Date().getFullYear()} - Secure P2P File Sharing</p>
      </footer>
    </div>
  );
}
