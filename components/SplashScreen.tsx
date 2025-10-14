import React, { useState } from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface SplashScreenProps {
  onStart: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onStart }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleStart = () => {
    setIsExiting(true);
    // Wait for the fade-out animation to complete before calling onStart
    setTimeout(onStart, 500); 
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--app-bg)] transition-opacity duration-500 ${isExiting ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className="text-center p-8">
        <div className="animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[var(--panel-bg-opaque)] border-2 border-[var(--app-accent)] rounded-full mb-6">
                <SparklesIcon />
            </div>
            <h1 className="text-2xl font-semibold text-[var(--text-muted)]">
                Bem-vindo ao
            </h1>
            <h2 
                className="text-5xl sm:text-6xl font-bold text-[var(--app-text)] mt-2"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
                currículo grátis
            </h2>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <button
              onClick={handleStart}
              className="mt-12 px-8 py-3 bg-[var(--app-accent)] hover:bg-[var(--app-accent-hover)] text-[var(--app-accent-text)] font-bold text-lg rounded-lg transition-all transform hover:scale-105"
            >
              Comece Já
            </button>
        </div>
      </div>
    </div>
  );
};