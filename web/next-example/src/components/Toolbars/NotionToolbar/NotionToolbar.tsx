import { ToolbarRenderProps } from '@yoopta/toolbar';
import { useYooptaEditor, useYooptaTools } from '@yoopta/editor';
import cx from 'classnames';
import { CodeIcon, ChevronDownIcon, RadicalIcon } from 'lucide-react';
import { useState } from 'react';
import { useFloating, offset, flip, shift, inline, autoUpdate, FloatingPortal } from '@floating-ui/react';
import s from './NotionToolbar.module.scss';
import { buildActionMenuRenderProps } from '@yoopta/action-menu-list';

const DEFAULT_MODALS = { link: false, highlight: false, actionMenu: false };
type ModalsState = typeof DEFAULT_MODALS;

const NotionToolbar = (props: ToolbarRenderProps) => {
  const [modals, setModals] = useState<ModalsState>({ link: false, highlight: false, actionMenu: false });

  // positioning for action menu tool
  const { refs: actionMenuRefs, floatingStyles: actionMenuStyles } = useFloating({
    placement: 'bottom-start',
    open: modals.actionMenu,
    onOpenChange: (open) => onChangeModal('actionMenu', open),
    middleware: [inline(), flip(), shift(), offset(10)],
    whileElementsMounted: autoUpdate,
  });

  const onChangeModal = (modal: keyof ModalsState, value: boolean) => {
    setModals(() => ({ ...DEFAULT_MODALS, [modal]: value }));
  };

  const { activeBlock } = props;
  const editor = useYooptaEditor();
  const tools = useYooptaTools();

  const blockLabel = activeBlock?.options?.display?.title || activeBlock?.type || '';
  const ActionMenu = tools.ActionMenu;

  const onCloseActionMenu = () => onChangeModal('actionMenu', false);

  const actionMenuRenderProps = buildActionMenuRenderProps({
    editor,
    onClose: onCloseActionMenu,
    view: 'small',
    mode: 'toggle',
  });

  return (
    <div>
      <div className={s.toolbar}>
        <div className={s.group}>
          <button type="button" className={s.item} onClick={() => alert('Soon... 😍 \nIn development')}>
            <span className={s.askGPT}>Ask AI</span>
          </button>
        </div>
        <div className={s.group}>
          <button
            type="button"
            className={s.item}
            ref={actionMenuRefs.setReference}
            onClick={() => onChangeModal('actionMenu', !modals.actionMenu)}
          >
            <span className={s.block}>
              {blockLabel} <ChevronDownIcon size={12} strokeWidth={2} color="rgba(55, 53, 47, 0.35)" />
            </span>
            {modals.actionMenu && !!ActionMenu && (
              <FloatingPortal id="yoo-custom-toolbar-action-menu-list-portal" root={editor.refElement}>
                <div style={actionMenuStyles} ref={actionMenuRefs.setFloating} onClick={(e) => e.stopPropagation()}>
                  <ActionMenu {...actionMenuRenderProps} />
                </div>
              </FloatingPortal>
            )}
          </button>
        </div>
        <div className={s.group}>
          <button
            type="button"
            onClick={() => editor.formats.bold.toggle()}
            className={cx(s.item, { [s.active]: editor.formats.bold.isActive() })}
          >
            <span className={s.bold}>B</span>
          </button>
          <button
            type="button"
            onClick={() => editor.formats.italic.toggle()}
            className={cx(s.item, { [s.active]: editor.formats.italic.isActive() })}
          >
            <span className={s.italic}>i</span>
          </button>
          <button
            type="button"
            onClick={() => editor.formats.underline.toggle()}
            className={cx(s.item, { [s.active]: editor.formats.underline.isActive() })}
          >
            <span className={s.underline}>U</span>
          </button>
          <button
            type="button"
            onClick={() => editor.formats.strike.toggle()}
            className={cx(s.item, { [s.active]: editor.formats.strike.isActive() })}
          >
            <span className={s.strikethrough}>S</span>
          </button>
          <button
            type="button"
            onClick={() => editor.formats.code.toggle()}
            className={cx(s.item, { [s.active]: editor.formats.code.isActive() })}
          >
            <span className={s.code}>
              <CodeIcon size={15} strokeWidth={1.5} />
            </span>
          </button>
          {/* <button
            type="button"
            // onClick={() => alert('See example with custom text format')}
            onClick={() => editor.formats.katex.toggle()}
            className={cx(s.item, { [s.active]: editor.formats.katex.isActive() })}
          >
            <span className={s.code}>
              <RadicalIcon size={15} strokeWidth={1.5} />
            </span>
          </button> */}
        </div>
      </div>
    </div>
  );
};

export { NotionToolbar };
