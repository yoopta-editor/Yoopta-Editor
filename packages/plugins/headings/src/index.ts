import { HeadingOne } from './plugin/heading-one/plugin';
import { HeadingThree } from './plugin/heading-three/plugin';
import { HeadingTwo } from './plugin/heading-two/plugin';
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
