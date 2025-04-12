import { Elements, UI as UI_HELPERS, YooEditor, YooptaBlockData } from '@yoopta/editor';
import { Select } from './Select';
import { THEMES_MAP } from '../utils/themes';

import { Trigger } from '@radix-ui/react-select';
import { LANGUAGES_MAP } from '../utils/languages';
import CopyIcon from '../icons/copy.svg';
import CodeIcon from '../icons/code.svg';
import ThemeIcon from '../icons/theme.svg';
import { CodeElement } from '../types';
import copy from 'copy-to-clipboard';
import { getCodeElementText } from '../utils/element';
import { useState } from 'react';

const { ExtendedBlockActions, BlockOptionsMenuGroup, BlockOptionsMenuItem, BlockOptionsSeparator } = UI_HELPERS;

type Props = {
  editor: YooEditor;
  block: YooptaBlockData;
  element: CodeElement;
};

export const CodeBlockOptions = ({ block, editor, element }: Props) => {
  const [isCopied, setIsCopied] = useState(false);

  const onChangeTheme = (theme: string) => {
    // We change it directly in the block because this plugin doesn't have Slate instance
    // because it's a plugin with custom editor
    editor.updateBlock(block.id, { value: [{ ...element, props: { ...element.props, theme } }] });
  };

  const onChangeLanguage = (language: string) => {
    // We change it directly in the block because this plugin doesn't have Slate instance
    // because it's a plugin with custom editor

    editor.updateBlock(block.id, { value: [{ ...element, props: { ...element.props, language } }] });
    // editor.applyChanges();
  };

  const onCopy = () => {
    const text = getCodeElementText(block);
    copy(text);

    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <ExtendedBlockActions onClick={() => editor.setPath({ current: block.meta.order })} className="yoopta-code-options">
      <BlockOptionsSeparator />
      <BlockOptionsMenuGroup>
        <BlockOptionsMenuItem>
          <button type="button" className="yoopta-block-options-button" onClick={onCopy}>
            <CopyIcon className="yoo-code-w-4 yoo-code-h-4 yoo-code-mr-2" />
            {isCopied
              ? editor.getLabelText('plugins.Code.options.copyCodeSuccess') || 'Copied'
              : editor.getLabelText('plugins.Code.options.copyCode') || 'Copy'}
          </button>
        </BlockOptionsMenuItem>
        <BlockOptionsMenuItem>
          <Select
            className="select-theme"
            options={Object.keys(THEMES_MAP)
              .map((theme) => ({ value: theme, label: theme }))
              .sort((a, b) => a.label.localeCompare(b.label))}
            onChange={onChangeTheme}
            value={element.props?.theme || 'VSCode'}
          >
            <Trigger className="yoopta-block-options-button">
              <ThemeIcon className="yoo-code-w-4 yoo-code-h-4 yoo-code-mr-2" />
              {editor.getLabelText('plugins.Code.options.theme') || 'Theme'}
            </Trigger>
          </Select>
        </BlockOptionsMenuItem>
        <BlockOptionsMenuItem>
          <Select
            className="select-language"
            options={Object.keys(LANGUAGES_MAP)
              .map((key) => ({
                value: LANGUAGES_MAP[key].type,
                label: LANGUAGES_MAP[key].name,
              }))
              .sort((a, b) => a.label.localeCompare(b.label))}
            onChange={onChangeLanguage}
            value={element.props?.language || 'JavaScript'}
          >
            <Trigger className="yoopta-block-options-button">
              <CodeIcon className="yoo-code-w-4 yoo-code-h-4 yoo-code-mr-2" />
              {editor.getLabelText('plugins.Code.options.language') || 'Language'}
            </Trigger>
          </Select>
        </BlockOptionsMenuItem>
      </BlockOptionsMenuGroup>
    </ExtendedBlockActions>
  );
};
