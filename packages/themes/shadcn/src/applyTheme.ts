import type { YooptaPlugin } from '@yoopta/editor';

import { AccordionUI } from './accordion';
import { BlockquoteUI } from './blockquote';
import { CalloutUI } from './callout';
import { CarouselUI } from './carousel';
import { CodeUI } from './code';
import { CodeGroupUI } from './code-group';
import { DividerUI } from './divider';
import { EmbedUI } from './embed';
import { FileUI } from './file';
import { HeadingsUI } from './headings';
import { ImageUI } from './image';
import { LinkUI } from './link';
import { ListsUI } from './lists';
import { MentionUI } from './mention';
import { ParagraphUI } from './paragraph';
import { StepsUI } from './steps';
import { TableUI } from './table';
import { TableOfContentsUI } from './table-of-contents';
import { TabsUI } from './tabs';
import { VideoUI } from './video';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PluginWithUI = YooptaPlugin<any, any>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PluginExtensions = Record<
  string,
  {
    injectElementsFromPlugins?: PluginWithUI[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    events?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    elements?: any;
  }
>;

/**
 * Applies Shadcn UI components to plugins automatically
 *
 * @param plugins - Array of plugins to apply UI to
 * @param extensions - Optional object with additional extensions per plugin type
 * @returns Array of plugins with Shadcn UI applied
 *
 * @example
 * ```typescript
 * const plugins = applyTheme([
 *   Accordion,
 *   Paragraph,
 *   Headings.HeadingOne,
 * ], {
 *   Accordion: {
 *     injectElementsFromPlugins: [Paragraph, Headings.HeadingOne]
 *   }
 * });
 * ```
 */
export function applyTheme(
  plugins: PluginWithUI[],
  extensions?: PluginExtensions,
): PluginWithUI[] {
  // Mapping of plugin types to their UI components
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const uiMap: Record<string, any> = {
    Accordion: AccordionUI,
    Paragraph: ParagraphUI,
    Blockquote: BlockquoteUI,
    Callout: CalloutUI,
    Table: TableUI,
    TableOfContents: TableOfContentsUI,
    Link: LinkUI,
    HeadingOne: HeadingsUI.HeadingOne,
    HeadingTwo: HeadingsUI.HeadingTwo,
    HeadingThree: HeadingsUI.HeadingThree,
    BulletedList: ListsUI.BulletedList,
    NumberedList: ListsUI.NumberedList,
    TodoList: ListsUI.TodoList,
    Image: ImageUI,
    Video: VideoUI,
    Code: CodeUI,
    Tabs: TabsUI,
    CodeGroup: CodeGroupUI,
    Steps: StepsUI,
    Carousel: CarouselUI,
    Divider: DividerUI,
    Embed: EmbedUI,
    File: FileUI,
    Mention: MentionUI,
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
        injectElementsFromPlugins: extension.injectElementsFromPlugins,
        events: extension.events,
        options: extension.options,
      }),
    });
  });
}
