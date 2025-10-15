import React from 'react';
import type { ResumeTemplateProps } from '../../types';
import { generateThemeVariables } from '../../config/theme';

export const ClassicTemplate: React.FC<ResumeTemplateProps> = ({ data, styleConfig }) => {
  const { personalInfo, summary, experience, education, skills } = data;
  const themeVariables = generateThemeVariables(styleConfig);

  return (
    <div 
      className="p-8 w-[210mm] h-[297mm] mx-auto"
      style={{ 
        ...themeVariables,
        fontSize: `${styleConfig.fontSize}pt`,
        fontFamily: styleConfig.fontFamily,
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)' 
      }}
    >
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-[2.8em] font-bold tracking-wider" style={{ color: 'var(--name-color)' }}>{personalInfo.fullName}</h1>
        <p className="text-[1.25em]" style={{ color: 'var(--muted-foreground)' }}>{personalInfo.jobTitle}</p>
        <div className="flex justify-center gap-4 mt-2 text-[0.9em]" style={{ color: 'var(--muted-foreground)' }}>
          <span>{personalInfo.email}</span>
          <span>&bull;</span>
          <span>{personalInfo.phone}</span>
          <span>&bull;</span>
          <span>{personalInfo.address}</span>
        </div>
        <div className="flex justify-center gap-4 mt-1 text-[0.9em]">
          <a href={`https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" style={{color: 'var(--accent)'}}>{personalInfo.linkedin}</a>
          <span style={{color: 'var(--accent)'}}>&bull;</span>
          <a href={`https://github.com/${personalInfo.github}`} target="_blank" rel="noopener noreferrer" style={{color: 'var(--accent)'}}>{personalInfo.github}</a>
        </div>
      </header>

      {/* Summary */}
      <section className="mb-6">
        <h2 className="text-[1.4em] font-bold border-b-2 pb-1 mb-2 uppercase tracking-widest" style={{borderColor: 'var(--border)', color: 'var(--accent)'}} >Resumo</h2>
        <p className="text-[0.95em] leading-relaxed">{summary}</p>
      </section>

      {/* Experience */}
      <section className="mb-6">
        <h2 className="text-[1.4em] font-bold border-b-2 pb-1 mb-2 uppercase tracking-widest" style={{borderColor: 'var(--border)', color: 'var(--accent)'}}>Experiência</h2>
        {experience.map(exp => (
          <div key={exp.id} className="mb-4">
            <div className="flex justify-between items-baseline">
              <h3 className="text-[1.1em] font-semibold">{exp.jobTitle}</h3>
              <p className="text-[0.9em]" style={{ color: 'var(--muted-foreground)' }}>{exp.startDate} - {exp.endDate}</p>
            </div>
            <p className="text-[1em] font-medium" style={{ color: 'var(--muted-foreground)' }}>{exp.company} | {exp.location}</p>
            <ul className="list-disc list-inside mt-1 text-[0.95em] leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
              {exp.description.split('\n').map((item, index) => item.trim() && <li key={index}>{item.trim().replace(/^- /, '')}</li>)}
            </ul>
          </div>
        ))}
      </section>

      {/* Education */}
      <section className="mb-6">
        <h2 className="text-[1.4em] font-bold border-b-2 pb-1 mb-2 uppercase tracking-widest" style={{borderColor: 'var(--border)', color: 'var(--accent)'}}>Formação</h2>
        {education.map(edu => (
          <div key={edu.id} className="mb-3">
            <div className="flex justify-between items-baseline">
                <h3 className="text-[1.1em] font-semibold">{edu.institution}</h3>
                <p className="text-[0.9em]" style={{ color: 'var(--muted-foreground)' }}>{edu.startDate} - {edu.endDate}</p>
            </div>
            <p className="text-[1em] font-medium" style={{ color: 'var(--muted-foreground)' }}>{edu.degree}</p>
            <p className="text-[0.9em]" style={{ color: 'var(--muted-foreground)' }}>{edu.fieldOfStudy}</p>
          </div>
        ))}
      </section>

      {/* Skills */}
      <section>
        <h2 className="text-[1.4em] font-bold border-b-2 pb-1 mb-2 uppercase tracking-widest" style={{borderColor: 'var(--border)', color: 'var(--accent)'}}>Habilidades</h2>
        <div className="flex flex-wrap gap-2">
          {skills.map(skill => (
            <span 
              key={skill.id} 
              className="text-[0.9em] font-medium px-3 py-1 rounded-full"
              style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}
            >
              {skill.name}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
};
