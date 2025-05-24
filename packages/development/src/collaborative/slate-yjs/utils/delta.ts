import * as Y from 'yjs';
import { DeltaInsert, InsertDelta } from '../model/types';
import { deepEquals } from './object';

export function normalizeInsertDelta(delta: InsertDelta): InsertDelta {
  const normalized: InsertDelta = [];

  for (const element of delta) {
    if (typeof element.insert === 'string' && element.insert.length === 0) {
      continue;
    }

    const prev = normalized[normalized.length - 1];
    if (
      !prev ||
      typeof prev.insert !== 'string' ||
      typeof element.insert !== 'string'
    ) {
      normalized.push(element);
      continue;
    }

    const merge =
      prev.attributes === element.attributes ||
      (!prev.attributes === !element.attributes &&
        deepEquals(prev.attributes ?? {}, element.attributes ?? {}));

    if (merge) {
      prev.insert += element.insert;
      continue;
    }

    normalized.push(element);
  }

  return normalized;
}

export function yTextToInsertDelta(yText: Y.XmlText): InsertDelta {
  return normalizeInsertDelta(yText.toDelta());
}

export function getInsertLength({ insert }: DeltaInsert): number {
  return typeof insert === 'string' ? insert.length : 1;
}

export function getInsertDeltaLength(delta: InsertDelta): number {
  return delta.reduce((curr, element) => curr + getInsertLength(element), 0);
}

export function sliceInsertDelta(
  delta: InsertDelta,
  start: number,
  length: number
): InsertDelta {
  if (length < 1) {
    return [];
  }

  let currentOffset = 0;
  const sliced: InsertDelta = [];
  const end = start + length;

  for (let i = 0; i < delta.length; i++) {
    if (currentOffset >= end) {
      break;
    }

    const element = delta[i];
    const elementLength = getInsertLength(element);

    if (currentOffset + elementLength <= start) {
      currentOffset += elementLength;
      continue;
    }

    if (typeof element.insert !== 'string') {
      currentOffset += elementLength;
      sliced.push(element);
      continue;
    }

    const startOffset = Math.max(0, start - currentOffset);
    const endOffset = Math.min(
      elementLength,
      elementLength - (currentOffset + elementLength - end)
    );

    sliced.push({
      ...element,
      insert: element.insert.slice(startOffset, endOffset),
    });
    currentOffset += elementLength;
  }

  return sliced;
}
