import { useRef, useState } from 'react';

import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const WistiaPlayer = ({ videoId, children, attributes, width, height, ...other }) => {
  const wistiaRootRef = useRef(null);
  const [isFrameLoaded, setFrameLoaded] = useState(false);

  const { isIntersecting: isInViewport } = useIntersectionObserver(wistiaRootRef, {
    freezeOnceVisible: true,
    rootMargin: '50%',
  });

  const onRef = (el) => {
    wistiaRootRef.current = el;
    attributes.ref(el);
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
            src={`https://fast.wistia.net/embed/iframe/${videoId}?videoFoam=true&videoHeight=${height}&videoWidth=${width}`}
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
            {...other}
          />
        )}
      </div>
      {children}
    </div>
  );
}

export default WistiaPlayer;
