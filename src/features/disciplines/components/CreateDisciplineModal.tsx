'use client';

import { useState } from 'react';
import { Layers, FlaskConical, Star } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import type { Discipline } from '../models/disciplineModel';
import type { FormulaEntry } from '@/features/settings/models/formulaModel';

const PRESET_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
  '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#3b82f6', '#06b6d4',
];

const NO_FORMULA = '__none__';

type Props = {
  formulas: FormulaEntry[];
  discipline?: Discipline;
  onSave: (d: Omit<Discipline, 'id'> | Discipline) => Promise<void>;
  onClose: () => void;
};

export function CreateDisciplineModal({ formulas, discipline, onSave, onClose }: Props) {
  const primaryFormula = formulas.find(f => f.isPrimary);
  const isEditing = discipline !== undefined;

  const [name, setName] = useState(discipline?.name ?? '');
  const [code, setCode] = useState(discipline?.code ?? '');
  const [description, setDescription] = useState(discipline?.description ?? '');
  const [color, setColor] = useState(discipline?.color ?? PRESET_COLORS[0]);
  const [formulaId, setFormulaId] = useState<number | undefined>(
    discipline?.formulaId ?? primaryFormula?.id,
  );
  const [saving, setSaving] = useState(false);

  const isValid = name.trim().length > 0 && code.trim().length > 0;
  const selectedFormula = formulas.find(f => f.id === formulaId);

  function handleFormulaChange(value: string) {
    setFormulaId(value === NO_FORMULA ? undefined : Number(value));
  }

  async function handleSave() {
    if (!isValid) return;
    setSaving(true);
    const data = {
      name: name.trim(),
      code: code.trim().toUpperCase(),
      description: description.trim(),
      color,
      teacherCount: discipline?.teacherCount ?? 0,
      classes: discipline?.classes ?? 0,
      formulaId,
      topics: discipline?.topics ?? [],
    };
    await onSave(isEditing ? { ...data, id: discipline.id } : data);
    setSaving(false);
    onClose();
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className='max-w-sm sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Layers size={16} className='text-primary' />
            {isEditing ? 'Editar Disciplina' : 'Nova Disciplina'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Atualize os dados da disciplina.'
              : 'Preencha os dados para cadastrar uma nova disciplina.'}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
            <div className='sm:col-span-2'>
              <label className='text-sm font-medium block mb-1'>
                Nome <span className='text-danger'>*</span>
              </label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder='Ex: Matemática'
                className='w-full h-9 px-3 text-sm border border-border bg-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary'
              />
            </div>

            <div>
              <label className='text-sm font-medium block mb-1'>
                Código <span className='text-danger'>*</span>
              </label>
              <input
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder='Ex: MAT101'
                className='w-full h-9 px-3 text-sm border border-border bg-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary uppercase'
              />
            </div>

            <div>
              <label className='text-sm font-medium block mb-1'>Cor</label>
              <div className='flex items-center gap-2 h-9'>
                <div
                  className='w-6 h-6 rounded-md border border-border shrink-0'
                  style={{ backgroundColor: color }}
                />
                <div className='flex gap-1 flex-wrap'>
                  {PRESET_COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-5 h-5 rounded-md transition-transform ${color === c ? 'scale-125 ring-2 ring-offset-1 ring-border' : 'hover:scale-110'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className='text-sm font-medium block mb-1'>Descrição</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder='Descreva brevemente a disciplina...'
              rows={3}
              className='w-full px-3 py-2 text-sm border border-border bg-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary resize-none'
            />
          </div>

          {/* Formula selector */}
          <div>
            <label className='text-sm font-medium flex items-center gap-1.5 mb-1'>
              <FlaskConical size={14} className='text-muted-foreground' />
              Fórmula de Aprovação
            </label>
            {formulas.length === 0 ? (
              <p className='text-xs text-muted-foreground py-1'>
                Nenhuma fórmula cadastrada. Configure em Configurações → Fórmulas.
              </p>
            ) : (
              <>
                <Select
                  value={formulaId !== undefined ? String(formulaId) : NO_FORMULA}
                  onValueChange={handleFormulaChange}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Selecionar fórmula...' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NO_FORMULA}>Nenhuma</SelectItem>
                    {formulas.map(f => (
                      <SelectItem key={f.id} value={String(f.id)}>
                        <span className='flex items-center gap-1.5'>
                          {f.isPrimary && <Star size={11} className='fill-primary text-primary shrink-0' />}
                          {f.description}
                          {f.isPrimary && (
                            <span className='text-xs text-muted-foreground'>(Principal)</span>
                          )}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedFormula && (
                  <div className='mt-2 px-3 py-2 rounded-lg bg-muted/50 border border-border'>
                    <p className='text-xs text-muted-foreground mb-0.5'>Fórmula selecionada:</p>
                    <p className='text-xs font-mono text-foreground'>{selectedFormula.formula}</p>
                  </div>
                )}
              </>
            )}
          </div>

          <div
            className='flex items-center gap-3 p-3 rounded-xl border border-border'
            style={{ backgroundColor: `${color}10` }}
          >
            <div
              className='w-9 h-9 rounded-lg flex items-center justify-center shrink-0'
              style={{ backgroundColor: `${color}25` }}
            >
              <Layers size={18} style={{ color }} />
            </div>
            <div className='min-w-0'>
              <p className='text-sm font-semibold text-foreground truncate'>
                {name || 'Nome da disciplina'}
              </p>
              <p className='text-xs text-muted-foreground'>
                {code ? code.toUpperCase() : 'CÓDIGO'}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <button
            onClick={onClose}
            className='px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors'
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !isValid}
            className='px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors'
          >
            {saving ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Cadastrar Disciplina'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
