import type { ReactElement } from 'react';
import type { ZodTypeAny } from 'zod';

import type {
  PluginElement,
  PluginElementProps,
  PluginElementRenderProps,
  PluginElementsMap,
} from './types';

export type PluginJSXElementProps = {
  render: (props: PluginElementRenderProps) => JSX.Element;
  propsSchema?: ZodTypeAny;
  children?: ReactElement<PluginJSXElementProps> | ReactElement<PluginJSXElementProps>[];
};

export type PluginJSXElement = ReactElement<PluginJSXElementProps, string>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getDefaultValuesFromSchema(schema: ZodTypeAny): Record<string, unknown> | undefined {
  try {
    // Try to parse empty object - if schema has defaults, they will be applied
    const result = schema.safeParse({});
    if (result.success) {
      return result.data as Record<string, unknown>;
    }
    // If parsing fails, try to get defaults from schema shape
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const shape = (schema as any)._def?.shape;
    if (shape) {
      const defaults: Record<string, unknown> = {};
      Object.keys(shape).forEach((key) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fieldSchema = shape[key];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const defaultValue = (fieldSchema as any)._def?.defaultValue;
        if (defaultValue !== undefined) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          defaults[key] = typeof defaultValue === 'function' ? defaultValue() : defaultValue;
        }
      });
      return Object.keys(defaults).length > 0 ? defaults : undefined;
    }
    return undefined;
  } catch {
    return undefined;
  }
}

function buildElementsMap<TKeys extends string = string>(
  jsxElement: PluginJSXElement,
): PluginElementsMap<TKeys> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const elementsMap: PluginElementsMap<TKeys> = {} as any;

  function traverse(element: PluginJSXElement, isRoot = false): TKeys {
    const { type, props } = element;
    const { render, propsSchema } = props;

    if (typeof type !== 'string') {
      throw new Error(`[buildPluginElements] Element type must be a string, got: ${typeof type}`);
    }

    if (!render || typeof render !== 'function') {
      throw new Error(`[buildPluginElements] Element "${type}" must define a render function`);
    }

    const elementConfig: PluginElement<TKeys, PluginElementProps<Record<string, unknown>>> = {
      render,
    };

    if (isRoot) {
      elementConfig.asRoot = true;
    }

    if (propsSchema) {
      const defaultValues = getDefaultValuesFromSchema(propsSchema);
      if (defaultValues && Object.keys(defaultValues).length > 0) {
        elementConfig.props = defaultValues as PluginElementProps<Record<string, unknown>>;
      }
    }

    // Process children - they can be in props.children or as React children
    const children = props.children;
    if (children) {
      const childrenArray: PluginJSXElement[] = Array.isArray(children)
        ? children.filter(
            (child): child is PluginJSXElement =>
              typeof child === 'object' && child !== null && 'type' in child && 'props' in child,
          )
        : typeof children === 'object' &&
          children !== null &&
          'type' in children &&
          'props' in children
        ? [children as PluginJSXElement]
        : [];

      if (childrenArray.length > 0) {
        const childTypes = childrenArray.map((child) => traverse(child, false));
        elementConfig.children = childTypes as TKeys[];
      }
    }

    elementsMap[type as TKeys] = elementConfig;

    return type as TKeys;
  }

  traverse(jsxElement, true);
  return elementsMap;
}

export function buildPluginElements<TKeys extends string = string>(
  jsxElement: PluginJSXElement,
): PluginElementsMap<TKeys> {
  const elementsMap = buildElementsMap<TKeys>(jsxElement);
  return elementsMap;
}

export function isReactElement(value: unknown): value is PluginJSXElement {
  return (
    typeof value === 'object' &&
    value !== null &&
    'type' in value &&
    'props' in value &&
    typeof (value as { type: unknown }).type === 'string'
  );
}
