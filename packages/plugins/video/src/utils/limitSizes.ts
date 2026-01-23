import type { VideoSizes } from '../types';

/**
 * Converts a size value (number or string) to a number
 * @param value Size value that can be number or string (e.g. '570px', '100%', 300)
 * @returns Number value without units
 */
const parseSize = (value: string | number): number => {
  if (typeof value === 'number') return value;
  return parseInt(value.replace(/[^\d]/g, ''), 10);
};

/**
 * Limits image sizes to not exceed maximum allowed dimensions
 * @param sizes Current image dimensions
 * @param maxSizes Maximum allowed dimensions
 * @returns New image dimensions that fit within maxSizes
 */
export const limitSizes = (sizes: VideoSizes, maxSizes: VideoSizes): VideoSizes => {
  const currentWidth = parseSize(sizes.width);
  const currentHeight = parseSize(sizes.height);
  const maxWidth = parseSize(maxSizes.width);
  const maxHeight = parseSize(maxSizes.height);

  if (currentWidth <= maxWidth && currentHeight <= maxHeight) {
    return { width: currentWidth, height: currentHeight };
  }

  const widthRatio = currentWidth / maxWidth;
  const heightRatio = currentHeight / maxHeight;
  const ratio = Math.max(widthRatio, heightRatio);

  const newWidth = Math.round(currentWidth / ratio);
  const newHeight = Math.round(currentHeight / ratio);

  return {
    width: Math.min(newWidth, maxWidth),
    height: Math.min(newHeight, maxHeight),
  };
};
