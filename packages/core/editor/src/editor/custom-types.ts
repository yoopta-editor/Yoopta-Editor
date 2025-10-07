export type ExtendableTypes = 'YooEditor' | 'Plugin';

export interface ExtendYooptaTypes {
  [key: string]: unknown;
}

export type ExtendedType<K extends ExtendableTypes, B> = unknown extends ExtendYooptaTypes[K]
  ? B
  : ExtendYooptaTypes[K];
