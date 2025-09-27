import { HeadingTwo } from './plugin/HeadingTwo';
import { HeadingOne } from './plugin/HeadingOne';
import { HeadingThree } from './plugin/HeadingThree';
import { HeadingOneElement, HeadingThreeElement, HeadingTwoElement } from './types';
import './styles.css';

declare module 'slate' {
  interface CustomTypes {
    Element: HeadingOneElement | HeadingTwoElement | HeadingThreeElement;
  }
}

const Headings = {
  HeadingOne,
  HeadingTwo,
  HeadingThree,
};

export { HeadingOneCommands, HeadingTwoCommands, HeadingThreeCommands } from './commands';

export default Headings;
export {
  HeadingOne,
  HeadingTwo,
  HeadingThree,
  HeadingOneElement,
  HeadingTwoElement,
  HeadingThreeElement,
};
