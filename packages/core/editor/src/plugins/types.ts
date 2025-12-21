import type { HTMLAttributes, ReactElement, ReactNode } from 'react';
import type { RenderElementProps, RenderLeafProps } from 'slate-react';

import type {
  SlateEditor,
  SlateElement,
  YooEditor,
  YooptaBlockBaseMeta,
  YooptaBlockData,
} from '../editor/types';
import type { EditorEventHandlers } from '../types/eventHandlers';
import type { HOTKEYS_TYPE } from '../utils/hotkeys';

export enum NodeType {
  Block = 'block',
  Inline = 'inline',
  Void = 'void',
  InlineVoid = 'inlineVoid',
}

export type PluginOptions<T> = Partial<
  {
    display?: {
      title?: string;
      description?: string;
      icon?: string | ReactNode | ReactElement;
    };
    shortcuts?: string[];
    HTMLAttributes?: HTMLAttributes<HTMLElement>;
  } & T
>;

export type RenderSlateElementProps = Omit<RenderElementProps, 'element'> & {
  element: SlateElement;
};

export type PluginElementExtendRenderProps = RenderSlateElementProps & {
  blockId: string;
  HTMLAttributes?: HTMLAttributes<HTMLElement>;
};

export type PluginElementRenderProps = PluginElementExtendRenderProps;

export type PluginCustomEditorRenderProps = {
  blockId: string;
};

export type PluginElementNodeType = 'block' | 'inline' | 'void' | 'inlineVoid';
export type PluginDefaultProps = { nodeType?: PluginElementNodeType };
export type PluginElementProps<T> = PluginDefaultProps & T;

export type PluginElement<TKeys, T> = {
  render?: (props: PluginElementRenderProps) => JSX.Element;
  props?: PluginElementProps<T>;
  asRoot?: boolean;
  children?: TKeys[];
  allowedPlugins?: string[];
  rootPlugin?: string;
  /**
   * Placeholder text for this element when it's empty
   * Only applies to leaf elements (elements without children)
   */
  placeholder?: string;
};

export type PluginElementsMap<TKeys extends string = string, TProps = PluginDefaultProps> = {
  [key in TKeys]: PluginElement<TKeys, TProps>;
};

export type EventHandlers = {
  [key in keyof EditorEventHandlers]: (
    editor: YooEditor,
    slate: SlateEditor,
    options: PluginEventHandlerOptions,
  ) => EditorEventHandlers[key] | void;
};

export type PluginEventHandlerOptions = {
  hotkeys: HOTKEYS_TYPE;
  defaultBlock: YooptaBlockData;
  currentBlock: YooptaBlockData;
};

export type ElementPropsMap = Record<string, Record<string, unknown>>;

export type PluginDOMEvents = EventHandlers;

export type PluginLifeCycleEvents = {
  beforeCreate?: (editor: YooEditor) => SlateElement;
  onCreate?: (editor: YooEditor, blockId: string) => void;
  onDestroy?: (editor: YooEditor, blockId: string) => void;
};

export type PluginInputElements<TElementMap extends Record<string, SlateElement>> =
  | {
      [K in keyof TElementMap]: PluginElement<
        Exclude<keyof TElementMap, K>,
        TElementMap[K]['props']
      >;
    }
  | ReactElement<unknown, string>;

export type Plugin<
  TElementMap extends Record<string, SlateElement>,
  TPluginOptions = Record<string, unknown>,
> = {
  type: string;
  extensions?: (slate: SlateEditor, editor: YooEditor, blockId: string) => SlateEditor;
  commands?: Record<string, (editor: YooEditor, ...args: any[]) => any>;
  elements: {
    [K in keyof TElementMap]: PluginElement<Exclude<keyof TElementMap, K>, TElementMap[K]['props']>;
  };
  events?: PluginDOMEvents;
  lifecycle?: PluginLifeCycleEvents;
  options?: PluginOptions<TPluginOptions>;
  parsers?: Partial<Record<PluginParserTypes, PluginParsers>>;
};

export type PluginParsers = {
  deserialize?: PluginDeserializeParser;
  serialize?: PluginSerializeParser;
};

export type PluginParserTypes = 'html' | 'markdown' | 'email';
export type PluginParserValues = 'deserialize' | 'serialize';

export type PluginSerializeParser = (
  element: SlateElement,
  content: string,
  blockMetaData?: YooptaBlockBaseMeta,
) => string;

export type PluginDeserializeParser = {
  nodeNames: string[];
  parse?: (el: HTMLElement, editor: YooEditor) => SlateElement | YooptaBlockData[] | void;
};

export type LeafFormats<K extends string, V> = {
  [key in K]: V;
};

export type ExtendedLeaf<K extends string, V> = RenderLeafProps['leaf'] &
  LeafFormats<K, V> & {
    withPlaceholder?: boolean;
    elementPlaceholder?: string;
  };

export type YooptaMarkProps<K extends string, V> = {
  children: RenderLeafProps['children'];
  leaf: ExtendedLeaf<K, V>;
};

export type ExtendedLeafProps<K extends string, V> = RenderLeafProps & {
  leaf: ExtendedLeaf<K, V>;
};
