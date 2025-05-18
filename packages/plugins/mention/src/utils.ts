import { clsx, type ClassValue } from 'clsx';
import { Range } from 'slate';
import { ReactEditor } from 'slate-react';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
