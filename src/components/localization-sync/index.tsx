'use client';

import { ReactNode } from 'react';
import { localization, type SupportedLanguage } from '@/libs/language';

interface LocalizationSyncProps {
  language: SupportedLanguage;
  children: ReactNode;
}

export const LocalizationSync = ({ language, children }: LocalizationSyncProps) => {
  if (localization.getLanguage() !== language) {
    localization.setLanguage(language);
  }

  return <>{children}</>;
};
