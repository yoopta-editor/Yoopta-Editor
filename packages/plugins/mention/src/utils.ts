export function cn(...classes: (string | undefined | boolean | null)[]) {
  return classes.filter(Boolean).join(' ');
}
