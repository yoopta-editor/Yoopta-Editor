import type React from 'react';
import { useRef } from 'react';

import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

type InstagramProps = {
  provider: {
    id: string;
    url: string;
  };
  width: number | 'auto';
  height: number | 'auto';
  blockId: string;
  attributes: any;
  children: React.ReactNode;
};

const Instagram: React.FC<InstagramProps> = ({ provider, width, height, attributes, children }) => {
  const embedUrl = `https://www.instagram.com/p/${provider.id}/embed`;
  const instagramRootRef = useRef<HTMLEmbedElement>(null);

  const { isIntersecting: isInViewport } = useIntersectionObserver(instagramRootRef, {
    freezeOnceVisible: true,
    rootMargin: '50%',
  });

  return (
    <div className="yoo-embed-w-full yoo-embed-h-full" {...attributes}>
      <div ref={instagramRootRef}>
        {isInViewport && (
          <iframe
            src={embedUrl}
            width={width === 'auto' ? '100%' : width}
            height={height === 'auto' ? '100%' : height}
            frameBorder="0"
            scrolling="no"
            allowTransparency
            allowFullScreen
            className="yoo-embed-absolute yoo-embed-top-0 yoo-embed-left-0"
          />
        )}
        {children}
      </div>
    </div>
  );
};

export default Instagram;
