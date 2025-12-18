export function validateYooptaValue(value: any): boolean {
  if (!value) return false;
  if (typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;

  return true;
}

export function isYooptaBlock(block: any): boolean {
  return !!block && !!block.id && !!block.type && !!block.value && !!block.meta;
}
