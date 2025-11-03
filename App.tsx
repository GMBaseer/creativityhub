import React, { useState, useEffect } from 'react';
import { EmbraceIcon, EnhanceIcon, ExtractIcon, HeartIcon, StyleIcon, ValidateIcon, VideoIcon } from './components/Icons';
import EmbraceTool from './components/EmbraceTool';
import EnhanceTool from './components/EnhanceTool';
import StylizeTool from './components/StylizeTool';
import ValidatorTool from './components/ValidatorTool';
import ObjectExtractorTool from './components/ObjectExtractorTool';
import VideoTool from './components/VideoTool';
import AboutModal from './components/AboutModal';
import ThemeToggle from './components/ThemeToggle';


type ToolId = 'embrace' | 'stylize' | 'enhance' | 'validator' | 'extractor' | 'video';
export type Theme = 'light' | 'dark';

interface Tool {
  id: ToolId;
  label: string;
  icon: React.FC;
  component: React.ComponentType<{ setIsAboutModalOpen: (isOpen: boolean) => void; }>;
}

const tools: Tool[] = [
  { id: 'embrace', label: 'Embrace', icon: HeartIcon, component: EmbraceTool },
  { id: 'stylize', label: 'Stylize', icon: StyleIcon, component: StylizeTool },
  { id: 'enhance', label: 'Enhance', icon: EnhanceIcon, component: EnhanceTool },
  { id: 'validator', label: 'Validator', icon: ValidateIcon, component: ValidatorTool },
  { id: 'extractor', label: 'Extractor', icon: ExtractIcon, component: ObjectExtractorTool },
  { id: 'video', label: 'Image to Video', icon: VideoIcon, component: VideoTool },
];

function App() {
  const [activeTool, setActiveTool] = useState<ToolId>('embrace');
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const ActiveComponent = tools.find(t => t.id === activeTool)?.component;

  return (
    <div className="min-h-screen bg-yellow-400 dark:bg-gray-900 w-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <main className="w-full max-w-4xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-10 text-center">
        <header className="mb-8 relative">
          <div className="absolute top-0 right-0">
              <ThemeToggle theme={theme} setTheme={setTheme} />
          </div>
          <div className="flex items-center justify-center">
            <EmbraceIcon />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-800 dark:text-gray-100 tracking-tight ml-2">
              AI Creative <span className="text-yellow-500 dark:text-yellow-400">Suite</span>
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto text-base sm:text-lg">
            Your all-in-one toolbox for creative AI-powered image and video editing.
          </p>
        </header>

        <div className="border-b border-gray-300 dark:border-gray-700 mb-8">
          <nav className="-mb-px flex flex-wrap justify-center gap-x-2 sm:gap-x-4" aria-label="Tabs">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`${
                  activeTool === tool.id
                    ? 'border-yellow-500 text-yellow-600 dark:text-yellow-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                } group inline-flex items-center py-3 px-2 sm:px-4 border-b-4 font-bold text-sm sm:text-base transition-colors duration-200`}
                aria-current={activeTool === tool.id ? 'page' : undefined}
              >
                <tool.icon />
                {tool.label}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="tool-content">
          {ActiveComponent && <ActiveComponent setIsAboutModalOpen={setIsAboutModalOpen} />}
        </div>

      </main>
      <footer className="w-full max-w-4xl text-center mt-6 text-gray-800/70 dark:text-gray-400/70">
        <p>Powered by Gemini API</p>
      </footer>
      <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />
    </div>
  );
}

export default App;