import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFloatingBlockActionsStore } from './store';

describe('FloatingBlockActionsStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useFloatingBlockActionsStore());
    act(() => {
      result.current.reset();
    });
  });

  describe('Initial State', () => {
    it('should initialize with closed state', () => {
      const { result } = renderHook(() => useFloatingBlockActionsStore());

      expect(result.current.state).toBe('closed');
      expect(result.current.blockId).toBeNull();
    });

    it('should have initial position', () => {
      const { result } = renderHook(() => useFloatingBlockActionsStore());

      expect(result.current.position).toEqual({ top: 0, left: 0 });
    });

    it('should have initial styles', () => {
      const { result } = renderHook(() => useFloatingBlockActionsStore());

      expect(result.current.styles).toBeDefined();
      expect(result.current.styles.position).toBe('fixed');
      expect(result.current.styles.opacity).toBe(0);
      expect(result.current.styles.pointerEvents).toBe('none');
    });

    it('should have null reference initially', () => {
      const { result } = renderHook(() => useFloatingBlockActionsStore());

      expect(result.current.reference).toBeNull();
    });
  });

  describe('Toggle State', () => {
    it('should toggle to hovering state', () => {
      const { result } = renderHook(() => useFloatingBlockActionsStore());

      act(() => {
        result.current.toggle('hovering', 'block-1');
      });

      expect(result.current.state).toBe('hovering');
      expect(result.current.blockId).toBe('block-1');
    });

    it('should toggle to frozen state', () => {
      const { result } = renderHook(() => useFloatingBlockActionsStore());

      act(() => {
        result.current.toggle('frozen', 'block-1');
      });

      expect(result.current.state).toBe('frozen');
      expect(result.current.blockId).toBe('block-1');
    });

    it('should toggle to closed state', () => {
      const { result } = renderHook(() => useFloatingBlockActionsStore());

      act(() => {
        result.current.toggle('hovering', 'block-1');
        result.current.toggle('closed');
      });

      expect(result.current.state).toBe('closed');
      expect(result.current.blockId).toBeNull();
    });

    it('should handle toggle without blockId', () => {
      const { result } = renderHook(() => useFloatingBlockActionsStore());

      act(() => {
        result.current.toggle('hovering');
      });

      expect(result.current.state).toBe('hovering');
      expect(result.current.blockId).toBeNull();
    });
  });

  describe('Position Updates', () => {
    it('should update position and styles', () => {
      const { result } = renderHook(() => useFloatingBlockActionsStore());

      act(() => {
        result.current.updatePosition(100, 200);
      });

      expect(result.current.position).toEqual({ top: 100, left: 200 });
      expect(result.current.styles.top).toBe(100);
      expect(result.current.styles.left).toBeDefined();
      expect(result.current.styles.opacity).toBe(1);
      expect(result.current.styles.pointerEvents).toBe('auto');
    });

    it('should calculate left position with blockActionsWidth', () => {
      const { result } = renderHook(() => useFloatingBlockActionsStore());
      const blockActionsWidth = 50;

      act(() => {
        result.current.updatePosition(100, 200, blockActionsWidth);
      });

      expect(result.current.position).toEqual({ top: 100, left: 200 });
      expect(result.current.styles.left).toBe(200);
      expect(result.current.styles.transform).toBe(
        `scale(1) translateX(-${blockActionsWidth + 2}px)`,
      );
    });

    it('should use default blockActionsWidth when not provided', () => {
      const { result } = renderHook(() => useFloatingBlockActionsStore());

      act(() => {
        result.current.updatePosition(100, 200);
      });

      // Default width is 46, transform uses (46 + 2)px
      expect(result.current.styles.left).toBe(200);
      expect(result.current.styles.transform).toBe('scale(1) translateX(-48px)');
    });

    it('should update position multiple times', () => {
      const { result } = renderHook(() => useFloatingBlockActionsStore());

      act(() => {
        result.current.updatePosition(100, 200);
      });
      expect(result.current.position.top).toBe(100);

      act(() => {
        result.current.updatePosition(150, 250);
      });
      expect(result.current.position).toEqual({ top: 150, left: 250 });
    });
  });

  describe('Hide', () => {
    it('should hide floating actions', () => {
      const { result } = renderHook(() => useFloatingBlockActionsStore());

      act(() => {
        result.current.updatePosition(100, 200);
        result.current.hide();
      });

      expect(result.current.styles.opacity).toBe(0);
      expect(result.current.styles.pointerEvents).toBe('none');
      expect(result.current.styles.transform).toContain('scale(0.95)');
    });

    it('should maintain position when hidden', () => {
      const { result } = renderHook(() => useFloatingBlockActionsStore());

      act(() => {
        result.current.updatePosition(100, 200);
        result.current.hide();
      });

      expect(result.current.position).toEqual({ top: 100, left: 200 });
    });
  });

  describe('setReference', () => {
    it('should set reference element', () => {
      const { result } = renderHook(() => useFloatingBlockActionsStore());
      const mockElement = document.createElement('div');

      act(() => {
        result.current.setReference(mockElement);
      });

      expect(result.current.reference).toBe(mockElement);
    });

    it('should clear reference when set to null', () => {
      const { result } = renderHook(() => useFloatingBlockActionsStore());
      const mockElement = document.createElement('div');

      act(() => {
        result.current.setReference(mockElement);
        result.current.setReference(null);
      });

      expect(result.current.reference).toBeNull();
    });
  });

  describe('Reset', () => {
    it('should reset to initial state', () => {
      const { result } = renderHook(() => useFloatingBlockActionsStore());
      const mockElement = document.createElement('div');

      act(() => {
        result.current.toggle('frozen', 'block-1');
        result.current.updatePosition(100, 200);
        result.current.setReference(mockElement);
        result.current.reset();
      });

      expect(result.current.state).toBe('closed');
      expect(result.current.blockId).toBeNull();
      expect(result.current.position).toEqual({ top: 0, left: 0 });
      expect(result.current.styles.opacity).toBe(0);
      expect(result.current.styles.pointerEvents).toBe('none');
      // Note: reset() doesn't reset reference in the actual implementation
      expect(result.current.reference).toBe(mockElement);
    });

    it('should reset styles correctly', () => {
      const { result } = renderHook(() => useFloatingBlockActionsStore());

      act(() => {
        result.current.updatePosition(100, 200);
        result.current.reset();
      });

      expect(result.current.styles.position).toBe('fixed');
      expect(result.current.styles.opacity).toBe(0);
      expect(result.current.styles.pointerEvents).toBe('none');
      expect(result.current.styles.transform).toContain('translateX(-46px)');
    });
  });

  describe('State Transitions', () => {
    it('should transition from hovering to frozen', () => {
      const { result } = renderHook(() => useFloatingBlockActionsStore());

      act(() => {
        result.current.toggle('hovering', 'block-1');
      });
      expect(result.current.state).toBe('hovering');

      act(() => {
        result.current.toggle('frozen', 'block-1');
      });
      expect(result.current.state).toBe('frozen');
      expect(result.current.blockId).toBe('block-1');
    });

    it('should transition from frozen to hovering', () => {
      const { result } = renderHook(() => useFloatingBlockActionsStore());

      act(() => {
        result.current.toggle('frozen', 'block-1');
        result.current.toggle('hovering', 'block-2');
      });

      expect(result.current.state).toBe('hovering');
      expect(result.current.blockId).toBe('block-2');
    });

    it('should transition from any state to closed', () => {
      const { result } = renderHook(() => useFloatingBlockActionsStore());

      act(() => {
        result.current.toggle('hovering', 'block-1');
        result.current.toggle('closed');
      });
      expect(result.current.state).toBe('closed');

      act(() => {
        result.current.toggle('frozen', 'block-2');
        result.current.toggle('closed');
      });
      expect(result.current.state).toBe('closed');
    });
  });

  describe('Styles with Transitions', () => {
    it('should include transition property in styles', () => {
      const { result } = renderHook(() => useFloatingBlockActionsStore());

      expect(result.current.styles.transition).toContain('opacity');
      expect(result.current.styles.transition).toContain('transform');
    });

    it('should maintain transition after position update', () => {
      const { result } = renderHook(() => useFloatingBlockActionsStore());

      act(() => {
        result.current.updatePosition(100, 200);
      });

      expect(result.current.styles.transition).toContain('opacity');
      expect(result.current.styles.transition).toContain('transform');
    });

    it('should show visible styles when position updated', () => {
      const { result } = renderHook(() => useFloatingBlockActionsStore());

      act(() => {
        result.current.updatePosition(100, 200);
      });

      expect(result.current.styles.opacity).toBe(1);
      expect(result.current.styles.pointerEvents).toBe('auto');
      // Default blockActionsWidth is 46, so transform is (46 + 2)px = 48px
      expect(result.current.styles.transform).toBe('scale(1) translateX(-48px)');
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid state changes', () => {
      const { result } = renderHook(() => useFloatingBlockActionsStore());

      act(() => {
        result.current.toggle('hovering', 'block-1');
        result.current.toggle('frozen', 'block-1');
        result.current.toggle('closed');
        result.current.toggle('hovering', 'block-2');
      });

      expect(result.current.state).toBe('hovering');
      expect(result.current.blockId).toBe('block-2');
    });

    it('should handle position updates without state change', () => {
      const { result } = renderHook(() => useFloatingBlockActionsStore());

      act(() => {
        result.current.updatePosition(100, 200);
        result.current.updatePosition(150, 250);
        result.current.updatePosition(200, 300);
      });

      expect(result.current.position).toEqual({ top: 200, left: 300 });
      expect(result.current.state).toBe('closed');
    });

    it('should handle hide after multiple position updates', () => {
      const { result } = renderHook(() => useFloatingBlockActionsStore());

      act(() => {
        result.current.updatePosition(100, 200);
        result.current.updatePosition(150, 250);
        result.current.hide();
      });

      expect(result.current.styles.opacity).toBe(0);
      expect(result.current.position).toEqual({ top: 150, left: 250 });
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle typical hover flow', () => {
      const { result } = renderHook(() => useFloatingBlockActionsStore());

      // Mouse enters block
      act(() => {
        result.current.toggle('hovering', 'block-1');
        result.current.updatePosition(100, 200);
      });

      expect(result.current.state).toBe('hovering');
      expect(result.current.blockId).toBe('block-1');
      expect(result.current.styles.opacity).toBe(1);

      // Mouse leaves
      act(() => {
        result.current.toggle('closed');
        result.current.hide();
      });

      expect(result.current.state).toBe('closed');
      expect(result.current.styles.opacity).toBe(0);
    });

    it('should handle frozen state flow', () => {
      const { result } = renderHook(() => useFloatingBlockActionsStore());

      // Hover and open menu
      act(() => {
        result.current.toggle('hovering', 'block-1');
        result.current.updatePosition(100, 200);
        result.current.toggle('frozen', 'block-1');
      });

      expect(result.current.state).toBe('frozen');

      // Menu closes, resume hovering
      act(() => {
        result.current.toggle('hovering', 'block-1');
      });

      expect(result.current.state).toBe('hovering');
    });
  });
});
