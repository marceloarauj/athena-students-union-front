'use client';

import { useState } from 'react';
import { FileText, ChevronRight } from 'lucide-react';
import { usePermissionGuard } from '@/features/auth/hooks/usePermissionGuard';
import { useInstitutionStore } from '@/entities/institution';
import { useReportCardLayout } from '@/features/reportCard/hooks/useReportCardLayout';
import { ReportCardLayoutEditor } from '@/features/reportCard/components/ReportCardLayoutEditor';
import type { ReportCardLayoutConfig } from '@/features/reportCard/models/reportCardLayoutModel';

export default function VisualFilesPage() {
  const allowed = usePermissionGuard('SHOW_SCREEN_SETTINGS');
  const { institution } = useInstitutionStore();
  const alias = institution?.alias ?? '';
  const { layout, loading, saveLayout } = useReportCardLayout(alias);
  const [editorOpen, setEditorOpen] = useState(false);

  if (!allowed) return null;

  if (loading || !layout) {
    return (
      <div className='p-6 max-w-3xl mx-auto space-y-6'>
        <div className='space-y-2'>
          <div className='h-7 w-48 rounded-lg bg-muted animate-pulse' />
          <div className='h-4 w-72 rounded-lg bg-muted animate-pulse' />
        </div>
        <div className='h-20 rounded-xl bg-muted animate-pulse' />
      </div>
    );
  }

  async function handleSave(config: ReportCardLayoutConfig) {
    await saveLayout(config);
    setEditorOpen(false);
  }

  return (
    <>
      <div className='p-6 max-w-3xl mx-auto space-y-6'>
        <div>
          <h1 className='text-2xl font-bold text-foreground'>Visual de Arquivos</h1>
          <p className='text-sm text-muted-foreground mt-1'>
            Personalize o layout dos documentos gerados pela plataforma.
          </p>
        </div>

        <button
          onClick={() => setEditorOpen(true)}
          className='w-full flex items-center gap-4 p-5 rounded-xl border border-border bg-card hover:bg-muted/40 transition-colors text-left'
        >
          <div className='w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0'>
            <FileText size={20} className='text-primary' />
          </div>
          <div className='flex-1 min-w-0'>
            <p className='text-sm font-semibold text-foreground'>Editar Boletim</p>
            <p className='text-xs text-muted-foreground mt-0.5'>
              Arraste e posicione os componentes do boletim escolar conforme o layout desejado.
            </p>
          </div>
          <ChevronRight size={18} className='text-muted-foreground shrink-0' />
        </button>
      </div>

      {editorOpen && (
        <ReportCardLayoutEditor
          initialConfig={layout}
          onSave={handleSave}
          onClose={() => setEditorOpen(false)}
        />
      )}
    </>
  );
}
