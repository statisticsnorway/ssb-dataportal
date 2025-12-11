import { Item } from '@/types/item';
import { getRenderer, registerRenderer } from './registry';
import LinkRenderer from './renderers/LinkRenderer';
import LongTextRenderer from './renderers/LongTextRender';
import TagsRenderer from './renderers/TagsRenderer';
import TextRenderer from './renderers/TextRenderer';
import styles from './text-field.module.css';

registerRenderer('text', TextRenderer);
registerRenderer('longtext', LongTextRenderer);
registerRenderer('link', LinkRenderer);
registerRenderer('tags', TagsRenderer);

interface TextFieldProps extends Item {}

export const TextField = ({ label, value, type = 'text', display }: TextFieldProps) => {
  const Renderer = getRenderer(type);
  return (
    <div className={styles.fieldWrapper}>
      <dt className={styles.label}>{label}</dt>
      <dd>{value != null ? <Renderer label={label} value={value} display={display} type={type} /> : '–'}</dd>
    </div>
  );
};
