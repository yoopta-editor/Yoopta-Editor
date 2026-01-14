import { buildPluginElements, isReactElement } from './build-plugin-elements';
import type {
  Plugin,
  PluginDOMEvents,
  PluginElementRenderProps,
  PluginInputElements,
  PluginLifeCycleEvents,
  PluginOptions,
} from './types';
import type { SlateElement } from '../editor/types';

export type ExtendPluginRender<TKeys extends string> = {
  [x in TKeys]: (props: PluginElementRenderProps) => JSX.Element;
};

export type ExtendPluginElementConfig = {
  render?: (props: PluginElementRenderProps) => JSX.Element;
  props?: Record<string, unknown>;
  injectElementsFromPlugins?: YooptaPlugin<any, any>[];
  placeholder?: string;
};

export type ExtendPlugin<TElementMap extends Record<string, SlateElement>, TOptions> = {
  options?: Partial<PluginOptions<TOptions>>;
  events?: Partial<PluginDOMEvents>;
  lifecycle?: Partial<PluginLifeCycleEvents>;
  injectElementsFromPlugins?: YooptaPlugin<any, any>[];
  elements?: {
    [K in keyof TElementMap]?: ExtendPluginElementConfig;
  };
};

type PluginInput<TElementMap extends Record<string, SlateElement>, TOptions> = Omit<
  Plugin<TElementMap, TOptions>,
  'elements'
> & {
  elements: PluginInputElements<TElementMap> | Plugin<TElementMap, TOptions>['elements'];
};

export class YooptaPlugin<
  TElementMap extends Record<string, SlateElement>,
  TOptions = Record<string, unknown>,
> {
  private readonly plugin: Plugin<TElementMap, TOptions>;
  constructor(pluginInput: PluginInput<TElementMap, TOptions>) {
    let elements: Plugin<TElementMap, TOptions>['elements'];

    // Check if elements is a React element (JSX)
    if (isReactElement(pluginInput.elements)) {
      // Convert JSX to PluginElementsMap
      elements = buildPluginElements<keyof TElementMap & string>(pluginInput.elements) as Plugin<
        TElementMap,
        TOptions
      >['elements'];
    } else {
      // Use elements as is
      elements = pluginInput.elements as Plugin<TElementMap, TOptions>['elements'];
    }

    this.plugin = {
      ...pluginInput,
      elements,
    } as Plugin<TElementMap, TOptions>;
  }

  get getPlugin(): Plugin<TElementMap, TOptions> {
    return this.plugin;
  }

  // [TODO] - add validation
  // validatePlugin(): boolean {
  //   return true
  // }

  extend(extendPlugin: ExtendPlugin<TElementMap, TOptions>): YooptaPlugin<TElementMap, TOptions> {
    const {
      options,
      events,
      lifecycle,
      injectElementsFromPlugins,
      elements: extendElements,
    } = extendPlugin;

    const extendedOptions = { ...this.plugin.options, ...options };
    const elements = { ...this.plugin.elements };

    if (lifecycle) {
      Object.keys(lifecycle).forEach((event) => {
        const eventHandler = lifecycle[event];

        if (eventHandler) {
          if (!this.plugin.lifecycle) this.plugin.lifecycle = {};
          this.plugin.lifecycle[event] = eventHandler;
        }
      });
    }

    if (events) {
      Object.keys(events).forEach((event) => {
        const eventHandler = events[event];

        if (eventHandler) {
          if (!this.plugin.events) this.plugin.events = {};
          this.plugin.events[event] = eventHandler;
        }
      });
    }

    // Handle plugin-level injectElementsFromPlugins: apply to ALL leaf elements
    if (injectElementsFromPlugins) {
      const injectedPluginTypes = injectElementsFromPlugins.map((plugin) => plugin.getPlugin.type);

      Object.keys(elements).forEach((elementType) => {
        const element = elements[elementType];

        // Apply to leaf elements only (no children or empty children)
        const isLeaf = !element.children || element.children.length === 0;

        if (isLeaf) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (element as any).injectElementsFromPlugins = injectedPluginTypes;
        }
      });
    }

    // Handle elements extension
    if (extendElements) {
      Object.keys(extendElements).forEach((elementType) => {
        const element = elements[elementType];
        const extendElementConfig = extendElements[elementType];

        if (!element) {
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.warn(
              `[extend] Element "${elementType}" not found in plugin "${this.plugin.type}"`,
            );
          }
          return;
        }

        if (!extendElementConfig) return;

        // Handle injectElementsFromPlugins
        if (extendElementConfig.injectElementsFromPlugins) {
          // Validate: element must be a leaf (no children or only text nodes)
          if (element.children && element.children.length > 0) {
            throw new Error(
              `[extend] Cannot set injectElementsFromPlugins on element "${elementType}" ` +
                `in plugin "${this.plugin.type}": element has children. ` +
                `injectElementsFromPlugins can only be set on leaf elements.`,
            );
          }

          // Convert plugin instances to plugin types
          const injectedPluginTypes = extendElementConfig.injectElementsFromPlugins.map(
            (plugin) => plugin.getPlugin.type,
          );

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (element as any).injectElementsFromPlugins = injectedPluginTypes;
        }

        // Handle custom render
        if (extendElementConfig.render) {
          const elementRender = extendElementConfig.render;

          if (typeof elementRender === 'function') {
            element.render = (props) => elementRender(props);
          }
        }

        // Handle props override
        if (extendElementConfig.props) {
          element.props = {
            ...element.props,
            ...extendElementConfig.props,
          };
        }

        // Handle placeholder override
        if (extendElementConfig.placeholder !== undefined) {
          element.placeholder = extendElementConfig.placeholder;
        }
      });
    }

    return new YooptaPlugin<TElementMap, TOptions>({
      ...this.plugin,
      elements,
      options: extendedOptions as PluginOptions<TOptions>,
    });
  }
}
