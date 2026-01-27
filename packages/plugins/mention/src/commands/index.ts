import type { BaseYooEditor, YooptaPathIndex } from '@yoopta/editor';
import { Blocks, generateId } from '@yoopta/editor';
import { Editor, Element, Transforms } from 'slate';

import type {
  MentionCloseEvent,
  MentionElement,
  MentionElementProps,
  MentionItem,
  MentionPluginOptions,
  MentionState,
  MentionTargetRect,
  MentionTrigger,
} from '../types';
import { INITIAL_MENTION_STATE } from '../types';

// Extended editor type with mentions support (internal use only)
type MentionYooEditor = BaseYooEditor & {
  mentions: {
    state: MentionState;
    setState: (state: Partial<MentionState>) => void;
    open: (params: {
      trigger: MentionTrigger;
      targetRect: MentionTargetRect;
      triggerRange: MentionState['triggerRange'];
    }) => void;
    close: (reason?: MentionCloseEvent['reason']) => void;
    setQuery: (query: string) => void;
  };
};

// Helper to safely access mentions state
function getMentionEditor(editor: BaseYooEditor): MentionYooEditor {
  return editor as MentionYooEditor;
}

// ============================================================================
// OPTION TYPES
// ============================================================================

type MentionElementOptions<TMeta = Record<string, unknown>> = {
  props: Omit<MentionElementProps<TMeta>, 'nodeType'>;
};

type InsertMentionOptions = {
  /** Focus the editor after inserting */
  focus?: boolean;
};

type FindMentionOptions = {
  blockId?: string;
  at?: YooptaPathIndex;
};

type UpdateMentionOptions = {
  blockId?: string;
  at?: YooptaPathIndex;
};

// ============================================================================
// COMMANDS TYPE
// ============================================================================

export type MentionCommandsType<TMeta = Record<string, unknown>> = {
  // Build
  buildMentionElement: (
    editor: BaseYooEditor,
    options: MentionElementOptions<TMeta>,
  ) => MentionElement<TMeta>;

  // Insert
  insertMention: (
    editor: BaseYooEditor,
    item: MentionItem<TMeta>,
    options?: InsertMentionOptions,
  ) => void;

  // Find
  findMention: (
    editor: BaseYooEditor,
    mentionId: string,
    options?: FindMentionOptions,
  ) => MentionElement<TMeta> | null;
  findMentions: (
    editor: BaseYooEditor,
    options?: FindMentionOptions,
  ) => MentionElement<TMeta>[];
  findMentionsByType: (
    editor: BaseYooEditor,
    type: string,
    options?: FindMentionOptions,
  ) => MentionElement<TMeta>[];

  // Update
  updateMention: (
    editor: BaseYooEditor,
    mentionId: string,
    props: Partial<Omit<MentionElementProps<TMeta>, 'nodeType'>>,
    options?: UpdateMentionOptions,
  ) => void;

  // Delete
  deleteMention: (editor: BaseYooEditor, mentionId: string, options?: FindMentionOptions) => void;

  // Dropdown control
  openDropdown: (
    editor: BaseYooEditor,
    params: {
      trigger: MentionTrigger;
      targetRect: MentionTargetRect;
      triggerRange: MentionState['triggerRange'];
    },
  ) => void;
  closeDropdown: (editor: BaseYooEditor, reason?: MentionCloseEvent['reason']) => void;

  // State
  getState: (editor: BaseYooEditor) => MentionState;
  getQuery: (editor: BaseYooEditor) => string;
  setQuery: (editor: BaseYooEditor, query: string) => void;
  getTrigger: (editor: BaseYooEditor) => MentionTrigger | null;

  // Utilities
  getTriggers: (editor: BaseYooEditor) => MentionTrigger[];
  getTriggerByChar: (editor: BaseYooEditor, char: string) => MentionTrigger | undefined;
};

// ============================================================================
// COMMANDS IMPLEMENTATION
// ============================================================================

export const MentionCommands: MentionCommandsType = {
  buildMentionElement: (_editor, options) => {
    const { props } = options;
    return {
      id: generateId(),
      type: 'mention',
      children: [{ text: '' }],
      props: {
        ...props,
        nodeType: 'inlineVoid',
      },
    } as MentionElement;
  },

  insertMention: (editor, item, options = {}) => {
    const mentionEditor = getMentionEditor(editor);
    const state = mentionEditor.mentions.state;
    if (!state.triggerRange) return;

    const { blockId, path, startOffset } = state.triggerRange;
    const slateEditor = Blocks.getBlockSlate(editor, { id: blockId });
    if (!slateEditor) return;

    // Calculate the end offset (current cursor position)
    const trigger = state.trigger;
    const query = state.query;
    const triggerLength = trigger?.char.length ?? 1;
    const endOffset = startOffset + triggerLength + query.length;

    // Select the range from trigger start to current position
    Transforms.select(slateEditor, {
      anchor: { path, offset: startOffset },
      focus: { path, offset: endOffset },
    });

    // Delete the trigger + query
    Transforms.delete(slateEditor);

    // Create and insert mention node
    const mentionNode: MentionElement = {
      id: generateId(),
      type: 'mention',
      children: [{ text: '' }],
      props: {
        id: item.id,
        type: item.type,
        name: item.name,
        avatar: item.avatar,
        meta: item.meta,
        nodeType: 'inlineVoid',
      },
    };

    Transforms.insertNodes(slateEditor, mentionNode);

    // Close dropdown
    const pluginOptions = editor.plugins.Mention?.options as MentionPluginOptions | undefined;
    if (pluginOptions?.closeOnSelect !== false) {
      mentionEditor.mentions.close('select');
    }

    // Trigger onSelect callback
    if (pluginOptions?.onSelect && trigger) {
      pluginOptions.onSelect(item, trigger);
    }

    // Focus if requested
    if (options.focus) {
      const block = Blocks.getBlock(editor, { id: blockId });
      if (block?.id) {
        editor.focusBlock(block.id);
      }
    }
  },

  findMention: (editor, mentionId, options = {}) => {
    const mentions = MentionCommands.findMentions(editor, options);
    return mentions.find((m) => m.props?.id === mentionId) ?? null;
  },

  findMentions: (editor, options = {}) => {
    try {
      const blockToFind = options.blockId
        ? { id: options.blockId }
        : { at: options.at ?? editor.path.current };

      const slateEditor = Blocks.getBlockSlate(editor, blockToFind);
      if (!slateEditor) return [];

      const mentions: MentionElement[] = [];

      for (const [node] of Editor.nodes(slateEditor, {
        at: [],
        match: (n): n is MentionElement =>
          Element.isElement(n) && !Editor.isEditor(n) && n.type === 'mention',
      })) {
        mentions.push(node);
      }

      return mentions;
    } catch {
      return [];
    }
  },

  findMentionsByType: (editor, type, options = {}) => {
    const mentions = MentionCommands.findMentions(editor, options);
    return mentions.filter((m) => m.props?.type === type);
  },

  updateMention: (editor, mentionId, props, options = {}) => {
    const blockToFind = options.blockId
      ? { id: options.blockId }
      : { at: options.at ?? editor.path.current };

    const slateEditor = Blocks.getBlockSlate(editor, blockToFind);
    if (!slateEditor) return;

    const entries = Array.from(
      Editor.nodes(slateEditor, {
        at: [],
        match: (n): n is MentionElement =>
          Element.isElement(n) && !Editor.isEditor(n) && n.type === 'mention' && n.props?.id === mentionId,
      }),
    );

    const firstEntry = entries[0];
    if (firstEntry) {
      const [node, path] = firstEntry;
      Transforms.setNodes(
        slateEditor,
        {
          props: {
            ...node.props,
            ...props,
            nodeType: 'inlineVoid',
          },
        },
        { at: path },
      );
    }
  },

  deleteMention: (editor, mentionId, options = {}) => {
    const blockToFind = options.blockId
      ? { id: options.blockId }
      : { at: options.at ?? editor.path.current };

    const slateEditor = Blocks.getBlockSlate(editor, blockToFind);
    if (!slateEditor) return;

    const entries = Array.from(
      Editor.nodes(slateEditor, {
        at: [],
        match: (n): n is MentionElement =>
          Element.isElement(n) && !Editor.isEditor(n) && n.type === 'mention' && n.props?.id === mentionId,
      }),
    );

    const firstEntry = entries[0];
    if (firstEntry) {
      const [, path] = firstEntry;
      Transforms.removeNodes(slateEditor, { at: path });
    }
  },

  openDropdown: (editor, params) => {
    getMentionEditor(editor).mentions.open(params);
  },

  closeDropdown: (editor, reason = 'manual') => {
    getMentionEditor(editor).mentions.close(reason);
  },

  getState: (editor) => getMentionEditor(editor).mentions?.state ?? INITIAL_MENTION_STATE,

  getQuery: (editor) => getMentionEditor(editor).mentions?.state.query ?? '',

  setQuery: (editor, query) => {
    getMentionEditor(editor).mentions.setQuery(query);
  },

  getTrigger: (editor) => getMentionEditor(editor).mentions?.state.trigger ?? null,

  getTriggers: (editor) => {
    const options = editor.plugins.Mention?.options as MentionPluginOptions | undefined;
    if (!options) return [{ char: '@' }];

    if (options.triggers && options.triggers.length > 0) {
      return options.triggers;
    }

    return [{ char: options.char ?? '@' }];
  },

  getTriggerByChar: (editor, char) => {
    const triggers = MentionCommands.getTriggers(editor);
    return triggers.find((t) => t.char === char);
  },
};
