import { ReactNode } from 'react';

type Props = {
  actions: string[] | ReactNode;
};

const FloatingBlockActions = () => {
  return (
    <div>
      <button>Add Block</button>
      <button>Open Block Options</button>
    </div>
  );
};

export { FloatingBlockActions };
