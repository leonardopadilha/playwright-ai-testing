import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const MODELO_OPENAI = 'gpt-3.5-turbo'

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export class AITestScenarioGenerator {

    async gerar_cenario_teste(casoUso: string | null) {
        const systemPrompt = `
            Você é um especialista em desenvolver cenários de teste para validar uma aplicação web, quanto sua
            navegação. Para isso, considere o caso de uso destacado em: ${casoUso}.

            Seu caso de teste deve fornecer dados suficientes para validar uma aplicação HTML, CSS e JS para que
            possa ser implementado usando TypeScript e Playwright. 

            Não gere código de automação.
        `

        const resposta = await client.chat.completions.create({
            model: MODELO_OPENAI,
            messages: [
                { role: 'system', content: systemPrompt }
            ],
        })

        return resposta.choices[0].message.content
    }
}
