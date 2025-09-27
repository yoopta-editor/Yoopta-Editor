import { Action } from '../types';
import s from './Actions.module.scss';

type Props = {
  actions: Action[];
  onAction: (action: Action) => void;
};

const Actions = ({ actions, onAction }: Props) => {
  return (
    <div className={s.actions}>
      <div className={s.actionsContent}>
        <div className={s.group}>
          {actions.map((action) => {
            return (
              <button
                key={action.name}
                type="button"
                className={s.item}
                onClick={() => onAction(action)}>
                {action.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export { Actions };
