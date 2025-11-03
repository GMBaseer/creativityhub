import React from 'react';
import { CloseIcon, UserIcon } from './Icons';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center relative transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()}
        style={{ animationFillMode: 'forwards' }}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 dark:text-gray-500 dark:hover:text-gray-100 transition-colors"
          aria-label="Close modal"
        >
          <CloseIcon />
        </button>
        
        <div className="w-24 h-24 bg-yellow-400 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
          <UserIcon />
        </div>

        <h2 className="text-3xl font-black text-gray-800 dark:text-gray-100">About the Author</h2>
        <p className="text-xl font-bold text-yellow-500 dark:text-yellow-400 mt-1">A Passionate Developer</p>
        
        <p className="text-gray-600 dark:text-gray-400 my-4">
          This application was crafted with creativity and a love for cutting-edge technology. 
          As a developer, I'm driven by the potential of AI to unlock new forms of expression and bring ideas to life.
        </p>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <p className="font-semibold text-gray-700 dark:text-gray-300">Connect with me:</p>
          <div className="flex justify-center gap-4 mt-2">
            <a href="#" className="text-gray-500 hover:text-yellow-600 dark:text-gray-400 dark:hover:text-yellow-400 font-bold transition-colors">GitHub</a>
            <a href="#" className="text-gray-500 hover:text-yellow-600 dark:text-gray-400 dark:hover:text-yellow-400 font-bold transition-colors">LinkedIn</a>
            <a href="#" className="text-gray-500 hover:text-yellow-600 dark:text-gray-400 dark:hover:text-yellow-400 font-bold transition-colors">Portfolio</a>
          </div>
        </div>

      </div>
      <style>{`
        @keyframes fade-in-scale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AboutModal;