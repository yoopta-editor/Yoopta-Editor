import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToolbarStore } from './store';

describe('ToolbarStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useToolbarStore());
    act(() => {
      result.current.reset();
    });
  });

  describe('Initial State', () => {
    it('should initialize with closed state', () => {
      const { result } = renderHook(() => useToolbarStore());

      expect(result.current.state).toBe('closed');
      expect(result.current.frozen).toBe(false);
    });

    it('should have initial styles', () => {
      const { result } = renderHook(() => useToolbarStore());

      expect(result.current.styles).toBeDefined();
      expect(result.current.styles.position).toBe('absolute');
    });
  });

  describe('Open/Close', () => {
    it('should open toolbar', () => {
      const { result } = renderHook(() => useToolbarStore());

      act(() => {
        result.current.open();
      });

      expect(result.current.state).toBe('open');
    });

    it('should close toolbar', () => {
      const { result } = renderHook(() => useToolbarStore());

      act(() => {
        result.current.open();
        result.current.close();
      });

      expect(result.current.state).toBe('closed');
    });

    it('should reset frozen state when closing', () => {
      const { result } = renderHook(() => useToolbarStore());

      act(() => {
        result.current.open();
        result.current.setFrozen(true);
        result.current.close();
      });

      expect(result.current.state).toBe('closed');
      expect(result.current.frozen).toBe(false);
    });
  });

  describe('Toggle', () => {
    it('should toggle to open', () => {
      const { result } = renderHook(() => useToolbarStore());

      act(() => {
        result.current.toggle('open');
      });

      expect(result.current.state).toBe('open');
    });

    it('should toggle to closed', () => {
      const { result } = renderHook(() => useToolbarStore());

      act(() => {
        result.current.open();
        result.current.toggle('closed');
      });

      expect(result.current.state).toBe('closed');
    });
  });

  describe('Frozen State', () => {
    it('should freeze toolbar', () => {
      const { result } = renderHook(() => useToolbarStore());

      act(() => {
        result.current.setFrozen(true);
      });

      expect(result.current.frozen).toBe(true);
    });

    it('should unfreeze toolbar', () => {
      const { result } = renderHook(() => useToolbarStore());

      act(() => {
        result.current.setFrozen(true);
        result.current.setFrozen(false);
      });

      expect(result.current.frozen).toBe(false);
    });
  });

  describe('Styles', () => {
    it('should update styles', () => {
      const { result } = renderHook(() => useToolbarStore());
      const newStyles = {
        opacity: 1,
        top: 100,
        left: 200,
      };

      act(() => {
        result.current.updateStyles(newStyles);
      });

      expect(result.current.styles).toEqual(newStyles);
    });
  });

  describe('Reset', () => {
    it('should reset to initial state', () => {
      const { result } = renderHook(() => useToolbarStore());

      act(() => {
        result.current.open();
        result.current.setFrozen(true);
        result.current.updateStyles({ opacity: 1 });
        result.current.reset();
      });

      expect(result.current.state).toBe('closed');
      expect(result.current.frozen).toBe(false);
      expect(result.current.styles.position).toBe('absolute');
    });
  });
});
