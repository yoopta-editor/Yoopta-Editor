import { StringComponent } from './StringComponent';

type Props = {
  isLast: boolean;
  leaf: any;
  parent: any;
  renderLeaf: (props: any) => JSX.Element;
  text: any;
};

const Leaf = (props: Props) => {
  const { leaf, isLast, text, parent, renderLeaf } = props;

  const children = <StringComponent isLast={isLast} leaf={leaf} parent={parent} text={text} />;
  const attributes = { 'data-slate-leaf': true };

  return renderLeaf({ attributes, children, leaf, text });
};

export { Leaf };
