import { buildPluginElements, isReactElement } from './build-plugin-elements';
import type {
  Plugin,
  PluginElementRenderProps,
  PluginEvents,
  PluginInputElements,
  PluginOptions,
} from './types';
import type { SlateElement } from '../editor/types';

export type ExtendPluginRender<TKeys extends string> = {
  [x in TKeys]: (props: PluginElementRenderProps) => JSX.Element;
};

type ExtractProps<T> = T extends SlateElement<string, infer P> ? P : never;

export type ExtendPluginElementConfig = {
  render?: (props: PluginElementRenderProps) => JSX.Element;
  props?: Record<string, unknown>;
  allowedPlugins?: YooptaPlugin<any, any>[];
};

export type ExtendPlugin<TElementMap extends Record<string, SlateElement>, TOptions> = {
  renders?: {
    [K in keyof TElementMap]?: (props: PluginElementRenderProps) => JSX.Element;
  };
  options?: Partial<PluginOptions<TOptions>>;
  elementProps?: {
    [K in keyof TElementMap]?: (
      props: ExtractProps<TElementMap[K]>,
    ) => ExtractProps<TElementMap[K]>;
  };
  events?: Partial<PluginEvents>;
  // Plugin-level allowedPlugins: applies to ALL leaf elements
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  allowedPlugins?: YooptaPlugin<any, any>[];
  // Element-level configuration (for fine-grained control)
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
    // renders and elementProps are legacy
    const {
      renders,
      options,
      elementProps,
      events,
      allowedPlugins,
      elements: extendElements,
    } = extendPlugin;

    const extendedOptions = { ...this.plugin.options, ...options };
    const elements = { ...this.plugin.elements };

    if (renders) {
      Object.keys(renders).forEach((elementType) => {
        const element = elements[elementType];

        if (element?.render) {
          const customRenderFn = renders[elementType];
          const elementRender = element.render;
          element.render = (props) => elementRender({ ...props, extendRender: customRenderFn });
        }
      });
    }

    if (elementProps) {
      Object.keys(elementProps).forEach((elementType) => {
        const element = elements[elementType];

        if (element) {
          const defaultPropsFn = elementProps[elementType];
          const updatedElementProps = element.props;
          if (defaultPropsFn && updatedElementProps) {
            element.props = defaultPropsFn(updatedElementProps);
          }
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

    // Handle plugin-level allowedPlugins: apply to ALL leaf elements
    if (allowedPlugins) {
      const allowedPluginTypes = allowedPlugins.map((plugin) => plugin.getPlugin.type);

      Object.keys(elements).forEach((elementType) => {
        const element = elements[elementType];

        // Apply to leaf elements only (no children or empty children)
        const isLeaf = !element.children || element.children.length === 0;

        if (isLeaf) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (element as any).allowedPlugins = allowedPluginTypes;
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

        // Handle allowedPlugins
        if (extendElementConfig.allowedPlugins) {
          // Validate: element must be a leaf (no children or only text nodes)
          if (element.children && element.children.length > 0) {
            throw new Error(
              `[extend] Cannot set allowedPlugins on element "${elementType}" ` +
                `in plugin "${this.plugin.type}": element has children. ` +
                `allowedPlugins can only be set on leaf elements.`,
            );
          }

          // Convert plugin instances to plugin types
          const allowedPluginTypes = extendElementConfig.allowedPlugins.map(
            (plugin) => plugin.getPlugin.type,
          );

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (element as any).allowedPlugins = allowedPluginTypes;
        }

        // Handle custom render
        if (extendElementConfig.render) {
          const customRenderFn = extendElementConfig.render;
          const elementRender = element.render;

          if (typeof elementRender === 'function') {
            element.render = (props) => elementRender({ ...props, extendRender: customRenderFn });
          }
        }

        // Handle props override
        if (extendElementConfig.props) {
          element.props = {
            ...element.props,
            ...extendElementConfig.props,
          };
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
