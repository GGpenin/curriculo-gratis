import React, { useState, useMemo } from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface SplashScreenProps {
  onStart: () => void;
}

// Sample data for dynamic cards to make the background more lively
const cardExamples = [
    { name: "Ana Clara da Conceição", meta1: "Auxiliar de Enfermagem", meta2: "Gravatá – PE" },
    { name: "Gabriel Guerra", meta1: "Desenvolvedor Full Stack", meta2: "React • Node.js" },
    { name: "Mariana Lopes", meta1: "Analista de Marketing", meta2: "SEO • Conteúdo Digital" },
    { name: "Luiz Pereira", meta1: "UX/UI Designer", meta2: "Figma • Adobe XD" },
    { name: "Carlos Andrade", meta1: "Engenheiro de Dados", meta2: "Python • SQL • AWS" },
    { name: "Beatriz Costa", meta1: "Gerente de Projetos", meta2: "Metodologias Ágeis" },
    { name: "Rafael Almeida", meta1: "Estudante de Direito", meta2: "Procurando Estágio" },
];

// Helper functions for randomization
const rand = (min: number, max: number) => Math.random() * (max - min) + min;
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const SplashScreen: React.FC<SplashScreenProps> = ({ onStart }) => {
  const [isExiting, setIsExiting] = useState(false);

  // Generate randomized card properties, memoized for performance
  const floatingCards = useMemo(() => {
    return Array.from({ length: 35 }).map((_, i) => {
        const sample = pick(cardExamples);
        const withPhoto = Math.random() > 0.4;
        const initials = sample.name.split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase();
        
        return {
            id: i,
            sample,
            withPhoto,
            initials,
            style: {
                top: `${rand(-10, 110)}%`,
                left: `${rand(-10, 110)}%`,
                '--rot': `${rand(-15, 15)}deg`,
                '--scale': rand(0.75, 1.1).toFixed(2),
                '--dur': `${rand(8, 16)}s`,
                '--float-mult': rand(0.7, 1.3).toFixed(2),
                animationDelay: `-${rand(0, 10)}s`,
                opacity: rand(0.5, 1).toFixed(2),
            } as React.CSSProperties,
        };
    });
  }, []);

  const handleStart = () => {
    setIsExiting(true);
    // Wait for the fade-out animation to complete before calling onStart
    setTimeout(onStart, 500); 
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--app-bg)] transition-opacity duration-500 ${isExiting ? 'opacity-0' : 'opacity-100'} overflow-hidden`}
    >
      {/* Background Decoration - Covers the entire screen */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {floatingCards.map(card => (
            <div key={card.id} className="absolute animate-floaty" style={card.style}>
                <div className="w-56 h-auto bg-[var(--panel-bg-opaque)]/80 p-3 rounded-lg border border-[var(--panel-border)] shadow-xl text-left flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-md bg-[var(--input-border)] flex-shrink-0 flex items-center justify-center font-bold text-lg ${!card.withPhoto && 'opacity-50'}`}>
                        {card.withPhoto ? card.initials : 'CV'}
                    </div>
                    <div className="flex-grow overflow-hidden">
                        <div className="text-sm font-bold text-[var(--app-text)] truncate">{card.sample.name}</div>
                        <div className="text-xs text-[var(--text-muted)] mt-1 truncate">{card.sample.meta1}</div>
                        <div className="text-xs text-[var(--text-muted)] truncate">{card.sample.meta2}</div>
                    </div>
                </div>
            </div>
        ))}
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 text-center p-8 bg-[var(--app-bg)]/50 rounded-2xl">
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