import { Accordion } from './plugin/AccordionPlugin';
import type {
  AccordionListElement,
  AccordionListItemContentElement,
  AccordionListItemHeadingElement} from './types';
import {
  AccordionItemElement,
  AccordionListItemProps,
} from './types';
import './styles.css';

declare module 'slate' {
  type CustomTypes = {
    Element:
      | AccordionListElement
      | AccordionItemElement
      | AccordionListItemHeadingElement
      | AccordionListItemContentElement;
  }
}

export { AccordionCommands } from './commands/AccordionCommands';

export default Accordion;
export { AccordionItemElement, AccordionListItemProps };
