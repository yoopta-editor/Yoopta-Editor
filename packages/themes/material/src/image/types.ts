export type ObjectFit = 'contain' | 'cover' | 'fill';
export type Alignment = 'left' | 'center' | 'right';

export type ImageElementProps = {
  src: string;
  alt?: string | null;
  sizes: { width: number; height: number };
  fit?: ObjectFit;
  alignment?: Alignment;
  borderRadius?: number;
};
