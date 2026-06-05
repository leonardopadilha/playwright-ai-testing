import path from 'path';
import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';

import {
    AssistantContext,
    bootstrapAssistant,
    cleanupAssistant,
} from './AssistantProject';
import { AIUseCaseGenerator } from './AIUseCaseGenerator';
import { AITestScenarioGenerator } from './AITestScenarioGenerator';
import { AIPlaywrightGenerator } from './AIPlaywrightGenerator';
import { saveMarkdown } from '../utils/readMarkdown';
import { MODELO_GPT_4 } from './tools';

const DOCS_DIR = 'docs/info-empresa';
const OUTPUT_DIR = 'generate-test-case-openai/scripts_gerados';
const DEFAULT_BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000';

function slugify(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
        .slice(0, 60) || 'caso';
}

async function askUser(question: string, fallback: string): Promise<string> {
    const rl = readline.createInterface({ input, output });
    try {
        const answer = await rl.question(question);
        return answer.trim() || fallback;
    } finally {
        rl.close();
    }
}

async function main(): Promise<void> {
    const pedidoUsuario = await askUser(
        'Digite um caso de uso (enter para padrão): ',
        'Carlos deseja realizar cadastro na plataforma Hub de Leitura.',
    );

    const context: Partial<AssistantContext> = {};

    try {
        const ctx = await bootstrapAssistant(DOCS_DIR, MODELO_GPT_4);
        Object.assign(context, ctx);

        const useCaseGen = new AIUseCaseGenerator();
        const scenarioGen = new AITestScenarioGenerator();
        const playwrightGen = new AIPlaywrightGenerator();

        console.log('\n>>> Gerando caso de uso...');
        const casoUso = await useCaseGen.gerar_caso_uso({
            assistantId: ctx.assistantId,
            threadId: ctx.threadId,
            pedidoUsuario,
        });
        console.log('\nCaso de uso:\n', casoUso);

        console.log('\n>>> Gerando cenários de teste...');
        const cenarioTeste = await scenarioGen.gerar_cenario_teste({
            assistantId: ctx.assistantId,
            threadId: ctx.threadId,
            casoUso,
        });
        console.log('\nCenários:\n', cenarioTeste);

        console.log('\n>>> Gerando script Playwright (TypeScript)...');
        const script = await playwrightGen.gerar_script_teste({
            assistantId: ctx.assistantId,
            threadId: ctx.threadId,
            casoUso,
            cenarioTeste,
            baseUrl: DEFAULT_BASE_URL,
        });

        const fileName = `${slugify(pedidoUsuario)}.spec.ts`;
        const outputPath = path.join(OUTPUT_DIR, fileName);
        saveMarkdown(outputPath, script);

        console.log(`\nScript Playwright salvo em: ${outputPath}`);
    } catch (err) {
        console.error('\nFalha na geração:', (err as Error).message);
        process.exitCode = 1;
    } finally {
        console.log('\n>>> Limpando recursos da OpenAI...');
        await cleanupAssistant(context);
        console.log('Limpeza concluída.');
    }
}

main();
