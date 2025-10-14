import React from 'react';
import type { ResumeTemplateProps } from '../../types';
import { generateThemeVariables } from '../../config/theme';

export const MinimalistTemplate: React.FC<ResumeTemplateProps> = ({ data, styleConfig }) => {
  const { personalInfo, summary, experience, education, skills } = data;
  const themeVariables = generateThemeVariables(styleConfig);

  const Section: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
    <section className="mb-6">
      <h2 className="text-[1.2em] font-bold uppercase tracking-wider pb-2 mb-3" style={{ color: 'var(--accent)' }}>{title}</h2>
      {children}
      <hr className="mt-6" style={{ borderColor: 'var(--muted)' }}/>
    </section>
  );

  return (
    <div 
      className="p-10 w-[210mm] h-[297mm] mx-auto"
      style={{ 
        ...themeVariables,
        fontSize: `${styleConfig.fontSize}pt`,
        fontFamily: styleConfig.fontFamily,
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)' 
      }}
    >
      <header className="mb-8">
        <h1 className="text-[3em] font-extrabold tracking-tight" style={{ color: 'var(--name-color)' }}>{personalInfo.fullName}</h1>
        <p className="text-[1.3em] mt-1" style={{ color: 'var(--muted-foreground)' }}>{personalInfo.jobTitle}</p>
        <div className="flex flex-wrap gap-x-6 gap-y-1 mt-4 text-[0.9em]" style={{ color: 'var(--accent)' }}>
          <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
          <span>{personalInfo.phone}</span>
          <a href={`https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer">{personalInfo.linkedin}</a>
          <a href={`https://github.com/${personalInfo.github}`} target="_blank" rel="noopener noreferrer">{personalInfo.github}</a>
        </div>
      </header>
      <hr className="mb-6" style={{ borderColor: 'var(--muted)' }}/>

      <Section title="Resumo">
        <p className="text-[0.95em] leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>{summary}</p>
      </Section>
      
      <Section title="Experiência">
        <div className="space-y-5">
            {experience.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[1.1em] font-semibold">{exp.jobTitle}</h3>
                  <p className="text-[0.9em]" style={{ color: 'var(--muted-foreground)' }}>{exp.startDate} - {exp.endDate}</p>
                </div>
                <p className="text-[1em]" style={{ color: 'var(--muted-foreground)' }}>{exp.company} | {exp.location}</p>
                <ul className="list-disc list-inside mt-2 text-[0.95em] leading-relaxed space-y-1" style={{ color: 'var(--muted-foreground)' }}>
                  {exp.description.split('\n').map((item, index) => item.trim() && <li key={index}>{item.trim().replace(/^- /, '')}</li>)}
                </ul>
              </div>
            ))}
        </div>
      </Section>

      <Section title="Formação">
         <div className="space-y-4">
            {education.map(edu => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                    <h3 className="text-[1.1em] font-semibold">{edu.institution}</h3>
                    <p className="text-[0.9em]" style={{ color: 'var(--muted-foreground)' }}>{edu.startDate} - {edu.endDate}</p>
                </div>
                <p className="text-[1em]" style={{ color: 'var(--muted-foreground)' }}>{edu.degree} em {edu.fieldOfStudy}</p>
              </div>
            ))}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-[1.2em] font-bold uppercase tracking-wider pb-2 mb-3" style={{ color: 'var(--accent)' }}>Habilidades</h2>
        <div className="flex flex-wrap gap-2">
          {skills.map(skill => (
            <span 
              key={skill.id} 
              className="text-[0.9em] font-medium px-3 py-1 rounded"
              style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}
            >
              {skill.name}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
};