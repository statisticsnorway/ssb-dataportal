import { Item } from '@/types/item';
import { getRenderer, registerRenderer } from './registry';
import LinkRenderer from './renderers/LinkRenderer';
import TagsRenderer from './renderers/TagsRenderer';
import TextRenderer from './renderers/TextRender';
import styles from './text-field.module.css';

registerRenderer('text', TextRenderer);
registerRenderer('link', LinkRenderer);
registerRenderer('tags', TagsRenderer);

interface TextFieldProps extends Item {}

export const TextField = ({ label, value, type = 'text', display }: TextFieldProps) => {
  const Renderer = getRenderer(type);
  return (
    <div className={styles.fieldWrapper}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>
        {value != null ? <Renderer label={label} value={value} display={display} type={type} /> : '–'}
      </span>
    </div>
  );
};
