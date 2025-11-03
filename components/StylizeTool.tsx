import React, { useState, useCallback } from 'react';
import { ImageUploader } from './ImageUploader';
import { stylizeImage } from '../services/geminiService';
import type { ImageData } from '../types';
import { ArrowDownIcon, StyleIcon, LoadingSpinner, DownloadIcon, UserIcon } from './Icons';

const stylePresets = [
  { name: "Studio Ghibli", imageUrl: "https://picsum.photos/seed/ghibli/200/200" },
  { name: "Anime", imageUrl: "https://picsum.photos/seed/anime/200/200" },
  { name: "Fantasy Art", imageUrl: "https://picsum.photos/seed/fantasy/200/200" },
  { name: "Cyberpunk", imageUrl: "https://picsum.photos/seed/cyberpunk/200/200" },
  { name: "Pixel Art", imageUrl: "https://picsum.photos/seed/pixelart/200/200" },
  { name: "Pop Art", imageUrl: "https://picsum.photos/seed/popart/200/200" },
];

interface ToolProps {
  setIsAboutModalOpen: (isOpen: boolean) => void;
}

function StylizeTool({ setIsAboutModalOpen }: ToolProps) {
  const [image, setImage] = useState<ImageData | null>(null);
  const [style, setStyle] = useState<string>("");
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!image || !style) {
      setError("Please upload an image and specify a style.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setResultImage(null);
    try {
      const result = await stylizeImage(image, style);
      if (result) {
        setResultImage(`data:image/png;base64,${result}`);
      } else {
        setError("Failed to stylize image.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [image, style]);

  const handleDownload = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = 'stylized-masterpiece.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <p className="text-gray-600 dark:text-gray-400 mt-2 mb-8 max-w-2xl mx-auto text-base sm:text-lg">
        Transform your photos into works of art. Upload an image and describe the style you want.
      </p>
      <div className="max-w-lg mx-auto mb-6">
        <ImageUploader label="Image to Stylize" onImageUpload={setImage} />
      </div>
      <div className="max-w-lg mx-auto mb-4">
        <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-3">Choose a Style or Type Your Own</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
          {stylePresets.map(preset => (
            <div key={preset.name} onClick={() => setStyle(preset.name)} className="cursor-pointer group text-center">
              <img src={preset.imageUrl} alt={preset.name} className="rounded-lg shadow-md group-hover:shadow-xl group-hover:ring-4 group-hover:ring-yellow-400 transition-all aspect-square object-cover w-full" />
              <p className="font-semibold mt-2 text-gray-700 group-hover:text-yellow-600 dark:text-gray-300 dark:group-hover:text-yellow-400 transition-colors">{preset.name}</p>
            </div>
          ))}
        </div>
        <input type="text" value={style} onChange={(e) => setStyle(e.target.value)} placeholder="e.g., 'Impressionist painting' or 'Sci-fi comic book'" className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
      </div>
      <button onClick={handleGenerate} disabled={isLoading || !image || !style} className="group relative inline-flex items-center justify-center bg-gray-800 text-yellow-400 font-bold text-lg py-3 px-8 rounded-lg shadow-[8px_8px_0_0_rgba(0,0,0,0.8)] hover:shadow-[4px_4px_0_0_rgba(0,0,0,0.8)] disabled:shadow-none disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform hover:-translate-y-1 disabled:transform-none">
        {isLoading ? <><LoadingSpinner />Stylizing...</> : <><StyleIcon />Stylize Image</>}
      </button>
      {error && <div className="mt-8 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300"><p className="font-bold">Error</p><p>{error}</p></div>}
      {resultImage && (
        <div className="mt-10">
          <div className="flex justify-center items-center mb-4"><ArrowDownIcon /><h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 ml-2">Stylized Masterpiece!</h2></div>
          <div className="bg-gray-200 dark:bg-gray-700 p-2 rounded-lg shadow-inner inline-block">
            <img src={resultImage} alt="Stylized result" className="rounded-md w-full max-w-md mx-auto" />
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

export default StylizeTool;