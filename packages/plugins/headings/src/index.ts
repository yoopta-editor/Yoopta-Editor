import { HeadingOne } from './plugin/HeadingOne';
import { HeadingThree } from './plugin/HeadingThree';
import { HeadingTwo } from './plugin/HeadingTwo';
import { HeadingOneElement, HeadingThreeElement, HeadingTwoElement } from './types';

declare module 'slate' {
  type CustomTypes = {
    Element: HeadingOneElement | HeadingTwoElement | HeadingThreeElement;
  };
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
