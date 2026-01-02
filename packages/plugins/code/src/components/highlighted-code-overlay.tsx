import { useEffect, useState } from 'react';
import type { SlateElement } from '@yoopta/editor';
import type {
  BundledLanguage,
  BundledTheme,
  HighlighterGeneric,
  SpecialLanguage,
  ThemedToken,
} from 'shiki';
import { Text } from 'slate';

import { initHighlighter } from '../utils/shiki';

export const useHighlighter = () => {
  const [highlighter, setHighlighter] = useState<HighlighterGeneric<
    BundledLanguage,
    BundledTheme
  > | null>(null);

  useEffect(() => {
    const init = async () => {
      const hl = await initHighlighter();
      if (!hl) {
        throw new Error('Failed to initialize `shiki` highlighter');
      }
      setHighlighter(hl);
    };

    init();
  }, []);

  return { highlighter };
};

const getNodeText = (node) => {
  if (Text.isText(node)) {
    return node.text;
  }
  return node.children?.map(getNodeText).join('\n') || '';
};

type HighlightedOverlayProps = {
  element: SlateElement;
  language: SpecialLanguage;
  theme: BundledTheme;
};

export const HighlightedCodeOverlay = ({ element, language, theme }: HighlightedOverlayProps) => {
  const code = getNodeText(element);
  const [tokens, setTokens] = useState<ThemedToken[][]>([]);
  const { highlighter } = useHighlighter();

  useEffect(() => {
    const highlightCode = async () => {
      if (!highlighter || !code) {
        setTokens([]);
        return;
      }

      // const formattedCode = await CodeCommands.prettifyCode(code, language || 'javascript');
      const highlighted = highlighter?.codeToTokens(code, {
        lang: language || 'javascript',
        theme: theme || 'github-dark',
      });
      if (highlighted) {
        setTokens(highlighted.tokens);
      }
    };

    highlightCode();
  }, [code, language, highlighter, theme]);

  if (!tokens.length) {
    return <span className="text-gray-400">{code}</span>;
  }

  return (
    <>
      {tokens.map((line, lineIndex) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={lineIndex} className="code-line">
          {line.map((token, tokenIndex) => (
            // eslint-disable-next-line react/no-array-index-key
            <span key={tokenIndex} style={{ color: token.color }}>
              {token.content}
            </span>
          ))}
          {lineIndex < tokens.length - 1 && '\n'}
        </div>
      ))}
    </>
  );
};
