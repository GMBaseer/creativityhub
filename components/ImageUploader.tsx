import React, { useState, useRef, useCallback } from 'react';
import type { ImageData } from '../types';
import { UploadIcon } from './Icons';

interface ImageUploaderProps {
  label: string;
  onImageUpload: (imageData: ImageData | null) => void;
}

const fileToImageData = (file: File): Promise<ImageData> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const previewUrl = event.target?.result as string;
            if (!previewUrl) {
                reject(new Error("Failed to read file."));
                return;
            }
            const base64 = previewUrl.split(',')[1];
            resolve({ base64, mimeType: file.type, previewUrl });
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};

export const ImageUploader: React.FC<ImageUploaderProps> = ({ label, onImageUpload }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      try {
        const imageData = await fileToImageData(file);
        setPreview(imageData.previewUrl);
        onImageUpload(imageData);
      } catch (error) {
        console.error("Error processing file:", error);
        onImageUpload(null);
      }
    }
  }, [onImageUpload]);

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">{label}</h3>
      <div
        onClick={openFileDialog}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`w-full h-64 border-4 border-dashed rounded-lg flex items-center justify-center text-center p-4 cursor-pointer transition-colors duration-300 ${isDragging ? 'border-yellow-500 bg-yellow-100 dark:bg-yellow-900/20' : 'border-gray-300 bg-gray-50 hover:border-yellow-400 dark:border-gray-600 dark:bg-gray-700/50 dark:hover:border-yellow-500'}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files)}
        />
        {preview ? (
          <img src={preview} alt={`${label} preview`} className="max-h-full max-w-full object-contain rounded-md" />
        ) : (
          <div className="text-gray-500 dark:text-gray-400">
            <UploadIcon />
            <p className="font-semibold">Click to upload or drag & drop</p>

            <p className="text-sm">PNG, JPG, or WEBP</p>
          </div>
        )}
      </div>
    </div>
  );
};