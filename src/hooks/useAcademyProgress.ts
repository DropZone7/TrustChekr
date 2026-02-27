'use client';

import { useEffect, useState, useCallback } from 'react';
import type { AcademyModuleId } from '@/lib/academy/modules';
import {
  loadProgress,
  saveProgress,
  type AcademyProgress,
  type ModuleCompletionStatus,
} from '@/lib/academy/progress';

export function useAcademyProgress() {
  const [progress, setProgress] = useState<AcademyProgress | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const setModuleStatus = useCallback(
    (moduleId: AcademyModuleId, status: ModuleCompletionStatus) => {
      setProgress((current) => {
        const base = current ?? loadProgress();
        // Don't downgrade: completed > in_progress > not_started
        const currentStatus = base.modules[moduleId];
        if (currentStatus === 'completed' && status !== 'completed') return base;
        if (currentStatus === 'in_progress' && status === 'not_started') return base;

        const next: AcademyProgress = {
          ...base,
          modules: { ...base.modules, [moduleId]: status },
          lastUpdated: new Date().toISOString(),
        };
        saveProgress(next);
        return next;
      });
    },
    []
  );

  return { progress, setModuleStatus };
}
