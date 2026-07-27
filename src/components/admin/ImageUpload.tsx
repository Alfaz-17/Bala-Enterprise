'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Upload, X, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  onFileReady?: (file: File | null) => void;
  uploading?: boolean;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function ImageUpload({
  value,
  onChange,
  label = 'Image URL',
  onFileReady,
  uploading = false,
}: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (value && value.startsWith('blob:')) {
        URL.revokeObjectURL(value);
      }
    };
  }, [value]);

  const processFile = useCallback((file: File) => {
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

    const localUrl = URL.createObjectURL(file);
    onChange(localUrl);
    if (onFileReady) onFileReady(file);
  }, [onChange, onFileReady]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
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
      if (file) processFile(file);
    },
    [processFile]
  );

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
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed cursor-pointer transition-all ${
            isDragOver
              ? 'border-primary bg-primary/5'
              : 'border-input hover:border-primary/50 hover:bg-accent/30'
          } ${uploading ? 'opacity-60 pointer-events-none' : ''}`}
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
                <span className="font-medium text-foreground">Click to select</span>{' '}
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
            disabled={uploading}
          />
        </div>
      ) : (
        /* Image preview + controls */
        <div className="space-y-2">
          {/* URL/Path input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={value.startsWith('blob:') ? '' : value}
              onChange={(e) => {
                onChange(e.target.value);
                if (onFileReady) onFileReady(null);
              }}
              className="flex-1 px-3 py-2 border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Local preview (uploading on save...)"
              disabled={uploading}
            />
            <button
              type="button"
              onClick={() => !uploading && fileInputRef.current?.click()}
              className="px-3 py-2 bg-muted text-foreground border border-input cursor-pointer hover:bg-accent transition-colors text-sm font-medium flex items-center gap-1.5 select-none whitespace-nowrap disabled:opacity-50"
              disabled={uploading}
            >
              Replace
            </button>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
              disabled={uploading}
            />
          </div>

          {/* Preview + actions */}
          <div className="relative inline-block border border-border bg-muted p-1.5 group">
            <img
              src={value}
              alt="Preview"
              className="h-28 w-auto object-contain max-w-[240px]"
            />

            {uploading && (
              <div className="absolute inset-0 bg-background/70 flex flex-col items-center justify-center gap-1">
                <Loader2 className="h-5 w-5 text-primary animate-spin" />
                <span className="text-[10px] text-muted-foreground font-medium">Uploading...</span>
              </div>
            )}

            {!uploading && (
              <button
                type="button"
                onClick={() => {
                  onChange('');
                  if (onFileReady) onFileReady(null);
                }}
                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold hover:bg-red-700 shadow-sm"
                title="Remove image"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
