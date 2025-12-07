import { LISTS } from './plugin';
import {
  BulletedListElement,
  NumberedListElement,
  TodoListElement,
  TodoListElementProps,
} from './types';

declare module 'slate' {
  type CustomTypes = {
    Element: NumberedListElement | BulletedListElement | TodoListElement;
  };
}

export default LISTS;

const NumberedList = LISTS.NumberedList;
const BulletedList = LISTS.BulletedList;
const TodoList = LISTS.TodoList;

export { TodoListCommands, BulletedListCommands, NumberedListCommands } from './commands';

export {
  NumberedListElement,
  BulletedListElement,
  TodoListElement,
  TodoListElementProps,
  NumberedList,
  BulletedList,
  TodoList,
};
