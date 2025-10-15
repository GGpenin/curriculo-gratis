import type { ResumeData } from '../types';
import saveAs from 'file-saver';

const escapeCsvCell = (cell: string): string => {
    if (cell === null || cell === undefined) return '""';
    let value = String(cell);
    let escaped = value.replace(/"/g, '""');
    if (escaped.includes(',') || escaped.includes('\n') || escaped.includes('"')) {
        escaped = `"${escaped}"`;
    }
    return escaped;
};

export const generateCsv = (data: ResumeData, fileName: string = 'curriculo.csv'): void => {
    let csvContent = "Section,Field,Value\n";

    // Personal Info
    Object.entries(data.personalInfo).forEach(([key, value]) => {
        if (key !== 'photo') { // Don't include base64 photo data in CSV
           csvContent += `PersonalInfo,${escapeCsvCell(key)},${escapeCsvCell(value)}\n`;
        }
    });

    // Summary
    csvContent += `Summary,Summary,${escapeCsvCell(data.summary)}\n`;

    // Experience
    data.experience.forEach((exp, index) => {
        const sectionName = `Experience ${index + 1}`;
        csvContent += `${sectionName},Job Title,${escapeCsvCell(exp.jobTitle)}\n`;
        csvContent += `${sectionName},Company,${escapeCsvCell(exp.company)}\n`;
        csvContent += `${sectionName},Location,${escapeCsvCell(exp.location)}\n`;
        csvContent += `${sectionName},Start Date,${escapeCsvCell(exp.startDate)}\n`;
        csvContent += `${sectionName},End Date,${escapeCsvCell(exp.endDate)}\n`;
        csvContent += `${sectionName},Description,${escapeCsvCell(exp.description)}\n`;
    });

    // Education
    data.education.forEach((edu, index) => {
        const sectionName = `Education ${index + 1}`;
        csvContent += `${sectionName},Institution,${escapeCsvCell(edu.institution)}\n`;
        csvContent += `${sectionName},Degree,${escapeCsvCell(edu.degree)}\n`;
        csvContent += `${sectionName},Field of Study,${escapeCsvCell(edu.fieldOfStudy)}\n`;
        csvContent += `${sectionName},Start Date,${escapeCsvCell(edu.startDate)}\n`;
        csvContent += `${sectionName},End Date,${escapeCsvCell(edu.endDate)}\n`;
    });

    // Skills
    data.skills.forEach((skill, index) => {
        csvContent += `Skill,Skill ${index + 1},${escapeCsvCell(skill.name)}\n`;
    });
    
    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' }); // \uFEFF for Excel BOM
    saveAs(blob, fileName);
};
