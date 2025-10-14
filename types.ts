import type React from 'react';

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  github: string;
  photo: string;
}

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
}

export interface Skill {
  id: string;
  name: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
}

export interface StyleConfig {
  fontSize: number;
  fontFamily: string;
  accent: string;
  background: string;
  foreground: string;
  sidebarBackground: string;
  sidebarForeground: string;
  nameColor: string;
}

export interface ResumeTemplateProps {
  data: ResumeData;
  styleConfig: StyleConfig;
  scale?: number;
}

export interface AppearanceEditorProps {
  styleConfig: StyleConfig;
  setStyleConfig: React.Dispatch<React.SetStateAction<StyleConfig>>;
  selectedTemplate: string;
  setSelectedTemplate: React.Dispatch<React.SetStateAction<string>>;
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
}


export interface ResumeFormProps extends AppearanceEditorProps {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
}

export interface AIAssistantProps extends AppearanceEditorProps {
    resumeData: ResumeData;
    setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
    onComplete: () => void;
}


export type ResumeTemplate = React.FC<ResumeTemplateProps>;