import { cx, ParentYoptaComponent, YoptaComponent, HOTKEYS } from '@yopta/editor';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { CSSProperties, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { Element, Editor, Node, Path, Point, Transforms } from 'slate';
import { useSlate } from 'slate-react';
import { getRectByCurrentSelection } from '../utils/selectionRect';
import s from './ActionMenuList.module.scss';

type LibProps = {
  items?: YoptaComponent[];
  render?: (props: { items: ParentYoptaComponent }) => ReactNode;
  trigger?: string | null;
  components: ParentYoptaComponent[];
};

type Props = LibProps;

type MenuProps = { style: undefined | CSSProperties; point: Point | null };

const MENU_PROPS_VALUE: MenuProps = { style: undefined, point: null };

const filterBy = (item, text: string, field: string) => item[field]?.toLowerCase().indexOf(text) > -1;

const ActionMenuList = ({ items, render, components, trigger = '/' }: Props) => {
  const editor = useSlate();
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const elementListRef = useRef<HTMLOListElement>(null);
  const [menuProps, setMenuProps] = useState<MenuProps>(MENU_PROPS_VALUE);
  const [searchString, setSearchString] = useState('');
  const [focusableElement, setFocusableElement] = useState(0);

  const showActionMenu = () => {
    if (!editor.selection) return;

    const selectionRect = getRectByCurrentSelection();
    const actionMenuHeight = actionMenuRef.current!.clientHeight;

    const showAtTop = selectionRect.top + selectionRect.height + actionMenuHeight > window.innerHeight;

    disableBodyScroll(document.body, { reserveScrollBarGap: true });
    const parentPath = Path.parent(editor.selection.anchor.path);

    setMenuProps({
      style: {
        left: selectionRect.left,
        top: showAtTop ? selectionRect.top - actionMenuHeight : selectionRect.top + selectionRect.height,
        opacity: 1,
      },
      point: { path: parentPath, offset: editor.selection.anchor.offset },
    });
  };

  const hideActionMenu = () => {
    enableBodyScroll(document.body);
    setMenuProps({ style: undefined, point: null });
    setSearchString('');
    setFocusableElement(0);

    const childNodes = elementListRef.current?.childNodes;
    const firstNodeEl = childNodes?.[0] as HTMLLIElement | undefined;

    firstNodeEl?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

  const isMenuOpen = menuProps.style !== undefined;

  const filterMenuList = (item) => {
    const filterText = searchString.replace(trigger || '', '');
    return (
      // filterBy(item, filterText, 'name') ||
      // filterBy(item, filterText, 'keywords') ||
      filterBy(item, filterText, 'type')
    );
  };

  const menuItems = useMemo<ParentYoptaComponent[]>(() => {
    const menuList = items ? items.map((item) => item.getComponent) : components;

    return menuList
      .filter((item) => !Editor.isInline(editor, { type: item.type, children: [{}] }))
      .filter(filterMenuList);
  }, [items, components, searchString]);

  const focusUp = () => {
    const childNodes = elementListRef.current?.childNodes;

    let nextElementIndex = focusableElement + 1;
    const isLast = nextElementIndex === childNodes?.length;
    if (isLast) nextElementIndex = 0;

    const selectedNodeEl = childNodes?.[nextElementIndex] as HTMLLIElement | undefined;

    selectedNodeEl?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });

    setFocusableElement(nextElementIndex);
  };

  const focusDown = () => {
    const childNodes = elementListRef.current?.childNodes;

    let prevElementIndex = focusableElement - 1;
    const isFirst = focusableElement === 0;
    if (isFirst) prevElementIndex = childNodes!.length - 1;
    const selectedNodeEl = childNodes?.[prevElementIndex] as HTMLLIElement | undefined;

    selectedNodeEl?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });

    setFocusableElement(prevElementIndex);
  };

  const handleKeydown = (event) => {
    if (HOTKEYS.isEscape(event)) {
      event.preventDefault();
      return hideActionMenu();
    }

    if (HOTKEYS.isEnter(event)) {
      const selectedNode = menuItems[focusableElement];
      if (selectedNode) handleChangeNode(selectedNode);

      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (HOTKEYS.isTab(event) || HOTKEYS.isArrowDown(event)) {
      event.preventDefault();
      return focusUp();
    }

    if (HOTKEYS.isShiftTab(event) || HOTKEYS.isArrowUp(event)) {
      event.preventDefault();
      return focusDown();
    }
  };

  const handleKeyup = (event) => {
    if (!editor.selection) return;

    const parentPath = Path.parent(editor.selection.anchor.path);
    if (!isMenuOpen && event.key === trigger) {
      event.preventDefault();
      return showActionMenu();
    }

    if (isMenuOpen) {
      const string = Editor.string(editor, parentPath);
      setSearchString(string);
    }
  };

  useEffect(() => {
    if (!editor.selection || !menuProps.point) return hideActionMenu();

    const parentPath: Path = Path.parent(editor.selection.anchor.path);
    const selectionPoint: Point = { path: parentPath, offset: editor.selection.anchor.offset };

    if (!Path.equals(selectionPoint.path, menuProps.point.path) || Point.isBefore(selectionPoint, menuProps.point)) {
      hideActionMenu();
    }
  }, [editor.selection, menuProps.point]);

  useEffect(() => {
    if (focusableElement > menuItems.length - 1) setFocusableElement(0);

    const contentEditor = document.querySelector('#yopta-contenteditable');
    contentEditor?.addEventListener('keyup', handleKeyup);

    if (isMenuOpen) document.addEventListener('keydown', handleKeydown, true);
    return () => {
      contentEditor?.removeEventListener('keyup', handleKeyup);
      if (isMenuOpen) document.removeEventListener('keydown', handleKeydown, true);
    };
  }, [editor, isMenuOpen, focusableElement, menuItems]);

  const handleChangeNode = (menuItem: ParentYoptaComponent) => {
    Editor.withoutNormalizing(editor, () => {
      if (!editor.selection) return;

      const { offset, path } = editor.selection.anchor;
      Transforms.delete(editor, {
        at: {
          anchor: { path, offset: 0 },
          focus: { path, offset },
        },
      });

      const [parentNode, parentPath] = Editor.parent(editor, Path.parent(editor.selection.anchor.path));

      if (Element.isElement(parentNode) && !Editor.isEditor(parentNode)) {
        Transforms.unwrapNodes(editor, {
          at: parentPath,
          match: (n) => Element.isElement(parentNode) && n.type === parentNode.type,
        });
      }

      menuItem.createNode?.(editor, menuItem.type);
    });
  };

  const isBlockActive = (type) => {
    return false;
  };

  return (
    <div className={s.dropdown} role="dialog" aria-modal="true" ref={actionMenuRef} style={menuProps.style}>
      <ul className={s.elementList} ref={elementListRef}>
        {menuItems?.map((menuItem, i) => {
          return (
            <li
              key={menuItem.type}
              className={cx(s.elementListItem, {
                [s.__active]: isBlockActive(menuItem.type),
                [s.hovered]: i === focusableElement,
              })}
              // aria-selected={isBlockActive(menuItem)}
              data-type={menuItem.type}
            >
              <button type="button" tabIndex={0} onMouseDown={(e) => handleChangeNode(menuItem)} className={s.button}>
                {menuItem.icon} <span>{menuItem.type}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export { ActionMenuList };