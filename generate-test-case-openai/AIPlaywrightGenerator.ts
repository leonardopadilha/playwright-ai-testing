import { runAssistantTurn } from './threadRunner';
import { MODELO_GPT_4 } from './tools';

export interface PlaywrightScriptRequest {
    assistantId: string;
    threadId: string;
    casoUso: string;
    cenarioTeste: string;
    baseUrl?: string;
    model?: string;
}

export class AIPlaywrightGenerator {
    async gerar_script_teste(req: PlaywrightScriptRequest): Promise<string> {
        const baseUrl = req.baseUrl ?? 'http://localhost:3000';

        const userPrompt = `
            Com base no caso de uso e nos cenários de teste já discutidos nesta
            mesma thread, gere um ÚNICO arquivo de teste Playwright em
            TypeScript que cubra todos os cenários listados.

            Requisitos OBRIGATÓRIOS do script:
            - Importar com: import { test, expect } from '@playwright/test';
            - Cada cenário deve virar um test() independente, isolado por hooks
              test.beforeEach / test.afterEach quando necessário.
            - Usar locators recomendados pelo Playwright (getByRole, getByLabel,
              getByPlaceholder, getByTestId) ao invés de seletores CSS frágeis.
            - Usar expect() com auto-waits (NÃO usar waitForTimeout).
            - URL base: ${baseUrl} (pode ser referenciada como '/').
            - Sem comentários redundantes; comentar apenas intenções não óbvias.
            - Sem fences markdown (sem ${'```'}typescript). Sem texto fora do
              código. A primeira linha do output deve ser o import.

            Lembre dos documentos do projeto via file_search se precisar
            confirmar nomes de telas, campos ou regras de negócio.

            Recapitulando o caso de uso:
            ${req.casoUso}

            Recapitulando os cenários de teste:
            ${req.cenarioTeste}
        `;

        const raw = await runAssistantTurn({
            threadId: req.threadId,
            assistantId: req.assistantId,
            userPrompt,
            model: req.model ?? MODELO_GPT_4,
        });

        return stripMarkdownFences(raw);
    }
}

function stripMarkdownFences(content: string): string {
    const trimmed = content.trim();
    const fenceMatch = trimmed.match(
        /^```(?:typescript|ts|javascript|js)?\s*\n([\s\S]*?)\n```\s*$/i,
    );
    return fenceMatch ? fenceMatch[1].trim() : trimmed;
}
