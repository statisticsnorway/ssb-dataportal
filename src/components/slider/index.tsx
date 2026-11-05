import { Popover } from '@digdir/designsystemet-react';
import { type KeyboardEvent, type PointerEvent, type ReactNode, useId, useRef, useState } from 'react';
import styles from './Slider.module.css';

type Range = readonly [number, number];
export type SliderValue = number | Range;

type Labelled =
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-labelledby': string; 'aria-label'?: never };

export type SliderProps<V extends SliderValue = number> = Labelled & {
  value?: V;
  defaultValue?: V;
  onChange?: (value: V) => void;
  onChangeEnd?: (value: V) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  name?: string;
  formatValue?: (value: number) => string;
  valueLabel?: ReactNode;
  /** Suffixes announced after `aria-label` for the first and last thumb of a range. */
  rangeLabels?: readonly [string, string];
  className?: string;
};

const isRange = (value: SliderValue): value is Range => typeof value !== 'number';

const toList = (value: SliderValue): readonly number[] => (isRange(value) ? value : [value]);

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

export function Slider<V extends SliderValue = number>({
  value,
  defaultValue,
  onChange,
  onChangeEnd,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  name,
  formatValue = String,
  valueLabel,
  rangeLabels = ['min', 'max'],
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
}: SliderProps<V>) {
  const [internal, setInternal] = useState<SliderValue>(defaultValue ?? min);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [focusedThumbIndex, setFocusedThumbIndex] = useState<number | null>(null);
  const thumbLabelId = useId();
  const trackRef = useRef<HTMLDivElement>(null);
  const current: SliderValue = value ?? internal;
  const currentRef = useRef<SliderValue>(current);
  currentRef.current = current;

  const thumbs = toList(current);
  const activeThumbIndex = draggingIndex ?? focusedThumbIndex;
  const start = isRange(current) ? percent(current[0], min, max) : 0;
  const end = percent(thumbs[thumbs.length - 1] ?? min, min, max);

  const commit = (index: number, raw: number): SliderValue => {
    const latest = currentRef.current;
    const latestThumbs = toList(latest);
    const next = snap(raw, min, max, step);
    const nextValue: SliderValue = isRange(latest)
      ? index === 0
        ? [Math.min(next, latest[1]), latest[1]]
        : [latest[0], Math.max(next, latest[0])]
      : next;
    const nextThumbs = toList(nextValue);
    const changed = nextThumbs.some((thumb, thumbIndex) => thumb !== latestThumbs[thumbIndex]);

    if (changed) {
      currentRef.current = nextValue;
      setInternal(nextValue);
      onChange?.(nextValue as V);
    }

    return nextValue;
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
    if (draggingIndex === null) return;
    setDraggingIndex(null);
    onChangeEnd?.(currentRef.current as V);
  };

  const handleKeyDown = (index: number) => (event: KeyboardEvent) => {
    if (disabled) return;
    const raw = valueFromKey(event.key, thumbs[index] ?? min, min, max, step);
    if (raw === null) return;

    event.preventDefault();
    const nextValue = commit(index, raw);
    onChangeEnd?.(nextValue as V);
  };

  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')} data-disabled={disabled || undefined}>
      {valueLabel ? <div className={styles.valueLabel}>{valueLabel}</div> : null}
      {ariaLabel
        ? thumbs.map((_, index) => (
            <span key={index} id={`${thumbLabelId}-${index}`} className='ds-sr-only'>
              {isRange(current) ? `${ariaLabel} ${rangeLabels[index === 0 ? 0 : 1]}` : ariaLabel}
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

          {thumbs.map((thumb, index) => {
            const formattedValue = formatValue(thumb);

            return (
              <Popover.TriggerContext key={index}>
                <Popover.Trigger asChild>
                  <div
                    role='slider'
                    tabIndex={disabled ? -1 : 0}
                    className={styles.thumb}
                    data-dragging={draggingIndex === index || undefined}
                    style={{ insetInlineStart: `${percent(thumb, min, max)}%` }}
                    aria-valuenow={thumb}
                    aria-valuemin={isRange(current) && index === 1 ? current[0] : min}
                    aria-valuemax={isRange(current) && index === 0 ? current[1] : max}
                    aria-valuetext={formattedValue}
                    aria-orientation='horizontal'
                    aria-disabled={disabled || undefined}
                    aria-labelledby={ariaLabelledby ?? (ariaLabel ? `${thumbLabelId}-${index}` : undefined)}
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

      {name ? thumbs.map((thumb, index) => <input key={index} type='hidden' name={name} value={thumb} />) : null}
    </div>
  );
}
