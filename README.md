# 🤖 Playwright AI Testing

Projeto experimental focado em automação de testes com Playwright + Inteligência Artificial.

A proposta deste projeto é explorar como IA pode auxiliar o processo de Engenharia de Qualidade, indo além da simples geração de scripts automatizados e buscando uma abordagem mais orientada a:

- regras de negócio
- casos de uso
- cenários de teste
- contexto da aplicação
- automação inteligente

---

# 🚀 Objetivo do Projeto

O principal objetivo deste projeto é estudar e evoluir o uso de IA aplicada em QA Automation, utilizando:

- Geração de casos de uso com IA
- Geração de cenários de teste
- Geração automatizada de scripts Playwright
- Interpretação de regras de negócio
- Engenharia de prompts
- Estruturação de pipelines de automação inteligente

Mais do que apenas gerar código, a ideia é explorar como IA pode participar de diferentes etapas do processo de qualidade de software.

---

# 🧠 Conceito Atual

Atualmente o projeto trabalha com uma pipeline inicial composta por:

```txt
Entrada de contexto
        ↓
Geração de Caso de Uso
        ↓
Geração de Cenário de Teste
        ↓
Geração de Script Playwright
```

A IA recebe contexto da aplicação através de documentos `.md` e utiliza essas informações para gerar:

- Casos de uso
- Cenários de teste
- Scripts automatizados

---

# 🛠️ Tecnologias Utilizadas

- Node.js
- TypeScript
- Playwright
- OpenAI API

---

# 📂 Estrutura Inicial do Projeto

```txt
project/
│
├── docs/
│   └── info-empresa/
│       ├── resumo-empresa.md
│       └── explicacao-casos.md
│
├── generate-test-case-openai/
│   └── generate-test-uso.ts
│
├── tests/
│
├── src/
│
├── package.json
└── README.md
```

---

# ⚙️ Instalação

Clone o repositório:

```bash
git clone <url-do-repositorio>
```

Acesse a pasta do projeto:

```bash
cd playwright-ai-testing
```

Instale as dependências:

```bash
npm install
```

---

# 🔑 Configuração

Crie um arquivo `.env` na raiz do projeto:

```env
OPENAI_API_KEY=sua_chave_openai
```

---

# ▶️ Executando o Projeto

## Iniciar aplicação

```bash
npm run dev
```

---

## Executar testes Playwright

```bash
npm test
```

---

## Executar gerador de testes com IA

```bash
npm run generate
```

---

# 🧪 Scripts Disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Executa a aplicação em modo desenvolvimento |
| `npm test` | Executa testes Playwright |
| `npm run test:ui` | Executa Playwright UI Mode |
| `npm run test:debug` | Executa testes em modo debug |
| `npm run test:codegen` | Abre Playwright Codegen |
| `npm run generate` | Executa geração de testes com IA |

---

# 📌 Estado Atual do Projeto

🚧 Projeto em fase inicial e evolução contínua.

O foco atual está em:

- Estruturar arquitetura do projeto
- Melhorar geração de prompts
- Evoluir qualidade dos cenários gerados
- Melhorar legibilidade dos scripts
- Explorar IA aplicada em QA de forma prática

---

# 🙏 Créditos

Este projeto utiliza como base uma aplicação de estudos disponibilizada por:

- [Hub de Leitura - Fabio Araujo QA](https://github.com/fabioaraujoqa/hub-de-leitura?utm_source=chatgpt.com)

Todos os créditos da aplicação base pertencem ao autor original do projeto.

Este repositório tem como objetivo realizar estudos e experimentações envolvendo:
- Playwright
- IA aplicada em QA
- geração automatizada de testes
- engenharia de qualidade

---

# 📖 Objetivo de Aprendizado

Este projeto funciona também como laboratório de estudos para:

- QA Automation
- IA aplicada em testes
- Engenharia de Prompt
- Arquitetura de automação
- Playwright
- Testes orientados por contexto
- Automação inteligente

A ideia não é apenas criar testes automatizados, mas estudar como IA pode participar do ciclo completo de qualidade de software.

---

# 🤝 Contribuições

Sugestões, ideias e melhorias são sempre bem-vindas.

---

# 📄 Licença

Este projeto está sob licença MIT.

---

# 👨‍💻 Autor

Leonardo Padilha