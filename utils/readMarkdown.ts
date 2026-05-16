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

export function saveMarkdown(filePath: string, content: string): void {
    const absolutePath = path.resolve(filePath);
    const dir = path.dirname(absolutePath);

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(absolutePath, content, 'utf-8');
}
