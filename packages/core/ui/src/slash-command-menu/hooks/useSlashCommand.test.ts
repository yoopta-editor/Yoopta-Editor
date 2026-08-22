import { act } from 'react';
import type { VirtualElement } from '@floating-ui/dom';
import type { FloatingContext } from '@floating-ui/react';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useSlashCommand } from './useSlashCommand';

const mocks = vi.hoisted(() => ({
  editor: {
    path: { current: 0 as number | null },
    refElement: null as HTMLElement | null,
    plugins: {},
    toggleBlock: vi.fn(),
  },
  closedSetReference: vi.fn(),
  openSetReference: vi.fn(),
}));

vi.mock('@yoopta/editor', () => ({
  Blocks: {
    getBlock: vi.fn(() => ({ id: 'block' })),
    getBlockSlate: vi.fn(() => ({
      selection: {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 0 },
      },
    })),
  },
  getAllowedPluginsFromElement: vi.fn(() => null),
  useYooptaEditor: vi.fn(() => mocks.editor),
}));

vi.mock('@floating-ui/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@floating-ui/react')>();

  return {
    ...actual,
    useTransitionStyles: vi.fn(() => ({ isMounted: true, styles: {} })),
  };
});

vi.mock('./usePositioning', () => ({
  getVirtualElementRects: vi.fn(),
  usePositioning: vi.fn(({ isOpen }: { isOpen: boolean }) => ({
    refs: {
      reference: { current: null },
      floating: { current: null },
      setReference: isOpen ? mocks.openSetReference : mocks.closedSetReference,
      setFloating: vi.fn(),
    },
    floatingStyles: {},
    floatingContext: null,
  })),
}));

describe('useSlashCommand', () => {
  beforeEach(() => {
    mocks.editor.refElement = document.createElement('div');
    document.body.append(mocks.editor.refElement);
    vi.clearAllMocks();
  });

  it('executes the currently highlighted item after filtering reorders equal-length results', () => {
    const onSelect = vi.fn();
    const items = [
      { id: 'CodeGroup', title: 'CodeGroup' },
      { id: 'Code', title: 'Code' },
    ];
    const { result } = renderHook(() => useSlashCommand({ items, onSelect }));

    act(() => {
      result.current.actionHandlers.open(
        { getBoundingClientRect: () => new DOMRect() } as VirtualElement,
        null as unknown as FloatingContext<VirtualElement>,
      );
    });

    act(() => {
      result.current.actionHandlers.setSearch('code');
    });

    expect(result.current.filteredItems.map((item) => item.id)).toEqual(['Code', 'CodeGroup']);

    act(() => {
      mocks.editor.refElement?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
      );
    });

    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'Code' }));
  });
});
