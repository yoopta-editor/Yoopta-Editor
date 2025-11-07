import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBlockOptionsStore } from './store';

describe('BlockOptionsStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useBlockOptionsStore());
    act(() => {
      // Reset store to initial state
      result.current.toggle('closed', null);
    });
  });

  describe('Initial State', () => {
    it('should initialize with closed state', () => {
      const { result } = renderHook(() => useBlockOptionsStore());

      expect(result.current.state).toBe('closed');
      expect(result.current.blockId).toBeNull();
    });

    it('should have null references initially', () => {
      const { result } = renderHook(() => useBlockOptionsStore());

      expect(result.current.refs.floating).toBeNull();
      expect(result.current.refs.reference).toBeNull();
    });
  });

  describe('Toggle State', () => {
    it('should open with reference and blockId', () => {
      const { result } = renderHook(() => useBlockOptionsStore());
      const mockReference = document.createElement('div');
      const blockId = 'test-block-id';

      act(() => {
        result.current.toggle('open', mockReference, blockId);
      });

      expect(result.current.state).toBe('open');
      expect(result.current.refs.reference).toBe(mockReference);
      expect(result.current.blockId).toBe(blockId);
    });

    it('should close and reset reference', () => {
      const { result } = renderHook(() => useBlockOptionsStore());
      const mockReference = document.createElement('div');

      act(() => {
        result.current.toggle('open', mockReference, 'block-1');
        result.current.toggle('closed', null);
      });

      expect(result.current.state).toBe('closed');
      expect(result.current.refs.reference).toBeNull();
      expect(result.current.blockId).toBeNull();
    });

    it('should handle toggle without blockId', () => {
      const { result } = renderHook(() => useBlockOptionsStore());
      const mockReference = document.createElement('div');

      act(() => {
        result.current.toggle('open', mockReference);
      });

      expect(result.current.state).toBe('open');
      expect(result.current.refs.reference).toBe(mockReference);
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

      expect(result.current.refs.reference).toBe(mockNode);
    });

    it('should clear reference when set to null', () => {
      const { result } = renderHook(() => useBlockOptionsStore());
      const mockNode = document.createElement('div');

      act(() => {
        result.current.setReference(mockNode);
        result.current.setReference(null);
      });

      expect(result.current.refs.reference).toBeNull();
    });

    it('should update reference without changing state', () => {
      const { result } = renderHook(() => useBlockOptionsStore());
      const mockNode1 = document.createElement('div');
      const mockNode2 = document.createElement('div');

      act(() => {
        result.current.toggle('open', mockNode1, 'block-1');
        result.current.setReference(mockNode2);
      });

      expect(result.current.state).toBe('open');
      expect(result.current.refs.reference).toBe(mockNode2);
    });
  });

  describe('Multiple Operations', () => {
    it('should handle opening for different blocks', () => {
      const { result } = renderHook(() => useBlockOptionsStore());
      const ref1 = document.createElement('div');
      const ref2 = document.createElement('div');

      act(() => {
        result.current.toggle('open', ref1, 'block-1');
      });
      expect(result.current.blockId).toBe('block-1');

      act(() => {
        result.current.toggle('open', ref2, 'block-2');
      });
      expect(result.current.blockId).toBe('block-2');
      expect(result.current.refs.reference).toBe(ref2);
    });

    it('should maintain state consistency', () => {
      const { result } = renderHook(() => useBlockOptionsStore());
      const mockRef = document.createElement('div');

      act(() => {
        result.current.toggle('open', mockRef, 'block-1');
      });

      const stateSnapshot = {
        state: result.current.state,
        blockId: result.current.blockId,
        reference: result.current.refs.reference,
      };

      expect(stateSnapshot).toEqual({
        state: 'open',
        blockId: 'block-1',
        reference: mockRef,
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle closing when already closed', () => {
      const { result } = renderHook(() => useBlockOptionsStore());

      act(() => {
        result.current.toggle('closed', null);
        result.current.toggle('closed', null);
      });

      expect(result.current.state).toBe('closed');
    });

    it('should handle opening when already open', () => {
      const { result } = renderHook(() => useBlockOptionsStore());
      const ref1 = document.createElement('div');
      const ref2 = document.createElement('div');

      act(() => {
        result.current.toggle('open', ref1, 'block-1');
        result.current.toggle('open', ref2, 'block-2');
      });

      expect(result.current.state).toBe('open');
      expect(result.current.blockId).toBe('block-2');
      expect(result.current.refs.reference).toBe(ref2);
    });
  });
});
