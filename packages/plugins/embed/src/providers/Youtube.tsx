import { useRef, useState } from 'react';

import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import type { ProviderRenderProps } from '../types';

const YouTube = ({ provider, width, height, attributes, children }: ProviderRenderProps) => {
  const youtubeRootRef = useRef(null);
  const [isFrameLoaded, setIsFrameLoaded] = useState<boolean>(false);

  const { isIntersecting: isInViewport } = useIntersectionObserver(youtubeRootRef, {
    freezeOnceVisible: true,
    rootMargin: '50%',
  });

  const onRef = (node) => {
    youtubeRootRef.current = node;
    attributes.ref(node);
  };

  return (
    <div {...attributes} ref={onRef} className="yoo-embed-relative">
      <img
        src={`https://i.ytimg.com/vi/${provider.id}/default.jpg`}
        alt="youtube_embed_preview"
        width="100%"
        height="100%"
        style={{
          opacity: isInViewport && isFrameLoaded ? 0 : 1,
          zIndex: isInViewport && isFrameLoaded ? -1 : 0,
        }}
      />
      {isInViewport && (
        <iframe
          title="Embed Player"
          // https://developers.google.com/youtube/player_parameters?hl=en
          src={`https://www.youtube.com/embed/${provider.id}`}
          frameBorder={0}
          onLoad={() => setIsFrameLoaded(true)}
          allowFullScreen
          width={width}
          height={height}
        />
      )}
      {children}
    </div>
  );
};

export { YouTube };
