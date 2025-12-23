import type { PluginElementRenderProps } from '@yoopta/editor';

import { TabsContent } from '../../ui/tabs';

export const TabsItemContent = (props: PluginElementRenderProps) => {
  const { attributes, children, element } = props;

  return (
    <TabsContent {...attributes} value={element.props?.referenceId} className="mt-2">
      {children}
    </TabsContent>
  );
};
