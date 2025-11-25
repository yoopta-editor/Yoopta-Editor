import type { ReactElement } from 'react';
import { isValidElement } from 'react';

import type {
  PluginElement,
  PluginElementNodeType,
  PluginElementProps,
  PluginElementRenderProps,
  PluginElementsMap,
} from './types';

export type PluginJSXElementProps = {
  render: (props: PluginElementRenderProps) => JSX.Element;
  props?: Record<string, unknown>;
  children?: ReactElement<PluginJSXElementProps> | ReactElement<PluginJSXElementProps>[];
  nodeType?: PluginElementNodeType;
};

export type PluginJSXElement = ReactElement<PluginJSXElementProps, string>;

function buildElementsMap<TKeys extends string = string>(
  jsxElement: PluginJSXElement,
): PluginElementsMap<TKeys> {
  const elementsMap: PluginElementsMap<TKeys> = {} as PluginElementsMap<TKeys>;

  function traverse(element: PluginJSXElement, isRoot = false): TKeys {
    const { type, props: elementProps } = element;
    const { render, props: defaultProps } = elementProps;

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

    const mergedProps: Record<string, unknown> = { ...defaultProps };
    mergedProps.nodeType = elementProps.nodeType ?? 'block';

    if (Object.keys(mergedProps).length > 0) {
      elementConfig.props = mergedProps as PluginElementProps<Record<string, unknown>>;
    }

    // Process children - they can be in props.children or as React children
    const children = elementProps.children;
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
  return isValidElement(value);
}
