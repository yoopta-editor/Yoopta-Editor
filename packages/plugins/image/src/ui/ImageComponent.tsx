import { CSSProperties, Fragment, useEffect, useState } from 'react';
import { RenderElementProps } from 'slate-react';
import { UI } from '@yoopta/editor';
import { ImageElementProps } from '../types';

type ImageComponentProps = Omit<ImageElementProps, 'sizes'> & {
  width: number | string;
  height: number | string;
  layout?: Layout;
} & Pick<RenderElementProps, 'attributes' | 'children'>;

type Layout = 'fill' | 'responsive' | 'intrinsic' | 'fixed';

const ZOOM_STYLES: CSSProperties = {
  position: 'fixed',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  height: '100%',
  zIndex: 99,
  maxWidth: '90vw',
  maxHeight: '90vh',
  cursor: 'zoom-out',
};

const ImageComponent = ({
  width,
  height,
  src,
  alt,
  fit,
  bgColor,
  attributes,
  children,
  layout = 'intrinsic',
}: ImageComponentProps) => {
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isZoomed) {
        setIsZoomed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomed]);

  let style: CSSProperties = {
    objectFit: fit || 'contain',
    backgroundColor: bgColor || 'transparent',
    cursor: 'zoom-in',
  };

  const isResponsive = layout === 'responsive';

  if (isResponsive) {
    style.width = '100%';
    style.height = 'auto';
  } else if (['fixed', 'fill', 'intrinsic'].includes(layout)) {
    style.width = '100%';
    style.height = '100%';
  }

  if (isZoomed) {
    style = { ...style, ...ZOOM_STYLES };
  }

  const handleImageClick = () => {
    setIsZoomed((prev) => !prev);
  };

  return (
    <div className="yoo-image-w-full yoo-image-relative" data-layout={layout} {...attributes}>
      {src && (
        <img
          src={src}
          width={width}
          height={height}
          alt={alt || ''}
          decoding="async"
          loading="lazy"
          style={style}
          onClick={handleImageClick}
        />
      )}
      {children}
      {alt && (
        <div className="yoopta-image-alt" title={alt}>
          <div className="yoopta-image-alt-text">ALT</div>
        </div>
      )}
      {isZoomed && (
        <UI.Portal id="image-zoom">
          <UI.Overlay
            onClick={handleImageClick}
            lockScroll
            className="yoopta-image-zoom-overlay yoo-image-bg-[rgba(255,255,255,0.95)]"
          >
            <Fragment />
          </UI.Overlay>
        </UI.Portal>
      )}
    </div>
  );
};

export { ImageComponent, ImageComponentProps };
