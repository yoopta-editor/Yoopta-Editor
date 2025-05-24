import * as Y from 'yjs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function assertDocumentAttachment<T extends Y.AbstractType<any>>(
  sharedType: T
): asserts sharedType is T & { doc: NonNullable<T['doc']> } {
  if (!sharedType.doc) {
    throw new Error("shared type isn't attached to a document");
  }
}
