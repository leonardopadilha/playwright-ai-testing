import OpenAI from 'openai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { MODELO_GPT_4 } from './tools';

dotenv.config();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export interface AssistantContext {
    assistantId: string;
    threadId: string;
    vectorStoreId: string;
    fileIds: string[];
}

const ASSISTANT_INSTRUCTIONS = `
    Você é um Analista de Qualidade Sênior especialista em testes funcionais e
    automação de testes Web com Playwright + TypeScript.

    Use SEMPRE a ferramenta file_search para consultar os documentos anexados
    (resumo da empresa, padrão de casos de uso, etc.) antes de responder.

    Mantenha contexto entre as mensagens desta thread: o caso de uso, os
    cenários de teste e o script Playwright devem ser coerentes entre si.

    Responda em português. Quando gerar código, gere SOMENTE código (sem
    fences markdown como ${'```'}typescript ou comentários fora do código),
    pronto para ser salvo em um arquivo .spec.ts.
`;

export function listMarkdownFiles(directory: string): string[] {
    const absolute = path.resolve(directory);
    if (!fs.existsSync(absolute)) {
        throw new Error(`Diretório não encontrado: ${absolute}`);
    }
    return fs
        .readdirSync(absolute)
        .filter((name) => name.toLowerCase().endsWith('.md'))
        .map((name) => path.join(absolute, name));
}

export async function uploadFiles(filePaths: string[]): Promise<string[]> {
    const ids: string[] = [];
    for (const filePath of filePaths) {
        const uploaded = await client.files.create({
            file: fs.createReadStream(filePath),
            purpose: 'assistants',
        });
        ids.push(uploaded.id);
        console.log(`Arquivo enviado: ${path.basename(filePath)} -> ${uploaded.id}`);
    }
    return ids;
}

export async function createVectorStore(
    name: string,
    fileIds: string[],
): Promise<string> {
    const vectorStore = await client.vectorStores.create({ name });
    if (fileIds.length > 0) {
        await client.vectorStores.fileBatches.createAndPoll(vectorStore.id, {
            file_ids: fileIds,
        });
    }
    console.log(`Vector store criada: ${vectorStore.id}`);
    return vectorStore.id;
}

export async function createAssistant(
    vectorStoreId: string,
    model: string = MODELO_GPT_4,
): Promise<string> {
    const assistant = await client.beta.assistants.create({
        name: 'QA Engineer - Hub de Leitura',
        instructions: ASSISTANT_INSTRUCTIONS,
        model,
        tools: [{ type: 'file_search' }],
        tool_resources: {
            file_search: { vector_store_ids: [vectorStoreId] },
        },
    });
    console.log(`Assistente criado: ${assistant.id}`);
    return assistant.id;
}

export async function createThread(): Promise<string> {
    const thread = await client.beta.threads.create();
    console.log(`Thread criada: ${thread.id}`);
    return thread.id;
}

export async function bootstrapAssistant(
    docsDirectory: string,
    model: string = MODELO_GPT_4,
): Promise<AssistantContext> {
    const filePaths = listMarkdownFiles(docsDirectory);
    if (filePaths.length === 0) {
        throw new Error(
            `Nenhum arquivo .md encontrado em ${docsDirectory} para alimentar a RAG.`,
        );
    }

    const fileIds = await uploadFiles(filePaths);
    const vectorStoreId = await createVectorStore('Base Hub de Leitura', fileIds);
    const assistantId = await createAssistant(vectorStoreId, model);
    const threadId = await createThread();

    return { assistantId, threadId, vectorStoreId, fileIds };
}

export async function deleteFiles(fileIds: string[]): Promise<void> {
    for (const id of fileIds) {
        try {
            await client.files.delete(id);
        } catch (err) {
            console.warn(`Falha ao apagar arquivo ${id}: ${(err as Error).message}`);
        }
    }
}

export async function deleteVectorStore(vectorStoreId: string): Promise<void> {
    try {
        await client.vectorStores.delete(vectorStoreId);
    } catch (err) {
        console.warn(
            `Falha ao apagar vector store ${vectorStoreId}: ${(err as Error).message}`,
        );
    }
}

export async function deleteAssistant(assistantId: string): Promise<void> {
    try {
        await client.beta.assistants.delete(assistantId);
    } catch (err) {
        console.warn(
            `Falha ao apagar assistente ${assistantId}: ${(err as Error).message}`,
        );
    }
}

export async function deleteThread(threadId: string): Promise<void> {
    try {
        await client.beta.threads.delete(threadId);
    } catch (err) {
        console.warn(
            `Falha ao apagar thread ${threadId}: ${(err as Error).message}`,
        );
    }
}

export async function cleanupAssistant(
    context: Partial<AssistantContext>,
): Promise<void> {
    if (context.threadId) await deleteThread(context.threadId);
    if (context.assistantId) await deleteAssistant(context.assistantId);
    if (context.vectorStoreId) await deleteVectorStore(context.vectorStoreId);
    if (context.fileIds?.length) await deleteFiles(context.fileIds);
}

export { client };
