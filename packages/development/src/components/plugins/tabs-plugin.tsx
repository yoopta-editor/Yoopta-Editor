import { YooptaPlugin, type PluginElementRenderProps, type SlateElement } from '@yoopta/editor';

const tabsContainerProps = {
  tab: 0,
};

type TabsElementMap = {
  'tabs-container': SlateElement<'tabs-container', typeof tabsContainerProps>;
  'tabs-list': SlateElement<'tabs-list'>;
  'tabs-item': SlateElement<'tabs-item'>;
  'tabs-item-heading': SlateElement<'tabs-item-heading'>;
  'tabs-item-content': SlateElement<'tabs-item-content'>;
};

// Renders
const TabsContainer = ({ attributes, children, element, blockId }: PluginElementRenderProps) => {
  return <div {...attributes}>{children}</div>;
};

const TabsList = ({ attributes, children }: PluginElementRenderProps) => {
  return <div {...attributes}>{children}</div>;
};

const TabsItem = ({ attributes, children, element, blockId }: PluginElementRenderProps) => {
  return <div {...attributes}>{children}</div>;
};

const TabsItemHeading = ({ attributes, children, element, blockId }: PluginElementRenderProps) => {
  return <div {...attributes}>{children}</div>;
};

const TabsItemContent = ({ attributes, children, element, blockId }: PluginElementRenderProps) => {
  return <div {...attributes}>{children}</div>;
};

export const TabsPlugin = new YooptaPlugin<TabsElementMap>({
  type: 'Tabs',
  elements: (
    <tabs-container render={TabsContainer} props={tabsContainerProps}>
      <tabs-list render={TabsList}>
        <tabs-item render={TabsItem}>
          <tabs-item-heading render={TabsItemHeading} />
          <tabs-item-content render={TabsItemContent} />
        </tabs-item>
      </tabs-list>
    </tabs-container>
  ),
  options: {
    display: {
      title: 'Tabs',
      description: 'Toggle content in tabs',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" />
          <path d="M12 2h3.5a3.5 3.5 0 0 1 0 7H12z" />
          <path d="M5 12v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V12" />
          <path d="M12 2v20" />
        </svg>
      ),
    },
    shortcuts: ['tabs'],
  },
});
