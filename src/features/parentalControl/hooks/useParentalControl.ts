'use client';

import { useEffect, useState } from 'react';
import { Child } from '../models/parentalControlModel';
import { getParentalControlService } from '../services/parentalControlInterface';

export function useParentalControl(institution: string) {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const service = getParentalControlService(institution);
    service.getChildren().then(data => {
      setChildren(data);
      setLoading(false);
    });
  }, [institution]);

  return { children, loading };
}
