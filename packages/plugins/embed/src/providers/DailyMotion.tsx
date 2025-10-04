import { useEffect, useRef, useState } from 'react';

import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import type { ProviderRenderProps } from '../types';

const getDayliMotionAPI = (embedId: string) =>
  `https://api.dailymotion.com/embed/${embedId}?fields=thumbnail_url`;

const DailyMotion = ({ provider, width, height, attributes, children }: ProviderRenderProps) => {
  const dailyMotionRootRef = useRef(null);
  const [src, setSrc] = useState(null);
  const [isFrameLoaded, setFrameLoaded] = useState(false);

  const { isIntersecting: isInViewport } = useIntersectionObserver(dailyMotionRootRef, {
    freezeOnceVisible: true,
    rootMargin: '50%',
  });

  useEffect(() => {
    fetch(getDayliMotionAPI(provider.id))
      .then((data) => data.json())
      .then((data) => setSrc(data.thumbnail_url))
      .catch(() => setSrc(null));
  }, [provider.id]);

  const onRef = (node) => {
    dailyMotionRootRef.current = node;
    attributes.ref(node);
  };

  return (
    <div {...children} ref={onRef} className="yoo-embed-relative">
      <img
        src={src || ''}
        alt="daylimotion_embed_preview"
        width="100%"
        height="100%"
        className="yoo-embed-absolute yoo-embed-top-0 yoo-embed-left-0 yoo-embed-w-full yoo-embed-h-full"
        style={{
          opacity: isInViewport && isFrameLoaded ? 0 : 1,
          zIndex: isInViewport && isFrameLoaded ? -1 : 0,
        }}
      />
      {isInViewport && (
        <iframe
          title="Dailymotion Embed Player"
          frameBorder={0}
          onLoad={() => setFrameLoaded(true)}
          src={`https://www.dailymotion.com/embed/embed/${provider.id}`}
          allowFullScreen
          className="yoo-embed-absolute yoo-embed-top-0 yoo-embed-left-0"
          width={width}
          height={height}
        />
      )}
      {children}
    </div>
  );
}

export { DailyMotion };
