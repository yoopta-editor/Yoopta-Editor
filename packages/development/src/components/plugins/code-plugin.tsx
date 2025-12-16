import { useState, useEffect, useRef } from 'react';
import { Text } from 'slate';
import {
  BundledLanguage,
  BundledTheme,
  createHighlighter,
  HighlighterGeneric,
  SpecialLanguage,
} from 'shiki';
import { PluginElementRenderProps, YooptaPlugin } from '@yoopta/editor';

const useShikiHighlighter = () => {
  const [highlighter, setHighlighter] = useState<HighlighterGeneric<
    BundledLanguage,
    BundledTheme
  > | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initHighlighter = async () => {
      try {
        const hl = await createHighlighter({
          themes: ['github-dark', 'github-light'],
          langs: ['javascript', 'typescript', 'python', 'html', 'css', 'json', 'rust', 'go'],
        });
        setHighlighter(hl);
      } catch (error) {
        console.error('Failed to initialize Shiki:', error);
      } finally {
        setLoading(false);
      }
    };
    initHighlighter();
  }, []);

  return { highlighter, loading };
};

const getNodeText = (node) => {
  if (Text.isText(node)) {
    return node.text;
  }
  return node.children?.map(getNodeText).join('\n') || '';
};

type HighlightedOverlayProps = {
  code: string;
  language: SpecialLanguage;
  highlighter: HighlighterGeneric<BundledLanguage, BundledTheme>;
  theme: BundledTheme;
};

const HighlightedOverlay = ({ code, language, highlighter, theme }: HighlightedOverlayProps) => {
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    if (!highlighter || !code) {
      setTokens([]);
      return;
    }

    try {
      const highlighted = highlighter.codeToTokens(code, {
        lang: language || 'javascript',
        theme: theme || 'github-dark',
      });
      setTokens(highlighted.tokens);
    } catch (error) {
      console.error('Highlighting error:', error);
      setTokens([]);
    }
  }, [code, language, highlighter, theme]);

  if (!tokens.length) {
    return <span className="text-gray-400">{code}</span>;
  }

  return (
    <>
      {tokens.map((line, lineIndex) => (
        <div key={lineIndex} className="code-line">
          {line.map((token, tokenIndex) => (
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

const CodeBlockElement = ({ attributes, children, element }: PluginElementRenderProps) => {
  const { highlighter } = useShikiHighlighter();
  const code = getNodeText(element);
  const language = element.props?.language || 'javascript';
  const theme = element.props?.theme || 'github-dark';
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e) => {
    if (overlayRef.current) {
      overlayRef.current.scrollTop = e.target.scrollTop;
      overlayRef.current.scrollLeft = e.target.scrollLeft;
    }
  };

  return (
    <div {...attributes} className="relative my-4">
      <div
        contentEditable={false}
        className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded-t-lg border-b border-gray-700">
        <span className="text-xs font-mono text-gray-400 uppercase">{language}</span>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>

      <div className="relative bg-gray-900 rounded-b-lg overflow-hidden">
        <div
          ref={overlayRef}
          className="absolute inset-0 p-4 font-mono text-sm whitespace-pre overflow-auto pointer-events-none z-10"
          style={{
            lineHeight: '1.6',
            tabSize: 2,
          }}
          aria-hidden="true">
          <HighlightedOverlay
            code={code}
            language={language}
            highlighter={highlighter}
            theme={theme}
          />
        </div>

        <div
          className="relative p-4 font-mono text-sm whitespace-pre overflow-auto"
          style={{
            lineHeight: '1.6',
            tabSize: 2,
            color: 'transparent',
            caretColor: '#fff',
          }}
          onScroll={handleScroll}>
          {children}
        </div>
      </div>
    </div>
  );
};

const ShikiCodePlugin = new YooptaPlugin({
  type: 'Code',
  elements: {
    code: {
      render: CodeBlockElement,
      asRoot: true,
    },
  },
  events: {
    onKeyDown: (editor, slate, options) => {
      return (event) => {
        const isEnter = event.key === 'Enter';
        const isShiftEnter = isEnter && event.shiftKey;

        if (isEnter || isShiftEnter) {
          event.preventDefault();
          slate.insertText('\n');
          return;
        }
      };
    },
  },
});

export { ShikiCodePlugin };
