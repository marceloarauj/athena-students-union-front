'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { ReportCardLayoutConfig } from '../models/reportCardLayoutModel';
import { getReportCardLayoutService } from '../services/reportCardLayoutInterface';

export function useReportCardLayout(institution: string) {
  const [layout, setLayout] = useState<ReportCardLayoutConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const service = getReportCardLayoutService(institution);
    service.getLayout().then(data => {
      setLayout(data);
      setLoading(false);
    });
  }, [institution]);

  async function saveLayout(config: ReportCardLayoutConfig): Promise<void> {
    const service = getReportCardLayoutService(institution);
    await service.saveLayout(config);
    setLayout(config);
    toast.success('Layout do boletim salvo com sucesso!');
  }

  return { layout, loading, saveLayout };
}
