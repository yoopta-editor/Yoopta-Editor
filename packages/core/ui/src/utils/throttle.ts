export type ThrottleOptions = {
  leading?: boolean;
  trailing?: boolean;
};

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  { leading = true, trailing = true }: ThrottleOptions = {},
): T & { cancel: () => void } {
  let lastCallTime = 0;
  let timeout: NodeJS.Timeout | null = null;
  let lastArgs: Parameters<T> | null = null;

  const invokeFunc = (time: number) => {
    func(...(lastArgs as Parameters<T>));
    lastCallTime = time;
    lastArgs = null;
  };

  const throttled = (...args: Parameters<T>) => {
    const now = Date.now();

    if (!lastCallTime && !leading) {
      lastCallTime = now;
    }

    const remainingTime = wait - (now - lastCallTime);
    lastArgs = args;

    if (remainingTime <= 0 || remainingTime > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      invokeFunc(now);
    } else if (!timeout && trailing) {
      timeout = setTimeout(() => {
        timeout = null;
        if (trailing && lastArgs) {
          invokeFunc(Date.now());
        }
      }, remainingTime);
    }
  };

  throttled.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    lastArgs = null;
    lastCallTime = 0;
  };

  return throttled as T & { cancel: () => void };
}
