import type { ReactNode } from 'react';
import styles from './classificationSurface.module.css';

interface ClassificationSurfaceProps {
  children: ReactNode;
  className?: string;
  seamless?: boolean;
}

export function ClassificationSurface({
  children,
  className = '',
  seamless = false,
}: Readonly<ClassificationSurfaceProps>) {
  return (
    <div
      className={`${styles.classificationSurface} ${seamless ? styles.seamless : ''} classification-surface ${className}`}
    >
      {children}
    </div>
  );
}
