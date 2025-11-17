import { renderHook, act } from '@testing-library/react';
import { useSlashActionMenuStore } from './store';

describe('SlashActionMenuStore', () => {
  beforeEach(() => {
    // Reset store before each test
    const { result } = renderHook(() => useSlashActionMenuStore());
    act(() => {
      result.current.reset();
    });
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useSlashActionMenuStore());

      expect(result.current.state).toBe('closed');
      expect(result.current.searchText).toBe('');
      expect(result.current.selectedIndex).toBe(0);
      expect(result.current.reference).toBeNull();
    });
  });

  describe('open()', () => {
    it('should open the menu', () => {
      const { result } = renderHook(() => useSlashActionMenuStore());

      act(() => {
        result.current.open();
      });

      expect(result.current.state).toBe('open');
    });

    it('should set reference when provided', () => {
      const { result } = renderHook(() => useSlashActionMenuStore());
      const mockReference = document.createElement('div') as HTMLElement;

      act(() => {
        result.current.open(mockReference);
      });

      expect(result.current.state).toBe('open');
      expect(result.current.reference).toBe(mockReference);
    });

    it('should keep existing reference if not provided', () => {
      const { result } = renderHook(() => useSlashActionMenuStore());
      const mockReference = document.createElement('div') as HTMLElement;

      act(() => {
        result.current.open(mockReference);
      });

      act(() => {
        result.current.open();
      });

      expect(result.current.reference).toBe(mockReference);
    });
  });

  describe('close()', () => {
    it('should close the menu', () => {
      const { result } = renderHook(() => useSlashActionMenuStore());

      act(() => {
        result.current.open();
      });

      expect(result.current.state).toBe('open');

      act(() => {
        result.current.close();
      });

      expect(result.current.state).toBe('closed');
    });

    it('should reset search text and selected index on close', () => {
      const { result } = renderHook(() => useSlashActionMenuStore());

      act(() => {
        result.current.open();
        result.current.setSearchText('test');
        result.current.setSelectedIndex(2);
      });

      expect(result.current.searchText).toBe('test');
      expect(result.current.selectedIndex).toBe(2);

      act(() => {
        result.current.close();
      });

      expect(result.current.searchText).toBe('');
      expect(result.current.selectedIndex).toBe(0);
    });
  });

  describe('setSearchText()', () => {
    it('should update search text', () => {
      const { result } = renderHook(() => useSlashActionMenuStore());

      act(() => {
        result.current.setSearchText('paragraph');
      });

      expect(result.current.searchText).toBe('paragraph');
    });
  });

  describe('setSelectedIndex()', () => {
    it('should update selected index', () => {
      const { result } = renderHook(() => useSlashActionMenuStore());

      act(() => {
        result.current.setSelectedIndex(3);
      });

      expect(result.current.selectedIndex).toBe(3);
    });
  });

  describe('reset()', () => {
    it('should reset all state to initial values', () => {
      const { result } = renderHook(() => useSlashActionMenuStore());
      const mockReference = document.createElement('div') as HTMLElement;

      act(() => {
        result.current.open(mockReference);
        result.current.setSearchText('test');
        result.current.setSelectedIndex(5);
      });

      expect(result.current.state).toBe('open');
      expect(result.current.searchText).toBe('test');
      expect(result.current.selectedIndex).toBe(5);
      expect(result.current.reference).toBe(mockReference);

      act(() => {
        result.current.reset();
      });

      expect(result.current.state).toBe('closed');
      expect(result.current.searchText).toBe('');
      expect(result.current.selectedIndex).toBe(0);
      expect(result.current.reference).toBeNull();
    });
  });

  describe('Singleton behavior', () => {
    it('should share state across multiple hook instances', () => {
      const { result: result1 } = renderHook(() => useSlashActionMenuStore());
      const { result: result2 } = renderHook(() => useSlashActionMenuStore());

      act(() => {
        result1.current.open();
      });

      expect(result1.current.state).toBe('open');
      expect(result2.current.state).toBe('open');
    });

    it('should update all instances when state changes', () => {
      const { result: result1 } = renderHook(() => useSlashActionMenuStore());
      const { result: result2 } = renderHook(() => useSlashActionMenuStore());

      act(() => {
        result1.current.setSearchText('heading');
      });

      expect(result1.current.searchText).toBe('heading');
      expect(result2.current.searchText).toBe('heading');
    });
  });
});
