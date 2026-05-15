import fs from 'fs';
import path from 'path';

export function readMarkdown(filePath: string): string {
    const absolutePath = path.resolve(filePath);

    if (!fs.existsSync(absolutePath)) {
        throw new Error(`Arquivo não encontrado: ${absolutePath}`);
    }

    const content = fs.readFileSync(absolutePath, 'utf-8');
    return content.trim();
}
