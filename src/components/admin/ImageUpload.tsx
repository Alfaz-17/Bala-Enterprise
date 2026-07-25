'use client';

import { useState, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';
import { removeBackground, type ProgressData } from '@/lib/removeBg';
import { Upload, X, Loader2, Wand2, ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  /** Provide the raw File object back to the parent (for AI analysis) */
  onFileReady?: (file: File) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function ImageUpload({
  value,
  onChange,
  label = 'Image URL',
  onFileReady,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [removingBg, setRemovingBg] = useState(false);
  const [bgProgress, setBgProgress] = useState(0);
  const [bgProgressText, setBgProgressText] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Keep track of the last selected file for BG removal
  const [lastFile, setLastFile] = useState<File | null>(null);

  async function uploadFile(file: File) {
    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`File too large. Max size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`);
      return;
    }

    // Validate type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (JPEG, PNG, WebP, etc.)');
      return;
    }

    setLastFile(file);
    if (onFileReady) onFileReady(file);

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.success && data.data?.url) {
        onChange(data.data.url);
        toast.success('Image uploaded successfully');
      } else {
        const errorMsg =
          data.error?.message || data.error || 'Upload failed. Check Cloudinary config.';
        toast.error(errorMsg);
        console.error('Upload error response:', data);
      }
    } catch (err: any) {
      console.error('Upload network error:', err);
      toast.error('Upload failed — network error. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    // Reset input so the same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  // --- Drag & Drop ---
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) uploadFile(file);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // --- Background Removal ---
  async function handleRemoveBg() {
    if (!value && !lastFile) {
      toast.error('Upload an image first');
      return;
    }

    setRemovingBg(true);
    setBgProgress(0);
    setBgProgressText('Loading AI model...');

    try {
      let fileToProcess = lastFile;

      // If we don't have the file in memory, fetch from URL
      if (!fileToProcess && value) {
        const response = await fetch(value);
        const blob = await response.blob();
        fileToProcess = new File([blob], 'image.png', { type: blob.type });
      }

      if (!fileToProcess) {
        toast.error('No image to process');
        return;
      }

      const result = await removeBackground(fileToProcess, (data: ProgressData) => {
        if (data.status === 'progress' && typeof data.progress === 'number') {
          setBgProgress(Math.round(data.progress));
          setBgProgressText(
            data.file ? `Loading: ${data.file.split('/').pop()}` : 'Loading model...'
          );
        } else if (data.status === 'done') {
          setBgProgressText('Processing image...');
        }
      });

      if (result) {
        setBgProgressText('Uploading processed image...');
        // Upload the BG-removed image to Cloudinary
        await uploadFile(result);
        toast.success('Background removed & uploaded!');
      } else {
        toast.error('Background removal produced no output');
      }
    } catch (err: any) {
      console.error('BG removal error:', err);
      toast.error(err.message || 'Background removal failed');
    } finally {
      setRemovingBg(false);
      setBgProgress(0);
      setBgProgressText('');
    }
  }

  const isProcessing = uploading || removingBg;

  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">
        {label}
      </label>

      {/* Drop zone / Upload area */}
      {!value ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isProcessing && fileInputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed cursor-pointer transition-all ${
            isDragOver
              ? 'border-primary bg-primary/5'
              : 'border-input hover:border-primary/50 hover:bg-accent/30'
          } ${isProcessing ? 'opacity-60 pointer-events-none' : ''}`}
        >
          {uploading ? (
            <>
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground text-center">
                <span className="font-medium text-foreground">Click to upload</span>{' '}
                or drag & drop
              </p>
              <p className="text-xs text-muted-foreground">
                JPEG, PNG, WebP • Max 10MB
              </p>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            disabled={isProcessing}
          />
        </div>
      ) : (
        /* Image preview + controls */
        <div className="space-y-2">
          {/* URL input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="flex-1 px-3 py-2 border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="https://example.com/image.jpg"
            />
            <label className="px-3 py-2 bg-muted text-foreground border border-input cursor-pointer hover:bg-accent transition-colors text-sm font-medium flex items-center gap-1.5 select-none whitespace-nowrap">
              <ImageIcon className="h-3.5 w-3.5" />
              {uploading ? 'Uploading...' : 'Replace'}
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                disabled={isProcessing}
              />
            </label>
          </div>

          {/* Preview + actions */}
          <div className="relative inline-block border border-border bg-muted p-1.5 group">
            <img
              src={value}
              alt="Preview"
              className="h-28 w-auto object-contain max-w-[240px]"
            />

            {/* Remove image button */}
            <button
              type="button"
              onClick={() => {
                onChange('');
                setLastFile(null);
              }}
              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold hover:bg-red-700 shadow-sm"
              title="Remove image"
            >
              <X className="h-3 w-3" />
            </button>

            {/* BG Remove button */}
            <button
              type="button"
              onClick={handleRemoveBg}
              disabled={isProcessing}
              className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/70 text-white text-[10px] font-medium hover:bg-black/90 transition-colors backdrop-blur-sm disabled:opacity-50"
              title="Remove background"
            >
              {removingBg ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Wand2 className="h-3 w-3" />
              )}
              {removingBg ? 'Processing...' : 'Remove BG'}
            </button>
          </div>

          {/* BG Removal progress bar */}
          {removingBg && (
            <div className="space-y-1">
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${Math.max(bgProgress, 5)}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground">{bgProgressText}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
