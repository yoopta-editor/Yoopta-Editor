"use client";

import { useCallback, useEffect, useMemo } from "react";
import YooptaEditor, {
  createYooptaEditor,
  RenderBlockProps,
  SlateElement,
  YooptaPlugin,
} from "@yoopta/editor";
import { withCollaboration, RemoteCursors } from "@yoopta/collaboration";
import type { CollaborationUser } from "@yoopta/collaboration";
import { YOOPTA_PLUGINS } from "../full-setup/plugins";
import { YOOPTA_MARKS } from "../full-setup/marks";
import { SelectionBox } from "@yoopta/ui/selection-box";
import { BlockDndContext, SortableBlock } from "@yoopta/ui/block-dnd";
import { withMentions } from "@yoopta/mention";
import { MentionDropdown } from "@yoopta/themes-shadcn/mention";
import { EmojiDropdown } from '@yoopta/themes-shadcn/emoji';
import { withEmoji } from '@yoopta/emoji';
import { applyTheme } from "@yoopta/themes-shadcn";
import { YooptaToolbar } from "../full-setup/new-yoo-components/yoopta-toolbar";
import { YooptaFloatingBlockActions } from "../full-setup/new-yoo-components/yoopta-floating-block-actions";
import { YooptaSlashCommandMenu } from "../full-setup/new-yoo-components/yoopta-slash-command-menu";
import { CollaborationStatusBar } from "./collaboration-status-bar";

const WS_URL = "wss://demos.yjs.dev/ws";
const ROOM_ID = "yoopta-playground-collab";

const EDITOR_STYLES = {
  width: "100%",
  paddingBottom: 100,
};

type CollaborationEditorProps = {
  user: CollaborationUser;
  containerBoxRef: React.RefObject<HTMLDivElement>;
};

export const CollaborationEditor = ({
  user,
  containerBoxRef,
}: CollaborationEditorProps) => {
  const editor = useMemo(() => {
    const base = withEmoji(withMentions(
      createYooptaEditor({
        plugins: applyTheme(
          YOOPTA_PLUGINS
        ) as unknown as YooptaPlugin<Record<string, SlateElement>, unknown>[],
        marks: YOOPTA_MARKS,
      })
    ));

    return withCollaboration(base, {
      url: WS_URL,
      roomId: ROOM_ID,
      user,
    });
  }, [user]);

  useEffect(() => {
    return () => {
      editor.collaboration.destroy();
    };
  }, [editor]);

  const renderBlock = useCallback(
    ({ children, blockId }: RenderBlockProps) => {
      return (
        <SortableBlock id={blockId} useDragHandle>
          {children}
        </SortableBlock>
      );
    },
    []
  );

  return (
    <div ref={containerBoxRef} className="w-full max-w-4xl mx-auto">
      <BlockDndContext editor={editor}>
        <YooptaEditor
          editor={editor}
          style={EDITOR_STYLES}
          renderBlock={renderBlock}
          placeholder="Start typing to collaborate..."
        >
          <CollaborationStatusBar />
          <YooptaToolbar />
          <YooptaFloatingBlockActions />
          <YooptaSlashCommandMenu />
          <SelectionBox selectionBoxElement={containerBoxRef} />
          <MentionDropdown />
          <EmojiDropdown />
          <RemoteCursors />
        </YooptaEditor>
      </BlockDndContext>
    </div>
  );
};
