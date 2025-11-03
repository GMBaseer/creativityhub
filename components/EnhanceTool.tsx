import React, { useState, useCallback } from 'react';
import { ImageUploader } from './ImageUploader';
import { enhanceImage } from '../services/geminiService';
import type { ImageData } from '../types';
import { ArrowDownIcon, EnhanceIcon, LoadingSpinner, DownloadIcon, UserIcon } from './Icons';

interface ToolProps {
  setIsAboutModalOpen: (isOpen: boolean) => void;
}

function EnhanceTool({ setIsAboutModalOpen }: ToolProps) {
  const [image, setImage] = useState<ImageData | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!image) {
      setError("Please upload an image to enhance.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setResultImage(null);
    try {
      const result = await enhanceImage(image);
      if (result) {
        setResultImage(`data:image/png;base64,${result}`);
      } else {
        setError("Failed to enhance image.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [image]);
  
  const handleDownload = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = 'enhanced-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <p className="text-gray-600 dark:text-gray-400 mt-2 mb-8 max-w-2xl mx-auto text-base sm:text-lg">
        Upload a photo to automatically improve its sharpness, colors, and overall quality.
      </p>
      <div className="max-w-md mx-auto mb-8">
        <ImageUploader label="Image to Enhance" onImageUpload={setImage} />
      </div>
      <button onClick={handleGenerate} disabled={isLoading || !image} className="group relative inline-flex items-center justify-center bg-gray-800 text-yellow-400 font-bold text-lg py-3 px-8 rounded-lg shadow-[8px_8px_0_0_rgba(0,0,0,0.8)] hover:shadow-[4px_4px_0_0_rgba(0,0,0,0.8)] disabled:shadow-none disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform hover:-translate-y-1 disabled:transform-none">
        {isLoading ? <><LoadingSpinner />Enhancing...</> : <><EnhanceIcon />Enhance Image</>}
      </button>
      {error && <div className="mt-8 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300"><p className="font-bold">Error</p><p>{error}</p></div>}
      {resultImage && (
        <div className="mt-10">
          <div className="flex justify-center items-center mb-4"><ArrowDownIcon /><h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 ml-2">Enhanced Image!</h2></div>
          <div className="bg-gray-200 dark:bg-gray-700 p-2 rounded-lg shadow-inner inline-block">
            <img src={resultImage} alt="Enhanced result" className="rounded-md w-full max-w-md mx-auto" />
          </div>
          <div className="mt-4">
            <button
              onClick={handleDownload}
              className="inline-flex items-center justify-center bg-yellow-500 text-gray-900 font-bold text-base py-2 px-6 rounded-lg shadow-[4px_4px_0_0_rgba(0,0,0,0.8)] hover:shadow-[2px_2px_0_0_rgba(0,0,0,0.8)] transition-all duration-200 ease-in-out transform hover:-translate-y-0.5"
            >
              <DownloadIcon />
              Download Image
            </button>
          </div>
        </div>
      )}
      <div className="mt-16 border-t dark:border-gray-700 pt-6 text-center">
          <button 
              onClick={() => setIsAboutModalOpen(true)}
              className="inline-flex items-center text-sm font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:underline transition-colors"
          >
              <UserIcon />
              About the Author
          </button>
      </div>
    </div>
  );
}

export default EnhanceTool;