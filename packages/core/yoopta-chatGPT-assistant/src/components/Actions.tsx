import s from './Actions.module.scss';
import type { Action } from '../types';

type Props = {
  actions: Action[];
  onAction: (action: Action) => void;
};

const Actions = ({ actions, onAction }: Props) => (
    <div className={s.actions}>
      <div className={s.actionsContent}>
        <div className={s.group}>
          {actions.map((action) => (
              <button
                key={action.name}
                type="button"
                className={s.item}
                onClick={() => onAction(action)}>
                {action.name}
              </button>
            ))}
        </div>
      </div>
    </div>
  );

export { Actions };
