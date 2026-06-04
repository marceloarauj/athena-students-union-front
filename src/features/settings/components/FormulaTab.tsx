'use client';

import { useState } from 'react';
import { Plus, Trash2, Star, Pencil, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FormulaBuilder } from './FormulaBuilder';
import type { FormulaEntry, FormulaToken, FormulaVariable } from '../models/formulaModel';
import { InfoHint } from '@/components/ui/info-hint';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';

interface Props {
  formulas: FormulaEntry[];
  variables: FormulaVariable[];
  loading: boolean;
  onSaveFormula: (f: Omit<FormulaEntry, 'id'> | FormulaEntry) => Promise<FormulaEntry>;
  onDeleteFormula: (id: number) => Promise<void>;
  onSetPrimary: (id: number) => Promise<void>;
  onSaveVariables: (vars: FormulaVariable[]) => Promise<void>;
}

type FormulaDraft = {
  id?: number;
  description: string;
  tokens: FormulaToken[];
  formula: string;
  isPrimary: boolean;
};

export function FormulaTab({
  formulas, variables, loading,
  onSaveFormula, onDeleteFormula, onSetPrimary, onSaveVariables,
}: Props) {
  const [editing, setEditing] = useState<FormulaDraft | null>(null);
  const [varMode, setVarMode] = useState(false);
  const [localVars, setLocalVars] = useState<FormulaVariable[]>([]);
  const [newVarKey, setNewVarKey] = useState('');
  const [newVarLabel, setNewVarLabel] = useState('');
  const [savingFormula, setSavingFormula] = useState(false);

  function startNewFormula() {
    setEditing({ description: '', tokens: [], formula: '', isPrimary: formulas.length === 0 });
  }

  function startEditFormula(f: FormulaEntry) {
    setEditing({ id: f.id, description: f.description, tokens: [...f.tokens], formula: f.formula, isPrimary: f.isPrimary });
  }

  async function handleSaveFormula() {
    if (!editing || !editing.description.trim() || !editing.formula.trim()) return;
    setSavingFormula(true);
    try {
      if (editing.id !== undefined) {
        await onSaveFormula({ id: editing.id, description: editing.description, tokens: editing.tokens, formula: editing.formula, isPrimary: editing.isPrimary });
      } else {
        await onSaveFormula({ description: editing.description, tokens: editing.tokens, formula: editing.formula, isPrimary: editing.isPrimary });
      }
      setEditing(null);
    } finally {
      setSavingFormula(false);
    }
  }

  function startEditVars() {
    setLocalVars([...variables]);
    setNewVarKey('');
    setNewVarLabel('');
    setVarMode(true);
  }

  function addVar() {
    const key = newVarKey.trim().toUpperCase();
    const label = newVarLabel.trim();
    if (!key || !label || localVars.find(v => v.key === key)) return;
    setLocalVars(prev => [...prev, { key, label }]);
    setNewVarKey('');
    setNewVarLabel('');
  }

  function removeVar(key: string) {
    setLocalVars(prev => prev.filter(v => v.key !== key));
  }

  async function handleSaveVars() {
    await onSaveVariables(localVars);
    setVarMode(false);
  }

  const canSave = !!(editing?.description.trim() && editing?.formula.trim());

  return (
    <div className='space-y-6'>
      {/* Variables */}
      <div className='border border-border rounded-xl p-4 space-y-4'>
        <div className='flex items-start justify-between gap-4'>
          <div>
            <p className='text-sm font-semibold flex items-center gap-1.5'>
              Variáveis
              <InfoHint text='Variáveis representam notas, frequência ou outros valores dinâmicos usados nas fórmulas.' />
            </p>
            <p className='text-xs text-muted-foreground mt-0.5'>
              Defina os valores disponíveis para montar as fórmulas de aprovação.
            </p>
          </div>
          {!varMode && (
            <button
              onClick={startEditVars}
              className='flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg border border-border hover:bg-muted transition-colors shrink-0'
            >
              <Pencil size={12} /> Editar
            </button>
          )}
        </div>

        {varMode ? (
          <div className='space-y-3'>
            <div className='space-y-2'>
              {localVars.map(v => (
                <div key={v.key} className='flex items-center gap-3'>
                  <span className='font-mono text-sm font-bold w-16 text-primary shrink-0'>{v.key}</span>
                  <span className='text-sm text-foreground flex-1'>{v.label}</span>
                  <button
                    onClick={() => removeVar(v.key)}
                    className='p-1 rounded hover:text-danger hover:bg-muted transition-colors'
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
              {localVars.length === 0 && (
                <p className='text-xs text-muted-foreground'>Nenhuma variável. Adicione abaixo.</p>
              )}
            </div>
            <div className='flex gap-2 items-center pt-3 border-t border-border'>
              <input
                value={newVarKey}
                onChange={e => setNewVarKey(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addVar()}
                placeholder='Chave'
                maxLength={8}
                className='w-20 h-8 px-2 text-sm border border-border bg-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary font-mono uppercase'
              />
              <input
                value={newVarLabel}
                onChange={e => setNewVarLabel(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addVar()}
                placeholder='Ex: Nota 5ª Avaliação'
                className='flex-1 h-8 px-2 text-sm border border-border bg-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary'
              />
              <button
                onClick={addVar}
                disabled={!newVarKey.trim() || !newVarLabel.trim()}
                className='px-3 h-8 rounded-lg bg-primary/10 text-primary border border-primary/25 text-sm font-medium disabled:opacity-40 hover:bg-primary/20 transition-colors'
              >
                <Plus size={13} />
              </button>
            </div>
            <div className='flex gap-2 justify-end pt-1'>
              <button
                onClick={() => setVarMode(false)}
                className='px-3 py-1.5 text-sm rounded-lg border border-border hover:bg-muted transition-colors'
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveVars}
                className='flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors'
              >
                <Check size={13} /> Salvar
              </button>
            </div>
          </div>
        ) : (
          <div className='flex flex-wrap gap-2'>
            {loading ? (
              <p className='text-xs text-muted-foreground'>Carregando...</p>
            ) : variables.length === 0 ? (
              <p className='text-xs text-muted-foreground'>Nenhuma variável cadastrada.</p>
            ) : (
              variables.map(v => (
                <span
                  key={v.key}
                  className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/25 text-sm'
                >
                  <span className='font-mono font-bold tracking-tight'>{v.key}</span>
                  <span className='text-xs opacity-70'>{v.label}</span>
                </span>
              ))
            )}
          </div>
        )}
      </div>

      {/* Formulas list */}
      <div className='space-y-3'>
        <div className='flex items-start justify-between gap-4'>
          <div>
            <p className='text-sm font-semibold'>Fórmulas de Aprovação</p>
            <p className='text-xs text-muted-foreground mt-0.5'>
              A fórmula marcada como principal é sugerida por padrão nas disciplinas.
            </p>
          </div>
          <button
            onClick={startNewFormula}
            className='flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors shrink-0'
          >
            <Plus size={14} /> Nova Fórmula
          </button>
        </div>

        {loading ? (
          <p className='text-sm text-muted-foreground'>Carregando...</p>
        ) : formulas.length === 0 ? (
          <div className='py-10 text-center rounded-xl border border-dashed border-border text-muted-foreground text-sm'>
            Nenhuma fórmula cadastrada. Clique em "Nova Fórmula" para começar.
          </div>
        ) : (
          <div className='space-y-3'>
            {formulas.map(f => (
              <div
                key={f.id}
                className={cn(
                  'p-4 rounded-xl border transition-colors',
                  f.isPrimary ? 'border-primary/40 bg-primary/5' : 'border-border',
                )}
              >
                <div className='flex items-start justify-between gap-3'>
                  <div className='min-w-0 flex-1'>
                    <div className='flex items-center gap-2 mb-2 flex-wrap'>
                      {f.isPrimary && (
                        <span className='flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/25 font-medium whitespace-nowrap'>
                          <Star size={10} className='fill-primary' /> Principal
                        </span>
                      )}
                      <p className='text-sm font-semibold text-foreground'>{f.description}</p>
                    </div>
                    <p className='text-xs font-mono text-muted-foreground bg-muted/50 px-2.5 py-1.5 rounded-md border border-border break-all'>
                      {f.formula}
                    </p>
                  </div>
                  <div className='flex gap-0.5 shrink-0 mt-0.5'>
                    {!f.isPrimary && (
                      <button
                        onClick={() => onSetPrimary(f.id)}
                        title='Definir como principal'
                        className='p-1.5 rounded text-muted-foreground hover:text-primary hover:bg-muted transition-colors'
                      >
                        <Star size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => startEditFormula(f)}
                      className='p-1.5 rounded text-muted-foreground hover:text-primary hover:bg-muted transition-colors'
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => onDeleteFormula(f.id)}
                      className='p-1.5 rounded text-muted-foreground hover:text-danger hover:bg-muted transition-colors'
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Formula editor dialog */}
      {editing !== null && (
        <Dialog open onOpenChange={open => { if (!open) setEditing(null); }}>
          <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle>
                {editing.id !== undefined ? 'Editar Fórmula' : 'Nova Fórmula'}
              </DialogTitle>
            </DialogHeader>
            <div className='space-y-4'>
              <div>
                <label className='text-sm font-medium block mb-1'>
                  Título <span className='text-danger'>*</span>
                </label>
                <input
                  value={editing.description}
                  onChange={e => setEditing(prev => prev ? { ...prev, description: e.target.value } : prev)}
                  placeholder='Ex: Média Simples, Fórmula com Recuperação...'
                  className='w-full h-9 px-3 text-sm border border-border bg-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary'
                />
              </div>
              <div>
                <label className='text-sm font-medium block mb-2'>Fórmula</label>
                <FormulaBuilder
                  key={editing.id ?? 'new'}
                  variables={variables}
                  initialTokens={editing.tokens}
                  onChange={(formula, tokens) =>
                    setEditing(prev => prev ? { ...prev, formula, tokens } : prev)
                  }
                />
              </div>
            </div>
            <DialogFooter className='mt-2'>
              <button
                onClick={() => setEditing(null)}
                className='px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors'
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveFormula}
                disabled={savingFormula || !canSave}
                className='px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors'
              >
                {savingFormula ? 'Salvando...' : 'Salvar Fórmula'}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
