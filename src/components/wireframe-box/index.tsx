import React, { ReactNode } from 'react';

interface Props {
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
  content?: ReactNode;
  className?: string;
}

export const WireframeBox: React.FC<Props> = ({ width = '100%', height = '1rem', style, content, className = '' }) => (
  <div
    className={className}
    style={{
      width,
      height,
      backgroundColor: '#eee',
      borderRadius: 4,
      ...style,
    }}
  >
    {content}
  </div>
);
