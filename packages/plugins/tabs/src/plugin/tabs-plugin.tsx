import type { PluginElementRenderProps } from '@yoopta/editor';
import { YooptaPlugin } from '@yoopta/editor';

import { TabsCommands } from '../commands/tabs-commands';
import type { TabsElementMap } from '../types';

const TabsContainer = ({ attributes, children }: PluginElementRenderProps) => (
  <div {...attributes}>{children}</div>
);

const TabsList = ({ attributes, children }: PluginElementRenderProps) => (
  <div {...attributes}>{children}</div>
);

const TabsItemHeading = ({ attributes, children }: PluginElementRenderProps) => (
  <div {...attributes}>{children}</div>
);

const TabsItemContent = ({ attributes, children }: PluginElementRenderProps) => (
  <div {...attributes}>{children}</div>
);

const tabsContainerProps = {
  activeTabId: null,
};

const tabsContentProps = {
  referenceId: null,
};

const Tabs = new YooptaPlugin<TabsElementMap>({
  type: 'Tabs',
  elements: (
    <tabs-container render={TabsContainer} props={tabsContainerProps}>
      <tabs-list render={TabsList}>
        <tabs-item-heading render={TabsItemHeading} />
      </tabs-list>
      <tabs-item-content render={TabsItemContent} props={tabsContentProps} />
    </tabs-container>
  ),
  commands: TabsCommands,
  options: {
    display: {
      title: 'Tabs',
      description: 'Toggle content in tabs',
    },
  },
});

export { Tabs };
