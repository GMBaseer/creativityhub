import React, { useState, useCallback } from 'react';
import { ImageUploader } from './ImageUploader';
import { validateHuman } from '../services/geminiService';
import type { ImageData } from '../types';
import { ValidateIcon, LoadingSpinner, UserIcon } from './Icons';

interface ToolProps {
  setIsAboutModalOpen: (isOpen: boolean) => void;
}

function ValidatorTool({ setIsAboutModalOpen }: ToolProps) {
  const [image, setImage] = useState<ImageData | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!image) {
      setError("Please upload an image to validate.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const apiResult = await validateHuman(image);
      if (apiResult === true) {
        setResult("✅ This image appears to contain a human.");
      } else if (apiResult === false) {
        setResult("❌ This image does not appear to contain a human.");
      } else {
        setError("Could not determine the contents of the image.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [image]);

  return (
    <div>
      <p className="text-gray-600 dark:text-gray-400 mt-2 mb-8 max-w-2xl mx-auto text-base sm:text-lg">
        Upload an image to check if it contains a human or a human-like figure.
      </p>
      <div className="max-w-md mx-auto mb-8">
        <ImageUploader label="Image to Validate" onImageUpload={setImage} />
      </div>
      <button onClick={handleGenerate} disabled={isLoading || !image} className="group relative inline-flex items-center justify-center bg-gray-800 text-yellow-400 font-bold text-lg py-3 px-8 rounded-lg shadow-[8px_8px_0_0_rgba(0,0,0,0.8)] hover:shadow-[4px_4px_0_0_rgba(0,0,0,0.8)] disabled:shadow-none disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform hover:-translate-y-1 disabled:transform-none">
        {isLoading ? <><LoadingSpinner />Validating...</> : <><ValidateIcon />Validate Image</>}
      </button>
      {error && <div className="mt-8 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300"><p className="font-bold">Error</p><p>{error}</p></div>}
      {result && (
        <div className="mt-10 p-6 bg-yellow-100 border-2 border-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-700/50 rounded-lg max-w-md mx-auto">
          <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{result}</p>
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

export default ValidatorTool;