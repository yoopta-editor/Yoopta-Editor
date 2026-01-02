import { useEffect, useRef } from 'react';
import { Elements, useYooptaEditor } from '@yoopta/editor';

import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import type { ProviderRenderProps } from '../types';

const Twitter = ({ provider, blockId, attributes, children }: ProviderRenderProps) => {
  const twitterRootRef = useRef<HTMLDivElement>(null);
  const editor = useYooptaEditor();

  const { isIntersecting: isInViewport } = useIntersectionObserver(twitterRootRef, {
    freezeOnceVisible: true,
    rootMargin: '50%',
  });

  const elementId = `${blockId}-${provider.id}`;

  useEffect(() => {
    if (!isInViewport) return;

    const script = document.createElement('script');
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    document.body.appendChild(script);

    const renderTweet = () => {
      if ((window as any).twttr) {
        (window as any).twttr.widgets
          .createTweet(provider.id, document.getElementById(elementId), {
            align: 'center',
            conversation: 'none',
            dnt: true,
            theme: 'light',
          })
          .then((el) => {
            if (el) {
              Elements.updateElement(editor, {
                blockId,
                type: 'embed',
                props: { sizes: { height: el.offsetHeight + 16, width: el.offsetWidth } },
              });
            }
          });
      }
    };

    if ((window as any).twttr) {
      renderTweet();
    } else {
      script.onload = renderTweet;
    }

    return () => {
      document.body.removeChild(script);
    };
  }, [provider.id, isInViewport, blockId, editor, elementId]);

  return (
    <div className="yoo-embed-w-full" {...attributes}>
      <div id={elementId} ref={twitterRootRef} />
      {children}
    </div>
  );
};

export default Twitter;
