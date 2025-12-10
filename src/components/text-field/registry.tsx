import { Item, FieldType } from '@/types/item';
import { ReactNode } from 'react';

export type RendererFn = (item: Item) => ReactNode;

const registry: Record<FieldType, RendererFn> = {} as Record<FieldType, RendererFn>;

export function registerRenderer(type: FieldType, renderer: RendererFn) {
  registry[type] = renderer;
}

export function getRenderer(type: FieldType): RendererFn {
  const renderer = registry[type];
  if (!renderer) {
    throw new Error(`No renderer registered for type: ${type}`);
  }
  return renderer;
}
