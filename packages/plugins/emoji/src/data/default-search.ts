import type { EmojiItem, EmojiTrigger } from '../types';
import { EMOJI_DATA } from './emoji-data';

/**
 * Default emoji search function using the built-in dataset.
 * Matches against name and keywords.
 */
export function defaultEmojiSearch(query: string, _trigger: EmojiTrigger): EmojiItem[] {
  if (!query) return EMOJI_DATA.slice(0, 20);

  const q = query.toLowerCase();
  const results: EmojiItem[] = [];

  for (const item of EMOJI_DATA) {
    if (results.length >= 20) break;

    if (
      item.name.includes(q) ||
      item.keywords?.some((k) => k.includes(q))
    ) {
      results.push(item);
    }
  }

  return results;
}
