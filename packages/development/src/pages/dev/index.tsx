import { DEFAULT_VALUE } from '@/utils/yoopta/default-value';
import YooptaEditor, {
  useYooptaEditor,
  YooEditor,
  YooptaContentValue,
  YooptaOnChangeOptions,
  createYooptaEditor,
} from '@yoopta/editor';
import {
  YooptaUI,
  FloatingBlockActions,
  useFloatingBlockActions,
  // BlockOptions,
  // ActionMenu,
  // useActionsMenu,
  // useBlockOptions,
  // useDndKit,
} from '@yoopta/ui';
import { useMemo, useRef, useState } from 'react';

import { FixedToolbar } from '../../components/FixedToolbar/FixedToolbar';
import { MARKS } from '../../utils/yoopta/marks';
import { YOOPTA_PLUGINS } from '../../utils/yoopta/plugins';
import { TOOLS } from '../../utils/yoopta/tools';
import { CopyIcon, EditIcon, Link2Icon, PlusIcon, TrashIcon } from 'lucide-react';
import { DragHandleDots1Icon } from '@radix-ui/react-icons';

const EDITOR_STYLE = {
  width: 750,
};

const FloatingBlockActionsComponent = () => {
  const editor = useYooptaEditor();

  const { hoveredBlockId } = useFloatingBlockActions();
  // const { open: openBlockOptions } = useBlockOptions();
  // const { open: openActionMenu } = useActionsMenu();
  // const { getDragHandleProps } = useDndKit();

  const onPlusClick = (e: React.MouseEvent) => {
    editor.insertBlock('text', { at: editor.path.current, focus: true });
    // openActionMenu({
    //   ref: e.currentTarget as HTMLElement,
    // });
  };

  const onDragClick = (e: React.MouseEvent) => {
    // openBlockOptions({
    //   ref: e.currentTarget as HTMLElement,
    //   blockId: editor.path.current,
    // });
  };

  // const dragHandleProps = getDragHandleProps(hoveredBlockId);
  const dragHandleProps = {};

  return (
    <FloatingBlockActions.Root>
      <FloatingBlockActions.Button onClick={onPlusClick}>
        <PlusIcon />
      </FloatingBlockActions.Button>
      <FloatingBlockActions.Button onClick={onDragClick} {...dragHandleProps}>
        <DragHandleDots1Icon />
      </FloatingBlockActions.Button>
      {/* <FloatingBlockActions.Button onClick={() => {}}>Insert Block</FloatingBlockActions.Button> */}
    </FloatingBlockActions.Root>
  );
};

// const BlockOptionsComponent = () => {
//   const { duplicateBlock, copyBlockLink, deleteBlock } = useBlockOptions();
//   const { open: openActionMenu } = useActionsMenu();

//   const onTurnInto = (e: React.MouseEvent) => {
//     openActionMenu({
//       ref: e.currentTarget as HTMLElement,
//     });
//   };

//   return (
//     <BlockOptions.Root>
//       <BlockOptions.Content>
//         <BlockOptions.Group>
//           <BlockOptions.Button icon={<EditIcon />} size="md" onClick={onTurnInto}>
//             Turn into
//           </BlockOptions.Button>
//           <BlockOptions.Button icon={<CopyIcon />} size="md" onClick={duplicateBlock}>
//             Duplicate block
//           </BlockOptions.Button>

//           <BlockOptions.Separator />
//           <BlockOptions.Button icon={<Link2Icon />} size="md" onClick={copyBlockLink}>
//             Copy link to block
//           </BlockOptions.Button>
//           <BlockOptions.Button
//             icon={<TrashIcon />}
//             variant="destructive"
//             size="md"
//             onClick={deleteBlock}>
//             Delete block
//           </BlockOptions.Button>
//         </BlockOptions.Group>
//       </BlockOptions.Content>
//     </BlockOptions.Root>
//   );
// };

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
      <YooptaUI
        theme={{
          floatingActions: {
            zIndex: 100,
          },
        }}>
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
          {/* <ActionsMenuComponent />
          <BlockOptionsComponent /> */}
        </YooptaEditor>
      </YooptaUI>
    </div>
  );
};

export default BasicExample;
