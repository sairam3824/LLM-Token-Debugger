"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  tokenize,
  getStats,
  TOKENIZER_CONFIGS,
  MODELS_BY_PROVIDER,
  PROVIDER_ORDER,
  PROVIDERS,
  TokenizerName,
  TokenInfo,
  Provider,
} from "@/lib/tokenizers";
import { EXAMPLES } from "@/lib/examples";

// ──────────────────────────────────────────────────────────────────
// Token chip
// ──────────────────────────────────────────────────────────────────

const TOKEN_COLORS = [
  "bg-blue-500/20 border-blue-500/40 text-blue-200",
  "bg-purple-500/20 border-purple-500/40 text-purple-200",
  "bg-emerald-500/20 border-emerald-500/40 text-emerald-200",
  "bg-amber-500/20 border-amber-500/40 text-amber-200",
  "bg-rose-500/20 border-rose-500/40 text-rose-200",
  "bg-cyan-500/20 border-cyan-500/40 text-cyan-200",
  "bg-violet-500/20 border-violet-500/40 text-violet-200",
  "bg-lime-500/20 border-lime-500/40 text-lime-200",
];

function TokenChip({ token, colorIndex }: { token: TokenInfo; colorIndex: number }) {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const [pos, setPos] = useState<"top" | "bottom">("top");

  const colorClass = token.isSpecial
    ? "bg-yellow-500/20 border-yellow-400/50 text-yellow-300"
    : token.isWhitespace
    ? "bg-zinc-600/30 border-zinc-500/30 text-zinc-400"
    : token.isContinuation
    ? `${TOKEN_COLORS[colorIndex % TOKEN_COLORS.length]} opacity-70`
    : TOKEN_COLORS[colorIndex % TOKEN_COLORS.length];

  const rawDisplay = token.isWhitespace
    ? token.text.replace(/ /g, "·").replace(/\t/g, "→").replace(/\n/g, "↵")
    : token.text;

  return (
    <span className="relative inline-block" ref={ref}>
      <span
        className={`inline-block border rounded px-0.5 py-px text-sm font-mono cursor-default select-text leading-relaxed whitespace-pre ${colorClass}`}
        onMouseEnter={() => {
          if (ref.current) setPos(ref.current.getBoundingClientRect().top < 140 ? "bottom" : "top");
          setShow(true);
        }}
        onMouseLeave={() => setShow(false)}
      >
        {rawDisplay}
      </span>
      {show && (
        <span className={`absolute z-50 ${pos === "top" ? "bottom-full mb-1" : "top-full mt-1"} left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-xs font-mono whitespace-nowrap shadow-xl pointer-events-none min-w-max`}>
          <div className="text-zinc-400 mb-1">Token #{token.id}</div>
          <div className="mb-1">
            <span className="text-zinc-500">str: </span>
            <span className="text-emerald-400">{JSON.stringify(token.text)}</span>
          </div>
          <div className="mb-1">
            <span className="text-zinc-500">bytes: </span>
            <span className="text-amber-400">
              [{token.bytes.map((b) => `0x${b.toString(16).padStart(2, "0")}`).join(", ")}]
            </span>
          </div>
          <div>
            <span className="text-zinc-500">len: </span>
            <span className="text-blue-400">{token.bytes.length}b</span>
          </div>
          {token.isWhitespace && <div className="text-zinc-500 mt-1">whitespace</div>}
          {token.isSpecial && <div className="text-yellow-400 mt-1">special token</div>}
          {token.isContinuation && <div className="text-purple-400 mt-1">## continuation (WordPiece)</div>}
        </span>
      )}
    </span>
  );
}

function TokenDisplay({ tokens }: { tokens: TokenInfo[] }) {
  if (tokens.length === 0) {
    return <div className="text-zinc-600 text-sm font-mono text-center py-10">enter text above to see tokens</div>;
  }
  let colorIdx = 0;
  return (
    <div className="leading-loose break-all">
      {tokens.map((token, i) => {
        // advance color on each new non-whitespace, non-continuation token
        if (i > 0 && !token.isWhitespace && !token.isSpecial && !token.isContinuation) {
          colorIdx = (colorIdx + 1) % TOKEN_COLORS.length;
        }
        return <TokenChip key={i} token={token} colorIndex={colorIdx} />;
      })}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// Stats
// ──────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, warn }: { label: string; value: string | number; sub?: string; warn?: boolean }) {
  return (
    <div className={`border rounded-lg p-3 ${warn ? "bg-red-950/30 border-red-800/50" : "bg-zinc-900 border-zinc-800"}`}>
      <div className="text-zinc-500 text-xs uppercase tracking-wider mb-1">{label}</div>
      <div className={`text-xl font-mono font-semibold ${warn ? "text-red-400" : "text-white"}`}>{value}</div>
      {sub && <div className="text-zinc-600 text-xs mt-0.5">{sub}</div>}
    </div>
  );
}

function StatsPanel({ tokens, text, name }: { tokens: TokenInfo[]; text: string; name: TokenizerName }) {
  if (!text) return null;
  const stats = getStats(tokens, text, name);
  const cfg = TOKENIZER_CONFIGS[name];

  const ctxLabel = cfg.contextWindow >= 1_000_000
    ? `of ${(cfg.contextWindow / 1_000_000).toFixed(0)}M ctx`
    : cfg.contextWindow >= 1000
    ? `of ${(cfg.contextWindow / 1000).toFixed(0)}k ctx`
    : `of ${cfg.contextWindow} ctx`;

  return (
    <div className="space-y-2 mt-4">
      {stats.overLimit && (
        <div className="bg-red-950/40 border border-red-800/50 rounded-lg px-3 py-2 text-xs text-red-400 font-medium">
          ⚠ Exceeds {cfg.label} context window ({cfg.contextWindow.toLocaleString()} tokens)
          {cfg.isEmbedding ? " — text will be truncated before embedding" : ""}
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <StatCard label="Tokens" value={stats.total.toLocaleString()} warn={stats.overLimit} />
        <StatCard label="Unique" value={stats.unique.toLocaleString()} />
        <StatCard label="Chars / Token" value={stats.charsPerToken} sub={`${text.length} chars`} />
        <StatCard label="Context Used" value={`${stats.contextPct}%`} sub={ctxLabel} warn={stats.overLimit} />
        <StatCard
          label={cfg.isEmbedding ? "Embed Cost" : "Input Cost"}
          value={cfg.inputPricePerM === 0 ? "free" : `$${stats.inputCost}`}
          sub={cfg.inputPricePerM === 0 ? "open-source" : `$${cfg.inputPricePerM}/M`}
        />
        {cfg.isEmbedding && cfg.dims ? (
          <StatCard label="Dimensions" value={cfg.dims.toLocaleString()} sub="output vector size" />
        ) : (
          <StatCard
            label="Output Cost"
            value={cfg.outputPricePerM === 0 ? "free" : `$${stats.outputCost}`}
            sub={cfg.outputPricePerM === 0 ? "" : `$${cfg.outputPricePerM}/M`}
          />
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// Model selector
// ──────────────────────────────────────────────────────────────────

const ENGINE_LABELS: Record<string, string> = {
  cl100k: "cl100k", o200k: "o200k", p50k: "p50k", r50k: "r50k",
  sentencepiece: "SentencePiece", bpe: "BPE", wordpiece: "WordPiece",
};

function ModelSelector({ value, onChange, label }: {
  value: TokenizerName;
  onChange: (v: TokenizerName) => void;
  label: string;
}) {
  const currentProvider = TOKENIZER_CONFIGS[value].provider;
  const [tab, setTab] = useState<Provider>(currentProvider);

  return (
    <div>
      <div className="text-xs text-zinc-500 uppercase tracking-wider mb-3">{label}</div>

      {/* Provider tabs */}
      <div className="flex flex-wrap gap-1 mb-3">
        {PROVIDER_ORDER.map((p) => {
          const count = MODELS_BY_PROVIDER[p].length;
          return (
            <button
              key={p}
              onClick={() => setTab(p)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                tab === p
                  ? "bg-zinc-700 text-white border border-zinc-600"
                  : "text-zinc-500 border border-transparent hover:text-zinc-300 hover:border-zinc-700"
              }`}
            >
              {PROVIDERS[p].label}
              <span className="ml-1 text-zinc-600 font-normal">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Model grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {MODELS_BY_PROVIDER[tab].map((name) => {
          const cfg = TOKENIZER_CONFIGS[name];
          const isSelected = value === name;
          return (
            <button
              key={name}
              onClick={() => onChange(name)}
              className={`p-2.5 rounded-lg border text-left transition-all ${
                isSelected
                  ? "bg-zinc-800 border-zinc-500 text-white"
                  : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300"
              }`}
            >
              <div className="flex items-start justify-between gap-1">
                <div className="text-xs font-semibold leading-tight truncate flex-1">{cfg.label}</div>
                {cfg.isEmbedding && (
                  <span className="text-[9px] px-1 rounded bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 shrink-0 mt-px">embed</span>
                )}
              </div>
              <div className="flex items-center gap-1 mt-1 flex-wrap">
                <span className={`text-[10px] font-mono px-1 py-px rounded ${
                  cfg.accuracy === "exact"
                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                    : "bg-zinc-700/50 text-zinc-500 border border-zinc-700"
                }`}>
                  {cfg.accuracy === "exact" ? "exact" : "~approx"}
                </span>
                <span className="text-[10px] text-zinc-600 font-mono truncate">
                  {ENGINE_LABELS[cfg.engine] ?? cfg.engine}
                </span>
              </div>
              <div className="text-zinc-600 text-[10px] mt-1 leading-tight">
                {cfg.contextWindow >= 1_000_000
                  ? `${(cfg.contextWindow / 1_000_000).toFixed(cfg.contextWindow % 1_000_000 === 0 ? 0 : 1)}M ctx`
                  : `${(cfg.contextWindow / 1000).toFixed(0)}k ctx`}
                {cfg.inputPricePerM > 0
                  ? ` · $${cfg.inputPricePerM}/M`
                  : cfg.isEmbedding ? " · free" : " · open-source"}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// Main page
// ──────────────────────────────────────────────────────────────────

const totalModels = Object.values(MODELS_BY_PROVIDER).flat().length;

export default function Home() {
  const [text, setText] = useState("");
  const [modelA, setModelA] = useState<TokenizerName>("gpt4o");
  const [modelB, setModelB] = useState<TokenizerName>("minilm_l6_v2");
  const [compareMode, setCompareMode] = useState(false);
  const [tokensA, setTokensA] = useState<TokenInfo[]>([]);
  const [tokensB, setTokensB] = useState<TokenInfo[]>([]);
  const [loadingA, setLoadingA] = useState(false);
  const [loadingB, setLoadingB] = useState(false);
  const [activeExample, setActiveExample] = useState<number | null>(null);

  const run = useCallback(
    async (t: string, name: TokenizerName, set: (v: TokenInfo[]) => void, setL: (v: boolean) => void) => {
      if (!t) { set([]); return; }
      setL(true);
      try { set(await tokenize(t, name)); } finally { setL(false); }
    }, []
  );

  useEffect(() => {
    const t = setTimeout(() => run(text, modelA, setTokensA, setLoadingA), 200);
    return () => clearTimeout(t);
  }, [text, modelA, run]);

  useEffect(() => {
    if (!compareMode) return;
    const t = setTimeout(() => run(text, modelB, setTokensB, setLoadingB), 200);
    return () => clearTimeout(t);
  }, [text, modelB, compareMode, run]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800/60 px-4 py-3 sticky top-0 bg-zinc-950/90 backdrop-blur z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-white tracking-tight font-mono">llm-token-debugger</h1>
            <p className="text-zinc-500 text-xs mt-0.5">{totalModels} models · chat + embedding · hover tokens for details</p>
          </div>
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
              compareMode
                ? "bg-blue-600/20 border-blue-500/40 text-blue-300"
                : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
            }`}
          >
            {compareMode ? "Compare ON" : "Compare"}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Examples */}
        <div>
          <div className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Try an example</div>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex, i) => (
              <button
                key={i}
                onClick={() => { setActiveExample(i); setText(EXAMPLES[i].text); }}
                className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                  activeExample === i
                    ? "bg-zinc-700 border-zinc-600 text-white"
                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300"
                }`}
              >
                {ex.label}
              </button>
            ))}
          </div>
          {activeExample !== null && (
            <p className="text-zinc-500 text-xs mt-2 italic border-l-2 border-zinc-800 pl-3">
              {EXAMPLES[activeExample].insight}
            </p>
          )}
        </div>

        {/* Text input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-zinc-500 uppercase tracking-wider">Input Text</label>
            {text && (
              <button onClick={() => { setText(""); setActiveExample(null); }} className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
                Clear
              </button>
            )}
          </div>
          <textarea
            value={text}
            onChange={(e) => { setText(e.target.value); setActiveExample(null); }}
            placeholder="Paste your prompt, text to embed, or code here..."
            className="w-full h-36 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm font-mono text-zinc-100 placeholder-zinc-700 resize-y focus:outline-none focus:border-zinc-600 transition-colors"
          />
        </div>

        {/* Tokenizer panels */}
        <div className={`grid gap-8 ${compareMode ? "xl:grid-cols-2" : "grid-cols-1"}`}>
          <div className="space-y-4">
            <ModelSelector value={modelA} onChange={setModelA} label={compareMode ? "Model A" : "Model"} />
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 min-h-28">
              {loadingA
                ? <div className="text-zinc-600 text-xs font-mono animate-pulse">tokenizing…</div>
                : <TokenDisplay tokens={tokensA} />}
            </div>
            <StatsPanel tokens={tokensA} text={text} name={modelA} />
          </div>

          {compareMode && (
            <div className="space-y-4">
              <ModelSelector value={modelB} onChange={setModelB} label="Model B" />
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 min-h-28">
                {loadingB
                  ? <div className="text-zinc-600 text-xs font-mono animate-pulse">tokenizing…</div>
                  : <TokenDisplay tokens={tokensB} />}
              </div>
              <StatsPanel tokens={tokensB} text={text} name={modelB} />
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="border-t border-zinc-900 pt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-zinc-500">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded bg-blue-500/20 border border-blue-500/40" />
            alternating BPE token colors
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded bg-zinc-600/30 border border-zinc-500/30" />
            whitespace (·space ↵newline →tab)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded bg-yellow-500/20 border border-yellow-400/50" />
            special tokens
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono px-1 rounded border text-purple-300 border-purple-500/30 bg-purple-500/10">##cont</span>
            WordPiece continuation subword
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono px-1 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">exact</span>
            real tokenizer output
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono px-1 rounded bg-zinc-700/50 text-zinc-500 border border-zinc-700">~approx</span>
            modeled approximation
          </div>
          <div className="ml-auto text-zinc-700">hover any token for details</div>
        </div>
      </main>

      <footer className="border-t border-zinc-900 px-4 py-4 mt-8">
        <div className="max-w-6xl mx-auto text-xs text-zinc-700 flex items-center justify-between flex-wrap gap-2">
          <span>OpenAI models exact via <code className="text-zinc-600">gpt-tokenizer</code> · HuggingFace/others approximated</span>
          <span>100% client-side · no data leaves your browser</span>
        </div>
      </footer>
    </div>
  );
}
