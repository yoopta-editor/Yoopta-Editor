import type {
  CSSProperties} from 'react';
import {
  forwardRef,
  memo,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react';

export const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

const SPAN_STYLES: CSSProperties = {
  whiteSpace: 'pre-line',
};

const StringComponent = (props: { isLast: boolean; leaf: any; parent: any; text: any }) => {
  const { leaf, parent, text, isLast } = props;

  if (leaf.text === '' && parent.children[parent.children.length - 1].text === text.text) {
    return <ZeroWidthString isLineBreak />;
  }

  if (leaf.text === '') {
    return <ZeroWidthString />;
  }

  if (isLast && leaf.text.slice(-1) === '\n') {
    return <TextString isTrailing text={leaf.text} />;
  }

  return <TextString text={leaf.text} />;
};

const TextString = (props: { text: string; isTrailing?: boolean }) => {
  const { text, isTrailing = false } = props;
  const [initialText] = useState(`${text ?? ''}${isTrailing ? '\n' : ''}`);

  return (
    <span data-slate-string style={SPAN_STYLES}>
      {initialText}
    </span>
  );
};

export const ZeroWidthString = (props: { length?: number; isLineBreak?: boolean }) => {
  const { isLineBreak = false } = props;

  return (
    <span style={SPAN_STYLES}>
      {!isLineBreak ? '\uFEFF' : null}
      {isLineBreak ? <br /> : null}
    </span>
  );
};

export { StringComponent };
