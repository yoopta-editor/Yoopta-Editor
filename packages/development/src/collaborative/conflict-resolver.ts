import { MoveBlockOperation, YooptaBlockData, YooptaContentValue, YooptaOperation } from '@yoopta/editor';
import type { EditorState } from './withCollaboration';

class BlockResolver {
  resolveConflicts(state: EditorState, value: YooptaContentValue): YooptaOperation[] {
    const resolvedOps: YooptaOperation[] = [];

    return this.normalizeBlockOrder(resolvedOps, value);
  }

  private resolveInsertConflict(): YooptaOperation[] {
    return [];
  }

  private normalizeBlockOrder(
    operations: YooptaOperation[],
    currentBlocks: Record<string, YooptaBlockData>,
  ): YooptaOperation[] {
    return [];
  }
}

export default BlockResolver;
