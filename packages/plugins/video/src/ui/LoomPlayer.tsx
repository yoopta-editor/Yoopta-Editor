import { useEffect, useRef, useState } from 'react';

import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const LoomPlayer = ({ videoId, children, attributes, width, height, ...other }) => {
  const loomRootRef = useRef(null);
  const [isFrameLoaded, setFrameLoaded] = useState(false);
  const [iframeKey, setIframeKey] = useState(0); // Add key to force re-render

  const { isIntersecting: isInViewport } = useIntersectionObserver(loomRootRef, {
    freezeOnceVisible: true,
    rootMargin: '50%',
  });

  const onRef = (el) => {
    loomRootRef.current = el;
    attributes.ref(el);
  };

  // Force iframe reload when it becomes visible
  useEffect(() => {
    if (isInViewport) {
      setIframeKey((prev) => prev + 1);
    }
  }, [isInViewport]);

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
            key={iframeKey}
            title="Loom Video Player"
            src={`https://www.loom.com/embed/${videoId}?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true`}
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
            {...other}
          />
        )}
      </div>
      {children}
    </div>
  );
};

export default LoomPlayer;
