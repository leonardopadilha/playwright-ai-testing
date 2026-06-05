import { client } from './AssistantProject';
import { MODELO_GPT_4, STATUS_COMPLETED } from './tools';

export interface RunRequest {
    threadId: string;
    assistantId: string;
    userPrompt: string;
    model?: string;
    additionalInstructions?: string;
}

export async function runAssistantTurn(req: RunRequest): Promise<string> {
    const {
        threadId,
        assistantId,
        userPrompt,
        model = MODELO_GPT_4,
        additionalInstructions,
    } = req;

    await client.beta.threads.messages.create(threadId, {
        role: 'user',
        content: userPrompt,
    });

    const run = await client.beta.threads.runs.createAndPoll(threadId, {
        assistant_id: assistantId,
        model,
        tools: [{ type: 'file_search' }],
        ...(additionalInstructions
            ? { additional_instructions: additionalInstructions }
            : {}),
    });

    if (run.status !== STATUS_COMPLETED) {
        throw new Error(
            `Run não completou. Status final: ${run.status}. ` +
                `Última erro: ${JSON.stringify(run.last_error ?? null)}`,
        );
    }

    const messages = await client.beta.threads.messages.list(threadId, {
        order: 'desc',
        limit: 1,
    });

    const latest = messages.data[0];
    if (!latest || latest.role !== 'assistant') {
        throw new Error('Nenhuma resposta do assistente encontrada na thread.');
    }

    const text = latest.content
        .filter((block): block is Extract<typeof block, { type: 'text' }> =>
            block.type === 'text',
        )
        .map((block) => block.text.value)
        .join('\n')
        .trim();

    if (!text) {
        throw new Error('Resposta do assistente veio vazia.');
    }

    return text;
}
