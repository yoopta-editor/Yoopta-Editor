import { AccordionItemContent } from './elements/accordion-item-content';
import { AccordionItemHeading } from './elements/accordion-item-heading';
import { AccordionList } from './elements/accordion-list';
import { AccordionListItem } from './elements/accordion-list-item';
import './styles.css';

export { AccordionList, AccordionListItem, AccordionItemHeading, AccordionItemContent };

export const AccordionUI = {
  'accordion-list': {
    render: AccordionList,
  },
  'accordion-list-item': {
    render: AccordionListItem,
  },
  'accordion-list-item-heading': {
    render: AccordionItemHeading,
  },
  'accordion-list-item-content': {
    render: AccordionItemContent,
  },
};
