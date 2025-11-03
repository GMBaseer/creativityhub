import React, { useState, useCallback } from 'react';
import { ImageUploader } from './ImageUploader';
import { extractObject } from '../services/geminiService';
import type { ImageData } from '../types';
import { ArrowDownIcon, ExtractIcon, LoadingSpinner, DownloadIcon, UserIcon } from './Icons';

interface ToolProps {
  setIsAboutModalOpen: (isOpen: boolean) => void;
}

function ObjectExtractorTool({ setIsAboutModalOpen }: ToolProps) {
  const [image, setImage] = useState<ImageData | null>(null);
  const [object, setObject] = useState<string>("");
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!image || !object) {
      setError("Please upload an image and specify an object to extract.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setResultImage(null);
    try {
      const result = await extractObject(image, object);
      if (result) {
        setResultImage(`data:image/png;base64,${result}`);
      } else {
        setError("Failed to extract the object.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [image, object]);

  const handleDownload = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = 'extracted-object.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <p className="text-gray-600 dark:text-gray-400 mt-2 mb-8 max-w-2xl mx-auto text-base sm:text-lg">
        Isolate any object from your photos. Upload an image and name the object you want to extract.
      </p>
      <div className="max-w-lg mx-auto mb-6">
        <ImageUploader label="Source Image" onImageUpload={setImage} />
      </div>
      <div className="max-w-lg mx-auto mb-8">
        <input type="text" value={object} onChange={(e) => setObject(e.target.value)} placeholder="e.g., 'the person', 'the red car', 'the dog'" className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
      </div>
      <button onClick={handleGenerate} disabled={isLoading || !image || !object} className="group relative inline-flex items-center justify-center bg-gray-800 text-yellow-400 font-bold text-lg py-3 px-8 rounded-lg shadow-[8px_8px_0_0_rgba(0,0,0,0.8)] hover:shadow-[4px_4px_0_0_rgba(0,0,0,0.8)] disabled:shadow-none disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform hover:-translate-y-1 disabled:transform-none">
        {isLoading ? <><LoadingSpinner />Extracting...</> : <><ExtractIcon />Extract Object</>}
      </button>
      {error && <div className="mt-8 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300"><p className="font-bold">Error</p><p>{error}</p></div>}
      {resultImage && (
        <div className="mt-10">
          <div className="flex justify-center items-center mb-4"><ArrowDownIcon /><h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 ml-2">Extracted Object!</h2></div>
          <div className="bg-gray-200 dark:bg-gray-900 p-2 rounded-lg shadow-inner inline-block" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='6' ry='6' stroke='%23333' stroke-width='3' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`}}>
            <img src={resultImage} alt="Extracted object" className="rounded-md w-full max-w-md mx-auto" />
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

export default ObjectExtractorTool;