import OpenAI from 'openai';
import dotenv from 'dotenv';
import { readMarkdown, saveMarkdown } from '../utils/readMarkdown';

dotenv.config();

const MODELO_OPENAI = 'gpt-3.5-turbo'
const MODELO_OPENAI_REFINADO = 'ft:gpt-4o-mini-2024-07-18:student:ai-testing:DhOg5msd'

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export class AIUseCaseGenerator {
    
    async gerar_caso_uso() {
        const document = readMarkdown('docs/info-empresa/explicacao-casos.md');
    
        const sistemPrompt = `
            Você é um Analista de Qualidade Sênior experiente em testes funcionais de software.
    
            Sua tarefa é criar um documento de casos de uso. Você deve adotar o padrão abaixo para gerar
            seu caso de uso: 
            
            ${document}
    
            Considere os dados de entrada sugeridos pelo usuário.
        `
    
        const userPrompt = `
            Gere um caso de uso para o Carlos que deseja realizar cadastro na plataforma Hub de Leitura.
        `
    
        const response = await client.chat.completions.create({
            model: MODELO_OPENAI_REFINADO,
            messages: [
                { role: 'system', content: sistemPrompt },
                { role: 'user', content: userPrompt }
            ],
        });
    
        return response.choices[0].message.content
    }
}