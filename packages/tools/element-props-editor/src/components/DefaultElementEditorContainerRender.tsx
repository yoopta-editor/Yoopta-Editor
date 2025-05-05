import { flip, offset, shift, useFloating } from '@floating-ui/react';
import {
  ElementPropEditor,
  ElementPropEditorType,
  useYooptaEditor,
  UI,
  useFocusedElement,
  Blocks,
} from '@yoopta/editor';
import { useEffect, useMemo, useRef } from 'react';
import { RenderElementPropEditor } from './RenderEditor';

const { Portal } = UI;

export const DefaultElementEditorContainerRender = () => {
  const editor = useYooptaEditor();
  const focusedElement = useFocusedElement();
  const elementRef = useRef<HTMLElement | null>(null);

  const { refs, floatingStyles, update } = useFloating({
    placement: 'top',
    middleware: [offset(12), flip(), shift()],
  });

  useEffect(() => {
    console.log('DefaultElementEditorContainerRender _CHANGED_ focusedElement', focusedElement);
    if (!focusedElement) return;

    const element = document.querySelector(`[data-element-id="${focusedElement.element.id}"]`);

    if (element) {
      elementRef.current = element as HTMLElement;
      refs.setReference(element);
      update();
    }

    window.addEventListener('scroll', update);
    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [focusedElement?.element, update]);

  const editors = useMemo(() => {
    const EMPTY_EDITORS = {} as Record<ElementPropEditorType, ElementPropEditor>;
    if (!focusedElement) return EMPTY_EDITORS;

    const block = Blocks.getBlock(editor, { at: editor.path.current });

    if (!block || !focusedElement?.element) return EMPTY_EDITORS;

    const plugin = editor.plugins[block.type];
    if (!plugin || !focusedElement?.element) return EMPTY_EDITORS;

    const elementEditors = plugin.elements?.[focusedElement?.element?.type]?.editors;
    return elementEditors || EMPTY_EDITORS;
  }, [focusedElement?.element, editor.path]);

  if (!focusedElement) return null;

  const editorEntries = Object.entries(editors) as Array<[ElementPropEditorType, ElementPropEditor]>;
  if (editorEntries.length === 0) return null;

  console.log('editorEntries', editorEntries);

  return (
    <Portal id="edit-element">
      <div
        ref={refs.setFloating}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        style={floatingStyles}
        className="yoo-elements-z-50 yoo-elements-w-full yoo-elements-max-w-[220px] yoo-elements-p-2 yoo-elements-bg-white yoo-elements-rounded-lg yoo-elements-shadow-lg yoo-elements-border yoo-elements-border-gray-200 yoo-elements-max-h-[264px] yoo-elements-overflow-y-auto"
      >
        <div className="yoo-elements-flex yoo-elements-flex-col yoo-elements-gap-0">
          {editorEntries.map(([propName, propEditor]) => (
            <div
              key={propName}
              className="yoo-elements-flex yoo-elements-flex-col yoo-elements-gap-2 yoo-elements-mt-2 first:yoo-elements-mt-0 first:yoo-elements-gap-0"
            >
              <RenderElementPropEditor
                editor={editor}
                propName={propName}
                propEditor={propEditor}
                element={focusedElement.element}
              />
            </div>
          ))}
        </div>
      </div>
    </Portal>
  );
};
