import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBlockOptionsStore } from './store';

describe('BlockOptionsStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useBlockOptionsStore());
    act(() => {
      // Reset store to initial state
      result.current.reset();
    });
  });

  describe('Initial State', () => {
    it('should initialize with closed state', () => {
      const { result } = renderHook(() => useBlockOptionsStore());

      expect(result.current.state).toBe('closed');
      expect(result.current.blockId).toBeNull();
      expect(result.current.reference).toBeNull();
    });
  });

  describe('Open Action', () => {
    it('should open with reference and blockId', () => {
      const { result } = renderHook(() => useBlockOptionsStore());
      const mockReference = document.createElement('div');
      const blockId = 'test-block-id';

      act(() => {
        result.current.open({ reference: mockReference, blockId });
      });

      expect(result.current.state).toBe('open');
      expect(result.current.reference).toBe(mockReference);
      expect(result.current.blockId).toBe(blockId);
    });

    it('should open with only reference', () => {
      const { result } = renderHook(() => useBlockOptionsStore());
      const mockReference = document.createElement('div');

      act(() => {
        result.current.open({ reference: mockReference });
      });

      expect(result.current.state).toBe('open');
      expect(result.current.reference).toBe(mockReference);
      expect(result.current.blockId).toBeNull();
    });

    it('should update reference when opening again', () => {
      const { result } = renderHook(() => useBlockOptionsStore());
      const ref1 = document.createElement('div');
      const ref2 = document.createElement('div');

      act(() => {
        result.current.open({ reference: ref1, blockId: 'block-1' });
      });

      act(() => {
        result.current.open({ reference: ref2, blockId: 'block-2' });
      });

      expect(result.current.state).toBe('open');
      expect(result.current.reference).toBe(ref2);
      expect(result.current.blockId).toBe('block-2');
    });
  });

  describe('Close Action', () => {
    it('should close and reset reference and blockId', () => {
      const { result } = renderHook(() => useBlockOptionsStore());
      const mockReference = document.createElement('div');

      act(() => {
        result.current.open({ reference: mockReference, blockId: 'block-1' });
      });

      act(() => {
        result.current.close();
      });

      expect(result.current.state).toBe('closed');
      expect(result.current.reference).toBeNull();
      expect(result.current.blockId).toBeNull();
    });

    it('should handle closing when already closed', () => {
      const { result } = renderHook(() => useBlockOptionsStore());

      act(() => {
        result.current.close();
      });

      expect(result.current.state).toBe('closed');
      expect(result.current.reference).toBeNull();
      expect(result.current.blockId).toBeNull();
    });
  });

  describe('Toggle Action (Legacy)', () => {
    it('should open with reference and blockId', () => {
      const { result } = renderHook(() => useBlockOptionsStore());
      const mockReference = document.createElement('div');
      const blockId = 'test-block-id';

      act(() => {
        result.current.toggle('open', mockReference, blockId);
      });

      expect(result.current.state).toBe('open');
      expect(result.current.reference).toBe(mockReference);
      expect(result.current.blockId).toBe(blockId);
    });

    it('should close and reset reference', () => {
      const { result } = renderHook(() => useBlockOptionsStore());
      const mockReference = document.createElement('div');

      act(() => {
        result.current.toggle('open', mockReference, 'block-1');
      });

      act(() => {
        result.current.toggle('closed', null);
      });

      expect(result.current.state).toBe('closed');
      expect(result.current.reference).toBeNull();
      expect(result.current.blockId).toBeNull();
    });

    it('should handle toggle without blockId', () => {
      const { result } = renderHook(() => useBlockOptionsStore());
      const mockReference = document.createElement('div');

      act(() => {
        result.current.toggle('open', mockReference);
      });

      expect(result.current.state).toBe('open');
      expect(result.current.reference).toBe(mockReference);
      expect(result.current.blockId).toBeNull();
    });
  });

  describe('setReference', () => {
    it('should set reference node', () => {
      const { result } = renderHook(() => useBlockOptionsStore());
      const mockNode = document.createElement('div');

      act(() => {
        result.current.setReference(mockNode);
      });

      expect(result.current.reference).toBe(mockNode);
    });

    it('should clear reference when set to null', () => {
      const { result } = renderHook(() => useBlockOptionsStore());
      const mockNode = document.createElement('div');

      act(() => {
        result.current.setReference(mockNode);
      });

      act(() => {
        result.current.setReference(null);
      });

      expect(result.current.reference).toBeNull();
    });

    it('should update reference without changing state', () => {
      const { result } = renderHook(() => useBlockOptionsStore());
      const mockNode1 = document.createElement('div');
      const mockNode2 = document.createElement('div');

      act(() => {
        result.current.open({ reference: mockNode1, blockId: 'block-1' });
      });

      act(() => {
        result.current.setReference(mockNode2);
      });

      expect(result.current.state).toBe('open');
      expect(result.current.reference).toBe(mockNode2);
      expect(result.current.blockId).toBe('block-1');
    });
  });

  describe('Reset Action', () => {
    it('should reset all state to initial values', () => {
      const { result } = renderHook(() => useBlockOptionsStore());
      const mockReference = document.createElement('div');

      act(() => {
        result.current.open({ reference: mockReference, blockId: 'block-1' });
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.state).toBe('closed');
      expect(result.current.reference).toBeNull();
      expect(result.current.blockId).toBeNull();
    });
  });

  describe('Multiple Operations', () => {
    it('should handle opening for different blocks', () => {
      const { result } = renderHook(() => useBlockOptionsStore());
      const ref1 = document.createElement('div');
      const ref2 = document.createElement('div');

      act(() => {
        result.current.open({ reference: ref1, blockId: 'block-1' });
      });
      expect(result.current.blockId).toBe('block-1');
      expect(result.current.reference).toBe(ref1);

      act(() => {
        result.current.open({ reference: ref2, blockId: 'block-2' });
      });
      expect(result.current.blockId).toBe('block-2');
      expect(result.current.reference).toBe(ref2);
    });

    it('should maintain state consistency', () => {
      const { result } = renderHook(() => useBlockOptionsStore());
      const mockRef = document.createElement('div');

      act(() => {
        result.current.open({ reference: mockRef, blockId: 'block-1' });
      });

      const stateSnapshot = {
        state: result.current.state,
        blockId: result.current.blockId,
        reference: result.current.reference,
      };

      expect(stateSnapshot).toEqual({
        state: 'open',
        blockId: 'block-1',
        reference: mockRef,
      });
    });
  });

  describe('Store Singleton', () => {
    it('should share state across multiple hook calls', () => {
      const { result: result1 } = renderHook(() => useBlockOptionsStore());
      const { result: result2 } = renderHook(() => useBlockOptionsStore());

      const mockReference = document.createElement('div');

      act(() => {
        result1.current.open({ reference: mockReference, blockId: 'block-1' });
      });

      // Both hooks should see the same state
      expect(result1.current.state).toBe('open');
      expect(result2.current.state).toBe('open');
      expect(result1.current.blockId).toBe('block-1');
      expect(result2.current.blockId).toBe('block-1');
      expect(result1.current.reference).toBe(mockReference);
      expect(result2.current.reference).toBe(mockReference);
    });

    it('should update all hook instances when state changes', () => {
      const { result: result1 } = renderHook(() => useBlockOptionsStore());
      const { result: result2 } = renderHook(() => useBlockOptionsStore());

      const mockReference = document.createElement('div');

      act(() => {
        result1.current.open({ reference: mockReference, blockId: 'block-1' });
      });

      act(() => {
        result2.current.close();
      });

      // Both hooks should see the closed state
      expect(result1.current.state).toBe('closed');
      expect(result2.current.state).toBe('closed');
      expect(result1.current.blockId).toBeNull();
      expect(result2.current.blockId).toBeNull();
    });
  });
});
