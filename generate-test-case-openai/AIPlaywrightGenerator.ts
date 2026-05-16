import OpenAI from 'openai';
import dotenv from 'dotenv';
import { readMarkdown } from '../utils/readMarkdown';

dotenv.config();

const MODELO_OPENAI = 'gpt-3.5-turbo'

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export class AIPlaywrightGenerator {

    async gerar_script_teste(casoUso: string | null, testeCase: string | null) {
        const document = readMarkdown('docs/info-empresa/resumo-empresa.md');

        const systemPrompt = `
            Você é um Analista de Qualidade Sênior especialista em gerar scripts de teste para elaboração de casos
            e cenários de teste. Considere o contexto da empresa disponível em: ${document}

            Seu cenário de teste deve fornecer um script em Playwright. Além disso, seu código deve ser escrito em TypeScript
            e deve priorizar a legibilidade e a manutenibilidade do código.
        `

        const userPrompt = `
            Considere o caso de uso: ${casoUso} e o cenário de teste: ${testeCase} para gerar um script de teste.
            Crie um script para gerar um teste automatizado para ambos.
        `

        const resposta = await client.chat.completions.create({
            model: MODELO_OPENAI,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ]
        })

        return resposta.choices[0].message.content
    }
}
