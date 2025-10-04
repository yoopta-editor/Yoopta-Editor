import { useRef, useState } from 'react';

import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const YouTubePlayer = ({ videoId, children, attributes, ...other }) => {
  const youtubeRootRef = useRef(null);
  const [isFrameLoaded, setFrameLoaded] = useState(false);

  const { isIntersecting: isInViewport } = useIntersectionObserver(youtubeRootRef, {
    freezeOnceVisible: true,
    rootMargin: '50%',
  });

  const onRef = (el) => {
    youtubeRootRef.current = el;
    attributes.ref(el);
  };

  return (
    <div {...attributes} ref={onRef} className="yoo-video-relative">
      <img
        src={`https://i.ytimg.com/vi/${videoId}/default.jpg`}
        alt="youtube_video_preview"
        width="100%"
        height="100%"
        className="yoo-video-absolute yoo-video-top-0 yoo-video-left-0 yoo-video-w-full yoo-video-h-full"
        style={{
          opacity: isInViewport && isFrameLoaded ? 0 : 1,
          zIndex: isInViewport && isFrameLoaded ? -1 : 0,
        }}
      />
      {isInViewport && (
        <iframe
          title="Video Player"
          // https://developers.google.com/youtube/player_parameters?hl=en
          src={`https://www.youtube.com/embed/${videoId}`}
          frameBorder={0}
          onLoad={() => setFrameLoaded(true)}
          allowFullScreen
          className="yoo-video-absolute yoo-video-top-0 yoo-video-left-0"
          {...other}
        />
      )}
      {children}
    </div>
  );
}

export default YouTubePlayer;
