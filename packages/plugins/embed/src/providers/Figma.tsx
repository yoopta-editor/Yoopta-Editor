import { useRef } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { ProviderRenderProps } from '../types';

const Figma = ({ provider, width, height, attributes, children }: ProviderRenderProps) => {
  const figmaRootRef = useRef(null);

  const { isIntersecting: isInViewport } = useIntersectionObserver(figmaRootRef, {
    freezeOnceVisible: true,
    rootMargin: '50%',
  });

  const onRef = (node) => {
    figmaRootRef.current = node;
    attributes.ref(node);
  };

  return (
    <div className="yoo-embed-relative" {...attributes} ref={onRef}>
      {isInViewport && (
        <iframe
          src={`https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(
            provider?.url || '',
          )}`}
          frameBorder={0}
          allowFullScreen
          className="yoo-embed-absolute yoo-embed-top-0 yoo-embed-left-0"
          width={width}
          height={height}
        />
      )}
      {children}
    </div>
  );
};

export { Figma };
