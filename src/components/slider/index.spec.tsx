import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Slider } from './index';

describe('Slider', () => {
  it('renders an optional label with the slider control', () => {
    render(<Slider aria-label='Period range' value={[0, 1]} min={0} max={1} valueLabel='Jan 2020 – Feb 2020' />);

    expect(screen.getByText('Jan 2020 – Feb 2020')).toBeInTheDocument();
  });

  it('shows the formatted value for the focused thumb and updates it as the thumb moves', () => {
    render(
      <Slider
        aria-label='Period range'
        valueLabel='Jan 2020 – Dec 2022'
        defaultValue={[0, 4]}
        min={0}
        max={4}
        formatValue={(value) => `Period ${value}`}
      />,
    );

    const minimumThumb = screen.getByRole('slider', { name: 'Period range min' });
    const maximumThumb = screen.getByRole('slider', { name: 'Period range max' });
    expect(maximumThumb).toHaveAttribute('aria-valuenow', '4');
    expect(screen.getByText('Period 0').closest('[popover]')).toHaveAttribute('data-placement', 'bottom');
    expect(screen.getByText('Period 4').closest('[popover]')).toHaveAttribute('data-placement', 'bottom');
    const hitArea = minimumThumb.parentElement;
    expect(hitArea).not.toBeNull();
    if (hitArea) {
      fireEvent.pointerDown(hitArea, { button: 0, pointerId: 1, clientX: 100 });
      fireEvent.pointerMove(hitArea, { buttons: 1, clientX: 100 });
    }
    expect(minimumThumb).toHaveAttribute('aria-valuenow', '0');

    fireEvent.focus(minimumThumb);
    expect(screen.getByText('Jan 2020 – Dec 2022')).toBeInTheDocument();

    fireEvent.keyDown(minimumThumb, { key: 'ArrowRight', code: 'ArrowRight' });

    expect(screen.getByRole('slider', { name: 'Period range min' })).toHaveAttribute('aria-valuetext', 'Period 1');
    expect(screen.getByText('Period 1').closest('[popover]')).toBeInTheDocument();
    expect(screen.getByText('Jan 2020 – Dec 2022')).toBeInTheDocument();
  });

  it('moves a selected thumb along the inset track while dragging', () => {
    render(<Slider aria-label='Period range' defaultValue={[0, 4]} min={0} max={4} />);

    const minimumThumb = screen.getByRole('slider', { name: 'Period range min' });
    const track = minimumThumb.parentElement;
    const hitArea = track?.parentElement;
    expect(track?.className).toMatch(/track/);
    expect(hitArea).not.toBeNull();

    if (!track || !hitArea) return;

    Object.defineProperty(track, 'getBoundingClientRect', {
      value: () => ({ left: 20, right: 120, width: 100 }),
    });
    Object.defineProperty(hitArea, 'setPointerCapture', { value: vi.fn() });

    fireEvent.pointerDown(minimumThumb, { button: 0, pointerId: 1, clientX: 20 });
    expect(minimumThumb).toHaveAttribute('aria-valuenow', '0');

    fireEvent.pointerMove(hitArea, { pointerId: 1, buttons: 1, clientX: 70 });

    expect(screen.getByRole('slider', { name: 'Period range min' })).toHaveAttribute('aria-valuenow', '2');
  });

  it('updates the range from a thumb keyboard event', () => {
    const onChange = vi.fn();
    const onChangeEnd = vi.fn();

    render(
      <Slider aria-label='Period range' value={[0, 1]} min={0} max={1} onChange={onChange} onChangeEnd={onChangeEnd} />,
    );

    const maximumThumb = screen.getByRole('slider', { name: 'Period range max' });
    maximumThumb.focus();
    expect(document.activeElement).toBe(maximumThumb);
    fireEvent.keyDown(maximumThumb, { key: 'Home', code: 'Home' });

    expect(onChange).toHaveBeenCalledWith([0, 0]);
    expect(onChangeEnd).toHaveBeenCalledWith([0, 0]);
  });
});
