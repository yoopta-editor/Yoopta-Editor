# @yoopta/ui Integration Examples

## Complete Example with FloatingBlockActions + BlockOptions

```tsx
import { YooptaUI, FloatingBlockActions, BlockOptions, useBlockOptions } from '@yoopta/ui';
import { useYooptaEditor } from '@yoopta/editor';
import YooptaEditor, { createYooptaEditor } from '@yoopta/editor';
import { PlusIcon, TrashIcon, CopyIcon, Link2Icon } from 'lucide-react';
import { DragHandleDots2Icon } from '@radix-ui/react-icons';

// FloatingBlockActions Component
const FloatingBlockActionsComponent = () => {
  const editor = useYooptaEditor();
  const { open } = useBlockOptions();

  const onPlusClick = (e: React.MouseEvent) => {
    editor.insertBlock('text', { at: editor.path.current, focus: true });
  };

  const onDragClick = (e: React.MouseEvent) => {
    // Open BlockOptions - this will freeze FloatingBlockActions
    open({
      ref: e.currentTarget as HTMLElement,
    });
  };

  return (
    <FloatingBlockActions>
      <FloatingBlockActions.Button onClick={onPlusClick} title="Add block">
        <PlusIcon size={16} />
      </FloatingBlockActions.Button>
      <FloatingBlockActions.Button onClick={onDragClick} title="Open menu">
        <DragHandleDots2Icon />
      </FloatingBlockActions.Button>
    </FloatingBlockActions>
  );
};

// BlockOptions Component
const BlockOptionsComponent = () => {
  const { isOpen, duplicateBlock, copyBlockLink, deleteBlock } = useBlockOptions();

  if (!isOpen) return null;

  return (
    <BlockOptions>
      <BlockOptions.Content>
        <BlockOptions.Group>
          <BlockOptions.Button icon={<CopyIcon />} onClick={duplicateBlock}>
            Duplicate
          </BlockOptions.Button>
          <BlockOptions.Button icon={<Link2Icon />} onClick={copyBlockLink}>
            Copy link to block
          </BlockOptions.Button>
        </BlockOptions.Group>
        <BlockOptions.Separator />
        <BlockOptions.Group>
          <BlockOptions.Button icon={<TrashIcon />} onClick={deleteBlock} variant="destructive">
            Delete
          </BlockOptions.Button>
        </BlockOptions.Group>
      </BlockOptions.Content>
    </BlockOptions>
  );
};

const BasicExample = () => {
  const editor = useMemo(() => createYooptaEditor(), []);
  const [value, setValue] = useState(DEFAULT_VALUE);

  return (
    <div className="px-[100px] max-w-[900px] mx-auto my-10">
      <YooptaUI>
        <YooptaEditor
          editor={editor}
          plugins={YOOPTA_PLUGINS}
          marks={MARKS}
          value={value}
          onChange={setValue}>
          <FloatingBlockActionsComponent />
          <BlockOptionsComponent />
        </YooptaEditor>
      </YooptaUI>
    </div>
  );
};

export default BasicExample;
```

## How Freeze Works

When you click the drag button in FloatingBlockActions:

1. ✅ **BlockOptions opens** → positioned relative to the button
2. ✅ **FloatingBlockActions freezes** → stays on the current block
3. ✅ **Move mouse to BlockOptions** → FloatingBlockActions doesn't move!
4. ✅ **Click an option or Escape** → BlockOptions closes
5. ✅ **FloatingBlockActions unfreezes** → resumes normal hover tracking

**Why is this important?**
Without freeze, when you move your mouse from FloatingBlockActions to BlockOptions menu, the FloatingBlockActions would disappear or move to a different block, making the UX confusing.

## Minimal Example

```tsx
import { YooptaUI, FloatingBlockActions } from '@yoopta/ui';

function MinimalExample() {
  return (
    <YooptaUI>
      <YooptaEditor editor={editor} plugins={plugins}>
        <FloatingBlockActions>
          <FloatingBlockActions.Button onClick={() => console.log('Plus')}>
            +
          </FloatingBlockActions.Button>
          <FloatingBlockActions.Button onClick={() => console.log('Drag')}>
            ⋮⋮
          </FloatingBlockActions.Button>
        </FloatingBlockActions>
      </YooptaEditor>
    </YooptaUI>
  );
}
```

## Testing

1. Run development server:

```bash
yarn dev
```

2. Open http://localhost:3000/dev

3. Hover mouse over any block in the editor

4. Floating panel with buttons should appear on the left of the block

5. Panel should disappear on scroll

6. Clicking buttons should trigger handlers

## Troubleshooting

### Panel doesn't appear

- Make sure YooptaUI wraps YooptaEditor
- Check that blocks have `data-yoopta-block-id` attribute
- Open DevTools and verify elements are rendering

### Wrong position

- Make sure blocks have proper `getBoundingClientRect()`
- Check CSS `position: fixed` on FloatingBlockActions

### Styles not applying

- Make sure CSS file is imported
- Check for conflicts with other styles
