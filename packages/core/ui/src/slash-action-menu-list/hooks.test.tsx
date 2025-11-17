import { renderHook, act, waitFor } from '@testing-library/react';
import { useSlashActionMenuActions } from './hooks';
import { useSlashActionMenuStore } from './store';

describe('useSlashActionMenuActions', () => {
  beforeEach(() => {
    // Reset store before each test
    const { result } = renderHook(() => useSlashActionMenuStore());
    act(() => {
      result.current.reset();
    });
  });

  describe('Initial state', () => {
    it('should return correct initial state', () => {
      const { result } = renderHook(() => useSlashActionMenuActions());

      expect(result.current.isOpen).toBe(false);
      expect(typeof result.current.open).toBe('function');
      expect(typeof result.current.close).toBe('function');
    });
  });

  describe('open()', () => {
    it('should open the menu', () => {
      const { result } = renderHook(() => useSlashActionMenuActions());

      act(() => {
        result.current.open();
      });

      expect(result.current.isOpen).toBe(true);
    });

    it('should open with reference', () => {
      const { result } = renderHook(() => useSlashActionMenuActions());
      const mockReference = document.createElement('div') as HTMLElement;

      act(() => {
        result.current.open(mockReference);
      });

      expect(result.current.isOpen).toBe(true);

      // Verify store has reference
      const { result: storeResult } = renderHook(() => useSlashActionMenuStore());
      expect(storeResult.current.reference).toBe(mockReference);
    });
  });

  describe('close()', () => {
    it('should close the menu', () => {
      const { result } = renderHook(() => useSlashActionMenuActions());

      act(() => {
        result.current.open();
      });

      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.close();
      });

      expect(result.current.isOpen).toBe(false);
    });
  });

  describe('isOpen state', () => {
    it('should reflect store state', () => {
      const { result: actionsResult } = renderHook(() => useSlashActionMenuActions());
      const { result: storeResult } = renderHook(() => useSlashActionMenuStore());

      expect(actionsResult.current.isOpen).toBe(false);

      act(() => {
        storeResult.current.open();
      });

      expect(actionsResult.current.isOpen).toBe(true);

      act(() => {
        storeResult.current.close();
      });

      expect(actionsResult.current.isOpen).toBe(false);
    });
  });

  describe('Multiple instances', () => {
    it('should share actions across multiple hook instances', () => {
      const { result: result1 } = renderHook(() => useSlashActionMenuActions());
      const { result: result2 } = renderHook(() => useSlashActionMenuActions());

      act(() => {
        result1.current.open();
      });

      expect(result1.current.isOpen).toBe(true);
      expect(result2.current.isOpen).toBe(true);

      act(() => {
        result2.current.close();
      });

      expect(result1.current.isOpen).toBe(false);
      expect(result2.current.isOpen).toBe(false);
    });
  });

  describe('Performance', () => {
    it('should not cause unnecessary re-renders', () => {
      let renderCount = 0;
      const { result } = renderHook(() => {
        renderCount++;
        return useSlashActionMenuActions();
      });

      const initialRenderCount = renderCount;

      // Open/close should trigger re-renders due to isOpen changing
      act(() => {
        result.current.open();
      });

      expect(renderCount).toBeGreaterThan(initialRenderCount);

      const afterOpenCount = renderCount;

      act(() => {
        result.current.close();
      });

      expect(renderCount).toBeGreaterThan(afterOpenCount);
    });
  });
});
