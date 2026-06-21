'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Plus, GripVertical, Trash2, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  ReportCardLayoutConfig,
  ReportCardLayoutComponent,
  ReportCardComponentType,
} from '../models/reportCardLayoutModel';

const CANVAS_SCALE = 0.65;
const CANVAS_W = 595;
const CANVAS_H = 842;

interface ReportCardLayoutEditorProps {
  initialConfig: ReportCardLayoutConfig;
  onSave: (config: ReportCardLayoutConfig) => Promise<void>;
  onClose: () => void;
}

const COMPONENT_LABELS: Record<ReportCardComponentType, string> = {
  logo: 'Logotipo',
  institution_name: 'Nome da Instituição',
  student_name: 'Nome do Aluno',
  class_info: 'Informações da Turma',
  grades_table: 'Tabela de Notas',
  responsible_name: 'Nome do Responsável',
  phone_number: 'Telefone',
  custom_text: 'Texto Personalizado',
};

const COMPONENT_TYPES = Object.keys(COMPONENT_LABELS) as ReportCardComponentType[];

function getComponentContent(component: ReportCardLayoutComponent) {
  switch (component.type) {
    case 'logo':
      return (
        <div className='border border-border rounded p-1 inline-flex'>
          <img src='/images/logo.png' alt='Logo' width={48} height={48} className='object-contain' />
        </div>
      );
    case 'institution_name':
      return <span>Nome da Instituição</span>;
    case 'student_name':
      return <span>Nome do Aluno: João Silva</span>;
    case 'class_info':
      return <span>Turma: 3º Ano A • Turno: Manhã</span>;
    case 'grades_table':
      return (
        <table className='text-xs border-collapse' style={{ fontSize: 'inherit' }}>
          <thead>
            <tr>
              {['Disciplina', 'B1', 'B2', 'Média'].map(h => (
                <th key={h} className='border border-current px-1.5 py-0.5 font-semibold'>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[['Matemática', '8.0', '7.5', '7.8'], ['Português', '9.0', '8.5', '8.8'], ['Ciências', '7.0', '8.0', '7.5']].map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} className='border border-current px-1.5 py-0.5'>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    case 'responsible_name':
      return <span>Responsável: Maria Silva</span>;
    case 'phone_number':
      return <span>(11) 99999-9999</span>;
    case 'custom_text':
      return <span>{component.content}</span>;
  }
}

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

// --- DraggableItem ---
// Uses native mouse events with scale compensation so saved positions
// match the 595×842 canvas coordinate space and render correctly in the PDF.

interface DraggableItemProps {
  component: ReportCardLayoutComponent;
  isSelected: boolean;
  onSelect: () => void;
  onMove: (x: number, y: number) => void;
}

function DraggableItem({ component, isSelected, onSelect, onMove }: DraggableItemProps) {
  const [pos, setPos] = useState({ x: component.x, y: component.y });
  const dragging = useRef(false);
  const start = useRef({ mx: 0, my: 0, cx: 0, cy: 0 });

  useEffect(() => {
    setPos({ x: component.x, y: component.y });
  }, [component.x, component.y]);

  function handleMouseDown(e: React.MouseEvent) {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();

    dragging.current = true;
    start.current = { mx: e.clientX, my: e.clientY, cx: pos.x, cy: pos.y };

    function handleMouseMove(ev: MouseEvent) {
      if (!dragging.current) return;
      const dx = (ev.clientX - start.current.mx) / CANVAS_SCALE;
      const dy = (ev.clientY - start.current.my) / CANVAS_SCALE;
      setPos({
        x: Math.max(0, Math.min(CANVAS_W - 10, start.current.cx + dx)),
        y: Math.max(0, Math.min(CANVAS_H - 10, start.current.cy + dy)),
      });
    }

    function handleMouseUp(ev: MouseEvent) {
      if (!dragging.current) return;
      dragging.current = false;
      const dx = (ev.clientX - start.current.mx) / CANVAS_SCALE;
      const dy = (ev.clientY - start.current.my) / CANVAS_SCALE;
      onMove(
        Math.max(0, Math.min(CANVAS_W - 10, start.current.cx + dx)),
        Math.max(0, Math.min(CANVAS_H - 10, start.current.cy + dy)),
      );
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        color: component.color,
        fontSize: component.fontSize,
        fontWeight: component.fontWeight,
        userSelect: 'none',
        cursor: 'grab',
      }}
      onMouseDown={handleMouseDown}
      onClick={e => { e.stopPropagation(); onSelect(); }}
      className={cn(
        'inline-flex items-start gap-1 rounded px-1 py-0.5',
        !component.visible && 'opacity-40',
        isSelected && 'ring-2 ring-primary',
      )}
    >
      <GripVertical size={12} className='mt-0.5 shrink-0 opacity-40' />
      {getComponentContent(component)}
    </div>
  );
}

// --- Main Editor ---

export function ReportCardLayoutEditor({ initialConfig, onSave, onClose }: ReportCardLayoutEditorProps) {
  const [config, setConfig] = useState<ReportCardLayoutConfig>(initialConfig);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const selected = config.components.find(c => c.id === selectedId) ?? null;

  function addComponent(type: ReportCardComponentType) {
    const newComp: ReportCardLayoutComponent = {
      id: generateId(),
      type,
      label: COMPONENT_LABELS[type],
      x: 20,
      y: 20,
      color: '#000000',
      content: type === 'custom_text' ? 'Texto personalizado' : undefined,
      visible: true,
      fontSize: 14,
      fontWeight: 'normal',
    };
    setConfig(prev => ({ ...prev, components: [...prev.components, newComp] }));
    setSelectedId(newComp.id);
  }

  function updateComponent(id: string, patch: Partial<ReportCardLayoutComponent>) {
    setConfig(prev => ({
      ...prev,
      components: prev.components.map(c => c.id === id ? { ...c, ...patch } : c),
    }));
  }

  function removeComponent(id: string) {
    setConfig(prev => ({ ...prev, components: prev.components.filter(c => c.id !== id) }));
    if (selectedId === id) setSelectedId(null);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await onSave(config);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex flex-col bg-background'>
      {/* Header */}
      <div className='flex items-center justify-between px-6 h-14 border-b border-border shrink-0'>
        <h2 className='text-base font-semibold text-foreground'>Editor de Boletim</h2>
        <div className='flex items-center gap-2'>
          <button
            onClick={handleSave}
            disabled={saving}
            className='px-4 py-1.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors'
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
          <button
            onClick={onClose}
            className='p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors'
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className='flex flex-1 min-h-0 overflow-hidden'>
        {/* Left sidebar — component palette */}
        <aside className='w-48 border-r border-border flex flex-col gap-1 p-3 overflow-y-auto shrink-0'>
          <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 px-1'>Componentes</p>
          {COMPONENT_TYPES.map(type => (
            <button
              key={type}
              onClick={() => addComponent(type)}
              className='flex items-center gap-2 px-2 py-2 rounded-lg text-left text-xs font-medium text-foreground hover:bg-muted transition-colors border border-transparent hover:border-border'
            >
              <Plus size={13} className='text-primary shrink-0' />
              <span className='leading-tight'>{COMPONENT_LABELS[type]}</span>
            </button>
          ))}
        </aside>

        {/* Canvas area */}
        <div className='flex-1 flex items-start justify-center overflow-auto bg-muted/30 p-8'>
          <div style={{ transform: `scale(${CANVAS_SCALE})`, transformOrigin: 'top center', width: CANVAS_W, height: CANVAS_H, flexShrink: 0 }}>
            <div
              className='relative overflow-hidden'
              style={{ width: CANVAS_W, height: CANVAS_H, backgroundColor: config.pageBackground }}
              onClick={e => { if (e.target === e.currentTarget) setSelectedId(null); }}
            >
              {config.components.map(component => (
                <DraggableItem
                  key={component.id}
                  component={component}
                  isSelected={selectedId === component.id}
                  onSelect={() => setSelectedId(component.id)}
                  onMove={(x, y) => updateComponent(component.id, { x, y })}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar — properties */}
        <aside className='w-56 border-l border-border flex flex-col overflow-y-auto shrink-0'>
          <div className='p-3 flex-1'>
            {selected ? (
              <div className='space-y-4'>
                <div>
                  <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3'>Propriedades</p>
                  <p className='text-xs font-medium text-foreground truncate'>{selected.label}</p>
                </div>

                <div>
                  <label className='text-xs font-medium text-foreground block mb-1.5'>Cor do texto</label>
                  <div className='flex items-center gap-2'>
                    <input
                      type='color'
                      value={selected.color}
                      onChange={e => updateComponent(selected.id, { color: e.target.value })}
                      className='w-8 h-8 rounded border border-border cursor-pointer bg-transparent shrink-0'
                    />
                    <input
                      type='text'
                      value={selected.color}
                      onChange={e => updateComponent(selected.id, { color: e.target.value })}
                      className='flex-1 h-8 px-2 text-xs border border-border bg-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary font-mono'
                    />
                  </div>
                </div>

                <div>
                  <label className='text-xs font-medium text-foreground block mb-1.5'>Tamanho da fonte</label>
                  <input
                    type='number'
                    min={8}
                    max={48}
                    value={selected.fontSize}
                    onChange={e => updateComponent(selected.id, { fontSize: Number(e.target.value) })}
                    className='w-full h-8 px-2 text-xs border border-border bg-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary'
                  />
                </div>

                <div className='flex items-center justify-between'>
                  <label className='text-xs font-medium text-foreground'>Negrito</label>
                  <button
                    type='button'
                    role='switch'
                    aria-checked={selected.fontWeight === 'bold'}
                    onClick={() => updateComponent(selected.id, { fontWeight: selected.fontWeight === 'bold' ? 'normal' : 'bold' })}
                    className={cn(
                      'relative w-9 h-5 rounded-full transition-colors shrink-0',
                      selected.fontWeight === 'bold' ? 'bg-primary' : 'bg-muted border border-border',
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform',
                        selected.fontWeight === 'bold' ? 'translate-x-4' : 'translate-x-0',
                      )}
                    />
                  </button>
                </div>

                {selected.type === 'custom_text' && (
                  <div>
                    <label className='text-xs font-medium text-foreground block mb-1.5'>Conteúdo</label>
                    <textarea
                      value={selected.content ?? ''}
                      onChange={e => updateComponent(selected.id, { content: e.target.value })}
                      rows={3}
                      className='w-full px-2 py-1.5 text-xs border border-border bg-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary resize-none'
                    />
                  </div>
                )}

                <div className='grid grid-cols-2 gap-2'>
                  <div>
                    <label className='text-xs font-medium text-foreground block mb-1.5'>X (px)</label>
                    <input
                      type='number'
                      value={Math.round(selected.x)}
                      onChange={e => updateComponent(selected.id, { x: Number(e.target.value) })}
                      className='w-full h-8 px-2 text-xs border border-border bg-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary'
                    />
                  </div>
                  <div>
                    <label className='text-xs font-medium text-foreground block mb-1.5'>Y (px)</label>
                    <input
                      type='number'
                      value={Math.round(selected.y)}
                      onChange={e => updateComponent(selected.id, { y: Number(e.target.value) })}
                      className='w-full h-8 px-2 text-xs border border-border bg-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary'
                    />
                  </div>
                </div>

                <div className='flex gap-2 pt-1'>
                  <button
                    onClick={() => updateComponent(selected.id, { visible: !selected.visible })}
                    className='flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:bg-muted transition-colors'
                  >
                    {selected.visible ? <EyeOff size={13} /> : <Eye size={13} />}
                    {selected.visible ? 'Ocultar' : 'Mostrar'}
                  </button>
                  <button
                    onClick={() => removeComponent(selected.id)}
                    className='flex items-center justify-center gap-1.5 px-3 h-8 rounded-lg border border-danger/30 text-xs font-medium text-danger hover:bg-danger/10 transition-colors'
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ) : (
              <p className='text-xs text-muted-foreground'>Selecione um componente para editar</p>
            )}
          </div>

          <div className='border-t border-border p-3'>
            <label className='text-xs font-medium text-foreground block mb-1.5'>Fundo da página</label>
            <div className='flex items-center gap-2'>
              <input
                type='color'
                value={config.pageBackground}
                onChange={e => setConfig(prev => ({ ...prev, pageBackground: e.target.value }))}
                className='w-8 h-8 rounded border border-border cursor-pointer bg-transparent shrink-0'
              />
              <input
                type='text'
                value={config.pageBackground}
                onChange={e => setConfig(prev => ({ ...prev, pageBackground: e.target.value }))}
                className='flex-1 h-8 px-2 text-xs border border-border bg-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary font-mono'
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
