import React, { useState } from 'react';
// FIX: Import ResumeData type to resolve type errors.
import type { ResumeData, ResumeFormProps } from '../types';
import { enhanceTextWithAI } from '../services/geminiService';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { AppearanceEditor } from './AppearanceEditor';
import { ClearIcon } from './icons/ClearIcon';

export const ResumeForm: React.FC<ResumeFormProps> = ({ 
  resumeData, 
  setResumeData,
  styleConfig,
  setStyleConfig,
  selectedTemplate,
  setSelectedTemplate,
}) => {
  const [activeSection, setActiveSection] = useState<string>('appearance');
  const [aiLoading, setAiLoading] = useState<Record<string, boolean>>({});

  const handleChange = (section: keyof ResumeData, field: string, value: string, index?: number) => {
    setResumeData(prev => {
      const sectionData = prev[section];

      if (index !== undefined && Array.isArray(sectionData)) {
        const newSectionData = [...sectionData];
        newSectionData[index] = {
          ...newSectionData[index],
          [field]: value,
        };
        return { ...prev, [section]: newSectionData };
      }

      if (typeof sectionData === 'object' && !Array.isArray(sectionData) && sectionData !== null) {
        return {
          ...prev,
          [section]: {
            ...sectionData,
            [field]: value,
          },
        };
      }
      
      if (typeof sectionData === 'string') {
        return { ...prev, [section]: value as any };
      }

      return prev;
    });
  };

  const handleAddItem = (section: 'experience' | 'education' | 'skills') => {
    const newItem = 
      section === 'experience' ? { id: Date.now().toString(), jobTitle: '', company: '', location: '', startDate: '', endDate: '', description: '' }
      : section === 'education' ? { id: Date.now().toString(), institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' }
      : { id: Date.now().toString(), name: '' };
    
    setResumeData(prev => ({
      ...prev,
      [section]: [...prev[section], newItem]
    }));
  };

  const handleRemoveItem = (section: 'experience' | 'education' | 'skills', index: number) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const handleEnhanceWithAI = async (
    section: keyof ResumeData, 
    field: string, 
    currentText: string,
    index?: number
  ) => {
    // FIX: Explicitly convert section to a string to prevent potential runtime errors with symbols in template literals.
    const loadingKey = index !== undefined ? `${String(section)}-${index}-${field}` : `${String(section)}-${field}`;
    setAiLoading(prev => ({ ...prev, [loadingKey]: true }));
    try {
      const promptType = field === 'summary' ? 'summary' : 'description';
      const enhancedText = await enhanceTextWithAI(promptType, currentText);
      handleChange(section, field, enhancedText, index);
    } catch (error) {
      console.error("Falha na melhoria com IA:", error);
      alert("Falha ao aprimorar o texto com IA. Verifique sua chave de API e tente novamente.");
    } finally {
      setAiLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  const renderSectionHeader = (title: string, key: string) => (
    <button
      onClick={() => setActiveSection(key === activeSection ? '' : key)}
      className="w-full text-left p-4 bg-[var(--panel-bg-opaque)] rounded-lg flex justify-between items-center transition-colors duration-300 hover:bg-[var(--panel-bg-opaque)]/80"
    >
      <h2 className="text-xl font-bold text-[var(--app-accent)]">{title}</h2>
      <span className={`transform transition-transform duration-300 ${activeSection === key ? 'rotate-180' : ''}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </span>
    </button>
  );

  const InputField: React.FC<{label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder?: string, onClear?: () => void}> = ({label, value, onChange, placeholder, onClear}) => (
    <div className="flex flex-col">
      <label className="mb-1 text-sm font-semibold text-[var(--text-muted)]">{label}</label>
      <div className="relative flex items-center">
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder || `Digite ${label.toLowerCase()}`}
          className={`w-full p-2 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-md focus:ring-2 focus:ring-[var(--app-accent)] focus:outline-none transition-shadow ${onClear ? 'pr-8' : ''}`}
        />
        {onClear && value && (
            <button onClick={onClear} className="absolute right-2 text-[var(--text-muted)] hover:text-[var(--app-text)]" title={`Limpar ${label}`}>
                <ClearIcon />
            </button>
        )}
      </div>
    </div>
  );

  const TextAreaWithAI: React.FC<{label: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, onEnhance: () => void, isLoading: boolean, placeholder?: string}> = ({label, value, onChange, onEnhance, isLoading, placeholder}) => (
      <div className="flex flex-col col-span-2">
        <label className="mb-1 text-sm font-semibold text-[var(--text-muted)] flex justify-between items-center">
            {label}
            <button
                onClick={onEnhance}
                disabled={isLoading}
                className="flex items-center gap-1 text-xs px-2 py-1 bg-[var(--app-accent)] hover:bg-[var(--app-accent-hover)] text-[var(--app-accent-text)] rounded-md disabled:bg-gray-600 transition-colors"
            >
                {isLoading ? 'Melhorando...' : 'Melhorar com IA'} <SparklesIcon />
            </button>
        </label>
        <textarea
            value={value}
            onChange={onChange}
            rows={5}
            placeholder={placeholder}
            className="p-2 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-md focus:ring-2 focus:ring-[var(--app-accent)] focus:outline-none transition-shadow"
        />
      </div>
  );


  return (
    <div className="space-y-6">
      <div className="bg-[var(--panel-bg)] backdrop-blur-sm p-4 rounded-xl shadow-lg border border-[var(--panel-border)]">
        {renderSectionHeader("Personalizar Aparência", "appearance")}
        {activeSection === 'appearance' && (
          <AppearanceEditor 
            styleConfig={styleConfig}
            setStyleConfig={setStyleConfig}
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
            resumeData={resumeData}
            setResumeData={setResumeData}
          />
        )}
      </div>

      <div className="bg-[var(--panel-bg)] backdrop-blur-sm p-4 rounded-xl shadow-lg border border-[var(--panel-border)]">
        {renderSectionHeader("Informações Pessoais", "personalInfo")}
        {activeSection === 'personalInfo' && (
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Nome Completo" value={resumeData.personalInfo.fullName} onChange={(e) => handleChange('personalInfo', 'fullName', e.target.value)} />
            <InputField label="Cargo" value={resumeData.personalInfo.jobTitle} onChange={(e) => handleChange('personalInfo', 'jobTitle', e.target.value)} />
            <InputField label="Email" value={resumeData.personalInfo.email} onChange={(e) => handleChange('personalInfo', 'email', e.target.value)} />
            <InputField 
                label="Telefone" 
                value={resumeData.personalInfo.phone} 
                onChange={(e) => handleChange('personalInfo', 'phone', e.target.value)}
                onClear={() => handleChange('personalInfo', 'phone', '')}
            />
            <div className="col-span-2">
                <InputField 
                    label="Endereço" 
                    value={resumeData.personalInfo.address} 
                    onChange={(e) => handleChange('personalInfo', 'address', e.target.value)}
                    onClear={() => handleChange('personalInfo', 'address', '')}
                />
            </div>
            <InputField 
                label="LinkedIn" 
                value={resumeData.personalInfo.linkedin} 
                onChange={(e) => handleChange('personalInfo', 'linkedin', e.target.value)} 
                placeholder="linkedin.com/in/seunome"
                onClear={() => handleChange('personalInfo', 'linkedin', '')}
            />
            <InputField 
                label="GitHub" 
                value={resumeData.personalInfo.github} 
                onChange={(e) => handleChange('personalInfo', 'github', e.target.value)} 
                placeholder="github.com/seunome"
                onClear={() => handleChange('personalInfo', 'github', '')}
            />
          </div>
        )}
      </div>
      
      <div className="bg-[var(--panel-bg)] backdrop-blur-sm p-4 rounded-xl shadow-lg border border-[var(--panel-border)]">
        {renderSectionHeader("Resumo Profissional", "summary")}
        {activeSection === 'summary' && (
          <div className="p-4">
            <TextAreaWithAI
              label="Resumo"
              value={resumeData.summary}
              onChange={(e) => setResumeData(p => ({...p, summary: e.target.value}))}
              onEnhance={() => handleEnhanceWithAI('summary', 'summary', resumeData.summary)}
              isLoading={aiLoading['summary-summary']}
              placeholder="Escreva um breve resumo de sua carreira e objetivos..."
            />
          </div>
        )}
      </div>

      <div className="bg-[var(--panel-bg)] backdrop-blur-sm p-4 rounded-xl shadow-lg border border-[var(--panel-border)]">
        {renderSectionHeader("Experiência Profissional", "experience")}
        {activeSection === 'experience' && (
          <div className="p-4 space-y-6">
            {resumeData.experience.map((exp, index) => (
              <div key={exp.id} className="p-4 bg-[var(--input-bg)]/50 rounded-lg border border-[var(--input-border)] relative">
                 <button onClick={() => handleRemoveItem('experience', index)} className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-300"><TrashIcon /></button>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField label="Cargo" value={exp.jobTitle} onChange={(e) => handleChange('experience', 'jobTitle', e.target.value, index)} />
                  <InputField label="Empresa" value={exp.company} onChange={(e) => handleChange('experience', 'company', e.target.value, index)} />
                  <InputField label="Localização" value={exp.location} onChange={(e) => handleChange('experience', 'location', e.target.value, index)} />
                  <div/>
                  <InputField label="Data de Início" value={exp.startDate} onChange={(e) => handleChange('experience', 'startDate', e.target.value, index)} placeholder="ex: Jan 2020"/>
                  <InputField label="Data de Término" value={exp.endDate} onChange={(e) => handleChange('experience', 'endDate', e.target.value, index)} placeholder="ex: Atual"/>
                  <TextAreaWithAI
                    label="Descrição"
                    value={exp.description}
                    onChange={(e) => handleChange('experience', 'description', e.target.value, index)}
                    onEnhance={() => handleEnhanceWithAI('experience', 'description', exp.description, index)}
                    isLoading={aiLoading[`experience-${index}-description`]}
                    placeholder="Descreva suas responsabilidades e conquistas..."
                  />
                </div>
              </div>
            ))}
            <button onClick={() => handleAddItem('experience')} className="flex items-center gap-2 mt-4 px-4 py-2 bg-[var(--app-accent)] hover:bg-[var(--app-accent-hover)] text-[var(--app-accent-text)] font-semibold rounded-lg transition-colors"><PlusIcon /> Adicionar Experiência</button>
          </div>
        )}
      </div>

      <div className="bg-[var(--panel-bg)] backdrop-blur-sm p-4 rounded-xl shadow-lg border border-[var(--panel-border)]">
        {renderSectionHeader("Formação Acadêmica", "education")}
        {activeSection === 'education' && (
          <div className="p-4 space-y-6">
            {resumeData.education.map((edu, index) => (
              <div key={edu.id} className="p-4 bg-[var(--input-bg)]/50 rounded-lg border border-[var(--input-border)] relative">
                <button onClick={() => handleRemoveItem('education', index)} className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-300"><TrashIcon /></button>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField label="Instituição" value={edu.institution} onChange={(e) => handleChange('education', 'institution', e.target.value, index)} />
                  <InputField label="Curso" value={edu.degree} onChange={(e) => handleChange('education', 'degree', e.target.value, index)} />
                  <div className="col-span-2"><InputField label="Área de Estudo" value={edu.fieldOfStudy} onChange={(e) => handleChange('education', 'fieldOfStudy', e.target.value, index)} /></div>
                  <InputField label="Data de Início" value={edu.startDate} onChange={(e) => handleChange('education', 'startDate', e.target.value, index)} />
                  <InputField label="Data de Término" value={edu.endDate} onChange={(e) => handleChange('education', 'endDate', e.target.value, index)} />
                </div>
              </div>
            ))}
            <button onClick={() => handleAddItem('education')} className="flex items-center gap-2 mt-4 px-4 py-2 bg-[var(--app-accent)] hover:bg-[var(--app-accent-hover)] text-[var(--app-accent-text)] font-semibold rounded-lg transition-colors"><PlusIcon /> Adicionar Formação</button>
          </div>
        )}
      </div>

      <div className="bg-[var(--panel-bg)] backdrop-blur-sm p-4 rounded-xl shadow-lg border border-[var(--panel-border)]">
        {renderSectionHeader("Habilidades", "skills")}
        {activeSection === 'skills' && (
          <div className="p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {resumeData.skills.map((skill, index) => (
                <div key={skill.id} className="flex items-center bg-[var(--input-bg)]/50 rounded-md">
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => handleChange('skills', 'name', e.target.value, index)}
                    className="p-2 w-full bg-transparent focus:outline-none"
                    placeholder="Habilidade"
                  />
                  <button onClick={() => handleRemoveItem('skills', index)} className="p-2 text-red-400 hover:text-red-300"><TrashIcon /></button>
                </div>
              ))}
            </div>
            <button onClick={() => handleAddItem('skills')} className="flex items-center gap-2 mt-4 px-4 py-2 bg-[var(--app-accent)] hover:bg-[var(--app-accent-hover)] text-[var(--app-accent-text)] font-semibold rounded-lg transition-colors"><PlusIcon /> Adicionar Habilidade</button>
          </div>
        )}
      </div>
    </div>
  );
};
