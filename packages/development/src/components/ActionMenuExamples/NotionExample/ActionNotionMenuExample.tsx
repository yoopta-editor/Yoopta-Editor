import type { ActionMenuRenderProps } from '@yoopta/action-menu-list';
import cx from 'classnames';

import s from './ActionNotionMenuExample.module.scss';
import { ICONS_SRC } from './utils/iconsMap';

const VOID_PLUGINS = ['Video', 'Image', 'File', 'Embed'];

const ActionNotionMenuExample = (props: ActionMenuRenderProps) => {
  const { empty, getItemProps, actions, getRootProps, view } = props;

  const groups = {
    media: actions.filter((item) => VOID_PLUGINS.includes(item.type)),
    texts: actions.filter((item) => !VOID_PLUGINS.includes(item.type)),
  };

  const isViewSmall = view === 'small';

  return (
    <div {...getRootProps()} className={cx(s.dropdown, { [s.dropdownSmall]: isViewSmall })}>
      <div className={s.elementList}>
        {groups.texts.length > 0 && (
          <div className={s.group}>
            <div className={s.groupTitle}>Text nodes</div>
            {groups.texts.map((item) => {
              const icon = ICONS_SRC[item.type];

              return (
                <button
                  key={item.type}
                  type="button"
                  className={s.item}
                  {...getItemProps(item.type)}>
                  <div className={s.itemLeft}>
                    <img src={icon} className={s.leftImage} />
                  </div>
                  <div className={s.itemRight}>
                    <div className={s.rightTitle}>{item.title}</div>
                    <div className={s.rightDesc}>{item.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
        {groups.media.length > 0 && (
          <div className={s.group}>
            <div className={s.groupTitle}>Media</div>

            {groups.media.map((item) => {
              const icon = ICONS_SRC[item.type];

              return (
                <button
                  key={item.type}
                  type="button"
                  className={s.item}
                  {...getItemProps(item.type)}>
                  <div className={s.itemLeft}>
                    <img src={icon} className={s.leftImage} />
                  </div>
                  <div className={s.itemRight}>
                    <div className={s.rightTitle}>{item.title}</div>
                    <div className={s.rightDesc}>{item.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
        {empty && (
          <button type="button" className={s.item} disabled>
            <div className={s.itemRight}>
              <div className={s.rightTitle}>Not found</div>
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

export { ActionNotionMenuExample };
