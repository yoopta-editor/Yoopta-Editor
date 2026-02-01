import type { SlateEditor } from "@yoopta/editor";
import { Range } from "slate";
import { ReactEditor } from "slate-react";

import type { MentionPluginOptions, MentionTargetRect, MentionTrigger } from "../types";

export function getTriggers(options: MentionPluginOptions | undefined): MentionTrigger[] {
  if (!options) return [{ char: '@' }];

  if (options.triggers && options.triggers.length > 0) {
    return options.triggers;
  }

  return [{ char: options.char ?? '@' }];
}

export function shouldTriggerActivate(
  trigger: MentionTrigger,
  charBefore: string,
  charAfter: string,
): boolean {
  const allowedAfter = trigger.allowedAfter ?? /^$|\s/;

  // Check if character before trigger matches pattern (whitespace or start)
  const isLeftClear = allowedAfter.test(charBefore);
  // Check if character after is whitespace or end (for multi-char triggers like '[[')
  const isRightClear = charAfter === '' || /\s/.test(charAfter);

  return isLeftClear && isRightClear;
}

export function getCaretRectFromSlate(slate: SlateEditor): MentionTargetRect | null {
  if (!slate.selection || !Range.isCollapsed(slate.selection)) return null;

  try {
    const domRange = ReactEditor.toDOMRange(slate, slate.selection);
    if (!domRange) return null;

    const rects = domRange.getClientRects();
    const boundingRect = domRange.getBoundingClientRect();

    return {
      domRect: boundingRect,
      clientRects: rects.length > 0 ? rects : domRange.getClientRects(),
    };
  } catch {
    // Fallback to window selection if ReactEditor fails
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;

    const range = selection.getRangeAt(0);
    return {
      domRect: range.getBoundingClientRect(),
      clientRects: range.getClientRects(),
    };
  }
}