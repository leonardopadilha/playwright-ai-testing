import { AIUseCaseGenerator } from './AIUseCaseGenerator';
import { AITestScenarioGenerator } from './AITestScenarioGenerator';
import { AIPlaywrightGenerator } from './AIPlaywrightGenerator';
import { saveMarkdown } from '../utils/readMarkdown';

const aiUseCaseGenerator = new AIUseCaseGenerator();
const aiTestScenarioGenerator = new AITestScenarioGenerator();
const aiPlaywrightGenerator = new AIPlaywrightGenerator();

async function main() {
    const casoUso = await aiUseCaseGenerator.gerar_caso_uso();
    console.log("Caso de uso: \n", casoUso);

    const cenarioTeste = await aiTestScenarioGenerator.gerar_cenario_teste(casoUso);
    console.log("\n\nCenário de teste: \n", cenarioTeste);

    const scriptTeste = await aiPlaywrightGenerator.gerar_script_teste(casoUso, cenarioTeste);
    console.log("\n\nScript de teste: \n", scriptTeste);

    saveMarkdown('./script_temp_ia.ts', scriptTeste || '');
}

main();
