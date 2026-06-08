'use client';

import { useState, useRef } from 'react';
import { BookOpen, Plus, X, GripVertical } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import type { Discipline, DisciplineTopic } from '../models/disciplineModel';

type Props = {
  discipline: Discipline;
  onSave: (d: Discipline) => Promise<void>;
  onClose: () => void;
};

export function DisciplineTopicsModal({ discipline, onSave, onClose }: Props) {
  const [topics, setTopics] = useState<DisciplineTopic[]>(discipline.topics ?? []);
  const [input, setInput] = useState('');
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function addTopic() {
    const title = input.trim();
    if (!title) return;
    const nextId = topics.length > 0 ? Math.max(...topics.map(t => t.id)) + 1 : 1;
    setTopics(prev => [...prev, { id: nextId, title }]);
    setInput('');
    inputRef.current?.focus();
  }

  function removeTopic(id: number) {
    setTopics(prev => prev.filter(t => t.id !== id));
  }

  async function handleSave() {
    setSaving(true);
    await onSave({ ...discipline, topics });
    setSaving(false);
    onClose();
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className='max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <BookOpen size={16} className='text-primary' />
            Tópicos Lecionados
          </DialogTitle>
          <DialogDescription>
            Tópicos da disciplina{' '}
            <span className='font-medium text-foreground'>{discipline.name}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          {/* Input */}
          <div className='flex gap-2'>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTopic())}
              placeholder='Ex: Funções e gráficos...'
              className='flex-1 h-9 px-3 text-sm border border-border bg-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary'
            />
            <button
              onClick={addTopic}
              disabled={!input.trim()}
              className='flex items-center gap-1 px-3 h-9 rounded-lg bg-primary/10 text-primary border border-primary/25 text-sm font-medium disabled:opacity-40 hover:bg-primary/20 transition-colors whitespace-nowrap'
            >
              <Plus size={14} /> Adicionar
            </button>
          </div>

          {/* List */}
          {topics.length > 0 ? (
            <ol className='space-y-1.5'>
              {topics.map((topic, index) => (
                <li
                  key={topic.id}
                  className='flex items-center gap-2 px-3 py-2.5 rounded-lg bg-muted/40 border border-border group'
                >
                  <GripVertical size={13} className='text-muted-foreground/40 shrink-0' />
                  <span className='text-xs text-muted-foreground font-mono w-5 shrink-0 text-right'>
                    {index + 1}.
                  </span>
                  <span className='text-sm text-foreground flex-1'>{topic.title}</span>
                  <button
                    onClick={() => removeTopic(topic.id)}
                    className='p-0.5 rounded text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-danger transition-all shrink-0'
                  >
                    <X size={13} />
                  </button>
                </li>
              ))}
            </ol>
          ) : (
            <div className='py-8 text-center rounded-xl border border-dashed border-border text-muted-foreground text-sm'>
              Nenhum tópico cadastrado ainda.
              <br />
              <span className='text-xs'>Digite acima e pressione Enter para adicionar.</span>
            </div>
          )}

          {topics.length > 0 && (
            <p className='text-xs text-muted-foreground text-right'>
              {topics.length} tópico(s) cadastrado(s)
            </p>
          )}
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
            disabled={saving}
            className='px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors'
          >
            {saving ? 'Salvando...' : 'Salvar Tópicos'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
