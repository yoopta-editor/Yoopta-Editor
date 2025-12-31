# Blocks API Proposal

## Current State Analysis

### ✅ Good APIs (to follow as pattern)
- **insertBlock**: `(type: string, options?: InsertBlockOptions)`
  - Options: `at`, `focus`, `blockData`, `elements`
  - Clean, flexible, consistent

- **toggleBlock**: `(type: string, options?: ToggleBlockOptions)`
  - Options: `at`, `scope`, `preserveContent`, `focus`, `elements`
  - Well-structured with clear defaults

### ❌ APIs to Improve

#### 1. **mergeBlock**
**Current**: `mergeBlock(editor: YooEditor)` - no options
**Issues**:
- No way to specify which block to merge
- No control over focus behavior
- Always uses `editor.path.current`

**Proposed**:
```typescript
type MergeBlockOptions = {
  /**
   * Source block to merge (the one that will be merged into target)
   * @default editor.path.current
   */
  at?: YooptaPathIndex;
  
  /**
   * Target block to merge into (the one that will receive content)
   * If not provided, uses previous block
   * @default previous block
   */
  targetAt?: YooptaPathIndex;
  
  /**
   * Focus after merge
   * @default true
   */
  focus?: boolean;
  
  /**
   * Preserve content from source block
   * @default true
   */
  preserveContent?: boolean;
};

mergeBlock(editor: YooEditor, options?: MergeBlockOptions): void
```

**Usage examples**:
```typescript
// Merge current block into previous (default behavior)
editor.mergeBlock();

// Merge specific block into previous
editor.mergeBlock({ at: 5 });

// Merge block at index 5 into block at index 3
editor.mergeBlock({ at: 5, targetAt: 3 });

// Merge without focusing
editor.mergeBlock({ focus: false });
```

---

#### 2. **duplicateBlock**
**Current**: 
```typescript
type DuplicateBlockOptions = {
  original: { blockId?: never; path: YooptaPathIndex } | { blockId: string; path?: never };
  focus?: boolean;
  at?: YooptaPathIndex;
};
```
**Issues**:
- Complex union type for `original`
- Inconsistent with other APIs (should use `at` or `blockId` directly)

**Proposed**:
```typescript
type DuplicateBlockOptions = {
  /**
   * Block to duplicate (by path or id)
   * @default editor.path.current
   */
  at?: YooptaPathIndex;
  blockId?: string;
  
  /**
   * Position to insert duplicate
   * If not provided, inserts after original block
   * @default original.meta.order + 1
   */
  insertAt?: YooptaPathIndex;
  
  /**
   * Focus after duplicate
   * @default true
   */
  focus?: boolean;
  
  /**
   * Custom element structure for duplicate
   * If provided, overrides default duplication
   */
  elements?: SlateElement;
};

duplicateBlock(editor: YooEditor, options?: DuplicateBlockOptions): string // returns new block id
```

**Usage examples**:
```typescript
// Duplicate current block
editor.duplicateBlock();

// Duplicate specific block by path
editor.duplicateBlock({ at: 3 });

// Duplicate specific block by id
editor.duplicateBlock({ blockId: 'block-123' });

// Duplicate and insert at specific position
editor.duplicateBlock({ at: 3, insertAt: 0 });

// Duplicate without focusing
editor.duplicateBlock({ at: 3, focus: false });

// Duplicate with custom structure
editor.duplicateBlock({ 
  at: 3, 
  elements: editor.y('paragraph', { children: [editor.y.text('Custom')] })
});
```

---

#### 3. **deleteBlock**
**Current**:
```typescript
type DeleteBlockByIdOptions = { blockId: string; at?: never; };
type DeleteBlockByPathOptions = { at: YooptaPathIndex; blockId?: never; };
type DeleteBlockOptions = DeleteBlockByIdOptions | DeleteBlockByPathOptions & { focus?: boolean };
```
**Issues**:
- Complex union type
- Can be simplified

**Proposed**:
```typescript
type DeleteBlockOptions = {
  /**
   * Block to delete (by path or id)
   * @default editor.path.current
   */
  at?: YooptaPathIndex;
  blockId?: string;
  
  /**
   * Focus after delete
   * @default true
   */
  focus?: boolean;
  
  /**
   * Focus target after delete
   * - 'previous': focus previous block (default)
   * - 'next': focus next block
   * - 'none': don't focus anything
   * @default 'previous'
   */
  focusTarget?: 'previous' | 'next' | 'none';
};

deleteBlock(editor: YooEditor, options?: DeleteBlockOptions): void
```

**Usage examples**:
```typescript
// Delete current block
editor.deleteBlock();

// Delete specific block by path
editor.deleteBlock({ at: 3 });

// Delete specific block by id
editor.deleteBlock({ blockId: 'block-123' });

// Delete without focusing
editor.deleteBlock({ at: 3, focus: false });

// Delete and focus next block instead of previous
editor.deleteBlock({ at: 3, focusTarget: 'next' });
```

---

#### 4. **splitBlock**
**Current**:
```typescript
type SplitBlockOptions = {
  focus?: boolean;
  slate?: SlateEditor; // ❌ Should not be in options
};
```
**Issues**:
- `slate` should not be in options (should be determined automatically)
- No way to specify which block to split
- No control over split position

**Proposed**:
```typescript
type SplitBlockOptions = {
  /**
   * Block to split
   * @default editor.path.current
   */
  at?: YooptaPathIndex;
  blockId?: string;
  
  /**
   * Split position (selection point)
   * If not provided, uses current selection
   * @default slate.selection
   */
  splitAt?: Location;
  
  /**
   * Focus after split
   * @default true
   */
  focus?: boolean;
  
  /**
   * Focus target after split
   * - 'new': focus the new block (default)
   * - 'original': focus the original block
   * - 'none': don't focus anything
   * @default 'new'
   */
  focusTarget?: 'new' | 'original' | 'none';
  
  /**
   * Preserve content in both blocks
   * @default true
   */
  preserveContent?: boolean;
};

splitBlock(editor: YooEditor, options?: SplitBlockOptions): string // returns new block id
```

**Usage examples**:
```typescript
// Split current block at selection
editor.splitBlock();

// Split specific block
editor.splitBlock({ at: 3 });

// Split at specific position
editor.splitBlock({ at: 3, splitAt: { path: [0, 0, 5], offset: 10 } });

// Split without focusing
editor.splitBlock({ at: 3, focus: false });

// Split and focus original block
editor.splitBlock({ at: 3, focusTarget: 'original' });
```

---

## Summary of Improvements

### Consistency
- All methods now follow the same pattern: `(editor, options?)` where options have `at`/`blockId`, `focus`, etc.
- Default behavior uses `editor.path.current` when `at`/`blockId` not provided
- All methods have `focus` option with sensible defaults

### Flexibility
- Can specify blocks by path (`at`) or id (`blockId`)
- More control over focus behavior
- Additional options for specific use cases

### Simplicity
- Removed complex union types
- Clear, intuitive API
- Better TypeScript inference

### Return Values
- `duplicateBlock` and `splitBlock` return new block id (useful for chaining)
- `mergeBlock` and `deleteBlock` return void (no new block created)

