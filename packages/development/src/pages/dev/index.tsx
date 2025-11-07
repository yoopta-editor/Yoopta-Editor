import { DEFAULT_VALUE } from '@/utils/yoopta/default-value';
import YooptaEditor, {
  useYooptaEditor,
  YooEditor,
  YooptaContentValue,
  YooptaOnChangeOptions,
  createYooptaEditor,
} from '@yoopta/editor';
import {
  FloatingBlockActions,
  useBlockOptions,
  BlockOptions,
  useFloatingBlockActions,
} from '@yoopta/ui';
import { useMemo, useRef, useState } from 'react';

import { FixedToolbar } from '../../components/FixedToolbar/FixedToolbar';
import { MARKS } from '../../utils/yoopta/marks';
import { YOOPTA_PLUGINS } from '../../utils/yoopta/plugins';
import { TOOLS } from '../../utils/yoopta/tools';
import { PlusIcon } from 'lucide-react';
import { DragHandleDots2Icon } from '@radix-ui/react-icons';

const EDITOR_STYLE = {
  width: 750,
};

const FloatingBlockActionsComponent = () => {
  const editor = useYooptaEditor();
  const { open: openBlockOptions } = useBlockOptions();
  const { toggle, reference } = useFloatingBlockActions();

  const onPlusClick = (e: React.MouseEvent) => {
    editor.insertBlock('Paragraph', { at: editor.path.current, focus: true });
  };

  const onDragClick = (e: React.MouseEvent) => {
    openBlockOptions({ reference: reference as HTMLElement });
    toggle('frozen');
  };

  const dragHandleProps = {};

  return (
    <FloatingBlockActions.Root>
      <FloatingBlockActions.Button onClick={onPlusClick}>
        <PlusIcon />
      </FloatingBlockActions.Button>
      <FloatingBlockActions.Button onClick={onDragClick} {...dragHandleProps}>
        <DragHandleDots2Icon />
      </FloatingBlockActions.Button>
      <FloatingBlockActions.Button
        onClick={() => editor.insertBlock('Paragraph', { at: editor.path.current, focus: true })}>
        Insert
      </FloatingBlockActions.Button>
    </FloatingBlockActions.Root>
  );
};

const BlockOptionsComponent = () => {
  const { duplicateBlock, copyBlockLink, deleteBlock } = useBlockOptions();
  const { toggle: toggleFloatingBlockActions } = useFloatingBlockActions();

  const onDuplicateBlock = () => {
    duplicateBlock();
    toggleFloatingBlockActions('hovering');
  };

  const onCopyBlockLink = () => {
    copyBlockLink();
    toggleFloatingBlockActions('hovering');
  };

  const onDeleteBlock = () => {
    deleteBlock();
    toggleFloatingBlockActions('hovering');
  };

  const onClose = () => {
    toggleFloatingBlockActions('closed');
  };

  return (
    <BlockOptions.Root onClose={onClose}>
      <BlockOptions.Content>
        <BlockOptions.Group>
          <BlockOptions.Button onClick={duplicateBlock}>Turn into</BlockOptions.Button>
        </BlockOptions.Group>
        <BlockOptions.Separator />
        <BlockOptions.Group>
          <BlockOptions.Button onClick={onDuplicateBlock}>Duplicate</BlockOptions.Button>
          <BlockOptions.Button onClick={onCopyBlockLink}>Copy link to block</BlockOptions.Button>
          <BlockOptions.Button onClick={onDeleteBlock}>Delete</BlockOptions.Button>
        </BlockOptions.Group>
      </BlockOptions.Content>
    </BlockOptions.Root>
  );
};

// const ActionsMenuComponent = () => {
//   const { actions, selectedAction, empty, onMouseEnter } = useActionsMenu({
//     trigger: '/',
//     mode: 'create',
//   });

//   return (
//     <ActionMenu.Root>
//       <ActionMenu.Content>
//         <ActionMenu.List>
//           {empty ? (
//             <ActionMenu.Empty />
//           ) : (
//             actions.map((action) => (
//               <ActionMenu.Item
//                 key={action.type}
//                 icon={action.icon}
//                 title={action.title}
//                 type={action.type}
//                 description={action.description}
//                 selected={selectedAction?.type === action.type}
//                 // onClick={() => onActionClick(action.type)}
//                 onMouseEnter={() => onMouseEnter(action.type)}
//               />
//             ))
//           )}
//         </ActionMenu.List>
//       </ActionMenu.Content>
//     </ActionMenu.Root>
//   );
// };

const BasicExample = () => {
  const editor: YooEditor = useMemo(() => createYooptaEditor(), []);
  const selectionRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState<YooptaContentValue>(DEFAULT_VALUE);

  const onChange = (value: YooptaContentValue, options: YooptaOnChangeOptions) => {
    console.log('onChange', value, options);
    setValue(value);
  };

  return (
    <div
      className="px-[100px] max-w-[900px] mx-auto my-10 flex flex-col items-center"
      ref={selectionRef}>
      <FixedToolbar editor={editor} DEFAULT_DATA={DEFAULT_VALUE} />
      <YooptaEditor
        editor={editor}
        plugins={YOOPTA_PLUGINS}
        selectionBoxRoot={selectionRef}
        marks={MARKS}
        autoFocus
        readOnly={false}
        placeholder="Type / to open menu"
        tools={TOOLS}
        style={EDITOR_STYLE}
        value={value}
        onChange={onChange}>
        <FloatingBlockActionsComponent />
        <BlockOptionsComponent />
      </YooptaEditor>
    </div>
  );
};

export default BasicExample;
