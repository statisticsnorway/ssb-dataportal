import type { ReactNode } from 'react';
import styles from './classificationSurface.module.css';

interface ClassificationSurfaceProps {
  children: ReactNode;
  className?: string;
}

export function ClassificationSurface({ children, className = '' }: Readonly<ClassificationSurfaceProps>) {
  return <div className={`classification-surface ${styles.surface} ${className}`}>{children}</div>;
}
