import { useRef, useState } from 'react';

import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import type { ProviderRenderProps } from '../types';

const Wistia = ({ provider, attributes, children, width, height }: ProviderRenderProps) => {
  const wistiaRootRef = useRef(null);
  const [isFrameLoaded, setFrameLoaded] = useState(false);

  const { isIntersecting: isInViewport } = useIntersectionObserver(wistiaRootRef, {
    freezeOnceVisible: true,
    rootMargin: '50%',
  });

  const onRef = (node) => {
    wistiaRootRef.current = node;
    attributes.ref(node);
  };

  return (
    <div {...attributes} ref={onRef} className="yoo-video-relative" style={{ width, height }}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
        }}>
        {isInViewport && (
          <iframe
            src={`https://fast.wistia.net/embed/iframe/${provider.id}?videoFoam=false`}
            title="Wistia Video Player"
            frameBorder="0"
            allowFullScreen
            onLoad={() => setFrameLoaded(true)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: '4px',
            }}
          />
        )}
      </div>
      {children}
    </div>
  );
};

export { Wistia };
