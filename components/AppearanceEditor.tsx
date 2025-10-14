import React from 'react';
import type { AppearanceEditorProps } from '../types';
import { templates, FONTS } from '../config/theme';
import { TrashIcon } from './icons/TrashIcon';

const ColorInput: React.FC<{ label: string; value: string; onChange: (color: string) => void; }> = ({ label, value, onChange }) => (
    <div className="flex items-center justify-between">
      <label className="text-sm font-medium">{label}</label>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 p-0 border-none rounded cursor-pointer bg-transparent"
      />
    </div>
);

const FileInputField: React.FC<{label: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}> = ({label, onChange}) => (
    <div className="flex flex-col">
        <label className="mb-1 text-sm font-semibold text-[var(--text-muted)]">{label}</label>
        <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={onChange}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--app-accent)] file:text-[var(--app-accent-text)] hover:file:bg-[var(--app-accent-hover)] p-2 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-md focus:ring-2 focus:ring-[var(--app-accent)] focus:outline-none transition-shadow text-[var(--text-muted)]"
        />
    </div>
);


export const AppearanceEditor: React.FC<AppearanceEditorProps> = ({
    styleConfig,
    setStyleConfig,
    selectedTemplate,
    setSelectedTemplate,
    resumeData,
    setResumeData,
}) => {
    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target && typeof event.target.result === 'string') {
                    setResumeData(prev => ({...prev, personalInfo: {...prev.personalInfo, photo: event.target.result as string}}));
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const removePhoto = () => {
        setResumeData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, photo: '' } }));
    };

    return (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
                <div>
                    <label htmlFor="template-select" className="text-sm font-medium mb-1 block">Template</label>
                    <select
                        id="template-select"
                        value={selectedTemplate}
                        onChange={(e) => setSelectedTemplate(e.target.value)}
                        className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-md p-2 text-sm focus:ring-2 focus:ring-[var(--app-accent)] focus:outline-none transition-shadow"
                    >
                        {Object.entries(templates).map(([key, { name }]) => (
                            <option key={key} value={key}>{name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="font-select" className="text-sm font-medium mb-1 block">Fonte</label>
                    <select
                        id="font-select"
                        value={styleConfig.fontFamily}
                        onChange={(e) => setStyleConfig(prev => ({ ...prev, fontFamily: e.target.value }))}
                        className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-md p-2 text-sm focus:ring-2 focus:ring-[var(--app-accent)] focus:outline-none transition-shadow"
                    >
                        {Object.entries(FONTS).map(([key, { name, css }]) => (
                            <option key={key} value={css} style={{ fontFamily: css }}>{name}</option>
                        ))}
                    </select>
                </div>
                
                <div>
                    <label htmlFor="font-size-input" className="text-sm font-medium mb-1 block">Tamanho da Fonte (pt)</label>
                    <input
                        type="number"
                        id="font-size-input"
                        value={styleConfig.fontSize}
                        onChange={(e) => setStyleConfig(prev => ({ ...prev, fontSize: parseInt(e.target.value, 10) || 10 }))}
                        className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-md p-2 text-sm focus:ring-2 focus:ring-[var(--app-accent)] focus:outline-none transition-shadow"
                        min="8"
                        max="16"
                        step="1"
                    />
                </div>

                <div className="pt-2">
                    {resumeData.personalInfo.photo && (
                        <div className="relative inline-block group mb-2">
                            <img src={resumeData.personalInfo.photo} alt="Foto de Perfil" className="w-24 h-24 rounded-lg object-cover" />
                            <button onClick={removePhoto} className="absolute top-1 right-1 p-1 bg-red-600/70 hover:bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                <TrashIcon />
                            </button>
                        </div>
                    )}
                    <FileInputField label="Foto de Perfil" onChange={handlePhotoChange} />
                </div>
            </div>

            <div className="space-y-4">
                <div className="p-4 bg-[var(--input-bg)]/50 rounded-lg">
                    <h3 className="font-bold text-[var(--app-text)] mb-3 text-sm">Cores Principais</h3>
                    <div className="space-y-3">
                        <ColorInput label="Destaque" value={styleConfig.accent} onChange={c => setStyleConfig(p => ({...p, accent: c}))} />
                        <ColorInput label="Cor do Nome" value={styleConfig.nameColor} onChange={c => setStyleConfig(p => ({...p, nameColor: c}))} />
                        <ColorInput label="Fundo" value={styleConfig.background} onChange={c => setStyleConfig(p => ({...p, background: c}))} />
                        <ColorInput label="Texto" value={styleConfig.foreground} onChange={c => setStyleConfig(p => ({...p, foreground: c}))} />
                    </div>
                </div>

                <div className="p-4 bg-[var(--input-bg)]/50 rounded-lg">
                    <h3 className="font-bold text-[var(--app-text)] mb-3 text-sm">Cores da Barra Lateral</h3>
                    <div className="space-y-3">
                        <ColorInput label="Fundo" value={styleConfig.sidebarBackground} onChange={c => setStyleConfig(p => ({...p, sidebarBackground: c}))} />
                        <ColorInput label="Texto" value={styleConfig.sidebarForeground} onChange={c => setStyleConfig(p => ({...p, sidebarForeground: c}))} />
                    </div>
                </div>
            </div>
      </div>
    );
};