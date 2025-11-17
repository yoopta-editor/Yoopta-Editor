import { beforeEach, describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useActionMenuListStore } from './store';

describe('ActionMenuListStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useActionMenuListStore());
    act(() => result.current.reset());
  });

  describe('initial state', () => {
    it('should have default values', () => {
      const { result } = renderHook(() => useActionMenuListStore());

      expect(result.current.state).toBe('closed');
      expect(result.current.view).toBe('default');
      expect(result.current.reference).toBeNull();
      expect(result.current.placement).toBe('bottom-start');
      expect(result.current.blockId).toBeNull();
    });
  });

  describe('open()', () => {
    it('should open with default options', () => {
      const { result } = renderHook(() => useActionMenuListStore());

      act(() => {
        result.current.open();
      });

      expect(result.current.state).toBe('open');
      expect(result.current.view).toBe('default');
      expect(result.current.reference).toBeNull();
      expect(result.current.placement).toBe('bottom-start');
      expect(result.current.blockId).toBeNull();
    });

    it('should open with provided options', () => {
      const { result } = renderHook(() => useActionMenuListStore());
      const reference = document.createElement('button');

      act(() => {
        result.current.open({
          reference,
          view: 'small',
          placement: 'right-start',
          blockId: 'block-123',
        });
      });

      expect(result.current.state).toBe('open');
      expect(result.current.reference).toBe(reference);
      expect(result.current.view).toBe('small');
      expect(result.current.placement).toBe('right-start');
      expect(result.current.blockId).toBe('block-123');
    });

    it('should keep previous reference if not provided', () => {
      const { result } = renderHook(() => useActionMenuListStore());
      const reference = document.createElement('div');

      act(() => result.current.open({ reference }));
      expect(result.current.reference).toBe(reference);

      act(() => result.current.open());
      expect(result.current.reference).toBe(reference);
    });
  });

  describe('close()', () => {
    it('should close and reset transient data', () => {
      const { result } = renderHook(() => useActionMenuListStore());

      act(() => {
        result.current.open({
          reference: document.createElement('div'),
          view: 'small',
          placement: 'top',
          blockId: '123',
        });
      });

      act(() => {
        result.current.close();
      });

      expect(result.current.state).toBe('closed');
      expect(result.current.view).toBe('default');
      expect(result.current.placement).toBe('bottom-start');
      expect(result.current.blockId).toBeNull();
      // reference intentionally kept (used for exit animations)
    });
  });

  describe('toggle()', () => {
    it('should switch state to open', () => {
      const { result } = renderHook(() => useActionMenuListStore());

      act(() => result.current.toggle('open'));
      expect(result.current.state).toBe('open');
    });

    it('should switch state to closed', () => {
      const { result } = renderHook(() => useActionMenuListStore());
      act(() => result.current.open());

      act(() => result.current.toggle('closed'));
      expect(result.current.state).toBe('closed');
    });
  });

  describe('setters', () => {
    it('should set view', () => {
      const { result } = renderHook(() => useActionMenuListStore());

      act(() => result.current.setView('small'));
      expect(result.current.view).toBe('small');
    });

    it('should set reference', () => {
      const { result } = renderHook(() => useActionMenuListStore());
      const ref = document.createElement('div');

      act(() => result.current.setReference(ref));
      expect(result.current.reference).toBe(ref);
    });
  });

  describe('reset()', () => {
    it('should reset to initial state', () => {
      const { result } = renderHook(() => useActionMenuListStore());

      act(() => {
        result.current.open({
          reference: document.createElement('div'),
          view: 'small',
          placement: 'left',
          blockId: 'abc',
        });
        result.current.reset();
      });

      expect(result.current.state).toBe('closed');
      expect(result.current.view).toBe('default');
      expect(result.current.reference).toBeNull();
      expect(result.current.placement).toBe('bottom-start');
      expect(result.current.blockId).toBeNull();
    });
  });

  describe('singleton behavior', () => {
    it('should share state between hook instances', () => {
      const { result: first } = renderHook(() => useActionMenuListStore());
      const { result: second } = renderHook(() => useActionMenuListStore());

      act(() => first.current.open());
      expect(second.current.state).toBe('open');

      act(() => second.current.close());
      expect(first.current.state).toBe('closed');
    });
  });

  describe('edge cases', () => {
    it('should handle close when already closed', () => {
      const { result } = renderHook(() => useActionMenuListStore());
      act(() => result.current.close());
      expect(result.current.state).toBe('closed');
    });

    it('should handle open when already open', () => {
      const { result } = renderHook(() => useActionMenuListStore());
      act(() => result.current.open());
      act(() => result.current.open({ view: 'small' }));
      expect(result.current.view).toBe('small');
    });
  });
});
