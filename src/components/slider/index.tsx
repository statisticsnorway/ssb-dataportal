import { Popover } from '@digdir/designsystemet-react';
import { type KeyboardEvent, type PointerEvent, type ReactNode, useId, useRef, useState } from 'react';
import styles from './Slider.module.css';

type Range = readonly [number, number];

type Labelled =
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-labelledby': string; 'aria-label'?: never };

export type SliderProps = Labelled & {
  value: Range;
  onChange: (value: Range) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  formatValue?: (value: number) => string;
  valueLabel?: ReactNode;
  /** Suffixes announced after `aria-label` for the first and last thumb of a range. */
  rangeLabels?: readonly [string, string];
  className?: string;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const decimals = (value: number) => (String(value).split('.')[1] ?? '').length;

const snap = (raw: number, min: number, max: number, step: number) => {
  const snapped = Math.round((raw - min) / step) * step + min;
  return clamp(Number(snapped.toFixed(decimals(step))), min, max);
};

const percent = (value: number, min: number, max: number) => (max === min ? 0 : ((value - min) / (max - min)) * 100);

const valueFromKey = (key: string, current: number, min: number, max: number, step: number): number | null => {
  switch (key) {
    case 'ArrowRight':
    case 'ArrowUp':
      return current + step;
    case 'ArrowLeft':
    case 'ArrowDown':
      return current - step;
    case 'PageUp':
      return current + step * 10;
    case 'PageDown':
      return current - step * 10;
    case 'Home':
      return min;
    case 'End':
      return max;
    default:
      return null;
  }
};

export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  formatValue = String,
  valueLabel,
  rangeLabels = ['min', 'max'],
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
}: SliderProps) {
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [focusedThumbIndex, setFocusedThumbIndex] = useState<number | null>(null);
  const thumbLabelId = useId();
  const trackRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef(value);
  currentRef.current = value;

  const thumbIds = value.map((_, index) => `${thumbLabelId}-${index}`);
  const activeThumbIndex = draggingIndex ?? focusedThumbIndex;
  const start = percent(value[0], min, max);
  const end = percent(value[1], min, max);

  const thumbLabel = (index: number) => {
    const rangeLabel = index === 0 ? rangeLabels[0] : rangeLabels[1];
    return `${ariaLabel} ${rangeLabel}`;
  };

  const commit = (index: number, raw: number) => {
    const latest = currentRef.current;
    const next = snap(raw, min, max, step);
    const nextValue: Range =
      index === 0 ? [Math.min(next, latest[1]), latest[1]] : [latest[0], Math.max(next, latest[0])];

    if (nextValue[0] !== latest[0] || nextValue[1] !== latest[1]) {
      currentRef.current = nextValue;
      onChange(nextValue);
    }
  };

  const rawFromPointer = (clientX: number) => {
    const track = trackRef.current;
    if (!track) return min;

    const rect = track.getBoundingClientRect();
    const ratio = rect.width === 0 ? 0 : clamp((clientX - rect.left) / rect.width, 0, 1);
    const isRtl = getComputedStyle(track).direction === 'rtl';
    return min + (isRtl ? 1 - ratio : ratio) * (max - min);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled || event.button !== 0) return;

    if (!(event.target instanceof HTMLElement)) return;
    const thumb = event.target.closest<HTMLElement>('[role="slider"]');
    if (!thumb) return;
    const index = Array.from(event.currentTarget.querySelectorAll('[role="slider"]')).indexOf(thumb);
    if (index < 0) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    thumb.focus();
    setDraggingIndex(index);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (draggingIndex === null || event.buttons === 0) return;
    commit(draggingIndex, rawFromPointer(event.clientX));
  };

  const handlePointerUp = () => {
    setDraggingIndex(null);
  };

  const handleKeyDown = (index: number) => (event: KeyboardEvent) => {
    if (disabled) return;
    const raw = valueFromKey(event.key, value[index] ?? min, min, max, step);
    if (raw === null) return;

    event.preventDefault();
    commit(index, raw);
  };

  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')} data-disabled={disabled || undefined}>
      {valueLabel ? <div className={styles.valueLabel}>{valueLabel}</div> : null}
      {ariaLabel
        ? thumbIds.map((id, index) => (
            <span key={id} id={id} className='ds-sr-only'>
              {thumbLabel(index)}
            </span>
          ))
        : null}
      <div
        className={styles.hitArea}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div ref={trackRef} className={styles.track}>
          <div
            className={styles.fill}
            style={{
              insetInlineStart: `${start}%`,
              insetInlineEnd: `${100 - end}%`,
            }}
          />

          {value.map((thumb, index) => {
            const formattedValue = formatValue(thumb);

            return (
              <Popover.TriggerContext key={thumbIds[index]}>
                <Popover.Trigger asChild>
                  <div
                    role='slider'
                    tabIndex={disabled ? -1 : 0}
                    className={styles.thumb}
                    data-dragging={draggingIndex === index || undefined}
                    style={{ insetInlineStart: `${percent(thumb, min, max)}%` }}
                    aria-valuenow={thumb}
                    aria-valuemin={index === 1 ? value[0] : min}
                    aria-valuemax={index === 0 ? value[1] : max}
                    aria-valuetext={formattedValue}
                    aria-orientation='horizontal'
                    aria-disabled={disabled || undefined}
                    aria-labelledby={ariaLabelledby ?? (ariaLabel ? thumbIds[index] : undefined)}
                    onKeyDown={handleKeyDown(index)}
                    onFocus={() => setFocusedThumbIndex(index)}
                    onBlur={() =>
                      setFocusedThumbIndex((currentIndex) => (currentIndex === index ? null : currentIndex))
                    }
                  />
                </Popover.Trigger>
                <Popover
                  className={styles.valuePopover}
                  placement='bottom'
                  autoPlacement
                  aria-hidden='true'
                  open={activeThumbIndex === index}
                >
                  {formattedValue}
                </Popover>
              </Popover.TriggerContext>
            );
          })}
        </div>
      </div>
    </div>
  );
}
