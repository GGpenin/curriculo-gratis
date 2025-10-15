import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.warn("A variável de ambiente API_KEY não está definida. Os recursos de IA não funcionarão.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const PROMPTS = {
    summary: `Você é um especialista em redação de currículos. Reescreva o seguinte resumo profissional para ser mais impactante, conciso e profissional. Use verbos de ação fortes e destaque as principais conquistas. Não use markdown ou qualquer formatação especial. Apenas retorne o texto aprimorado. O resumo é: `,
    description: `Você é um especialista em redação de currículos. Reescreva os seguintes pontos da descrição de um cargo para serem mais orientados a conquistas e quantificáveis. Use o método STAR (Situação, Tarefa, Ação, Resultado) sempre que possível. Mantenha os pontos concisos. Não use markdown ou qualquer formatação especial. Apenas retorne o texto aprimorado. A descrição é: `
};

export const enhanceTextWithAI = async (type: 'summary' | 'description', text: string): Promise<string> => {
    if (!API_KEY) {
        throw new Error("A chave da API não está configurada.");
    }
    
    if (!text || text.trim().length < 10) {
        return text; // Não chamar a API para textos muito curtos
    }

    try {
        const fullPrompt = `${PROMPTS[type]}\n\n"${text}"`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
        });

        const enhancedText = response.text.trim();
        return enhancedText;
    } catch (error) {
        console.error("Erro ao chamar a API Gemini:", error);
        throw new Error("Falha ao aprimorar o texto com IA.");
    }
};

const sectionSchemas = {
    personalInfo: {
        type: Type.OBJECT,
        properties: {
            fullName: { type: Type.STRING },
            jobTitle: { type: Type.STRING },
        },
    },
    contactInfo: {
        type: Type.OBJECT,
        properties: {
            email: { type: Type.STRING },
            phone: { type: Type.STRING },
            address: { type: Type.STRING },
        },
    },
    socialLinks: {
        type: Type.OBJECT,
        properties: {
            linkedin: { type: Type.STRING },
            github: { type: Type.STRING },
        },
    },
    experience: {
        type: Type.OBJECT,
        properties: {
            jobTitle: { type: Type.STRING },
            company: { type: Type.STRING },
            location: { type: Type.STRING },
            startDate: { type: Type.STRING },
            endDate: { type: Type.STRING },
            description: { type: Type.STRING, description: "Uma descrição detalhada das responsabilidades e conquistas, separada por novas linhas." },
        },
    },
    education: {
        type: Type.OBJECT,
        properties: {
            institution: { type: Type.STRING },
            degree: { type: Type.STRING },
            fieldOfStudy: { type: Type.STRING },
            startDate: { type: Type.STRING },
            endDate: { type: Type.STRING },
        },
    },
    skills: {
        type: Type.OBJECT,
        properties: {
            skills: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
            },
        },
    },
};

export const extractInfoForSection = async (section: keyof typeof sectionSchemas, userInput: string): Promise<any> => {
    if (!API_KEY) {
        throw new Error("A chave da API não está configurada.");
    }
    if (!userInput || userInput.trim().length < 3) {
        return Promise.reject("Input do usuário muito curto.");
    }
    
    const prompt = `Analise o texto a seguir fornecido por um usuário e extraia as informações relevantes com base na seção do currículo. O texto é: "${userInput}"`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: sectionSchemas[section],
            },
        });
        
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error(`Erro ao extrair dados para a seção ${section}:`, error);
        throw new Error("Não foi possível processar sua resposta. Tente ser mais específico.");
    }
};
