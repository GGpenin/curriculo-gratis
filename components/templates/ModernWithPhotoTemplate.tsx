import React from 'react';
import type { ResumeTemplateProps } from '../../types';
import { generateThemeVariables } from '../../config/theme';

export const ModernWithPhotoTemplate: React.FC<ResumeTemplateProps> = ({ data, styleConfig }) => {
  const { personalInfo, summary, experience, education, skills } = data;
  const themeVariables = generateThemeVariables(styleConfig);

  return (
    <div 
      className="flex w-[210mm] h-[297mm] mx-auto"
      style={{ 
        ...themeVariables,
        fontSize: `${styleConfig.fontSize}pt`,
        fontFamily: styleConfig.fontFamily,
      }}
    >
      {/* Left Sidebar */}
      <aside 
        className="w-1/3 p-6 flex flex-col"
        style={{ backgroundColor: 'var(--sidebar-background)', color: 'var(--sidebar-foreground)' }}
      >
        <div className="text-center">
            {personalInfo.photo && (
                <img 
                    src={personalInfo.photo} 
                    alt="Foto de Perfil" 
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4"
                    style={{ borderColor: 'var(--sidebar-accent)' }}
                />
            )}
            <h1 className="text-[1.8em] font-bold leading-tight" style={{ color: 'var(--name-color)' }}>{personalInfo.fullName}</h1>
            <p className="text-[1.1em]" style={{ color: 'var(--sidebar-accent)' }}>{personalInfo.jobTitle}</p>
        </div>
        
        <div className="mt-8 space-y-6">
            <section>
                <h2 className="text-[1.2em] font-semibold uppercase border-b-2 pb-1 mb-2" style={{ borderColor: 'var(--sidebar-border)', color: 'var(--sidebar-accent)' }}>Contato</h2>
                <ul className="text-[0.85em] space-y-2 break-all">
                    <li><span className="font-semibold">Email:</span> {personalInfo.email}</li>
                    <li><span className="font-semibold">Tel:</span> {personalInfo.phone}</li>
                    <li><span className="font-semibold">End:</span> {personalInfo.address}</li>
                    <li><span className="font-semibold">LinkedIn:</span> {personalInfo.linkedin}</li>
                    <li><span className="font-semibold">GitHub:</span> {personalInfo.github}</li>
                </ul>
            </section>

            <section>
                <h2 className="text-[1.2em] font-semibold uppercase border-b-2 pb-1 mb-2" style={{ borderColor: 'var(--sidebar-border)', color: 'var(--sidebar-accent)' }}>Habilidades</h2>
                <ul className="text-[0.9em] space-y-1">
                    {skills.map(skill => (
                        <li key={skill.id}>{skill.name}</li>
                    ))}
                </ul>
            </section>

            <section>
                <h2 className="text-[1.2em] font-semibold uppercase border-b-2 pb-1 mb-2" style={{ borderColor: 'var(--sidebar-border)', color: 'var(--sidebar-accent)' }}>Formação</h2>
                {education.map(edu => (
                    <div key={edu.id} className="mb-3">
                        <h3 className="text-[1em] font-bold">{edu.institution}</h3>
                        <p className="text-[0.9em]">{edu.degree}</p>
                        <p className="text-[0.8em]" style={{color: 'var(--sidebar-foreground)'}}>{edu.startDate} - {edu.endDate}</p>
                    </div>
                ))}
            </section>
        </div>
      </aside>

      {/* Main Content */}
      <main 
        className="w-2/3 p-8 overflow-y-auto"
        style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
      >
        <section className="mb-6">
            <h2 className="text-[1.6em] font-bold uppercase border-b-2 pb-1 mb-3" style={{borderColor: 'var(--muted)', color: 'var(--accent)'}}>Resumo Profissional</h2>
            <p className="text-[0.95em] leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>{summary}</p>
        </section>
        
        <section>
            <h2 className="text-[1.6em] font-bold uppercase border-b-2 pb-1 mb-3" style={{borderColor: 'var(--muted)', color: 'var(--accent)'}}>Experiência Profissional</h2>
            {experience.map(exp => (
                <div key={exp.id} className="mb-4">
                    <div className="flex justify-between items-baseline">
                        <h3 className="text-[1.15em] font-semibold">{exp.jobTitle}</h3>
                        <p className="text-[0.9em]" style={{ color: 'var(--muted-foreground)' }}>{exp.startDate} - {exp.endDate}</p>
                    </div>
                    <p className="text-[1em] font-medium" style={{ color: 'var(--muted-foreground)' }}>{exp.company} | {exp.location}</p>
                    <ul className="list-disc list-inside mt-1 text-[0.95em] space-y-1" style={{ color: 'var(--muted-foreground)' }}>
                        {exp.description.split('\n').map((item, index) => item.trim() && <li key={index}>{item.trim().replace(/^- /, '')}</li>)}
                    </ul>
                </div>
            ))}
        </section>
      </main>
    </div>
  );
};