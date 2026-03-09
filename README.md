# LLM Token Debugger

[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

An interactive, client-side developer tool that visualizes exactly how LLMs and embedding models tokenize your text. Supports **50 models across 8 providers** — from GPT-5 and Claude to all-MiniLM-L6-v2 and BERT.

No backend. No API keys. No data leaves your browser.

---

## Features

### Token Visualization
- Each token rendered as a colored chip with alternating colors to mark boundaries
- Hover any token to inspect: token ID, string representation, raw bytes, byte length
- Whitespace rendered as visible glyphs (`·` space, `↵` newline, `→` tab)
- Special tokens highlighted in yellow (`[CLS]`, `<|endoftext|>`, `<s>`, etc.)
- WordPiece `##` continuation subwords shown with distinct styling (BERT-family models)

### 50 Models Across 8 Providers

| Provider | Models | Tokenizer Engine |
|---|---|---|
| **OpenAI** | GPT-5, GPT-4.1/mini/nano, GPT-4o/mini, o4-mini, o3/mini, o1/mini, GPT-4 Turbo, GPT-4, GPT-3.5 Turbo, text-davinci-003, GPT-2 | **Exact** — real `gpt-tokenizer` output |
| **OpenAI Embeddings** | text-embedding-3-small, text-embedding-3-large, text-embedding-ada-002 | **Exact** — real `gpt-tokenizer` output |
| **Anthropic** | Claude 3.5 Sonnet, Claude 3.5 Haiku, Claude 3 Opus, Claude 3 Haiku | Approximated (BPE, 100k vocab) |
| **Google** | Gemini 2.0 Flash, Gemini 1.5 Pro/Flash, Gemma 2 9B | Approximated (SentencePiece, 256k vocab) |
| **Meta** | Llama 3.3 70B, Llama 3.1 8B, Llama 2 70B | Approximated (BPE 128k / SP 32k) |
| **Mistral** | Mistral Large 2, Mistral Small 3.1, Codestral | Approximated (BPE, 32k vocab) |
| **DeepSeek** | DeepSeek R1, DeepSeek V3 | Approximated (BPE, 102k vocab) |
| **HuggingFace** | all-MiniLM-L6-v2, all-MiniLM-L12-v2, all-mpnet-base-v2, all-distilroberta-v1, paraphrase-multilingual-MiniLM-L12-v2, BGE-large-en-v1.5, BGE-M3, E5-large-v2, E5-mistral-7B-instruct, nomic-embed-text-v1.5, BERT-base-uncased, RoBERTa-base | Approximated (WordPiece `##` / BPE) |
| **Other** | Cohere embed-english/multilingual, Voyage-3/lite/code, Qwen 2.5 72B, Phi-4, Command R+ | Approximated |

### Stats Panel
For every model, get real-time:
- **Token count** with context window usage %
- **Unique token count**
- **Characters per token** ratio
- **Estimated cost** (input price per million tokens)
- **Embedding dimensions** (for embedding models)
- **Context limit warning** when your text exceeds the model's maximum sequence length

### Compare Mode
Side-by-side panel with independent model selection — great for seeing why the same text costs more with one provider, or how WordPiece vs BPE splits differently.

### Educational Examples
7 built-in examples with explanations:
- Emojis and Unicode (why emojis = many tokens)
- `tokenization` vs `tokenizing` (frequency matters)
- Numbers and math (digit-level splits)
- Code snippets (indentation as tokens)
- Whitespace behavior (leading space = different token)
- Multilingual text (non-Latin scripts = more tokens)
- Prompt engineering (system prompts cost tokens too)

---

## Tokenizer Accuracy

| Label | What it means |
|---|---|
| `exact` | Byte-identical output from the real tokenizer via `gpt-tokenizer` |
| `~approx` | Modeled approximation — token count is realistic but individual splits may differ |

**Exact models:** All OpenAI chat and embedding models. Token IDs and splits are identical to what the OpenAI API uses.

**Approximate models:** Non-OpenAI models (Claude, Gemini, Llama, BERT-family, etc.) use a vocabulary-size-aware approximation. Token *counts* are representative — larger vocabularies (200k+) produce fewer, longer tokens; smaller ones (30k) produce more splits. WordPiece models additionally model `##` continuation subword behavior.

For production RAG pipelines or billing-sensitive work, always verify with the model's official tokenizer.

---

## Tech Stack

| Tool | Role |
|---|---|
| [Next.js 16](https://nextjs.org/) (App Router) | Framework |
| [React 19](https://react.dev/) | UI |
| [Tailwind CSS 4](https://tailwindcss.com/) | Styling |
| [TypeScript 5](https://www.typescriptlang.org/) | Type safety |
| [`gpt-tokenizer`](https://github.com/niieani/gpt-tokenizer) v3 | Exact tokenization for all OpenAI models |

Everything runs in the browser. There is no server, no API, and no telemetry.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- npm (comes with Node.js)

### Installation

```bash
git clone https://github.com/your-username/llm-token-debugger.git
cd llm-token-debugger
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Other Commands

```bash
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main UI — token display, model selector, stats panel
│   ├── layout.tsx        # Root layout and metadata
│   └── globals.css       # Global styles (Tailwind import)
└── lib/
    ├── tokenizers.ts     # All model configs, tokenizer engines, getStats()
    └── examples.ts       # Curated example texts with educational insights
```

### Key Files

**`src/lib/tokenizers.ts`**
- `TOKENIZER_CONFIGS` — config for all 50 models (provider, engine, vocab size, pricing, context window)
- `tokenize(text, modelName)` — async function returning `TokenInfo[]`; dispatches to exact or approximate engine
- `getStats(tokens, text, modelName)` — returns count, unique, cost, context %, overflow flag
- `wordpieceTokenize()` — BERT-family approximation with `##` continuation subwords
- `bpeApproxTokenize()` — BPE/SentencePiece approximation scaled by vocabulary size
- `exactTokenize()` — delegates to `gpt-tokenizer` via dynamic import (cached)

**`src/app/page.tsx`**
- `TokenChip` — individual token chip with hover tooltip
- `TokenDisplay` — renders token list with alternating colors
- `ModelSelector` — tabbed provider selector with model cards
- `StatsPanel` — real-time stats grid with context overflow warning

---

## Use Cases

- **Prompt engineering** — see exactly how many tokens your system prompt consumes before your actual content
- **RAG chunking** — verify your chunks fit within 256/512-token embedding model windows
- **Cost estimation** — compare token counts across providers before committing to an API
- **Model selection** — understand tokenization efficiency differences (GPT-4o vs Claude vs Llama)
- **Learning** — build intuition for why some words are single tokens and others are split

---

## Contributing

Contributions are welcome. If you find a bug or want to add a model, open an issue or pull request.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push: `git push origin feature/my-feature`
5. Open a pull request

### Adding a New Model

1. Add a new entry to `TokenizerName` union in `src/lib/tokenizers.ts`
2. Add the config to `TOKENIZER_CONFIGS` (label, provider, engine, vocabSize, pricing, contextWindow)
3. Add the model name to the appropriate array in `MODELS_BY_PROVIDER`
4. If the model uses a gpt-tokenizer-supported path, set `accuracy: "exact"` and `gptTokenizerModel`

---

## License

Copyright (c) 2026 Sairam Maruri

MIT License. See [LICENSE](./LICENSE) for the full license text.
