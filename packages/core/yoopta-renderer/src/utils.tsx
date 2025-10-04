import { useEffect } from 'react';

export const isText = (value: any) => typeof value === 'object' && typeof value.text === 'string';
export const isElement = (value: any) => typeof value === 'object' && isNodeList(value.children);
export const isNode = (value: any): boolean => isText(value) || isElement(value);

export const isNodeList = (value: any): boolean => {
  if (!Array.isArray(value)) return false;

  const isNodeList = value.every((val) => isNode(val));
  return isNodeList;
};

export const useScrollToElement = () => {
  useEffect(() => {
    const elementId =
      window.location.hash.length > 0 ? window.location.hash.replace('#', '') : null;

    if (elementId) {
      const element =
        document.getElementById(elementId) ||
        document.querySelector(`[data-element-id="${elementId}"]`);

      if (element) {
        window.scrollTo({
          top: element.offsetTop,
          behavior: 'smooth',
        });
      }
    }
  }, []);

  return null;
};
