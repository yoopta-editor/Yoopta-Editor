import type { PluginElementRenderProps } from '@yoopta/editor';
import { useBlockData, useYooptaEditor, useYooptaReadOnly } from '@yoopta/editor';

import { CalloutBlockOptions } from './CalloutBlockOptions';
import DefaultIcon from '../icons/default.svg';
import ErrorIcon from '../icons/error.svg';
import InfoIcon from '../icons/info.svg';
import SuccessIcon from '../icons/success.svg';
import WarningIcon from '../icons/warning.svg';
import type { CalloutTheme } from '../types';

const THEME_ICONS: Record<CalloutTheme, any> = {
  default: DefaultIcon,
  success: SuccessIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const CalloutRender = ({ extendRender, ...props }: PluginElementRenderProps) => {
  const { element, attributes, children, blockId, HTMLAttributes = {} } = props;
  const { className = '', ...htmlAttrs } = HTMLAttributes;

  const block = useBlockData(blockId);
  const editor = useYooptaEditor();
  const isReadOnly = useYooptaReadOnly();
  const { theme = 'default' } = element.props || {};

  if (extendRender) {
    return extendRender(props);
  }

  const Icon = THEME_ICONS[theme];

  return (
    <div
      className={`yoopta-callout yoopta-callout-theme-${theme} ${className}`}
      {...htmlAttrs}
      {...attributes}>
      <div className="yoopta-callout-icon">
        <Icon />
      </div>
      {!isReadOnly && <CalloutBlockOptions block={block} editor={editor} props={element.props} />}
      {children}
    </div>
  );
};

CalloutRender.displayName = 'Callout';

export { CalloutRender };
