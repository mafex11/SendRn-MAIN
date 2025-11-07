// src/app/components/FileRoom.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { CloudinaryResource } from '../app/types';
import { useDropzone } from 'react-dropzone';
import { Upload, X, QrCode, Copy } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function FileRoom({ roomId }: { roomId: string }) {
  const [files, setFiles] = useState<CloudinaryResource[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [showQR, setShowQR] = useState(true);
  const [isCopied, setIsCopied] = useState(false); // New state for copy feedback

  useEffect(() => {
    fetchFiles();
    const interval = setInterval(fetchFiles, 5000);
    return () => clearInterval(interval);
  }, [roomId]);

  const fetchFiles = async () => {
    try {
      console.log(`Fetching files for room: ${roomId}`);
      const response = await axios.get(`/api/files/${roomId}`);
      setFiles((prevFiles) => {
        const newFiles = response.data;
        const updatedFiles = [...prevFiles];
        newFiles.forEach((newFile: CloudinaryResource) => {
          const existingIndex = updatedFiles.findIndex(
            (file) => file.public_id === newFile.public_id
          );
          if (existingIndex === -1) {
            updatedFiles.push(newFile);
          } else {
            updatedFiles[existingIndex] = newFile;
          }
        });
        // Sort by created_at descending so newest appears first
        updatedFiles.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        return updatedFiles;
      });
      console.log('Files fetched successfully:', response.data);
    } catch (err) {
      setError('Failed to load files or API limit reached, please try again in 20 mins, or try donating :)');
      console.error('Error fetching files:', err);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      handleUpload(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    console.log('Sending file:', file.name);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('roomId', roomId);
      console.log('Uploading file to Cloudinary...');
      const response = await axios.post('/api/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setUploadProgress(progress);
        },
      });
      console.log('File uploaded successfully:', response.data);
      await fetchFiles();
      setSelectedFile(null);
      setError(null);
      setUploadProgress(0);
    } catch (err) {
      setError('Upload failed');
      console.error('Error uploading file:', err);
    } finally {
      setIsUploading(false);
      console.log('Upload process completed');
    }
  };

  const roomUrl = `https://sendrn.vercel.app/CreateRoom?roomId=${roomId}`;

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
  };

  if (error) {
    return (
      <div className="flex flex-col w-full max-w-6xl space-y-8 mx-auto">
        <div className="w-full max-w-2xl space-y-8 bg-white/10 dark:bg-gray-900/20 backdrop-blur-2xl rounded-3xl p-12 shadow-2xl border border-white/20 dark:border-gray-700/30 mx-auto">
          <div className="flex flex-col space-y-4">
            <div className="flex items-start space-x-2 text-white dark:text-red-400">
              <X className="w-5 h-5 mt-0.5" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => window.location.href = '/Donate'}
              className="px-4 py-2 bg-zinc-950/30 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] text-lg hover:bg-zinc-800/50 border border-white/30"
            >
              Support Sendrn with a Donation
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-6xl space-y-8 mx-auto">
      <div className="w-full max-w-2xl space-y-8 bg-white/10 dark:bg-gray-900/20 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl border border-white/20 dark:border-gray-700/30 mx-auto">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center ">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Room: {roomId}</h1>
          <button
            onClick={handleCopyRoomId}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
            title="Copy Room ID"
          >
            <Copy className="w-5 h-5" />
          </button>
          {isCopied && (
            <span className="text-sm text-green-500 dark:text-green-400 animate-fadeInOut relative ">
              Copied!
            </span>
          )}
        </div>
        <button
          onClick={() => setShowQR(!showQR)}
          className="flex items-center space-x-2 px-4 py-2 bg-zinc-950/50 border border-white/30 hover:bg-zinc-900/20  rounded-lg transition-colors duration-200"
        >
          <QrCode className="w-5 h-5" />
          <span>QR Code</span>
        </button>
      </div>

      {showQR && (
        <div className="mb-8 p-6 bg-zinc-950/20 border border-white/30 hover:bg-zinc-900/20 rounded-3xl shadow-lg " >
          <div className="flex flex-col items-center space-y-4">
            <QRCodeSVG
              value={roomUrl}
              size={200}
              level="H"
              includeMargin
              className="bg-white p-2 rounded-lg"
            />
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Scan to open this room on your phone
            </p>
            <div className="flex items-center space-x-2 w-full">
              <input
                type="text"
                value={roomUrl}
                readOnly
                className="px-4 py-2 bg-zinc-950/20 border border-white/30 rounded-full text-white focus:bg-zinc-800/50 placeholder-gray-300  backdrop-blur-sm text-xl w-full"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(roomUrl);
                }}
                className="px-4 py-2 bg-zinc-950/30 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] text-lg hover:bg-zinc-800/50 border border-white/30"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer
            transition-colors duration-200 ease-in-out
            ${isDragActive 
              ? 'border-white/50 bg-zinc-950/20 ' 
              : 'border-white/30 hover:border-white'
            }
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-4">
            <Upload 
              className={`w-12 h-12 ${
                isDragActive ? 'text-white' : 'text-gray-400 dark:text-gray-600'
              }`}
            />
            {isDragActive ? (
              <p className="text-lg  text-white">Drop the file here...</p>
            ) : (
              <div className="space-y-2">
                <p className="text-lg text-white">
                  Drag & drop a file here, or click to select
                </p>
                <p className="text-sm text-white">
                  Supports any file type
                </p>
              </div>
            )}
          </div>
        </div>

        {isUploading && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-600 ">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-black border border-white rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="mt- p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 z-50 rounded-3xl">
            <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
              <X className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </div>
        )}
      </div>
    </div>

      {files.length > 0 && (
        <div className="w-full max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Uploaded Files</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {files.map((file) => {
              const filenameFromPublicId = file.public_id.split('/').pop() || 'Unnamed File';
              const displayName =
                file.original_filename && file.original_filename !== 'file'
                  ? file.original_filename
                  : filenameFromPublicId;
              return (
                <div key={file.public_id} className="bg-zinc-950/20 border border-white/30 hover:bg-zinc-900/20 rounded-3xl shadow-lg overflow-hidden">
                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 truncate">
                      {displayName}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Size: {(file.bytes / 1024).toFixed(2)} KB
                    </p>
                    <div className="mt-4 flex justify-end">
                      <a
                        href={file.secure_url}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-zinc-950/30 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] text-lg hover:bg-zinc-800/50 border border-white/30"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}