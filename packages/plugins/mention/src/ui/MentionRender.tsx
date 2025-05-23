import { Blocks, generateId, PluginElementRenderProps, useYooptaEditor, YooEditor } from '@yoopta/editor';
import { Node, Text, Transforms } from 'slate';
import { MentionElementProps, MentionUser } from '../types';
import { MentionDropdown } from './MentionDropdown';

const style: React.CSSProperties = {
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
  const editor = useYooptaEditor();
  const { element, attributes, children } = props;
  const { className = '' } = props.HTMLAttributes || {};

  const { user } = element.props as MentionElementProps;

  return (
    <>
      <span {...attributes} contentEditable={false} data-user-id={user.id} style={style}>
        @{user.name}
        {children}
      </span>
    </>
  );
};

export { MentionRender };
