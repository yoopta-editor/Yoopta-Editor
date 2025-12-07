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

// <y.element type="step-container" render={StepContainer}> [0]
//  <y.element type="step-list" render={StepList}> [0, 0]
//   <y.element type="step-list-item" render={StepListItem} props={{ isCompleted: false }}> [0, 0, 0]
//     <y.element type="step-list-item-heading" render={StepListItemHeading} /> [0, 0, 0, 0]
//     <y.element type="step-list-item-content" render={StepListItemContent}> [0, 0, 0, 1]
//       <y.text>Hello</y.text> [0, 0, 0, 1, 0]
//       <y.text.mark type="bold">World</y.text.mark> [0, 0, 0, 1, 1]
//     </y.element>
//   </y.element>
//  </y.element>
// </y.element>

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
 * editor.y('paragraph')
 *
 * // Element with custom props
 * editor.y('accordion-list-item', { props: { isExpanded: false } })
 *
 * // Nested structure
 * editor.y('accordion-list', {
 *   children: [
 *     editor.y('accordion-list-item', {
 *       props: { isExpanded: false },
 *       children: [
 *         editor.y('accordion-list-item-heading'),
 *         editor.y('accordion-list-item-content')
 *       ]
 *     })
 *   ]
 * })
 * ```
 */
export function y(
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
      children = elementConfig.children.map((childType) => y(editor, childType, {}));
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
 * const y = createJSXFactory(editor);
 *
 * // Now you can use JSX:
 * // @jsx y
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

    return y(editor, type, {
      props: Object.keys(customProps).length > 0 ? customProps : undefined,
      children: validChildren.length > 0 ? validChildren : undefined,
    });
  };
}
