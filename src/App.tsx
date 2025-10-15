import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { ResumeForm } from './components/ResumeForm';
import { ResumePreview } from './components/ResumePreview';
import { initialResumeData } from './constants';
import type { ResumeData, StyleConfig } from './types';
import { DownloadIcon } from './components/icons/DownloadIcon';
import { ChevronDownIcon } from './components/icons/ChevronDownIcon';
import { generatePdf } from './utils/pdfGenerator';
import { generateDoc } from './utils/docGenerator';
import { generateCsv } from './utils/csvGenerator';
import { AIAssistant } from './components/AIAssistant';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { EditIcon } from './components/icons/EditIcon';
import { SplashScreen } from './components/SplashScreen';

const THEMES = {
  'theme-dark-cyan': 'Ciano Escuro',
  'theme-light': 'Claro',
  'theme-midnight': 'Meia-noite',
};
type ThemeKey = keyof typeof THEMES;
type ViewMode = 'ai' | 'form';

const ThemeSwitcher: React.FC<{ theme: ThemeKey, setTheme: (theme: ThemeKey) => void }> = ({ theme, setTheme }) => (
  <div className="flex items-center gap-x-2 p-1 bg-[var(--input-bg)] rounded-full border border-[var(--panel-border)]">
    {Object.keys(THEMES).map((key) => (
      <button
        key={key}
        onClick={() => setTheme(key as ThemeKey)}
        className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${
          theme === key
            ? 'bg-[var(--app-accent)] text-[var(--app-accent-text)]'
            : 'text-[var(--text-muted)] hover:text-[var(--app-text)]'
        }`}
      >
        {THEMES[key as ThemeKey]}
      </button>
    ))}
  </div>
);

const ViewModeSwitcher: React.FC<{ viewMode: ViewMode, setViewMode: (mode: ViewMode) => void }> = ({ viewMode, setViewMode }) => (
    <div className="flex items-center gap-x-2 p-1 bg-[var(--input-bg)] rounded-full border border-[var(--panel-border)]">
        <button
            onClick={() => setViewMode('ai')}
            className={`flex items-center gap-x-2 px-3 py-1 text-xs font-bold rounded-full transition-colors ${
                viewMode === 'ai' ? 'bg-[var(--app-accent)] text-[var(--app-accent-text)]' : 'text-[var(--text-muted)] hover:text-[var(--app-text)]'
            }`}
        >
            <SparklesIcon /> Assistente com IA
        </button>
        <button
            onClick={() => setViewMode('form')}
            className={`flex items-center gap-x-2 px-3 py-1 text-xs font-bold rounded-full transition-colors ${
                viewMode === 'form' ? 'bg-[var(--app-accent)] text-[var(--app-accent-text)]' : 'text-[var(--text-muted)] hover:text-[var(--app-text)]'
            }`}
        >
            <EditIcon /> Editor Manual
        </button>
    </div>
);

const App: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('classic');
  const [styleConfig, setStyleConfig] = useState<StyleConfig>({
    fontSize: 10,
    fontFamily: "'Merriweather', serif",
    accent: '#06b6d4',
    background: '#ffffff',
    foreground: '#1f2937',
    sidebarBackground: '#1f2937',
    sidebarForeground: '#d1d5db',
    nameColor: '#06b6d4',
  });
  const resumePreviewRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(0.5);
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit');
  const [appTheme, setAppTheme] = useState<ThemeKey>('theme-dark-cyan');
  const [viewMode, setViewMode] = useState<ViewMode>('ai');
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const downloadMenuRef = useRef<HTMLDivElement>(null);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    document.body.className = `${appTheme} bg-[var(--app-bg)]`;
  }, [appTheme]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (downloadMenuRef.current && !downloadMenuRef.current.contains(event.target as Node)) {
            setIsDownloadOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useLayoutEffect(() => {
    const container = previewContainerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
        const A4_WIDTH_PX = 794; // 210mm at 96dpi
        const PADDING_OFFSET = 32; // Account for container padding
        const newScale = (container.offsetWidth - PADDING_OFFSET) / A4_WIDTH_PX;
        setPreviewScale(newScale > 1 ? 1 : newScale);
    });
    
    observer.observe(container);
    return () => observer.disconnect();
  }, [showSplash]); // Re-run when splash screen is dismissed

  const handleDownload = async (format: 'pdf' | 'doc' | 'csv') => {
    setIsDownloadOpen(false); // Close menu on selection
    if (!resumePreviewRef.current) return;

    try {
      if (format === 'pdf') {
        await generatePdf(resumePreviewRef.current);
      } else if (format === 'doc') {
        generateDoc(resumePreviewRef.current);
      } else if (format === 'csv') {
        generateCsv(resumeData);
      }
    } catch (error) {
        console.error(`Failed to generate ${format.toUpperCase()}:`, error);
        alert(`Sorry, there was an issue generating the ${format.toUpperCase()}. Please try again.`);
    }
  };
  
  if (showSplash) {
    return <SplashScreen onStart={() => setShowSplash(false)} />;
  }


  return (
    <div className="bg-[var(--app-bg)] text-[var(--app-text)] min-h-screen font-sans flex flex-col animate-fade-in">
      <header className="bg-[var(--panel-bg-opaque)]/80 backdrop-blur-sm sticky top-0 z-20 shadow-lg border-b border-[var(--panel-border)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-3 gap-4 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-[var(--app-accent)] whitespace-nowrap">AI Resume Builder</h1>
                
                <div className="flex items-center gap-x-2 sm:gap-x-4">
                    <ThemeSwitcher theme={appTheme} setTheme={setAppTheme} />
                    <div className="relative" ref={downloadMenuRef}>
                      <button
                        onClick={() => setIsDownloadOpen(prev => !prev)}
                        className="flex items-center gap-2 px-4 py-2 bg-[var(--app-accent)] hover:bg-[var(--app-accent-hover)] text-[var(--app-accent-text)] font-semibold rounded-lg transition-colors"
                      >
                        <DownloadIcon />
                        <span className="hidden sm:inline">Baixar</span>
                        <ChevronDownIcon />
                      </button>
                      {isDownloadOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-[var(--panel-bg-opaque)] border border-[var(--panel-border)] rounded-lg shadow-xl z-30">
                          <ul className="py-1">
                            <li>
                              <button
                                onClick={() => handleDownload('pdf')}
                                className="w-full text-left px-4 py-2 text-sm text-[var(--app-text)] hover:bg-[var(--app-accent-hover)]/20 transition-colors"
                              >
                                Baixar como PDF
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={() => handleDownload('doc')}
                                className="w-full text-left px-4 py-2 text-sm text-[var(--app-text)] hover:bg-[var(--app-accent-hover)]/20 transition-colors"
                              >
                                Baixar como DOC
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={() => handleDownload('csv')}
                                className="w-full text-left px-4 py-2 text-sm text-[var(--app-text)] hover:bg-[var(--app-accent-hover)]/20 transition-colors"
                              >
                                Baixar como CSV
                              </button>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                </div>
            </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
        <div className="mb-6">
            <ViewModeSwitcher viewMode={viewMode} setViewMode={setViewMode} />
        </div>
        {/* Mobile Tab Navigation */}
        <div className="lg:hidden sticky top-[65px] bg-[var(--app-bg)] z-10 mb-4">
          <div className="grid grid-cols-2 gap-px bg-[var(--panel-border)]">
            <button
              onClick={() => setMobileView('edit')}
              className={`py-3 text-sm font-bold transition-colors ${mobileView === 'edit' ? 'bg-[var(--panel-bg-opaque)] text-[var(--app-accent)]' : 'bg-[var(--panel-bg-opaque)]/50 text-[var(--app-text)]'}`}
            >
              {viewMode === 'ai' ? 'ASSISTENTE' : 'EDITAR'}
            </button>
            <button
              onClick={() => setMobileView('preview')}
              className={`py-3 text-sm font-bold transition-colors ${mobileView === 'preview' ? 'bg-[var(--panel-bg-opaque)] text-[var(--app-accent)]' : 'bg-[var(--panel-bg-opaque)]/50 text-[var(--app-text)]'}`}
            >
              VISUALIZAR
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* Left Panel: Form / AI Assistant */}
            <div className={`lg:col-span-2 ${mobileView === 'edit' ? 'block' : 'hidden lg:block'}`}>
                {viewMode === 'form' ? (
                    <ResumeForm 
                        resumeData={resumeData} 
                        setResumeData={setResumeData}
                        styleConfig={styleConfig}
                        setStyleConfig={setStyleConfig}
                        selectedTemplate={selectedTemplate}
                        setSelectedTemplate={setSelectedTemplate}
                    />
                ) : (
                    <AIAssistant
                        resumeData={resumeData}
                        setResumeData={setResumeData}
                        onComplete={() => setViewMode('form')}
                        styleConfig={styleConfig}
                        setStyleConfig={setStyleConfig}
                        selectedTemplate={selectedTemplate}
                        setSelectedTemplate={setSelectedTemplate}
                    />
                )}
            </div>

            {/* Right Panel: Preview */}
            <div className={`lg:col-span-3 lg:sticky lg:top-[88px] ${mobileView === 'preview' ? 'block' : 'hidden lg:block'}`}>
            <div ref={previewContainerRef} className="bg-[var(--panel-bg)] backdrop-blur-sm p-4 rounded-xl shadow-lg border border-[var(--panel-border)] h-full min-h-[50vh] lg:min-h-0 flex justify-center items-center">
                <ResumePreview 
                ref={resumePreviewRef} 
                resumeData={resumeData} 
                templateId={selectedTemplate} 
                styleConfig={styleConfig}
                scale={previewScale}
                />
            </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;
