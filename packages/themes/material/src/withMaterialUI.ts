import type { YooptaPlugin } from '@yoopta/editor';

import { AccordionUI } from './accordion';
import { BlockquoteUI } from './blockquote';
import { CalloutUI } from './callout';
import { CodeUI } from './code';
import { HeadingsUI } from './headings';
import { ImageUI } from './image';
import { LinkUI } from './link';
import { ListsUI } from './lists';
import { ParagraphUI } from './paragraph';
import { TableUI } from './table';

type PluginWithUI = YooptaPlugin<any, any>;

type PluginExtensions = Record<
  string,
  {
    allowedPlugins?: PluginWithUI[];
    events?: any;
    options?: any;
    elements?: any;
  }
>;

/**
 * Applies Material UI components to plugins automatically
 *
 * @param plugins - Array of plugins to apply UI to
 * @param extensions - Optional object with additional extensions per plugin type
 * @returns Array of plugins with Material UI applied
 *
 * @example
 * ```typescript
 * const plugins = withMaterialUI([
 *   Accordion,
 *   Paragraph,
 *   Headings.HeadingOne,
 * ], {
 *   Accordion: {
 *     allowedPlugins: [Paragraph, Headings.HeadingOne]
 *   }
 * });
 * ```
 */
export function withMaterialUI(
  plugins: PluginWithUI[],
  extensions?: PluginExtensions,
): PluginWithUI[] {
  // Mapping of plugin types to their UI components
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const uiMap: Record<string, any> = {
    Accordion: AccordionUI,
    HeadingOne: HeadingsUI.HeadingOne,
    HeadingTwo: HeadingsUI.HeadingTwo,
    HeadingThree: HeadingsUI.HeadingThree,
    Paragraph: ParagraphUI,
    Blockquote: BlockquoteUI,
    Link: LinkUI,
    Table: TableUI,
    Callout: CalloutUI,
    BulletedList: ListsUI.BulletedList,
    NumberedList: ListsUI.NumberedList,
    TodoList: ListsUI.TodoList,
    Image: ImageUI,
    Code: CodeUI,
  };

  return plugins.map((plugin) => {
    const pluginType = plugin.getPlugin.type;
    const ui = uiMap[pluginType];

    // If no UI found for this plugin type, return as is
    if (!ui) {
      return plugin;
    }

    // Get extension config for this plugin type
    const extension = extensions?.[pluginType];

    // Apply UI and any additional extensions
    // If extension provides custom elements, use them; otherwise use default UI
    const elementsToApply = extension?.elements ?? ui;

    return plugin.extend({
      elements: elementsToApply,
      ...(extension && {
        allowedPlugins: extension.allowedPlugins,
        events: extension.events,
        options: extension.options,
      }),
    });
  });
}
