import { PluginElementRenderProps, useYooptaEditor } from '@yoopta/editor';
import { MentionElementProps } from '../types';
import { MentionDropdown } from './MentionDropdown';

const style: React.CSSProperties = {
  padding: '3px 3px 2px',
  margin: '0 1px',
  verticalAlign: 'baseline',
  display: 'inline-block',
  borderRadius: '4px',
  backgroundColor: '#eee',
  fontSize: '0.8em',
  lineHeight: '120%',
};

const users = [
  { id: 'Lea Thompson', name: 'Lea Thompson' },
  { id: 'Cyndi Lauper', name: 'Cyndi Lauper' },
  { id: 'Tom Cruise', name: 'Tom Cruise' },
  { id: 'Madonna', name: 'Madonna' },
  { id: 'Jerry Hall', name: 'Jerry Hall' },
  { id: 'Joan Collins', name: 'Joan Collins' },
  { id: 'Winona Ryder', name: 'Winona Ryder' },
  { id: 'Christina Applegate', name: 'Christina Applegate' },
  { id: 'Alyssa Milano', name: 'Alyssa Milano' },
  { id: 'Molly Ringwald', name: 'Molly Ringwald' },
  { id: 'Ally Sheedy', name: 'Ally Sheedy' },
  { id: 'Debbie Harry', name: 'Debbie Harry' },
  { id: 'Olivia Newton', name: 'Olivia Newton-John' },
  { id: 'Elton John', name: 'Elton John' },
  { id: 'Michael J.', name: 'Michael J. Fox' },
  { id: 'Axl Rose', name: 'Axl Rose' },
  { id: 'Emilio Estevez', name: 'Emilio Estevez' },
  { id: 'Ralph Macchio', name: 'Ralph Macchio' },
  { id: 'Rob Lowe', name: 'Rob Lowe' },
  { id: 'Jennifer Grey', name: 'Jennifer Grey' },
  { id: 'Mickey Rourke', name: 'Mickey Rourke' },
  { id: 'John Cusack', name: 'John Cusack' },
  { id: 'Matthew Broderick', name: 'Matthew Broderick' },
  { id: 'Justine Bateman', name: 'Justine Bateman' },
  { id: 'Lisa Bonet', name: 'Lisa Bonet' },
];

const MentionRender = ({ extendRender, ...props }: PluginElementRenderProps) => {
  const editor = useYooptaEditor();
  const { element, attributes, children } = props;
  const { className = '' } = props.HTMLAttributes || {};

  const { user } = element.props as MentionElementProps;

  const onClose = () => {
    editor.mentions.target = null;
    editor.mentions.search = '';
  };

  return (
    <>
      <MentionDropdown
        users={users}
        target={editor.mentions.target}
        search={editor.mentions.search}
        onSelect={(user) => console.log('Selected user:', user)}
        onClose={onClose}
      />
      <span {...attributes} contentEditable={false} data-user-id={user.id} style={style}>
        @{user.name}
        {children}
      </span>
    </>
  );
};

export { MentionRender };
