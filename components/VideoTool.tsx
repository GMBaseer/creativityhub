import React, { useState, useCallback, useEffect } from 'react';
import { ImageUploader } from './ImageUploader';
import { generateVideoFromImage } from '../services/geminiService';
import type { ImageData } from '../types';
import { VideoIcon, LoadingSpinner, UserIcon } from './Icons';

interface ToolProps {
  setIsAboutModalOpen: (isOpen: boolean) => void;
}

function VideoTool({ setIsAboutModalOpen }: ToolProps) {
  const [image, setImage] = useState<ImageData | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [resultVideo, setResultVideo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progressMessage, setProgressMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [apiKeySelected, setApiKeySelected] = useState<boolean>(false);

  useEffect(() => {
    const checkApiKey = async () => {
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setApiKeySelected(hasKey);
      }
    };
    checkApiKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // Assume success and update UI immediately to avoid race conditions.
      setApiKeySelected(true);
    }
  };

  const handleGenerate = useCallback(async () => {
    if (!image || !prompt) {
      setError("Please upload an image and provide a prompt.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setResultVideo(null);
    setProgressMessage("Initiating video generation...");
    try {
      const result = await generateVideoFromImage(image, prompt, setProgressMessage);
      if (result) {
        setResultVideo(result);
      } else {
        setError("Failed to generate video.");
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      if (errorMessage.includes("Requested entity was not found")) {
        setError("API Key validation failed. Please select your API Key again.");
        setApiKeySelected(false);
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
      setProgressMessage("");
    }
  }, [image, prompt]);

  const content = (
    <div>
      <p className="text-gray-600 dark:text-gray-400 mt-2 mb-8 max-w-2xl mx-auto text-base sm:text-lg">
        Bring your images to life. Upload a starting image and describe the scene you want to create.
      </p>
      <div className="max-w-lg mx-auto mb-6">
        <ImageUploader label="Starting Image" onImageUpload={setImage} />
      </div>
      <div className="max-w-lg mx-auto mb-8">
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., 'A cinematic shot of a car driving through a neon-lit city at night.'" className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition h-24 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
      </div>
      <button onClick={handleGenerate} disabled={isLoading || !image || !prompt} className="group relative inline-flex items-center justify-center bg-gray-800 text-yellow-400 font-bold text-lg py-3 px-8 rounded-lg shadow-[8px_8px_0_0_rgba(0,0,0,0.8)] hover:shadow-[4px_4px_0_0_rgba(0,0,0,0.8)] disabled:shadow-none disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform hover:-translate-y-1 disabled:transform-none">
        {isLoading ? <><LoadingSpinner />Generating...</> : <><VideoIcon />Generate Video</>}
      </button>
      {isLoading && <p className="mt-4 text-gray-700 dark:text-gray-300 font-semibold animate-pulse">{progressMessage}</p>}
      {error && <div className="mt-8 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300"><p className="font-bold">Error</p><p>{error}</p></div>}
      {resultVideo && (
        <div className="mt-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Your Video is Ready!</h2>
          <div className="bg-gray-800 p-2 rounded-lg shadow-inner inline-block">
            <video src={resultVideo} controls autoPlay loop className="rounded-md w-full max-w-md mx-auto" />
          </div>
        </div>
      )}
    </div>
  );

  if (!apiKeySelected) {
    return (
      <div>
        <div className="text-center p-4 bg-yellow-100 border-2 border-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-700/50 rounded-lg">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">API Key Required</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Video generation with Veo requires a Google AI API key. Please select your key to continue.
            For more information about billing, visit <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-yellow-600 dark:text-yellow-400 underline hover:text-yellow-800 dark:hover:text-yellow-300">ai.google.dev/gemini-api/docs/billing</a>.
          </p>
          <button onClick={handleSelectKey} className="bg-yellow-500 text-gray-900 font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-yellow-600 transition-colors">
            Select API Key
          </button>
        </div>
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

  return (
    <div>
      {content}
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

export default VideoTool;