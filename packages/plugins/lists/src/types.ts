import type { SlateElement } from '@yoopta/editor';

export type BulletedListPluginKeys = 'bulleted-list';
export type NumberedListPluginKeys = 'numbered-list';
export type TodoListPluginKeys = 'todo-list';

export type ListElementProps = {};

export type NumberedListElement = SlateElement<'numbered-list', ListElementProps>;
export type BulletedListElement = SlateElement<'bulleted-list', ListElementProps>;
export type TodoListElement = SlateElement<'todo-list', TodoListElementProps>;

export type TodoListElementProps = {
  checked: boolean;
};

export type ListElementMap = {
  'bulleted-list': BulletedListElement;
  'numbered-list': NumberedListElement;
  'todo-list': TodoListElement;
};
