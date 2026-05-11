// src/components/FileUpload.tsx
'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';

interface Props {
  onFileUpload: (files: File[]) => void;
  isUploading: boolean;
}

export default function FileUpload({ onFileUpload, isUploading }: Props) {

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        w-full p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-all
        ${isDragActive
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 hover:border-blue-500 hover:bg-gray-50'
        }
        ${isUploading ? 'opacity-50 pointer-events-none' : ''}
      `}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="p-3 bg-blue-100 rounded-full">
          <FiUpload className="w-9 h-9 text-blue-500" />
        </div>

        <p className="text-lg font-medium text-blue-500">
          {isDragActive
            ? 'Drop your files here...'
            : 'Drag & drop files here, or click to select'
          }
        </p>

        <p className="text-sm text-gray-500">
          Multiple files supported — shared securely with one invite code
        </p>
      </div>
    </div>
  );
}