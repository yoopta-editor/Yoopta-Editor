import { PluginElementRenderProps, YooptaPlugin, useYooptaEditor } from '@yoopta/editor';
import { Mail, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ComponentType } from 'react';

type EmailActionElementsMap = any;
type EmailContainerElement = any;

const Card = ({ children }) => children;

const colorsByElementActions = {
  sendEmail: '#7d1327',
  reply: '#1a1a2e',
  forward: '#37bcff',
  receiveEmail: '#ff3780',
} as const;

const EmailContainerRender = (props: PluginElementRenderProps) => {
  const editor = useYooptaEditor();
  const emailType = (props.element as unknown as EmailContainerElement).props
    ?.type as keyof typeof colorsByElementActions;
  const bgColor = colorsByElementActions[emailType ?? 'sendEmail'];

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('editor.getEditorValue()', editor.getEditorValue());
    console.log('editor.children', editor.children);
    const hasContent = Object.keys(editor.getEditorValue()).length > 0;
    if (hasContent) {
      editor.toggleBlock('Paragraph', {
        deleteText: true,
        focus: true,
      });
    } else {
      editor.deleteBlock({ blockId: props.blockId });
    }
  };

  return (
    <Card
      {...props.attributes}
      className={cn(
        'group transition-all duration-300 ease-in-out hover:shadow-md relative',
        'p-4 gap-0 !border-[#e5e7eb] !border-solid !border-[1px]',
      )}>
      <button
        contentEditable={false}
        onClick={handleDelete}
        className="cursor-pointer absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8"
        aria-label="Delete email action">
        <Trash2 className="h-4 w-4" />
      </button>

      <div className="flex items-start gap-4">
        <div
          className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0"
          contentEditable={false}>
          <div
            className="w-full h-full rounded-full shadow-sm flex items-center justify-center"
            style={{ backgroundColor: bgColor }}>
            <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
              <path d="M2 3H18V15H2V3Z" stroke="white" strokeWidth="1.5" />
              <path d="M2 3L10 9L18 3" stroke="white" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
        <div className="flex-1 min-w-0">{props.children}</div>
      </div>
    </Card>
  );
};

const EmailReceiversRender = (props: PluginElementRenderProps) => {
  return (
    <div className="flex text-xs gap-1" {...props.attributes}>
      <span className="font-bold" contentEditable={false}>
        To:
      </span>
      <span>{props.children}</span>
    </div>
  );
};

const EmailSubjectRender = (props: PluginElementRenderProps) => {
  return (
    <div className="flex text-xs gap-1" {...props.attributes}>
      <span className="font-bold" contentEditable={false}>
        Subject:
      </span>
      <span>{props.children}</span>
    </div>
  );
};

const EmailTextRender = (props: PluginElementRenderProps) => {
  return (
    <div className="mt-4">
      <p className="text-sm leading-relaxed break-keep" {...props.attributes}>
        {props.children}
      </p>
    </div>
  );
};

export const SendEmailActionPlugin = new YooptaPlugin<EmailActionElementsMap>({
  type: 'SendEmailAction',
  elements: (
    <email-container render={EmailContainerRender}>
      <email-receivers render={EmailReceiversRender} />
      <email-subject render={EmailSubjectRender} />
      <email-text render={EmailTextRender} />
    </email-container>
  ),
  options: {
    display: {
      title: 'Email',
      description: 'Send an email to the customer',
    },
  },
});
