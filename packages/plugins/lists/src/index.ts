import { LISTS } from './plugin';
import {
  BulletedListElement,
  NumberedListElement,
  TodoListElement,
  TodoListElementProps,
} from './types';

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
