'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import { useDropzone, FileRejection } from 'react-dropzone';
import { Campton } from '@/lib/fonts';
import { cn } from '@/lib/cn';
import { EditIcon, DeleteIcon, CloseIcon, UploadIcon } from '@/components/Icons';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export default function ImageUpload({ 
  value, 
  onChange, 
  className,
  disabled = false 
}: ImageUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [fileInfo, setFileInfo] = useState<{ name: string; size: string } | null>(null);

  const compressImage = (file: File, quality: number = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Preserve GIFs as-is to keep animation
      if (file.type === 'image/gif') {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read GIF file'));
        reader.readAsDataURL(file);
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new window.Image();

      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        const MAX_WIDTH = 1024;
        const MAX_HEIGHT = 1024;
        
        let { width, height } = img;
        
        if (width > height) {
          if (width > MAX_WIDTH) {
            height = (height * MAX_WIDTH) / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = (width * MAX_HEIGHT) / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress, preserving format (PNG/WebP), default to JPEG
        ctx?.drawImage(img, 0, 0, width, height);
        
        let mimeType = 'image/jpeg';
        if (file.type === 'image/png') mimeType = 'image/png';
        if (file.type === 'image/webp') mimeType = 'image/webp';
        const compressedDataUrl = canvas.toDataURL(mimeType, quality);
        resolve(compressedDataUrl);
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    setError(null);

    if (fileRejections.length > 0) {
      const rejection = fileRejections[0];
      if (rejection.errors.find((e) => e.code === 'file-too-large')) {
        setError('File size must be less than 5MB');
      } else if (rejection.errors.find((e) => e.code === 'file-invalid-type')) {
        setError('Please select a valid image file');
      } else {
        setError('Invalid file');
      }
      return;
    }

    const file = acceptedFiles[0];
    if (file) {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Format file size
      const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      };

      setFileInfo({
        name: file.name,
        size: formatFileSize(file.size)
      });

      // Compress image before encoding
      compressImage(file)
        .then((compressedDataUrl) => {
          setUploadProgress(100);
          setTimeout(() => {
            onChange(compressedDataUrl);
            setIsUploading(false);
          }, 300);
        })
        .catch(() => {
          setError('Failed to process image');
          setIsUploading(false);
          setFileInfo(null);
          setUploadProgress(0);
        });
    }
  }, [onChange]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject
  } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled
  });

  const handleChangeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        onDrop([file], []);
      }
    };
    input.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setError(null);
    setFileInfo(null);
    setUploadProgress(0);
    setIsUploading(false);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "relative min-h-[140px] rounded-[12px] border-2 border-dashed transition-all duration-200 cursor-pointer",
          isDragActive && !isDragReject && "border-[#020202] bg-[#f8f9fa]",
          isDragReject && "border-red-500 bg-red-50",
          disabled && "opacity-50 cursor-not-allowed",
          value || isUploading ? "bg-white border-[#e9ecef]" : "bg-[#f8f9fa] border-[#dee2e6]"
        )}
      >
        <input {...getInputProps()} />

{value ? (
          <div className="p-4">
            {/* Show preview for both uploaded files and existing URLs */}
            <div className="flex items-center justify-between p-3 bg-[#f8f9fa] rounded-lg border border-[#e9ecef]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#e3f2fd] rounded-lg flex items-center justify-center overflow-hidden">
                  {/* Preview for URLs or data URIs (including GIFs) */}
                  {(() => {
                    // Use Next Image for all cases (GIFs/data URIs included) to satisfy linting
                    return (
                      <Image 
                        src={value} 
                        alt="Current image" 
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    );
                  })()}
                </div>
                <div className="flex-1">
                  <p className={cn(
                    "text-[#212529] text-[14px] font-medium truncate max-w-[200px]",
                    Campton.className
                  )}>
                    {fileInfo?.name || (value.startsWith('http') ? value.split('/').pop() || 'Uploaded Image' : 'Uploaded Image')}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {fileInfo?.size && (
                      <>
                        <span className={cn(
                          "text-[#6c757d] text-[12px]",
                          Campton.className
                        )}>
                          {fileInfo.size}
                        </span>
                        <span className="text-[#6c757d]">•</span>
                      </>
                    )}
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-[#28a745] rounded-full"></div>
                      <span className={cn(
                        "text-[#28a745] text-[12px] font-medium",
                        Campton.className
                      )}>
                        {value.startsWith('http') ? 'Loaded' : 'Completed'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleChangeClick}
                  className="p-1.5 text-[#6c757d] hover:text-[#020202] hover:bg-[#e9ecef] rounded transition-colors"
                  disabled={disabled || isUploading}
                  title="Change file"
                >
                  <EditIcon />
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="p-1.5 text-[#6c757d] hover:text-[#dc3545] hover:bg-[#f8d7da] rounded transition-colors"
                  disabled={disabled || isUploading}
                  title="Remove file"
                >
                  <DeleteIcon />
                </button>
              </div>
            </div>
          </div>
) : isUploading ? (
          <div className="p-4">
            {fileInfo && (
              <div className="flex items-center justify-between p-3 bg-[#fff3cd] rounded-lg border border-[#ffeaa7]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#fff] rounded-lg flex items-center justify-center border border-[#ffeaa7]">
                    <UploadIcon width={20} height={20} color="#856404" />
                  </div>
                  <div className="flex-1">
                    <p className={cn(
                      "text-[#212529] text-[14px] font-medium truncate max-w-[200px]",
                      Campton.className
                    )}>
                      {fileInfo.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn(
                        "text-[#6c757d] text-[12px]",
                        Campton.className
                      )}>
                        {fileInfo.size}
                      </span>
                      <span className="text-[#6c757d]">•</span>
                      <span className={cn(
                        "text-[#856404] text-[12px] font-medium",
                        Campton.className
                      )}>
                        Uploading... {uploadProgress}%
                      </span>
                    </div>
                    <div className="w-full bg-[#ffeaa7] rounded-full h-1.5 mt-2">
                      <div 
                        className="bg-[#ffc107] h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsUploading(false);
                    setFileInfo(null);
                    setUploadProgress(0);
                  }}
                  className="p-1.5 text-[#6c757d] hover:text-[#dc3545] hover:bg-[#f8d7da] rounded transition-colors"
                  title="Cancel upload"
                >
                  <CloseIcon />
                </button>
              </div>
            )}
          </div>
) : (
          <div className="flex flex-col items-center justify-center gap-4 py-8 px-4">
            <div className="w-12 h-12 bg-[#e3f2fd] rounded-xl flex items-center justify-center">
              <UploadIcon width={24} height={24} color="#1976d2" />
            </div>
            <div className="text-center">
              <p className={cn(
                "text-[#212529] text-[16px] font-medium mb-1",
                Campton.className
              )}>
                {isDragActive 
                  ? (isDragReject ? "Invalid file type" : "Drop your image here") 
                  : "Choose a file or drag & drop it here"
                }
              </p>
              <p className={cn(
                "text-[#6c757d] text-[14px]",
                Campton.className
              )}>
                JPEG, PNG, GIF, and WEBP formats, up to 5 MB
              </p>
            </div>
            {!isDragActive && (
              <button
                type="button"
                className={cn(
                  "px-6 py-2 bg-white border border-[#dee2e6] text-[#495057] rounded-lg hover:bg-[#f8f9fa] transition-colors font-medium",
                  Campton.className
                )}
              >
                Browse File
              </button>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className={cn(
          "text-red-500 text-xs",
          Campton.className
        )}>
          {error}
        </p>
      )}
    </div>
  );
}
