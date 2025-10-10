# FloatingBlockActions Integration Example

## In development/src/pages/dev/index.tsx

```tsx
import { YooptaUI, FloatingBlockActions, useFloatingBlockActions } from '@yoopta/ui';
import { useYooptaEditor } from '@yoopta/editor';
import YooptaEditor, { createYooptaEditor } from '@yoopta/editor';
import { PlusIcon } from 'lucide-react';
import { DragHandleDots1Icon } from '@radix-ui/react-icons';

const FloatingBlockActionsComponent = () => {
  const editor = useYooptaEditor();

  const { hoveredBlockId, onPlusClick, onDragClick } = useFloatingBlockActions({
    onPlusClick: (blockId, event) => {
      console.log('Plus clicked for block:', blockId);
      // Add new block or open ActionMenu
      editor.insertBlock('paragraph', {
        at: editor.children[blockId].meta.order + 1,
        focus: true,
      });
    },
    onDragClick: (blockId, event) => {
      console.log('Drag clicked for block:', blockId);
      // Open BlockOptions menu
      // openBlockOptions({ blockId, ref: event.currentTarget });
    },
  });

  return (
    <FloatingBlockActions>
      <FloatingBlockActions.Button onClick={onPlusClick} title="Add block">
        <PlusIcon size={16} />
      </FloatingBlockActions.Button>
      <FloatingBlockActions.Button onClick={onDragClick} title="Drag to move">
        <DragHandleDots1Icon />
      </FloatingBlockActions.Button>
      {hoveredBlockId && (
        <FloatingBlockActions.Button
          onClick={() => console.log('Custom action')}
          title="Custom action">
          ✨
        </FloatingBlockActions.Button>
      )}
    </FloatingBlockActions>
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
        </YooptaEditor>
      </YooptaUI>
    </div>
  );
};

export default BasicExample;
```

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
