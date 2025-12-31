# splitBlock API Changes

## Summary

Updated `splitBlock` to follow the improved Blocks API pattern with better flexibility and consistency.

## Breaking Changes

### Removed
- ❌ `slate?: SlateEditor` option (now determined automatically)

### Added
- ✅ `at?: YooptaPathIndex` - specify block by path
- ✅ `blockId?: string` - specify block by id
- ✅ `splitAt?: Location` - custom split position
- ✅ `focusTarget?: 'new' | 'original' | 'none'` - control focus behavior
- ✅ `preserveContent?: boolean` - control content preservation
- ✅ **Returns**: `string | undefined` - ID of new block

## Migration Guide

### Before
```typescript
// Old API
editor.splitBlock({ slate, focus: true });
```

### After
```typescript
// New API - simpler, no need to pass slate
editor.splitBlock({ focus: true });

// Split specific block
editor.splitBlock({ at: 3 });
editor.splitBlock({ blockId: 'block-123' });

// Control focus behavior
editor.splitBlock({ focusTarget: 'original' });
editor.splitBlock({ focusTarget: 'none' });

// Custom split position
editor.splitBlock({ 
  splitAt: { path: [0, 0], offset: 5 } 
});

// Get new block ID
const newBlockId = editor.splitBlock();
```

## New Features

### 1. Flexible Block Selection
```typescript
// By current path (default)
editor.splitBlock();

// By specific path
editor.splitBlock({ at: 3 });

// By block ID
editor.splitBlock({ blockId: 'block-123' });
```

### 2. Custom Split Position
```typescript
// Split at custom position
editor.splitBlock({ 
  splitAt: { path: [0, 0], offset: 10 } 
});

// Automatically restores original selection after split
```

### 3. Advanced Focus Control
```typescript
// Focus new block (default)
editor.splitBlock({ focusTarget: 'new' });

// Focus original block
editor.splitBlock({ focusTarget: 'original' });

// Don't focus anything
editor.splitBlock({ focusTarget: 'none' });
```

### 4. Return Value
```typescript
// Get new block ID for chaining
const newBlockId = editor.splitBlock();
if (newBlockId) {
  // Do something with new block
  editor.updateBlock(newBlockId, { ... });
}
```

## Implementation Details

### Automatic Slate Resolution
The method now automatically finds the correct Slate editor:
- Uses `getBlockSlate` when `blockId` is provided
- Uses `findSlateBySelectionPath` when `at` is provided
- Falls back to `editor.path.current`

### Selection Management
- Temporarily changes selection if `splitAt` is provided
- Restores original selection after split
- Handles invalid selections gracefully

### Error Handling
- Returns `undefined` if block not found
- Returns `undefined` if slate editor not found
- Returns `undefined` if no selection available
- Gracefully handles focus errors

## Tests

Comprehensive test coverage includes:
- ✅ Basic functionality (current block, by path, by id)
- ✅ Split position (default, custom, selection restore)
- ✅ Focus behavior (new, original, none, disabled)
- ✅ Content preservation
- ✅ Operation details
- ✅ Edge cases (errors, null path, invalid selection)

See: `splitBlock.test.ts` (47 test cases)

## Updated Files

1. **splitBlock.ts** - Main implementation
2. **splitBlock.test.ts** - Test suite (NEW)
3. **onKeyDown.ts** - Updated handler to use new API
4. **BLOCKS_API_PROPOSAL.md** - API documentation

## Next Steps

Continue with other block methods:
1. ✅ **splitBlock** (DONE)
2. 🔄 **mergeBlock**
3. 🔄 **duplicateBlock**
4. 🔄 **deleteBlock**

