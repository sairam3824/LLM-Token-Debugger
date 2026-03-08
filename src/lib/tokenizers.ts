export type TokenizerName =
  // ── OpenAI Chat — exact via gpt-tokenizer ──────────────────────
  | "gpt5" | "gpt41" | "gpt41_mini" | "gpt41_nano"
  | "gpt4o" | "gpt4o_mini"
  | "o3" | "o3_mini" | "o4_mini" | "o1" | "o1_mini"
  | "gpt4_turbo" | "gpt4" | "gpt35_turbo" | "text_davinci" | "gpt2"
  // ── OpenAI Embeddings — exact ──────────────────────────────────
  | "text_emb_3_small" | "text_emb_3_large" | "text_emb_ada"
  // ── Anthropic — approximate ───────────────────────────────────
  | "claude35_sonnet" | "claude35_haiku" | "claude3_opus" | "claude3_haiku"
  // ── Google — approximate ──────────────────────────────────────
  | "gemini2_flash" | "gemini15_pro" | "gemini15_flash" | "gemma2"
  // ── Meta — approximate ────────────────────────────────────────
  | "llama33" | "llama31_8b" | "llama2"
  // ── Mistral — approximate ─────────────────────────────────────
  | "mistral_large" | "mistral_small" | "codestral"
  // ── DeepSeek — approximate ───────────────────────────────────
  | "deepseek_r1" | "deepseek_v3"
  // ── HuggingFace / Sentence Transformers — WordPiece approx ───
  | "minilm_l6_v2" | "minilm_l12_v2" | "mpnet_base_v2"
  | "distilroberta_v1" | "multilingual_minilm"
  | "bge_large_en" | "bge_m3" | "e5_large_v2" | "e5_mistral"
  | "nomic_embed" | "bert_base" | "roberta_base"
  // ── Cohere — approximate ──────────────────────────────────────
  | "cohere_embed_en" | "cohere_embed_multi"
  // ── Voyage AI — approximate ───────────────────────────────────
  | "voyage3" | "voyage3_lite" | "voyage_code"
  // ── Other ─────────────────────────────────────────────────────
  | "qwen25" | "phi4" | "command_r";

export type Provider =
  | "openai" | "anthropic" | "google" | "meta"
  | "mistral" | "deepseek" | "huggingface" | "other";

export interface TokenInfo {
  id: number;
  text: string;
  bytes: number[];
  isWhitespace: boolean;
  isSpecial: boolean;
  isContinuation: boolean; // ## prefix in WordPiece
}

export type TokenizerAccuracy = "exact" | "approximate";
export type TokenizerEngine = "cl100k" | "o200k" | "p50k" | "r50k" | "sentencepiece" | "bpe" | "wordpiece";

export interface TokenizerConfig {
  label: string;
  description: string;
  provider: Provider;
  accuracy: TokenizerAccuracy;
  engine: TokenizerEngine;
  vocabSize: number;
  inputPricePerM: number;   // 0 = free / open-source
  outputPricePerM: number;
  contextWindow: number;
  isEmbedding?: boolean;    // embedding-only models
  dims?: number;            // embedding dimensions
  gptTokenizerModel?: string;
}

export const PROVIDERS: Record<Provider, { label: string }> = {
  openai:      { label: "OpenAI" },
  anthropic:   { label: "Anthropic" },
  google:      { label: "Google" },
  meta:        { label: "Meta" },
  mistral:     { label: "Mistral" },
  deepseek:    { label: "DeepSeek" },
  huggingface: { label: "HuggingFace" },
  other:       { label: "Other" },
};

export const TOKENIZER_CONFIGS: Record<TokenizerName, TokenizerConfig> = {

  // ────────────────────────────────────────────────────────────────
  // OpenAI Chat
  // ────────────────────────────────────────────────────────────────
  gpt5: {
    label: "GPT-5", description: "Most capable OpenAI model",
    provider: "openai", accuracy: "exact", engine: "o200k", vocabSize: 200019,
    inputPricePerM: 15, outputPricePerM: 60, contextWindow: 1_000_000,
    gptTokenizerModel: "gpt-5",
  },
  gpt41: {
    label: "GPT-4.1", description: "Flagship vision + reasoning",
    provider: "openai", accuracy: "exact", engine: "o200k", vocabSize: 200019,
    inputPricePerM: 2, outputPricePerM: 8, contextWindow: 1_000_000,
    gptTokenizerModel: "gpt-4.1",
  },
  gpt41_mini: {
    label: "GPT-4.1 mini", description: "Efficient 4.1 tier",
    provider: "openai", accuracy: "exact", engine: "o200k", vocabSize: 200019,
    inputPricePerM: 0.4, outputPricePerM: 1.6, contextWindow: 1_000_000,
    gptTokenizerModel: "gpt-4.1-mini",
  },
  gpt41_nano: {
    label: "GPT-4.1 nano", description: "Smallest / cheapest 4.1",
    provider: "openai", accuracy: "exact", engine: "o200k", vocabSize: 200019,
    inputPricePerM: 0.1, outputPricePerM: 0.4, contextWindow: 1_000_000,
    gptTokenizerModel: "gpt-4.1-nano",
  },
  gpt4o: {
    label: "GPT-4o", description: "Omni flagship, multimodal",
    provider: "openai", accuracy: "exact", engine: "o200k", vocabSize: 200019,
    inputPricePerM: 2.5, outputPricePerM: 10, contextWindow: 128_000,
    gptTokenizerModel: "gpt-4o",
  },
  gpt4o_mini: {
    label: "GPT-4o mini", description: "Cost-efficient GPT-4o",
    provider: "openai", accuracy: "exact", engine: "o200k", vocabSize: 200019,
    inputPricePerM: 0.15, outputPricePerM: 0.6, contextWindow: 128_000,
    gptTokenizerModel: "gpt-4o-mini",
  },
  o3: {
    label: "o3", description: "High-effort reasoning",
    provider: "openai", accuracy: "exact", engine: "o200k", vocabSize: 200019,
    inputPricePerM: 10, outputPricePerM: 40, contextWindow: 200_000,
    gptTokenizerModel: "o3",
  },
  o3_mini: {
    label: "o3-mini", description: "Lightweight reasoning",
    provider: "openai", accuracy: "exact", engine: "o200k", vocabSize: 200019,
    inputPricePerM: 1.1, outputPricePerM: 4.4, contextWindow: 200_000,
    gptTokenizerModel: "o3-mini",
  },
  o4_mini: {
    label: "o4-mini", description: "Latest efficient reasoning",
    provider: "openai", accuracy: "exact", engine: "o200k", vocabSize: 200019,
    inputPricePerM: 1.1, outputPricePerM: 4.4, contextWindow: 200_000,
    gptTokenizerModel: "o4-mini",
  },
  o1: {
    label: "o1", description: "Original reasoning model",
    provider: "openai", accuracy: "exact", engine: "o200k", vocabSize: 200019,
    inputPricePerM: 15, outputPricePerM: 60, contextWindow: 200_000,
    gptTokenizerModel: "o1",
  },
  o1_mini: {
    label: "o1-mini", description: "Reasoning, compact",
    provider: "openai", accuracy: "exact", engine: "o200k", vocabSize: 200019,
    inputPricePerM: 1.1, outputPricePerM: 4.4, contextWindow: 128_000,
    gptTokenizerModel: "o1-mini",
  },
  gpt4_turbo: {
    label: "GPT-4 Turbo", description: "GPT-4 Turbo Preview",
    provider: "openai", accuracy: "exact", engine: "cl100k", vocabSize: 100277,
    inputPricePerM: 10, outputPricePerM: 30, contextWindow: 128_000,
    gptTokenizerModel: "gpt-4-turbo",
  },
  gpt4: {
    label: "GPT-4", description: "Original GPT-4 (8k)",
    provider: "openai", accuracy: "exact", engine: "cl100k", vocabSize: 100277,
    inputPricePerM: 30, outputPricePerM: 60, contextWindow: 8_192,
    gptTokenizerModel: "gpt-4",
  },
  gpt35_turbo: {
    label: "GPT-3.5 Turbo", description: "Fast chat model",
    provider: "openai", accuracy: "exact", engine: "cl100k", vocabSize: 100277,
    inputPricePerM: 0.5, outputPricePerM: 1.5, contextWindow: 16_385,
    gptTokenizerModel: "gpt-3.5-turbo",
  },
  text_davinci: {
    label: "text-davinci-003", description: "Legacy InstructGPT",
    provider: "openai", accuracy: "exact", engine: "p50k", vocabSize: 50281,
    inputPricePerM: 20, outputPricePerM: 20, contextWindow: 4_097,
    gptTokenizerModel: "text-davinci-003",
  },
  gpt2: {
    label: "GPT-2", description: "Classic base model",
    provider: "openai", accuracy: "exact", engine: "r50k", vocabSize: 50257,
    inputPricePerM: 0, outputPricePerM: 0, contextWindow: 1_024,
    gptTokenizerModel: "gpt2",
  },

  // ────────────────────────────────────────────────────────────────
  // OpenAI Embeddings
  // ────────────────────────────────────────────────────────────────
  text_emb_3_small: {
    label: "text-embedding-3-small", description: "Best price/perf embedding",
    provider: "openai", accuracy: "exact", engine: "cl100k", vocabSize: 100277,
    inputPricePerM: 0.02, outputPricePerM: 0, contextWindow: 8_191,
    isEmbedding: true, dims: 1536,
    gptTokenizerModel: "text-embedding-3-small",
  },
  text_emb_3_large: {
    label: "text-embedding-3-large", description: "Highest accuracy embedding",
    provider: "openai", accuracy: "exact", engine: "cl100k", vocabSize: 100277,
    inputPricePerM: 0.13, outputPricePerM: 0, contextWindow: 8_191,
    isEmbedding: true, dims: 3072,
    gptTokenizerModel: "text-embedding-3-large",
  },
  text_emb_ada: {
    label: "text-embedding-ada-002", description: "Legacy embedding model",
    provider: "openai", accuracy: "exact", engine: "cl100k", vocabSize: 100277,
    inputPricePerM: 0.1, outputPricePerM: 0, contextWindow: 8_191,
    isEmbedding: true, dims: 1536,
    gptTokenizerModel: "text-embedding-ada-002",
  },

  // ────────────────────────────────────────────────────────────────
  // Anthropic
  // ────────────────────────────────────────────────────────────────
  claude35_sonnet: {
    label: "Claude 3.5 Sonnet", description: "Best coding & reasoning",
    provider: "anthropic", accuracy: "approximate", engine: "bpe", vocabSize: 100000,
    inputPricePerM: 3, outputPricePerM: 15, contextWindow: 200_000,
  },
  claude35_haiku: {
    label: "Claude 3.5 Haiku", description: "Fast + affordable",
    provider: "anthropic", accuracy: "approximate", engine: "bpe", vocabSize: 100000,
    inputPricePerM: 0.8, outputPricePerM: 4, contextWindow: 200_000,
  },
  claude3_opus: {
    label: "Claude 3 Opus", description: "Most powerful Claude 3",
    provider: "anthropic", accuracy: "approximate", engine: "bpe", vocabSize: 100000,
    inputPricePerM: 15, outputPricePerM: 75, contextWindow: 200_000,
  },
  claude3_haiku: {
    label: "Claude 3 Haiku", description: "Fastest Claude 3",
    provider: "anthropic", accuracy: "approximate", engine: "bpe", vocabSize: 100000,
    inputPricePerM: 0.25, outputPricePerM: 1.25, contextWindow: 200_000,
  },

  // ────────────────────────────────────────────────────────────────
  // Google
  // ────────────────────────────────────────────────────────────────
  gemini2_flash: {
    label: "Gemini 2.0 Flash", description: "Google's fastest current model",
    provider: "google", accuracy: "approximate", engine: "sentencepiece", vocabSize: 256000,
    inputPricePerM: 0.1, outputPricePerM: 0.4, contextWindow: 1_048_576,
  },
  gemini15_pro: {
    label: "Gemini 1.5 Pro", description: "Long-context multimodal",
    provider: "google", accuracy: "approximate", engine: "sentencepiece", vocabSize: 256000,
    inputPricePerM: 1.25, outputPricePerM: 5, contextWindow: 2_097_152,
  },
  gemini15_flash: {
    label: "Gemini 1.5 Flash", description: "Cost-effective Gemini 1.5",
    provider: "google", accuracy: "approximate", engine: "sentencepiece", vocabSize: 256000,
    inputPricePerM: 0.075, outputPricePerM: 0.3, contextWindow: 1_048_576,
  },
  gemma2: {
    label: "Gemma 2 9B", description: "Google open-source model",
    provider: "google", accuracy: "approximate", engine: "sentencepiece", vocabSize: 256000,
    inputPricePerM: 0.2, outputPricePerM: 0.2, contextWindow: 8_192,
  },

  // ────────────────────────────────────────────────────────────────
  // Meta
  // ────────────────────────────────────────────────────────────────
  llama33: {
    label: "Llama 3.3 70B", description: "Meta's latest open model",
    provider: "meta", accuracy: "approximate", engine: "bpe", vocabSize: 128256,
    inputPricePerM: 0.59, outputPricePerM: 0.79, contextWindow: 128_000,
  },
  llama31_8b: {
    label: "Llama 3.1 8B", description: "Efficient open-source model",
    provider: "meta", accuracy: "approximate", engine: "bpe", vocabSize: 128256,
    inputPricePerM: 0.1, outputPricePerM: 0.1, contextWindow: 128_000,
  },
  llama2: {
    label: "Llama 2 70B", description: "Previous gen SentencePiece",
    provider: "meta", accuracy: "approximate", engine: "sentencepiece", vocabSize: 32000,
    inputPricePerM: 0.7, outputPricePerM: 0.9, contextWindow: 4_096,
  },

  // ────────────────────────────────────────────────────────────────
  // Mistral
  // ────────────────────────────────────────────────────────────────
  mistral_large: {
    label: "Mistral Large 2", description: "Top-tier Mistral model",
    provider: "mistral", accuracy: "approximate", engine: "bpe", vocabSize: 32768,
    inputPricePerM: 2, outputPricePerM: 6, contextWindow: 128_000,
  },
  mistral_small: {
    label: "Mistral Small 3.1", description: "Affordable & multimodal",
    provider: "mistral", accuracy: "approximate", engine: "bpe", vocabSize: 32768,
    inputPricePerM: 0.1, outputPricePerM: 0.3, contextWindow: 128_000,
  },
  codestral: {
    label: "Codestral", description: "Code-specialized Mistral",
    provider: "mistral", accuracy: "approximate", engine: "bpe", vocabSize: 32768,
    inputPricePerM: 0.3, outputPricePerM: 0.9, contextWindow: 256_000,
  },

  // ────────────────────────────────────────────────────────────────
  // DeepSeek
  // ────────────────────────────────────────────────────────────────
  deepseek_r1: {
    label: "DeepSeek R1", description: "Reasoning model, OSS",
    provider: "deepseek", accuracy: "approximate", engine: "bpe", vocabSize: 102400,
    inputPricePerM: 0.55, outputPricePerM: 2.19, contextWindow: 128_000,
  },
  deepseek_v3: {
    label: "DeepSeek V3", description: "General-purpose powerhouse",
    provider: "deepseek", accuracy: "approximate", engine: "bpe", vocabSize: 102400,
    inputPricePerM: 0.27, outputPricePerM: 1.1, contextWindow: 128_000,
  },

  // ────────────────────────────────────────────────────────────────
  // HuggingFace / Sentence Transformers  (WordPiece — ## continuation)
  // ────────────────────────────────────────────────────────────────
  minilm_l6_v2: {
    label: "all-MiniLM-L6-v2", description: "Fastest & most popular ST model",
    provider: "huggingface", accuracy: "approximate", engine: "wordpiece", vocabSize: 30522,
    inputPricePerM: 0, outputPricePerM: 0, contextWindow: 256,
    isEmbedding: true, dims: 384,
  },
  minilm_l12_v2: {
    label: "all-MiniLM-L12-v2", description: "Deeper MiniLM, better quality",
    provider: "huggingface", accuracy: "approximate", engine: "wordpiece", vocabSize: 30522,
    inputPricePerM: 0, outputPricePerM: 0, contextWindow: 512,
    isEmbedding: true, dims: 384,
  },
  mpnet_base_v2: {
    label: "all-mpnet-base-v2", description: "Best quality ST model (SBERT)",
    provider: "huggingface", accuracy: "approximate", engine: "wordpiece", vocabSize: 30522,
    inputPricePerM: 0, outputPricePerM: 0, contextWindow: 514,
    isEmbedding: true, dims: 768,
  },
  distilroberta_v1: {
    label: "all-distilroberta-v1", description: "RoBERTa-based sentence encoder",
    provider: "huggingface", accuracy: "approximate", engine: "bpe", vocabSize: 50265,
    inputPricePerM: 0, outputPricePerM: 0, contextWindow: 512,
    isEmbedding: true, dims: 768,
  },
  multilingual_minilm: {
    label: "paraphrase-multilingual-MiniLM-L12-v2", description: "50+ language support",
    provider: "huggingface", accuracy: "approximate", engine: "wordpiece", vocabSize: 105879,
    inputPricePerM: 0, outputPricePerM: 0, contextWindow: 128,
    isEmbedding: true, dims: 384,
  },
  bge_large_en: {
    label: "BGE-large-en-v1.5", description: "BAAI top English embedder",
    provider: "huggingface", accuracy: "approximate", engine: "wordpiece", vocabSize: 30522,
    inputPricePerM: 0, outputPricePerM: 0, contextWindow: 512,
    isEmbedding: true, dims: 1024,
  },
  bge_m3: {
    label: "BGE-M3", description: "Multilingual, multi-granularity",
    provider: "huggingface", accuracy: "approximate", engine: "sentencepiece", vocabSize: 250002,
    inputPricePerM: 0, outputPricePerM: 0, contextWindow: 8192,
    isEmbedding: true, dims: 1024,
  },
  e5_large_v2: {
    label: "E5-large-v2", description: "Microsoft E5 embedding",
    provider: "huggingface", accuracy: "approximate", engine: "wordpiece", vocabSize: 30522,
    inputPricePerM: 0, outputPricePerM: 0, contextWindow: 512,
    isEmbedding: true, dims: 1024,
  },
  e5_mistral: {
    label: "E5-mistral-7B-instruct", description: "Instruction-tuned Mistral for embed",
    provider: "huggingface", accuracy: "approximate", engine: "bpe", vocabSize: 32000,
    inputPricePerM: 0, outputPricePerM: 0, contextWindow: 32768,
    isEmbedding: true, dims: 4096,
  },
  nomic_embed: {
    label: "nomic-embed-text-v1.5", description: "Long-context open embedder",
    provider: "huggingface", accuracy: "approximate", engine: "wordpiece", vocabSize: 30522,
    inputPricePerM: 0, outputPricePerM: 0, contextWindow: 8192,
    isEmbedding: true, dims: 768,
  },
  bert_base: {
    label: "BERT-base-uncased", description: "The original BERT model",
    provider: "huggingface", accuracy: "approximate", engine: "wordpiece", vocabSize: 30522,
    inputPricePerM: 0, outputPricePerM: 0, contextWindow: 512,
    isEmbedding: true, dims: 768,
  },
  roberta_base: {
    label: "RoBERTa-base", description: "Robustly optimized BERT (BPE)",
    provider: "huggingface", accuracy: "approximate", engine: "bpe", vocabSize: 50265,
    inputPricePerM: 0, outputPricePerM: 0, contextWindow: 512,
    isEmbedding: true, dims: 768,
  },

  // ────────────────────────────────────────────────────────────────
  // Cohere
  // ────────────────────────────────────────────────────────────────
  cohere_embed_en: {
    label: "embed-english-v3.0", description: "Cohere's top English embed",
    provider: "other", accuracy: "approximate", engine: "bpe", vocabSize: 50000,
    inputPricePerM: 0.1, outputPricePerM: 0, contextWindow: 512,
    isEmbedding: true, dims: 1024,
  },
  cohere_embed_multi: {
    label: "embed-multilingual-v3.0", description: "100+ language Cohere embed",
    provider: "other", accuracy: "approximate", engine: "bpe", vocabSize: 50000,
    inputPricePerM: 0.1, outputPricePerM: 0, contextWindow: 512,
    isEmbedding: true, dims: 1024,
  },

  // ────────────────────────────────────────────────────────────────
  // Voyage AI
  // ────────────────────────────────────────────────────────────────
  voyage3: {
    label: "voyage-3", description: "Voyage top-quality embedding",
    provider: "other", accuracy: "approximate", engine: "bpe", vocabSize: 100000,
    inputPricePerM: 0.06, outputPricePerM: 0, contextWindow: 32000,
    isEmbedding: true, dims: 1024,
  },
  voyage3_lite: {
    label: "voyage-3-lite", description: "Voyage optimized for cost",
    provider: "other", accuracy: "approximate", engine: "bpe", vocabSize: 100000,
    inputPricePerM: 0.02, outputPricePerM: 0, contextWindow: 32000,
    isEmbedding: true, dims: 512,
  },
  voyage_code: {
    label: "voyage-code-3", description: "Voyage code-specialized embed",
    provider: "other", accuracy: "approximate", engine: "bpe", vocabSize: 100000,
    inputPricePerM: 0.12, outputPricePerM: 0, contextWindow: 32000,
    isEmbedding: true, dims: 1024,
  },

  // ────────────────────────────────────────────────────────────────
  // Other
  // ────────────────────────────────────────────────────────────────
  qwen25: {
    label: "Qwen 2.5 72B", description: "Alibaba open-source model",
    provider: "other", accuracy: "approximate", engine: "bpe", vocabSize: 151936,
    inputPricePerM: 0.4, outputPricePerM: 1.2, contextWindow: 128_000,
  },
  phi4: {
    label: "Phi-4", description: "Microsoft small but mighty",
    provider: "other", accuracy: "approximate", engine: "bpe", vocabSize: 100352,
    inputPricePerM: 0.07, outputPricePerM: 0.14, contextWindow: 16_384,
  },
  command_r: {
    label: "Command R+", description: "Cohere RAG-optimized LLM",
    provider: "other", accuracy: "approximate", engine: "bpe", vocabSize: 256000,
    inputPricePerM: 2.5, outputPricePerM: 10, contextWindow: 128_000,
  },
};

export const PROVIDER_ORDER: Provider[] = [
  "openai", "anthropic", "google", "meta", "mistral", "deepseek", "huggingface", "other",
];

export const MODELS_BY_PROVIDER: Record<Provider, TokenizerName[]> = {
  openai: [
    "gpt5", "gpt41", "gpt41_mini", "gpt41_nano",
    "gpt4o", "gpt4o_mini",
    "o3", "o3_mini", "o4_mini", "o1", "o1_mini",
    "gpt4_turbo", "gpt4", "gpt35_turbo", "text_davinci", "gpt2",
    "text_emb_3_small", "text_emb_3_large", "text_emb_ada",
  ],
  anthropic:   ["claude35_sonnet", "claude35_haiku", "claude3_opus", "claude3_haiku"],
  google:      ["gemini2_flash", "gemini15_pro", "gemini15_flash", "gemma2"],
  meta:        ["llama33", "llama31_8b", "llama2"],
  mistral:     ["mistral_large", "mistral_small", "codestral"],
  deepseek:    ["deepseek_r1", "deepseek_v3"],
  huggingface: [
    "minilm_l6_v2", "minilm_l12_v2", "mpnet_base_v2",
    "distilroberta_v1", "multilingual_minilm",
    "bge_large_en", "bge_m3", "e5_large_v2", "e5_mistral",
    "nomic_embed", "bert_base", "roberta_base",
  ],
  other: [
    "cohere_embed_en", "cohere_embed_multi",
    "voyage3", "voyage3_lite", "voyage_code",
    "qwen25", "phi4", "command_r",
  ],
};

// ──────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────

function textToBytes(text: string): number[] {
  return Array.from(new TextEncoder().encode(text));
}

function isWhitespaceOnly(text: string): boolean {
  return /^\s+$/.test(text);
}

const SPECIAL_TOKEN_SET = new Set([
  "<|endoftext|>", "<|im_start|>", "<|im_end|>",
  "<s>", "</s>", "[CLS]", "[SEP]", "[PAD]", "[UNK]", "[MASK]",
  "<unk>", "<pad>", "<bos>", "<eos>",
]);

function isSpecialToken(text: string): boolean {
  return SPECIAL_TOKEN_SET.has(text);
}

function pseudoId(text: string, salt = 0): number {
  let h = (5381 + salt) | 0;
  for (let i = 0; i < text.length; i++) {
    h = ((h << 5) + h + text.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// ──────────────────────────────────────────────────────────────────
// WordPiece approximation  (BERT-family)
// Key behaviors:
//   1. Splits on whitespace AND punctuation (each punct = 1 token)
//   2. Continuation subwords get "##" prefix
//   3. Small 30k vocab → more splits than BPE models
//   4. CLS / SEP special tokens added at boundaries
// ──────────────────────────────────────────────────────────────────

// Roughly, how many chars per subword given a 30k wordpiece vocab
const WP_CHARS_PER_SUBWORD = 4.0;

function makeToken(text: string, isContinuation: boolean, salt: number): TokenInfo {
  const displayText = isContinuation ? `##${text}` : text;
  return {
    id: pseudoId(displayText, salt),
    text: displayText,
    bytes: textToBytes(text),
    isWhitespace: false,
    isSpecial: false,
    isContinuation,
  };
}

function wordpieceTokenize(text: string, cfg: TokenizerConfig): TokenInfo[] {
  // For multilingual models, more chars/subword due to larger vocab
  const charsPerSub = cfg.vocabSize > 100000 ? 5.5 : WP_CHARS_PER_SUBWORD;

  const tokens: TokenInfo[] = [];

  // Split into words and whitespace runs (whitespace is NOT part of the token in WordPiece)
  const chunks = text.match(/\s+|[A-Za-z0-9\u00C0-\u024F\u0400-\u04FF\u4E00-\u9FFF\uAC00-\uD7AF]+|[^\w\s]/gu) ?? [];

  for (const chunk of chunks) {
    if (isWhitespaceOnly(chunk)) {
      tokens.push({
        id: pseudoId(chunk, 1),
        text: chunk,
        bytes: textToBytes(chunk),
        isWhitespace: true,
        isSpecial: false,
        isContinuation: false,
      });
      continue;
    }

    if (isSpecialToken(chunk)) {
      tokens.push({
        id: pseudoId(chunk, 2),
        text: chunk,
        bytes: textToBytes(chunk),
        isWhitespace: false,
        isSpecial: true,
        isContinuation: false,
      });
      continue;
    }

    // Single punctuation characters are each their own token in WordPiece
    if (/^[^\w\s]$/u.test(chunk)) {
      tokens.push(makeToken(chunk, false, 5));
      continue;
    }

    // Subword split
    const chars = [...chunk];
    const byteLen = textToBytes(chunk).length;
    const numSubwords = Math.max(1, Math.round(byteLen / (charsPerSub * 0.9)));

    if (numSubwords === 1) {
      tokens.push(makeToken(chunk, false, 3));
    } else {
      const subSize = Math.ceil(chars.length / numSubwords);
      for (let i = 0; i < chars.length; i += subSize) {
        const sub = chars.slice(i, i + subSize).join("");
        tokens.push(makeToken(sub, i > 0, 4));
      }
    }
  }

  return tokens;
}

// ──────────────────────────────────────────────────────────────────
// BPE / SentencePiece approximate tokenizer
// ──────────────────────────────────────────────────────────────────

const APPROX_PARAMS: Record<string, number> = {
  "bpe-32k": 3.2, "bpe-50k": 3.4, "bpe-100k": 3.6,
  "bpe-128k": 3.8, "bpe-150k": 4.0, "bpe-200k": 4.2,
  "sp-32k": 3.0, "sp-256k": 3.6,
};

function vocabKey(engine: TokenizerEngine, vocabSize: number): string {
  const style = engine === "sentencepiece" ? "sp" : "bpe";
  if (vocabSize >= 200000) return `${style}-200k`;
  if (vocabSize >= 150000) return `${style}-150k`;
  if (vocabSize >= 128000) return `${style}-128k`;
  if (vocabSize >= 100000) return `${style}-100k`;
  if (vocabSize >= 50000)  return `${style}-50k`;
  return `${style}-32k`;
}

function bpeApproxTokenize(text: string, cfg: TokenizerConfig): TokenInfo[] {
  const avgChars = APPROX_PARAMS[vocabKey(cfg.engine, cfg.vocabSize)] ?? 3.5;
  const tokens: TokenInfo[] = [];
  const chunks = text.match(/\s+|\S+/g) ?? [];

  for (const chunk of chunks) {
    if (isWhitespaceOnly(chunk)) {
      tokens.push({ id: pseudoId(chunk, 1), text: chunk, bytes: textToBytes(chunk), isWhitespace: true, isSpecial: false, isContinuation: false });
      continue;
    }
    if (isSpecialToken(chunk)) {
      tokens.push({ id: pseudoId(chunk, 2), text: chunk, bytes: textToBytes(chunk), isWhitespace: false, isSpecial: true, isContinuation: false });
      continue;
    }

    const byteLen = textToBytes(chunk).length;
    const numTokens = Math.max(1, Math.round(byteLen / (avgChars * 0.85)));

    if (numTokens === 1) {
      tokens.push({ id: pseudoId(chunk, 3), text: chunk, bytes: textToBytes(chunk), isWhitespace: false, isSpecial: false, isContinuation: false });
    } else {
      const chars = [...chunk];
      const chunkSize = Math.ceil(chars.length / numTokens);
      for (let i = 0; i < chars.length; i += chunkSize) {
        const part = chars.slice(i, i + chunkSize).join("");
        tokens.push({ id: pseudoId(part + i, 4), text: part, bytes: textToBytes(part), isWhitespace: false, isSpecial: false, isContinuation: false });
      }
    }
  }
  return tokens;
}

// ──────────────────────────────────────────────────────────────────
// Exact tokenizer via gpt-tokenizer
// ──────────────────────────────────────────────────────────────────

type GptEncodeModule = {
  encode: (text: string) => number[];
  decode: (tokens: number[]) => string;
};

const moduleCache = new Map<string, GptEncodeModule>();

async function loadGptTokenizer(modelPath: string): Promise<GptEncodeModule> {
  if (moduleCache.has(modelPath)) return moduleCache.get(modelPath)!;
  const mod = await import(`gpt-tokenizer/model/${modelPath}`) as GptEncodeModule;
  moduleCache.set(modelPath, mod);
  return mod;
}

async function exactTokenize(text: string, modelPath: string): Promise<TokenInfo[]> {
  const mod = await loadGptTokenizer(modelPath);
  return mod.encode(text).map((id) => {
    const tokenText = mod.decode([id]);
    return {
      id,
      text: tokenText,
      bytes: textToBytes(tokenText),
      isWhitespace: isWhitespaceOnly(tokenText),
      isSpecial: isSpecialToken(tokenText),
      isContinuation: false,
    };
  });
}

// ──────────────────────────────────────────────────────────────────
// Public API
// ──────────────────────────────────────────────────────────────────

export async function tokenize(text: string, name: TokenizerName): Promise<TokenInfo[]> {
  if (!text) return [];
  const cfg = TOKENIZER_CONFIGS[name];

  if (cfg.accuracy === "exact" && cfg.gptTokenizerModel) {
    try {
      return await exactTokenize(text, cfg.gptTokenizerModel);
    } catch (err) {
      console.warn(`Exact tokenizer failed for ${name}, falling back:`, err);
    }
  }

  if (cfg.engine === "wordpiece") return wordpieceTokenize(text, cfg);
  return bpeApproxTokenize(text, cfg);
}

export function getStats(tokens: TokenInfo[], text: string, name: TokenizerName) {
  const cfg = TOKENIZER_CONFIGS[name];
  const total = tokens.filter(t => !t.isWhitespace).length; // embedding models count non-ws
  const totalAll = tokens.length;
  const unique = new Set(tokens.map((t) => t.id)).size;
  const charsPerToken = totalAll > 0 ? (text.length / totalAll).toFixed(2) : "0";
  const inputCost = ((totalAll / 1_000_000) * cfg.inputPricePerM).toFixed(6);
  const outputCost = ((totalAll / 1_000_000) * cfg.outputPricePerM).toFixed(6);
  const contextPct = ((totalAll / cfg.contextWindow) * 100).toFixed(1);
  const overLimit = totalAll > cfg.contextWindow;

  return { total: totalAll, unique, charsPerToken, inputCost, outputCost, contextPct, overLimit };
}
