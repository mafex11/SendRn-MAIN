'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { CloudinaryResource, TextMessage } from '../app/types';
import { useDropzone } from 'react-dropzone';
import { Upload, X, QrCode, Copy, Check, FileText, Send, Download, File, Image, Video, Music } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

type Tab = 'files' | 'text';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext)) return Image;
  if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext)) return Video;
  if (['mp3', 'wav', 'flac', 'aac', 'ogg'].includes(ext)) return Music;
  if (['pdf', 'doc', 'docx', 'txt', 'md'].includes(ext)) return FileText;
  return File;
}

export default function FileRoom({ roomId }: { roomId: string }) {
  const [files, setFiles] = useState<CloudinaryResource[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<{ file: File; progress: number }[]>([]);
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('files');
  const [textMessages, setTextMessages] = useState<TextMessage[]>([]);
  const [textInput, setTextInput] = useState('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchFiles();
    const interval = setInterval(fetchFiles, 5000);
    return () => clearInterval(interval);
  }, [roomId]);

  useEffect(() => {
    const stored = localStorage.getItem(`sendrn-text-${roomId}`);
    if (stored) setTextMessages(JSON.parse(stored));
  }, [roomId]);

  const fetchFiles = async () => {
    try {
      const response = await fetch(`/api/files/${roomId}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const newFiles: CloudinaryResource[] = await response.json();
      setFiles(prev => {
        const merged = [...prev];
        newFiles.forEach(newFile => {
          const idx = merged.findIndex(f => f.public_id === newFile.public_id);
          if (idx === -1) merged.push(newFile);
          else merged[idx] = newFile;
        });
        merged.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        return merged;
      });
    } catch { /* silent retry */ }
  };

  const uploadFile = async (file: File, index: number) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('roomId', roomId);

    const xhr = new XMLHttpRequest();
    return new Promise<void>((resolve, reject) => {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded * 100) / e.total);
          setUploadQueue(prev => prev.map((item, i) =>
            i === index ? { ...item, progress } : item
          ));
        }
      });
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) resolve();
        else reject(new Error('Upload failed'));
      });
      xhr.addEventListener('error', () => reject(new Error('Upload failed')));
      xhr.open('POST', '/api/upload');
      xhr.send(formData);
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const queue = acceptedFiles.map(file => ({ file, progress: 0 }));
    setUploadQueue(queue);
    setIsUploading(true);

    let successCount = 0;
    for (let i = 0; i < acceptedFiles.length; i++) {
      try {
        await uploadFile(acceptedFiles[i], i);
        successCount++;
      } catch {
        toast.error(`Failed to upload ${acceptedFiles[i].name}`);
      }
    }

    await fetchFiles();
    setIsUploading(false);
    setUploadQueue([]);
    if (successCount > 0) toast.success(`${successCount} file${successCount > 1 ? 's' : ''} uploaded`);
  }, [roomId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: true });

  const roomUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/CreateRoom?roomId=${roomId}`
    : `https://sendrn.vercel.app/CreateRoom?roomId=${roomId}`;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast.success(`${label} copied`);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSendText = () => {
    if (!textInput.trim()) return;
    const msg: TextMessage = {
      id: crypto.randomUUID(),
      content: textInput.trim(),
      created_at: new Date().toISOString(),
    };
    const updated = [msg, ...textMessages];
    setTextMessages(updated);
    localStorage.setItem(`sendrn-text-${roomId}`, JSON.stringify(updated));
    setTextInput('');
    toast.success('Text saved to room');
  };

  const handleDeleteText = (id: string) => {
    const updated = textMessages.filter(m => m.id !== id);
    setTextMessages(updated);
    localStorage.setItem(`sendrn-text-${roomId}`, JSON.stringify(updated));
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-2xl text-stone-900">
            Room <span className="font-mono text-stone-500 text-lg">{roomId}</span>
          </h1>
          <button
            onClick={() => handleCopy(roomId, 'Room ID')}
            className="p-1.5 rounded-lg hover:bg-black/[0.04] transition-colors"
          >
            {copied === 'Room ID' ? (
              <Check className="w-4 h-4 text-emerald-500" />
            ) : (
              <Copy className="w-4 h-4 text-stone-400" />
            )}
          </button>
        </div>
        <button
          onClick={() => setShowQR(!showQR)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl glass text-sm text-stone-600 font-medium hover:bg-white/80 transition-colors"
        >
          <QrCode className="w-4 h-4" />
          <span className="hidden sm:inline">QR</span>
        </button>
      </div>

      {/* QR Panel */}
      <AnimatePresence>
        {showQR && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="glass rounded-3xl p-6">
              <div className="flex flex-col items-center gap-4">
                <QRCodeSVG
                  value={roomUrl}
                  size={170}
                  level="H"
                  includeMargin
                  className="rounded-xl"
                  bgColor="#ffffff"
                  fgColor="#1c1917"
                />
                <p className="text-sm text-stone-400">Scan to open on another device</p>
                <div className="flex items-center gap-2 w-full max-w-sm">
                  <input
                    type="text"
                    value={roomUrl}
                    readOnly
                    className="flex-1 px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-500 text-xs truncate"
                  />
                  <button
                    onClick={() => handleCopy(roomUrl, 'Link')}
                    className="px-3 py-2 rounded-xl bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors"
                  >
                    {copied === 'Link' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-2xl glass">
        {(['files', 'text'] as Tab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-white shadow-sm text-stone-900'
                : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            {tab === 'files' ? <Upload className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
            {tab === 'files' ? 'Files' : 'Text'}
          </button>
        ))}
      </div>

      {/* Files Tab */}
      {activeTab === 'files' && (
        <div className="space-y-4">
          <div
            {...getRootProps()}
            className={`relative rounded-3xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-200 ${
              isDragActive
                ? 'border-orange-300 bg-orange-50/50 scale-[1.01]'
                : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50/50'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-3">
              <div className={`p-4 rounded-2xl ${isDragActive ? 'bg-orange-100' : 'bg-stone-100'} transition-colors`}>
                <Upload className={`w-7 h-7 ${isDragActive ? 'text-orange-500' : 'text-stone-400'}`} />
              </div>
              {isDragActive ? (
                <p className="text-stone-700 font-medium">Drop files here</p>
              ) : (
                <div className="space-y-1">
                  <p className="text-stone-600 font-medium">Drop files or click to upload</p>
                  <p className="text-stone-400 text-sm">Multiple files supported</p>
                </div>
              )}
            </div>
          </div>

          {/* Progress */}
          <AnimatePresence>
            {isUploading && uploadQueue.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-2 overflow-hidden"
              >
                {uploadQueue.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-2xl glass">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-stone-700 truncate">{item.file.name}</p>
                      <div className="mt-1.5 h-1.5 rounded-full bg-stone-100 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-orange-400 to-amber-400"
                          initial={{ width: 0 }}
                          animate={{ width: `${item.progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-stone-400 font-medium tabular-nums">{item.progress}%</span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-stone-400 uppercase tracking-wider px-1">
                {files.length} file{files.length > 1 ? 's' : ''}
              </p>
              <div className="space-y-2">
                {files.map((file) => {
                  const name = file.original_filename && file.original_filename !== 'file'
                    ? file.original_filename
                    : file.public_id.split('/').pop() || 'Unnamed';
                  const Icon = getFileIcon(name);
                  return (
                    <motion.div
                      key={file.public_id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 p-3.5 rounded-2xl glass group hover:shadow-md transition-shadow"
                    >
                      <div className="p-2 rounded-xl bg-stone-100">
                        <Icon className="w-4 h-4 text-stone-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-stone-800 truncate">{name}</p>
                        <p className="text-xs text-stone-400">{formatBytes(file.bytes)}</p>
                      </div>
                      <a
                        href={file.secure_url}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 transition-colors opacity-0 group-hover:opacity-100 sm:opacity-100"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Download</span>
                      </a>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {files.length === 0 && !isUploading && (
            <p className="text-center text-stone-400 text-sm py-8">
              No files yet — drop something to get started.
            </p>
          )}
        </div>
      )}

      {/* Text Tab */}
      {activeTab === 'text' && (
        <div className="space-y-4">
          <div className="relative">
            <textarea
              ref={textAreaRef}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  handleSendText();
                }
              }}
              placeholder="Paste text, links, code snippets..."
              className="w-full min-h-[120px] p-4 rounded-2xl glass border-0 text-stone-800 placeholder-stone-300 resize-none focus:outline-none focus:ring-2 focus:ring-stone-200 transition-shadow"
            />
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <span className="text-xs text-stone-300">
                {typeof navigator !== 'undefined' && navigator.platform?.includes('Mac') ? '⌘' : 'Ctrl'}+Enter
              </span>
              <button
                onClick={handleSendText}
                disabled={!textInput.trim()}
                className="p-2 rounded-xl bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {textMessages.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-stone-400 uppercase tracking-wider px-1">Saved text</p>
              {textMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group relative p-4 rounded-2xl glass"
                >
                  <pre className="text-sm text-stone-700 whitespace-pre-wrap break-words font-mono leading-relaxed">
                    {msg.content}
                  </pre>
                  <div className="absolute top-2.5 right-2.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleCopy(msg.content, msg.id)}
                      className="p-1.5 rounded-lg bg-white/80 hover:bg-white shadow-sm transition-colors"
                    >
                      {copied === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-stone-400" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteText(msg.id)}
                      className="p-1.5 rounded-lg bg-white/80 hover:bg-red-50 shadow-sm transition-colors"
                    >
                      <X className="w-3.5 h-3.5 text-stone-400 hover:text-red-500" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {textMessages.length === 0 && (
            <p className="text-center text-stone-400 text-sm py-8">
              Share text, links, or code between your devices.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
