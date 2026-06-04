'use client';

import { useState } from 'react';
import { Delete, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FormulaToken, FormulaVariable } from '../models/formulaModel';
import { tokensToFormula } from '../models/formulaModel';

interface Props {
  variables: FormulaVariable[];
  loading?: boolean;
  initialTokens?: FormulaToken[];
  onChange?: (formula: string, tokens: FormulaToken[]) => void;
}

const OPERATORS: { value: '+' | '-' | '*' | '/'; display: string }[] = [
  { value: '+', display: '+' },
  { value: '-', display: '−' },
  { value: '*', display: '×' },
  { value: '/', display: '÷' },
];

const COMPARISONS: { value: '>=' | '<=' | '>' | '<' | '='; display: string }[] = [
  { value: '>=', display: '≥' },
  { value: '<=', display: '≤' },
  { value: '>', display: '>' },
  { value: '<', display: '<' },
  { value: '=', display: '=' },
];

export function FormulaBuilder({ variables, loading, initialTokens, onChange }: Props) {
  const [tokens, setTokens] = useState<FormulaToken[]>(initialTokens ?? []);
  const [numberInput, setNumberInput] = useState('');

  function push(token: FormulaToken) {
    const next = [...tokens, token];
    setTokens(next);
    onChange?.(tokensToFormula(next), next);
  }

  function removeLast() {
    if (tokens.length === 0) return;
    const next = tokens.slice(0, -1);
    setTokens(next);
    onChange?.(tokensToFormula(next), next);
  }

  function clearAll() {
    setTokens([]);
    setNumberInput('');
    onChange?.('', []);
  }

  function insertNumber() {
    const trimmed = numberInput.trim();
    if (!trimmed || isNaN(Number(trimmed))) return;
    push({ type: 'number', value: trimmed });
    setNumberInput('');
  }

  const formula = tokensToFormula(tokens);

  return (
    <div className='space-y-4'>
      {/* Formula display */}
      <div
        className={cn(
          'min-h-12 px-3 py-2.5 rounded-lg border bg-muted/30 flex flex-wrap gap-1.5 items-center overflow-x-auto',
          tokens.length === 0 ? 'border-border' : 'border-primary/30',
        )}
      >
        {tokens.length === 0 ? (
          <span className='text-sm text-muted-foreground select-none'>
            Sua fórmula aparecerá aqui...
          </span>
        ) : (
          tokens.map((token, i) => <TokenChip key={i} token={token} />)
        )}
      </div>

      {/* Raw formula string (read-only feedback) */}
      {formula && (
        <p className='text-xs text-muted-foreground font-mono bg-muted/40 rounded px-2.5 py-1.5 border border-border truncate'>
          {formula}
        </p>
      )}

      {/* Variables */}
      <div>
        <SectionLabel>Variáveis</SectionLabel>
        {loading ? (
          <p className='text-xs text-muted-foreground'>Carregando variáveis...</p>
        ) : (
          <div className='flex flex-wrap gap-2'>
            {variables.map(v => (
              <button
                key={v.key}
                onClick={() => push({ type: 'variable', key: v.key, label: v.label })}
                className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/25 text-sm hover:bg-primary/20 transition-colors'
              >
                <span className='font-mono font-bold tracking-tight'>{v.key}</span>
                <span className='text-xs opacity-70'>{v.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Operators and Comparisons */}
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <SectionLabel>Operadores</SectionLabel>
          <div className='flex gap-1.5'>
            {OPERATORS.map(op => (
              <CalcButton
                key={op.value}
                onClick={() => push({ type: 'operator', value: op.value })}
              >
                {op.display}
              </CalcButton>
            ))}
          </div>
        </div>

        <div>
          <SectionLabel>Parênteses</SectionLabel>
          <div className='flex gap-1.5'>
            {(['(', ')'] as const).map(p => (
              <CalcButton
                key={p}
                onClick={() => push({ type: 'paren', value: p })}
              >
                {p}
              </CalcButton>
            ))}
          </div>
        </div>
      </div>

      <div>
        <SectionLabel>Comparação</SectionLabel>
        <div className='flex gap-1.5 flex-wrap'>
          {COMPARISONS.map(c => (
            <CalcButton
              key={c.value}
              onClick={() => push({ type: 'comparison', value: c.value })}
              variant='comparison'
            >
              {c.display}
            </CalcButton>
          ))}
        </div>
      </div>

      {/* Number input */}
      <div>
        <SectionLabel>Inserir Número</SectionLabel>
        <div className='flex gap-2'>
          <input
            type='number'
            value={numberInput}
            onChange={e => setNumberInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && insertNumber()}
            placeholder='Ex: 5, 7.5, 10...'
            className='flex-1 h-9 px-3 text-sm border border-border bg-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary font-mono'
          />
          <button
            onClick={insertNumber}
            disabled={!numberInput.trim() || isNaN(Number(numberInput.trim()))}
            className='px-4 h-9 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
          >
            Inserir
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className='flex justify-between pt-1'>
        <button
          onClick={removeLast}
          disabled={tokens.length === 0}
          className='flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
        >
          <Delete size={14} />
          Apagar último
        </button>
        <button
          onClick={clearAll}
          disabled={tokens.length === 0}
          className='flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-danger hover:border-danger/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
        >
          <X size={14} />
          Limpar tudo
        </button>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2'>
      {children}
    </p>
  );
}

function CalcButton({
  children,
  onClick,
  variant = 'default',
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'comparison';
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-3 py-2 rounded-lg border text-sm font-mono font-semibold transition-colors',
        variant === 'comparison'
          ? 'border-border bg-input hover:bg-muted hover:text-primary'
          : 'border-border bg-input hover:bg-muted',
      )}
    >
      {children}
    </button>
  );
}

const OPERATOR_DISPLAY: Record<string, string> = {
  '+': '+', '-': '−', '*': '×', '/': '÷',
};
const COMPARISON_DISPLAY: Record<string, string> = {
  '>=': '≥', '<=': '≤', '>': '>', '<': '<', '=': '=',
};

function TokenChip({ token }: { token: FormulaToken }) {
  if (token.type === 'variable') {
    return (
      <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/15 text-primary border border-primary/20 text-sm font-mono font-bold'>
        {token.key}
      </span>
    );
  }
  if (token.type === 'number') {
    return (
      <span className='px-1.5 py-0.5 text-sm font-mono font-semibold text-foreground'>
        {token.value}
      </span>
    );
  }
  if (token.type === 'operator') {
    return (
      <span className='px-1.5 py-0.5 text-sm font-mono text-muted-foreground font-bold'>
        {OPERATOR_DISPLAY[token.value] ?? token.value}
      </span>
    );
  }
  if (token.type === 'comparison') {
    return (
      <span className='px-2 py-0.5 rounded-md bg-secondary/15 text-secondary border border-secondary/20 text-sm font-mono font-bold'>
        {COMPARISON_DISPLAY[token.value] ?? token.value}
      </span>
    );
  }
  // paren
  return (
    <span className='px-0.5 py-0.5 text-sm font-mono text-muted-foreground font-bold'>
      {token.value}
    </span>
  );
}
