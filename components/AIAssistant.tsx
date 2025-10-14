import React, { useState, useEffect, useRef } from 'react';
import type { AIAssistantProps, Experience, Education, Skill } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';
import { extractInfoForSection } from '../services/geminiService';
import { AppearanceEditor } from './AppearanceEditor';

type Message = {
    sender: 'bot' | 'user';
    text: string;
};

type ConversationStep = {
    key: 'personalInfo' | 'contactInfo' | 'socialLinks' | 'summary' | 'experience' | 'ask_more_experience' | 'education' | 'ask_more_education' | 'skills' | 'done';
    question: string;
    section?: 'personalInfo' | 'contactInfo' | 'socialLinks' | 'experience' | 'education' | 'skills';
    isConfirmation?: boolean;
};

const conversationFlow: ConversationStep[] = [
    { key: 'personalInfo', question: 'Olá! Vamos começar a criar seu currículo. Primeiro, qual é o seu nome completo e cargo?', section: 'personalInfo' },
    { key: 'contactInfo', question: 'Ótimo. Agora, qual seu email, telefone e endereço?', section: 'contactInfo' },
    { key: 'socialLinks', question: 'Perfeito. Pode me informar seus links do LinkedIn e GitHub?', section: 'socialLinks' },
    { key: 'summary', question: 'Agora, escreva um breve resumo profissional sobre você. Não se preocupe em ser perfeito, posso ajudar a melhorá-lo mais tarde.' },
    { key: 'experience', question: 'Excelente. Fale sobre sua experiência de trabalho mais recente. Inclua o cargo, empresa, local, datas de início/término e uma descrição de suas responsabilidades.', section: 'experience' },
    { key: 'ask_more_experience', question: 'Experiência adicionada! Você gostaria de adicionar outra? (responda "sim" ou "não")', isConfirmation: true },
    { key: 'education', question: 'Ok, vamos para a formação. Descreva sua formação mais relevante, incluindo nome da instituição, curso, área de estudo e datas.', section: 'education' },
    { key: 'ask_more_education', question: 'Formação adicionada! Você gostaria de adicionar outra? (responda "sim" ou "não")', isConfirmation: true },
    { key: 'skills', question: 'Estamos quase lá! Liste suas principais habilidades, separadas por vírgula.', section: 'skills' },
    { key: 'done', question: 'Tudo pronto! Seu currículo foi preenchido. Agora você pode ir para o Editor Manual para personalizar o design, as cores e fazer ajustes finos.' },
];

export const AIAssistant: React.FC<AIAssistantProps> = ({ 
    resumeData,
    setResumeData, 
    onComplete,
    styleConfig,
    setStyleConfig,
    selectedTemplate,
    setSelectedTemplate,
}) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isAppearanceOpen, setIsAppearanceOpen] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMessages([{ sender: 'bot', text: conversationFlow[0].question }]);
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    const handleNextStep = (nextIndex: number) => {
        if (nextIndex < conversationFlow.length) {
            setCurrentStepIndex(nextIndex);
            setMessages(prev => [...prev, { sender: 'bot', text: conversationFlow[nextIndex].question }]);
        } else {
            onComplete();
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading) return;

        const userMessage: Message = { sender: 'user', text: userInput };
        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setIsLoading(true);

        const currentStep = conversationFlow[currentStepIndex];

        try {
            if (currentStep.isConfirmation) {
                if (userInput.toLowerCase().trim().startsWith('sim')) {
                     const previousStepKey = currentStep.key === 'ask_more_experience' ? 'experience' : 'education';
                     const previousStepIndex = conversationFlow.findIndex(step => step.key === previousStepKey);
                     handleNextStep(previousStepIndex);
                } else {
                    handleNextStep(currentStepIndex + 1);
                }
            } else if (currentStep.section) {
                const data = await extractInfoForSection(currentStep.section, userInput);
                if (currentStep.section === 'experience') {
                     setResumeData(prev => ({ ...prev, experience: [...prev.experience, { ...data, id: Date.now().toString() }] as Experience[] }));
                } else if (currentStep.section === 'education') {
                    setResumeData(prev => ({ ...prev, education: [...prev.education, { ...data, id: Date.now().toString() }] as Education[] }));
                } else if (currentStep.section === 'skills') {
                    const skillsArray = data.skills.map((s: string) => ({ id: s, name: s })) as Skill[];
                    setResumeData(prev => ({ ...prev, skills: [...prev.skills, ...skillsArray]}));
                } else { // personalInfo, contactInfo, socialLinks
                    setResumeData(prev => ({...prev, personalInfo: { ...prev.personalInfo, ...data }}));
                }
                handleNextStep(currentStepIndex + 1);
            } else if (currentStep.key === 'summary') {
                setResumeData(prev => ({...prev, summary: userInput }));
                handleNextStep(currentStepIndex + 1);
            }
        } catch (error) {
            const err = error instanceof Error ? error.message : "Ocorreu um erro desconhecido.";
            setMessages(prev => [...prev, { sender: 'bot', text: `Desculpe, tive um problema. ${err}. Vamos tentar de novo?` }]);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="bg-[var(--panel-bg)] backdrop-blur-sm p-4 rounded-xl shadow-lg border border-[var(--panel-border)] h-full flex flex-col">
            <div className="bg-[var(--panel-bg-opaque)]/50 mb-4 rounded-lg border border-[var(--panel-border)]">
                <button
                    onClick={() => setIsAppearanceOpen(prev => !prev)}
                    className="w-full text-left p-4 flex justify-between items-center transition-colors duration-300 hover:bg-[var(--panel-bg-opaque)]/80 rounded-t-lg"
                >
                    <h2 className="text-lg font-bold text-[var(--app-accent)]">Personalizar Aparência</h2>
                    <span className={`transform transition-transform duration-300 ${isAppearanceOpen ? 'rotate-180' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </span>
                </button>
                {isAppearanceOpen && (
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

            <h2 className="text-xl font-bold text-[var(--app-accent)] mb-4 flex items-center gap-2 flex-shrink-0">
                <SparklesIcon /> Assistente de Currículo com IA
            </h2>

            <div className="flex-grow space-y-4 overflow-y-auto pr-2 min-h-0">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                        {msg.sender === 'bot' && <div className="w-8 h-8 rounded-full bg-[var(--app-accent)] flex items-center justify-center text-[var(--app-accent-text)] flex-shrink-0"><SparklesIcon /></div>}
                        <div className={`max-w-md p-3 rounded-lg ${msg.sender === 'bot' ? 'bg-[var(--panel-bg-opaque)]' : 'bg-[var(--app-accent)] text-[var(--app-accent-text)]'}`}>
                            <p className="text-sm">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-end gap-2">
                        <div className="w-8 h-8 rounded-full bg-[var(--app-accent)] flex items-center justify-center text-[var(--app-accent-text)] flex-shrink-0"><SparklesIcon /></div>
                        <div className="max-w-md p-3 rounded-lg bg-[var(--panel-bg-opaque)]">
                           <div className="flex items-center gap-2">
                             <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                             <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                             <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                           </div>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleSubmit} className="mt-4 flex gap-2 flex-shrink-0">
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Digite sua resposta..."
                    disabled={isLoading || conversationFlow[currentStepIndex].key === 'done'}
                    className="flex-grow p-2 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-md focus:ring-2 focus:ring-[var(--app-accent)] focus:outline-none transition-shadow disabled:opacity-50"
                />
                <button
                    type="submit"
                    disabled={isLoading || conversationFlow[currentStepIndex].key === 'done'}
                    className="px-4 py-2 bg-[var(--app-accent)] hover:bg-[var(--app-accent-hover)] text-[var(--app-accent-text)] font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Enviar
                </button>
            </form>
        </div>
    );
};