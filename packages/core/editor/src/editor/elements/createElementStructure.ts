import type { PluginElement } from '../../plugins/types';
import { generateId } from '../../utils/generateId';
import type { SlateElement, YooEditor } from '../types';

export type ElementStructureOptions = {
  props?: Record<string, unknown>;
  children?: SlateElement[];
};

/**
 * Finds element configuration by element type across all plugins
 */
function findElementConfig(
  editor: YooEditor,
  elementType: string,
): PluginElement<string, unknown> | null {
  for (const pluginType of Object.keys(editor.plugins)) {
    const plugin = editor.plugins[pluginType];
    if (plugin.elements?.[elementType]) {
      return plugin.elements[elementType];
    }
  }
  return null;
}

/**
 * Creates a SlateElement structure for use in insertBlock or other operations
 *
 * @param editor - YooEditor instance
 * @param type - Element type (e.g., 'accordion-list', 'paragraph', etc.)
 * @param options - Optional props and children
 *
 * @example
 * ```typescript
 * // Simple element
 * editor.h('paragraph')
 *
 * // Element with custom props
 * editor.h('accordion-list-item', { props: { isExpanded: false } })
 *
 * // Nested structure
 * editor.h('accordion-list', {
 *   children: [
 *     editor.h('accordion-list-item', {
 *       props: { isExpanded: false },
 *       children: [
 *         editor.h('accordion-list-item-heading'),
 *         editor.h('accordion-list-item-content')
 *       ]
 *     })
 *   ]
 * })
 * ```
 */
export function h(
  editor: YooEditor,
  type: string,
  options: ElementStructureOptions = {},
): SlateElement {
  const elementConfig = findElementConfig(editor, type);

  if (!elementConfig) {
    throw new Error(
      `Element type "${type}" not found in any plugin. ` +
        `Make sure the plugin is registered in editor.plugins`,
    );
  }

  const { props: customProps, children: customChildren } = options;

  // Merge default props from config with custom props
  const props = {
    ...elementConfig.props,
    ...customProps,
  };

  // Determine children
  let children: SlateElement['children'];

  if (customChildren !== undefined) {
    // Use explicitly provided children (even if empty array)
    children = customChildren.length > 0 ? customChildren : [{ text: '' }];
  } else if (elementConfig.children && elementConfig.children.length > 0) {
    // Only build children from config if they are NOT from allowedPlugins
    // If element has allowedPlugins, default to text node unless explicitly specified
    if (elementConfig.allowedPlugins && elementConfig.allowedPlugins.length > 0) {
      // Element with allowedPlugins defaults to empty text node
      children = [{ text: '' }];
    } else {
      // Build standard children from element config
      children = elementConfig.children.map((childType) => h(editor, childType, {}));
    }
  } else {
    // Leaf element - add empty text node
    children = [{ text: '' }];
  }

  return {
    id: generateId(),
    type,
    children,
    props,
  };
}

/**
 * Creates a JSX-compatible function bound to the editor
 * Use this for JSX pragma
 *
 * @example
 * ```typescript
 * import { createJSXFactory } from '@yoopta/editor';
 *
 * const h = createJSXFactory(editor);
 *
 * // Now you can use JSX:
 * // @jsx h
 * const structure = (
 *   <accordion-list>
 *     <accordion-list-item props={{ isExpanded: false }}>
 *       <accordion-list-item-heading />
 *     </accordion-list-item>
 *   </accordion-list>
 * );
 *
 * editor.insertBlock('Accordion', {
 *   blockData: { value: [structure] }
 * });
 * ```
 */
export function createJSXFactory(editor: YooEditor) {
  return function hFactory(
    type: string,
    props: Record<string, unknown> | null,
    ...children: unknown[]
  ): SlateElement {
    // Extract custom props (everything except 'children' and React-specific props)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {
      children: UNUSED_CHILDREN,
      key: UNUSED_KEY,
      ref: UNUSED_REF,
      ...customProps
    } = props ?? {};

    // Filter out null/undefined children and flatten arrays
    const validChildren = children
      .flat()
      .filter(
        (child) => child !== null && typeof child === 'object' && 'type' in child,
      ) as SlateElement[];

    return h(editor, type, {
      props: Object.keys(customProps).length > 0 ? customProps : undefined,
      children: validChildren.length > 0 ? validChildren : undefined,
    });
  };
}
