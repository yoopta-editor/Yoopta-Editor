import { PluginElementRenderProps, useYooptaReadOnly } from '@yoopta/editor';
import { useState } from 'react';
import { LinkElementProps } from '../types';
import { LinkHoverPreview } from './LinkHoverPreview';
import {
  useFloating,
  offset,
  flip,
  shift,
  inline,
  autoUpdate,
  useTransitionStyles,
} from '@floating-ui/react';

const VALID_TARGET_VALUES = ['_blank', '_self', '_parent', '_top', 'framename'];

const LinkRender = ({ extendRender, ...props }: PluginElementRenderProps) => {
  const [hovered, setHovered] = useState(false);
  const [holdLinkTool, setHoldLinkTool] = useState(false);
  const { className = '', ...htmlAttrs } = props.HTMLAttributes || {};

  const {
    refs: linkPreviewRefs,
    floatingStyles: linkPreviewFloatingStyles,
    context,
  } = useFloating({
    placement: 'bottom',
    open: hovered,
    onOpenChange: setHovered,
    middleware: [inline(), flip(), shift(), offset(0)],
    whileElementsMounted: autoUpdate,
  });

  const { isMounted: isActionMenuMounted, styles: linkPreviewTransitionStyles } =
    useTransitionStyles(context, {
      duration: {
        open: 200,
        close: 100,
      },
    });

  const linkPreviewStyles = { ...linkPreviewFloatingStyles, ...linkPreviewTransitionStyles };

  const { url, target = '', rel } = props.element.props || {};
  const isReadOnly = useYooptaReadOnly();

  const linkProps: Partial<Pick<LinkElementProps, 'rel' | 'target'>> = {
    rel,
    target,
  };

  if (!VALID_TARGET_VALUES.includes(target)) {
    delete linkProps.target;
  }

  if (typeof rel !== 'string' || rel?.length === 0) {
    delete linkProps.rel;
  }

  const onClose = () => {
    setHoldLinkTool(false);
    setHovered(false);
  };

  const onMouseOver = () => {
    setHovered(true);
  };

  const onMouseOut = () => {
    if (holdLinkTool) return;
    onClose();
  };

  return (
    <span ref={linkPreviewRefs.setReference} onMouseOver={onMouseOver} onMouseOut={onMouseOut}>
      {extendRender ? (
        extendRender(props)
      ) : (
        <a
          {...linkProps}
          {...htmlAttrs}
          {...props.attributes}
          draggable={false}
          href={url || ''}
          className={`yoopta-link ${className}`}>
          {props.children}
        </a>
      )}
      {isActionMenuMounted && !isReadOnly && (
        <LinkHoverPreview
          style={linkPreviewStyles}
          setFloating={linkPreviewRefs.setFloating}
          element={props.element}
          setHoldLinkTool={setHoldLinkTool}
          onClose={onClose}
          blockId={props.blockId}
        />
      )}
    </span>
  );
};

export { LinkRender };
