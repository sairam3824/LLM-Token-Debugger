export interface Example {
  label: string;
  text: string;
  insight: string;
}

export const EXAMPLES: Example[] = [
  {
    label: "Emojis & Unicode",
    text: "Hello 👋 world! 🌍 Tokenizers 🤖 handle emojis differently. 🎉🔥💯",
    insight: "Emojis often split into multiple tokens — each byte of the UTF-8 encoding can become a separate token.",
  },
  {
    label: "tokenization vs tokenizing",
    text: "tokenization tokenizing tokenize tokenized tokenizer",
    insight: "'tokenization' is often 1 token, but 'tokenizing' splits into 2 — token boundaries depend on training data frequency.",
  },
  {
    label: "Numbers & Math",
    text: "The answer is 1234567890. Pi ≈ 3.14159265358979323846. 2^32 = 4294967296.",
    insight: "Numbers are often split digit-by-digit or in small groups. Large numbers = many tokens!",
  },
  {
    label: "Code Snippet",
    text: `def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)`,
    insight: "Code tokenizes efficiently — keywords and common patterns are single tokens. Indentation whitespace matters!",
  },
  {
    label: "Whitespace Matters",
    text: "hello world\thello\tworld\nhello\nworld",
    insight: "Leading spaces are often part of the token — 'hello' and ' hello' are different tokens with different IDs!",
  },
  {
    label: "Multilingual Text",
    text: "Hello! こんにちは! مرحبا! Привет! 你好! 안녕하세요!",
    insight: "Non-Latin scripts use far more tokens per word — models see non-English text as many more tokens.",
  },
  {
    label: "Prompt Engineering",
    text: "You are a helpful assistant. Your task is to summarize the following text in 3 bullet points:\n\n",
    insight: "System prompts consume tokens too! This prompt alone uses ~30 tokens before you even add your content.",
  },
];
