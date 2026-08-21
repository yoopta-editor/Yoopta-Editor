import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { ElementOptionsInput } from './element-options-input';

describe('ElementOptionsInput IME composition', () => {
  it('does not call onChange with intermediate IME characters', () => {
    const onChange = vi.fn();
    render(<ElementOptionsInput value="" onChange={onChange} />);

    const input = screen.getByRole('textbox');

    fireEvent.compositionStart(input);
    fireEvent.change(input, { target: { value: 'ㄇ' } });
    fireEvent.change(input, { target: { value: 'ㄇㄨ' } });

    expect(onChange).not.toHaveBeenCalled();

    fireEvent.change(input, { target: { value: '木' } });
    fireEvent.compositionEnd(input);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('木');
  });

  it('shows intermediate IME characters without committing them to a controlled parent', () => {
    const committed: string[] = [];

    function ControlledInput() {
      const [value, setValue] = useState('');
      return (
        <ElementOptionsInput
          value={value}
          onChange={(next) => {
            committed.push(next);
            setValue(next);
          }}
        />
      );
    }

    render(<ControlledInput />);
    const input = screen.getByRole('textbox') as HTMLInputElement;

    fireEvent.compositionStart(input);
    fireEvent.change(input, { target: { value: 'ㄇ' } });

    expect(committed).toEqual([]);
    expect(input.value).toBe('ㄇ');

    fireEvent.change(input, { target: { value: 'ㄇㄨ' } });
    expect(committed).toEqual([]);
    expect(input.value).toBe('ㄇㄨ');

    fireEvent.change(input, { target: { value: '木' } });
    fireEvent.compositionEnd(input);

    expect(committed).toEqual(['木']);
    expect(input.value).toBe('木');
  });

  it('does not overwrite in-progress IME composition when the parent value is stale', () => {
    const onChange = vi.fn();
    const { rerender } = render(<ElementOptionsInput value="" onChange={onChange} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;

    fireEvent.compositionStart(input);
    fireEvent.change(input, { target: { value: 'ㄇ' } });

    rerender(<ElementOptionsInput value="" onChange={onChange} />);

    expect(input.value).toBe('ㄇ');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('calls onChange immediately for non-IME typing', () => {
    const onChange = vi.fn();
    render(<ElementOptionsInput value="" onChange={onChange} />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'hello' } });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('hello');
  });

  it('syncs from the value prop when not composing', () => {
    const onChange = vi.fn();
    const { rerender } = render(<ElementOptionsInput value="Title" onChange={onChange} />);

    expect(screen.getByRole('textbox')).toHaveValue('Title');

    rerender(<ElementOptionsInput value="Updated" onChange={onChange} />);

    expect(screen.getByRole('textbox')).toHaveValue('Updated');
    expect(onChange).not.toHaveBeenCalled();
  });
});
