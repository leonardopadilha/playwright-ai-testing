import OpenAI from 'openai';
import dotenv from 'dotenv';
import { readMarkdown } from '../utils/readMarkdown';

dotenv.config();

const MODELO_OPENAI = 'gpt-3.5-turbo'

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function gerar_caso_uso() {
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
        model: MODELO_OPENAI,
        messages: [
            { role: 'system', content: sistemPrompt },
            { role: 'user', content: userPrompt }
        ],
    });

    return response.choices[0].message.content
}

async function gerar_cenario_teste(casoUso: string | null) {
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

async function gerar_script_teste(casoUso: string | null, testeCase: string | null) {
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

async function main() {
    const casoUso = await gerar_caso_uso();
    console.log("Caso de uso: \n", casoUso);

    const cenarioTeste = await gerar_cenario_teste(casoUso);
    console.log("\n\nCenário de teste: \n", cenarioTeste);

    const scriptTeste = await gerar_script_teste(casoUso, cenarioTeste);
    console.log("\n\nScript de teste: \n", scriptTeste);
}

main();