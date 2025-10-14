import React from 'react';
import type { ResumeData, StyleConfig } from '../types';
import { templates } from '../config/theme';

interface ResumePreviewProps {
  resumeData: ResumeData;
  templateId: string;
  styleConfig: StyleConfig;
  scale: number;
}

export const ResumePreview = React.forwardRef<HTMLDivElement, ResumePreviewProps>(({ resumeData, templateId, styleConfig, scale }, ref) => {
  const SelectedTemplate = templates[templateId]?.component;

  if (!SelectedTemplate) {
    return (
        <div className="bg-gray-800/50 p-8 rounded-xl shadow-lg border border-gray-700 text-center">
            <p className="text-red-400">Template não encontrado.</p>
        </div>
    );
  }

  return (
    <div 
        ref={ref} 
        style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease-in-out',
        }}
    >
        <SelectedTemplate data={resumeData} styleConfig={styleConfig} />
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';