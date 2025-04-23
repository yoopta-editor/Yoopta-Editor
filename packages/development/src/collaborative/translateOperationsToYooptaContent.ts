// src/utils/translateOperationsToContent.ts
import { YooptaOperation, YooptaContentValue } from '@yoopta/editor';

export function translateOperationsToContent(
  operations: YooptaOperation[],
  currentContent: YooptaContentValue = {},
): YooptaContentValue {
  let content = { ...currentContent };

  operations.forEach((op) => {
    switch (op.type) {
      case 'set_editor_value': {
        content = op.properties.value;
        break;
      }

      case 'insert_block': {
        content[op.block.id] = op.block;
        break;
      }

      case 'delete_block': {
        delete content[op.block.id];
        break;
      }

      case 'move_block': {
        const block = content[op.properties.id];
        if (block) {
          content[op.properties.id] = {
            ...block,
            meta: {
              ...block.meta,
              order: op.properties.order,
            },
          };
        }
        break;
      }

      case 'set_block_meta': {
        const block = content[op.id];
        if (block) {
          content[op.id] = {
            ...block,
            meta: {
              ...block.meta,
              ...op.properties,
            },
          };
        }
        break;
      }

      case 'set_block_value': {
        const block = content[op.id];
        if (block) {
          content[op.id] = {
            ...block,
            value: op.value,
          };
        }
        break;
      }
    }
  });

  return content;
}
