export type FormulaVariable = {
  key: string;
  label: string;
};

export type FormulaToken =
  | { type: 'variable'; key: string; label: string }
  | { type: 'number'; value: string }
  | { type: 'operator'; value: '+' | '-' | '*' | '/' }
  | { type: 'comparison'; value: '>=' | '<=' | '>' | '<' | '=' }
  | { type: 'paren'; value: '(' | ')' };

export type FormulaEntry = {
  id: number;
  description: string;
  tokens: FormulaToken[];
  formula: string;
  isPrimary: boolean;
};

export function tokensToFormula(tokens: FormulaToken[]): string {
  return tokens
    .map(t => {
      if (t.type === 'variable') return t.key;
      if (t.type === 'paren') return t.value;
      return t.value;
    })
    .join(' ');
}
