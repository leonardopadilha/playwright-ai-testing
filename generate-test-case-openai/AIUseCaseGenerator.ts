import { runAssistantTurn } from './threadRunner';
import { MODELO_GPT_4 } from './tools';

export interface UseCaseRequest {
    assistantId: string;
    threadId: string;
    pedidoUsuario: string;
    model?: string;
}

export class AIUseCaseGenerator {
    async gerar_caso_uso(req: UseCaseRequest): Promise<string> {
        const userPrompt = `
            Consulte os documentos anexados (especialmente "explicacao-casos.md"
            e "resumo-empresa.md") via file_search e gere UM caso de uso completo
            para a seguinte solicitação:

            "${req.pedidoUsuario}"

            Siga estritamente o formato de saída descrito em
            "explicacao-casos.md". Retorne apenas o caso de uso em Markdown,
            sem comentários adicionais.
        `;

        return runAssistantTurn({
            threadId: req.threadId,
            assistantId: req.assistantId,
            userPrompt,
            model: req.model ?? MODELO_GPT_4,
        });
    }
}
