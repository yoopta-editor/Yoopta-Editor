import { PluginElementRenderProps, useElementSelected } from '@yoopta/editor';
import { MentionElementProps } from '../types';

const baseStyle: React.CSSProperties = {
  padding: '.1rem .3rem',
  margin: '0 1px',
  verticalAlign: 'baseline',
  display: 'inline-block',
  borderRadius: '4px',
  color: '#6A00F5',
  backgroundColor: 'rgba(88, 5, 255, .05)',
  fontSize: '0.8em',
  lineHeight: '120%',
};

const MentionRender = ({ extendRender, ...props }: PluginElementRenderProps) => {
  const { element, attributes, children } = props;
  const { mention } = element.props as MentionElementProps;

  const { selected, focused } = useElementSelected();

  const style = {
    ...baseStyle,
    backgroundColor: selected && focused ? 'rgba(88, 5, 255, .2)' : baseStyle.backgroundColor,
  };

  return (
    <>
      <span {...attributes} contentEditable={false} data-mention-id={mention.id} style={style}>
        {mention.name}
        {children}
      </span>
    </>
  );
};

export { MentionRender };
