export type ObjectFit = 'contain' | 'cover' | 'fill';
export type Alignment = 'left' | 'center' | 'right';

// import from @yoopta/image
export type ImageElementProps = {
  id: string;
  src: string;
  alt?: string | null;
  sizes: { width: number; height: number };
  fit?: ObjectFit;
  alignment?: Alignment;
  borderRadius?: number;
};
