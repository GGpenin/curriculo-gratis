import React from 'react';
import { ClassicTemplate } from '../components/templates/ClassicTemplate';
import { ModernWithPhotoTemplate } from '../components/templates/ModernWithPhotoTemplate';
import { MinimalistTemplate } from '../components/templates/MinimalistTemplate';
import type { ResumeTemplate, StyleConfig } from '../types';

export const templates: Record<string, { name: string; component: ResumeTemplate }> = {
  classic: {
    name: 'Clássico',
    component: ClassicTemplate,
  },
  modern: {
    name: 'Moderno com Foto',
    component: ModernWithPhotoTemplate,
  },
  minimalist: {
    name: 'Minimalista',
    component: MinimalistTemplate,
  },
};

export const FONTS: Record<string, { name: string; css: string }> = {
    merriweather: { name: 'Merriweather (Serif)', css: "'Merriweather', serif" },
    roboto: { name: 'Roboto (Sans-Serif)', css: "'Roboto', sans-serif" },
    lato: { name: 'Lato (Sans-Serif)', css: "'Lato', sans-serif" },
    montserrat: { name: 'Montserrat (Sans-Serif)', css: "'Montserrat', sans-serif" },
    lora: { name: 'Lora (Serif)', css: "'Lora', serif" },
};

/**
 * Generates a palette of CSS color variables from a StyleConfig object.
 * @param colors The user-selected color palette.
 * @returns A CSSProperties object with custom properties for theming.
 */
export const generateThemeVariables = (colors: Omit<StyleConfig, 'fontSize' | 'fontFamily'>): React.CSSProperties => {
    // These colors are derived or static for now to maintain some consistency.
    // They could also be added to the StyleConfig for even more control.
    const muted = colors.background === '#ffffff' ? '#f3f4f6' : '#2d3748'; // gray-100 or gray-800
    const mutedForeground = colors.background === '#ffffff' ? '#4b5563' : '#a0aec0'; // gray-600 or gray-400

    return {
        '--accent': colors.accent,
        '--background': colors.background,
        '--foreground': colors.foreground,
        '--name-color': colors.nameColor,
        '--muted': muted,
        '--muted-foreground': mutedForeground,
        '--border': colors.accent,
        
        '--sidebar-background': colors.sidebarBackground,
        '--sidebar-foreground': colors.sidebarForeground,
        '--sidebar-accent': colors.accent,
        '--sidebar-border': colors.accent,

        // A contrasting color for text on top of the accent color (e.g., in buttons)
        '--accent-foreground': (hex => {
            const rgb = parseInt(hex.slice(1), 16);
            const r = (rgb >> 16) & 0xff;
            const g = (rgb >>  8) & 0xff;
            const b = (rgb >>  0) & 0xff;
            const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            return luma < 128 ? '#ffffff' : '#1f2937';
        })(colors.accent),

    } as React.CSSProperties;
};