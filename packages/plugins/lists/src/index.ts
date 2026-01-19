import { LISTS } from './plugin';
import {
  BulletedListElement,
  NumberedListElement,
  TodoListElement,
  TodoListElementProps,
} from './types';
import { useNumberListCount } from './utils/use-number-list-count';

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
  useNumberListCount,
  NumberedList,
  BulletedList,
  TodoList,
};
