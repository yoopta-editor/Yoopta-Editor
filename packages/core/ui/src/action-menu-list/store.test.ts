import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useActionMenuListStore } from './store';

describe('ActionMenuListStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useActionMenuListStore());
    act(() => {
      result.current.reset();
    });
  });

  describe('Initial State', () => {
    it('should initialize with closed state', () => {
      const { result } = renderHook(() => useActionMenuListStore());

      expect(result.current.state).toBe('closed');
      expect(result.current.searchText).toBe('');
      expect(result.current.selectedIndex).toBe(0);
    });

    it('should have initial styles', () => {
      const { result } = renderHook(() => useActionMenuListStore());

      expect(result.current.styles).toBeDefined();
      expect(result.current.styles.position).toBe('absolute');
      expect(result.current.styles.opacity).toBe(0);
      expect(result.current.styles.pointerEvents).toBe('none');
    });
  });

  describe('Open/Close', () => {
    it('should open menu', () => {
      const { result } = renderHook(() => useActionMenuListStore());

      act(() => {
        result.current.open();
      });

      expect(result.current.state).toBe('open');
    });

    it('should close menu and reset search', () => {
      const { result } = renderHook(() => useActionMenuListStore());

      act(() => {
        result.current.open();
        result.current.setSearchText('test');
        result.current.setSelectedIndex(5);
        result.current.close();
      });

      expect(result.current.state).toBe('closed');
      expect(result.current.searchText).toBe('');
      expect(result.current.selectedIndex).toBe(0);
    });

    it('should toggle to open', () => {
      const { result } = renderHook(() => useActionMenuListStore());

      act(() => {
        result.current.toggle('open');
      });

      expect(result.current.state).toBe('open');
    });

    it('should toggle to closed', () => {
      const { result } = renderHook(() => useActionMenuListStore());

      act(() => {
        result.current.open();
        result.current.toggle('closed');
      });

      expect(result.current.state).toBe('closed');
    });
  });

  describe('Search Text', () => {
    it('should set search text', () => {
      const { result } = renderHook(() => useActionMenuListStore());

      act(() => {
        result.current.setSearchText('heading');
      });

      expect(result.current.searchText).toBe('heading');
    });

    it('should reset selected index when setting search text', () => {
      const { result } = renderHook(() => useActionMenuListStore());

      act(() => {
        result.current.setSelectedIndex(5);
        result.current.setSearchText('paragraph');
      });

      expect(result.current.searchText).toBe('paragraph');
      expect(result.current.selectedIndex).toBe(0);
    });

    it('should handle empty search text', () => {
      const { result } = renderHook(() => useActionMenuListStore());

      act(() => {
        result.current.setSearchText('test');
        result.current.setSearchText('');
      });

      expect(result.current.searchText).toBe('');
    });
  });

  describe('Selected Index', () => {
    it('should set selected index', () => {
      const { result } = renderHook(() => useActionMenuListStore());

      act(() => {
        result.current.setSelectedIndex(3);
      });

      expect(result.current.selectedIndex).toBe(3);
    });

    it('should update selected index multiple times', () => {
      const { result } = renderHook(() => useActionMenuListStore());

      act(() => {
        result.current.setSelectedIndex(1);
      });
      expect(result.current.selectedIndex).toBe(1);

      act(() => {
        result.current.setSelectedIndex(5);
      });
      expect(result.current.selectedIndex).toBe(5);
    });

    it('should handle negative index', () => {
      const { result } = renderHook(() => useActionMenuListStore());

      act(() => {
        result.current.setSelectedIndex(-1);
      });

      expect(result.current.selectedIndex).toBe(-1);
    });
  });

  describe('Styles', () => {
    it('should update styles', () => {
      const { result } = renderHook(() => useActionMenuListStore());
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

    it('should partially update styles', () => {
      const { result } = renderHook(() => useActionMenuListStore());

      act(() => {
        result.current.updateStyles({ opacity: 1 });
      });

      expect(result.current.styles.opacity).toBe(1);
    });

    it('should update styles multiple times', () => {
      const { result } = renderHook(() => useActionMenuListStore());

      act(() => {
        result.current.updateStyles({ opacity: 0.5 });
      });
      expect(result.current.styles.opacity).toBe(0.5);

      act(() => {
        result.current.updateStyles({ opacity: 1, transform: 'translateY(0)' });
      });
      expect(result.current.styles.opacity).toBe(1);
      expect(result.current.styles.transform).toBe('translateY(0)');
    });
  });

  describe('Reset', () => {
    it('should reset to initial state', () => {
      const { result } = renderHook(() => useActionMenuListStore());

      act(() => {
        result.current.open();
        result.current.setSearchText('test');
        result.current.setSelectedIndex(5);
        result.current.updateStyles({ opacity: 1 });
        result.current.reset();
      });

      expect(result.current.state).toBe('closed');
      expect(result.current.searchText).toBe('');
      expect(result.current.selectedIndex).toBe(0);
      expect(result.current.styles.opacity).toBe(0);
      expect(result.current.styles.pointerEvents).toBe('none');
    });

    it('should reset styles correctly', () => {
      const { result } = renderHook(() => useActionMenuListStore());

      act(() => {
        result.current.updateStyles({ opacity: 1, transform: 'translateY(0)' });
        result.current.reset();
      });

      expect(result.current.styles.position).toBe('absolute');
      expect(result.current.styles.opacity).toBe(0);
      expect(result.current.styles.pointerEvents).toBe('none');
      expect(result.current.styles.transform).toBe('translateY(-4px)');
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle typical menu flow', () => {
      const { result } = renderHook(() => useActionMenuListStore());

      // Open menu
      act(() => {
        result.current.open();
      });
      expect(result.current.state).toBe('open');

      // User types search
      act(() => {
        result.current.setSearchText('head');
      });
      expect(result.current.searchText).toBe('head');
      expect(result.current.selectedIndex).toBe(0);

      // User navigates
      act(() => {
        result.current.setSelectedIndex(2);
      });
      expect(result.current.selectedIndex).toBe(2);

      // User selects and closes
      act(() => {
        result.current.close();
      });
      expect(result.current.state).toBe('closed');
      expect(result.current.searchText).toBe('');
      expect(result.current.selectedIndex).toBe(0);
    });

    it('should handle search refinement', () => {
      const { result } = renderHook(() => useActionMenuListStore());

      act(() => {
        result.current.open();
        result.current.setSearchText('h');
      });
      expect(result.current.searchText).toBe('h');

      act(() => {
        result.current.setSearchText('he');
      });
      expect(result.current.searchText).toBe('he');
      expect(result.current.selectedIndex).toBe(0);

      act(() => {
        result.current.setSearchText('hea');
      });
      expect(result.current.searchText).toBe('hea');
      expect(result.current.selectedIndex).toBe(0);
    });

    it('should maintain state consistency', () => {
      const { result } = renderHook(() => useActionMenuListStore());

      act(() => {
        result.current.open();
        result.current.setSearchText('test');
        result.current.setSelectedIndex(3);
      });

      const stateSnapshot = {
        state: result.current.state,
        searchText: result.current.searchText,
        selectedIndex: result.current.selectedIndex,
      };

      expect(stateSnapshot).toEqual({
        state: 'open',
        searchText: 'test',
        selectedIndex: 3,
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle closing when already closed', () => {
      const { result } = renderHook(() => useActionMenuListStore());

      act(() => {
        result.current.close();
        result.current.close();
      });

      expect(result.current.state).toBe('closed');
    });

    it('should handle opening when already open', () => {
      const { result } = renderHook(() => useActionMenuListStore());

      act(() => {
        result.current.open();
        result.current.setSearchText('test');
        result.current.open();
      });

      expect(result.current.state).toBe('open');
      expect(result.current.searchText).toBe('test');
    });

    it('should handle rapid state changes', () => {
      const { result } = renderHook(() => useActionMenuListStore());

      act(() => {
        result.current.open();
        result.current.close();
        result.current.open();
        result.current.toggle('closed');
        result.current.toggle('open');
      });

      expect(result.current.state).toBe('open');
    });

    it('should handle empty string search', () => {
      const { result } = renderHook(() => useActionMenuListStore());

      act(() => {
        result.current.setSearchText('');
      });

      expect(result.current.searchText).toBe('');
      expect(result.current.selectedIndex).toBe(0);
    });
  });
});
