import { useEffect, useRef, useState } from 'react';

import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import type { ProviderRenderProps } from '../types';

const VIMEO_API_URI = 'https://vimeo.com/api/v2/embed';

const Vimeo = ({ provider, width, height, attributes, children }: ProviderRenderProps) => {
  const vimeoRootRef = useRef(null);
  const [src, setSrc] = useState(null);
  const [isFrameLoaded, setFrameLoaded] = useState(false);

  const { isIntersecting: isInViewport } = useIntersectionObserver(vimeoRootRef, {
    freezeOnceVisible: true,
    rootMargin: '50%',
  });

  useEffect(() => {
    fetch(`${VIMEO_API_URI}/${provider.id}.json`)
      .then((data) => data.json())
      .then((data) => setSrc(data[0].thumbnail_medium))
      .catch(() => setSrc(null));
  }, [provider.id]);

  const onRef = (node) => {
    vimeoRootRef.current = node;
    attributes.ref(node);
  };

  return (
    <div {...attributes} ref={onRef} className="yoo-embed-relative">
      <img
        src={src || ''}
        alt="vimeo_embed_preview"
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
          title="Embed Player"
          // https://developer.vimeo.com/player/embedding
          src={`https://player.vimeo.com/embed/${provider.id}?badge=0&byline=0&portrait=0&title=0`}
          frameBorder={0}
          allowFullScreen
          onLoad={() => setFrameLoaded(true)}
          className="yoo-embed-absolute yoo-embed-top-0 yoo-embed-left-0"
          width={width}
          height={height}
        />
      )}
      {children}
    </div>
  );
}

export { Vimeo };
