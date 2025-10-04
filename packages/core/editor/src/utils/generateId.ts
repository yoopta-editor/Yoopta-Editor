function getFallbackUUID() {
  const S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return `${S4() + S4() }-${ S4() }-${ S4() }-${ S4() }-${ S4() }${S4() }${S4()}`;
}

export const generateId = () => {
  if (typeof window === 'undefined') return getFallbackUUID();
  if (typeof window.crypto?.randomUUID !== 'function') return getFallbackUUID();

  return window.crypto?.randomUUID();
};
