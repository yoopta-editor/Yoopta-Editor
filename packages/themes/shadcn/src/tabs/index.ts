import { TabsContainer } from './elements/tabs-container';
import { TabsItemContent } from './elements/tabs-item-content';
import { TabsItemHeading } from './elements/tabs-item-heading';
import { TabsListElement } from './elements/tabs-list';

export const TabsUI = {
  'tabs-container': {
    render: TabsContainer,
  },
  'tabs-list': {
    render: TabsListElement,
  },
  'tabs-item-heading': {
    render: TabsItemHeading,
  },
  'tabs-item-content': {
    render: TabsItemContent,
  },
};
