import { LISTS } from './plugin';
import {
  NumberedListElement,
  BulletedListElement,
  TodoListElement,
  TodoListElementProps,
} from './types';
import './styles.css';

declare module 'slate' {
  interface CustomTypes {
    Element: NumberedListElement | BulletedListElement | TodoListElement;
  }
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
  // plugins
  NumberedList,
  BulletedList,
  TodoList,
  TodoListElementProps,
};
