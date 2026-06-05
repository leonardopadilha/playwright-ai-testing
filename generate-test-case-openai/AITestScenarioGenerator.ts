import { runAssistantTurn } from './threadRunner';
import { MODELO_GPT_4 } from './tools';

export interface TestScenarioRequest {
    assistantId: string;
    threadId: string;
    casoUso: string;
    model?: string;
}

export class AITestScenarioGenerator {
    async gerar_cenario_teste(req: TestScenarioRequest): Promise<string> {
        const userPrompt = `
            Considere o caso de uso gerado na mensagem anterior desta thread:

            ${req.casoUso}

            Consulte os documentos da empresa (file_search) e gere uma lista
            organizada de CENÁRIOS DE TESTE (caminho feliz + caminhos alternativos
            + casos de erro) suficientes para validar a aplicação web em
            HTML/CSS/JS via Playwright + TypeScript.

            Estrutura esperada (Markdown):
            - Pré-condições
            - Cenário 1: <título>
                - Passos
                - Resultado esperado
            - Cenário 2: ...

            NÃO gere código de automação. Apenas a especificação dos cenários.
        `;

        return runAssistantTurn({
            threadId: req.threadId,
            assistantId: req.assistantId,
            userPrompt,
            model: req.model ?? MODELO_GPT_4,
        });
    }
}
