import type { ActionMenuItem } from '../action-menu-list/types';

type UseArrowNavigationProps = {
  actions: ActionMenuItem[];
  selectedAction: ActionMenuItem | null;
  setSelectedAction: (action: ActionMenuItem) => void;
};

export const useArrowNavigation = ({
  actions,
  selectedAction,
  setSelectedAction,
}: UseArrowNavigationProps) => {
  const handleArrowUp = (event: KeyboardEvent) => {
    event.preventDefault();
    const currentSelected = selectedAction || actions[0];
    if (!currentSelected) return;

    const menuList = document.querySelector('[data-action-menu-list]');
    const menuListItems = menuList?.querySelectorAll('[data-action-menu-item]');
    if (!menuListItems) return;

    const currentListItem = menuList?.querySelector(`[aria-selected="true"]`) as HTMLElement;
    const currentIndex = Array.from(menuListItems || []).indexOf(currentListItem);

    const prevIndex = currentIndex - 1;
    const prevEl = menuListItems[prevIndex];

    if (!prevEl) {
      const lastEl = menuListItems[menuListItems.length - 1];
      const lastActionType = lastEl.getAttribute('data-action-menu-item-type');
      lastEl.scrollIntoView({ block: 'nearest' });

      const lastAction = actions.find((item) => item.type === lastActionType)!;
      return setSelectedAction(lastAction);
    }

    prevEl.scrollIntoView({ block: 'nearest' });
    const prevActionType = prevEl.getAttribute('data-action-menu-item-type');

    const prevAction = actions.find((item) => item.type === prevActionType)!;
    return setSelectedAction(prevAction);
  };

  const handleArrowDown = (event: KeyboardEvent) => {
    event.preventDefault();
    const currentSelected = selectedAction || actions[0];
    if (!currentSelected) return;

    const menuList = document.querySelector('[data-action-menu-list]');
    const menuListItems = menuList?.querySelectorAll('[data-action-menu-item]');
    if (!menuListItems) return;

    const currentListItem = menuList?.querySelector(`[aria-selected="true"]`) as HTMLElement;
    const currentIndex = Array.from(menuListItems || []).indexOf(currentListItem);

    const nextIndex = currentIndex + 1;
    const nextEl = menuListItems[nextIndex];

    if (!nextEl) {
      const firstEl = menuListItems[0];
      const firstActionType = firstEl.getAttribute('data-action-menu-item-type');
      firstEl.scrollIntoView({ block: 'nearest' });
      const firstAction = actions.find((item) => item.type === firstActionType)!;

      return setSelectedAction(firstAction);
    }

    nextEl.scrollIntoView({ block: 'nearest' });
    const nextActionType = nextEl.getAttribute('data-action-menu-item-type');

    const nextAction = actions.find((item) => item.type === nextActionType)!;
    return setSelectedAction(nextAction);
  };

  const handleArrowLeft = (event: KeyboardEvent) => {
    event.preventDefault();
    return;
  };

  const handleArrowRight = (event: KeyboardEvent) => {
    event.preventDefault();
    return;
  };

  return {
    handleArrowUp,
    handleArrowDown,
    handleArrowLeft,
    handleArrowRight,
  };
};
