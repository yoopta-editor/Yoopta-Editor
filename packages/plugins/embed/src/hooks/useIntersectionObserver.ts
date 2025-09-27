import { useEffect, useState } from 'react';

/**
 *
 * @param {DOM Ref} elementRef - DOM ref for checking the intersection
 * @param {Observer Params} - https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
 * @returns {IntersectionObserverEntry} - https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry
 */
export function useIntersectionObserver(
  elementRef,
  { threshold = 0, root = null, rootMargin = '0%', freezeOnceVisible = false } = {},
): IntersectionObserverEntry {
  const [entry, setEntry] = useState<IntersectionObserverEntry>({} as IntersectionObserverEntry);

  const frozen = entry.isIntersecting && freezeOnceVisible;

  const updateEntry = ([e]) => setEntry(e);

  useEffect(() => {
    const node = elementRef?.current;
    const hasNotIOSupport = !window.IntersectionObserver;

    if (hasNotIOSupport || frozen || !node) return;

    const observerParams = { threshold, root, rootMargin };
    const observer = new IntersectionObserver(
      updateEntry as unknown as IntersectionObserverCallback,
      observerParams,
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [elementRef, threshold, root, rootMargin, frozen]);

  return entry;
}
