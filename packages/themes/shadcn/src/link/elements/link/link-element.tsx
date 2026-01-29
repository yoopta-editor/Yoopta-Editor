import { useEffect, useRef, useState } from 'react';
import { Elements, useYooptaEditor } from '@yoopta/editor';
import type { PluginElementRenderProps } from '@yoopta/editor';
import copy from 'copy-to-clipboard';
import { Text } from 'slate';

import { LinkEdit } from './link-edit';
import { LinkPreview } from './link-preview';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../../../ui/hover-card';

const getNodeText = (node: unknown): string => {
  if (Text.isText(node)) {
    return node.text;
  }
  if (typeof node === 'object' && node !== null && 'children' in node) {
    const children = (node as { children?: unknown[] }).children;
    return children?.map(getNodeText).join('') ?? '';
  }
  return '';
};

const Link = (props: PluginElementRenderProps) => {
  const { attributes, children, element, blockId } = props;
  const editor = useYooptaEditor();
  const linkText = getNodeText(element);

  const [isEditing, setIsEditing] = useState(false);
  const [editedUrl, setEditedUrl] = useState(element.props.url ?? '');
  const [editedText, setEditedText] = useState(linkText);
  const [copied, setCopied] = useState(false);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditedUrl(element.props.url ?? '');
    setEditedText(linkText);
  }, [element.props.url, linkText]);

  useEffect(() => {
    if (isEditing && urlInputRef.current) {
      urlInputRef.current.focus();
      urlInputRef.current.select();
    }
  }, [isEditing]);

  const openLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (element.props.url) {
      window.open(element.props.url, element.props.target ?? '_blank', element.props.rel);
    }
  };

  const copyUrl = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (element.props.url) {
      const success = copy(element.props.url);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    }
  };

  const openEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // const linkElementPath = Elements.getElementPath(editor, {
    //   blockId,
    //   element,
    // });

    // if (!linkElementPath) return;

    // const slate = Blocks.getBlockSlate(editor, { id: blockId });
    // if (!slate) return;

    // const [linkEntry] = Editor.nodes(slate, {
    //   match: (n) => Element.isElement(n) && n.type === 'link',
    //   mode: 'lowest',
    //   at: linkElementPath,
    // });

    // Transforms.select(slate, linkEntry?.[1]);

    setIsEditing(true);
  };

  const saveEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const linkElementPath = Elements.getElementPath(editor, {
      blockId,
      element,
    });

    if (!linkElementPath) return;

    Elements.updateElement(editor, {
      blockId,
      type: 'link',
      text: editedText,
      path: linkElementPath,
      props: { url: editedUrl },
    });
    setIsEditing(false);
  };

  const cancelEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setEditedUrl(element.props.url ?? '');
    setEditedText(linkText);
    setIsEditing(false);
  };

  const deleteLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const linkElementPath = Elements.getElementPath(editor, {
      blockId,
      element,
    });

    if (!linkElementPath) return;

    Elements.deleteElement(editor, {
      mode: 'unwrap',
      type: 'link',
      path: linkElementPath,
      blockId,
    });
    setIsEditing(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();

      Elements.updateElement(editor, {
        blockId,
        type: 'link',
        text: editedText,
        props: {
          url: editedUrl,
        },
      });
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      setEditedUrl(element.props.url ?? '');
      setEditedText(linkText);
      setIsEditing(false);
    }
  };

  const onClick = (e: React.MouseEvent) => {
    if (isEditing) {
      e.preventDefault();
    }
  };

  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger asChild>
        <a
          {...attributes}
          href={element.props.url || undefined}
          target={element.props.target}
          rel={element.props.rel}
          title={element.props.title || undefined}
          className="text-primary font-medium underline underline-offset-4 cursor-pointer hover:text-primary/80 transition-colors"
          contentEditable={false}
          onClick={onClick}>
          {children}
        </a>
      </HoverCardTrigger>
      <HoverCardContent
        className="w-80 p-0"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}>
        {isEditing ? (
          <LinkEdit
            textInputRef={textInputRef}
            urlInputRef={urlInputRef}
            editedText={editedText}
            editedUrl={editedUrl}
            onChangeText={(e) => setEditedText(e.target.value)}
            onChangeUrl={(e) => setEditedUrl(e.target.value)}
            onKeyDown={onKeyDown}
            saveEdit={saveEdit}
            cancelEdit={cancelEdit}
            deleteLink={deleteLink}
          />
        ) : (
          <LinkPreview
            element={element}
            openLink={openLink}
            copyUrl={copyUrl}
            openEdit={openEdit}
            copied={copied}
          />
        )}
      </HoverCardContent>
    </HoverCard>
  );
};

export { Link };
