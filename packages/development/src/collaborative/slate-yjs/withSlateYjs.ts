import { Descendant, Editor, Operation, Point } from 'slate';
import * as Y from 'yjs';
import { applyYjsEvents } from './applyToSlate';
import { applySlateOp } from './applyToYjs';
import { yTextToSlateElement } from './utils/convert';
import {
  getStoredPosition,
  getStoredPositions,
  relativePositionToSlatePoint,
  removeStoredPosition,
  setStoredPosition,
  slatePointToRelativePosition,
} from './utils/position';
import { assertDocumentAttachment } from './utils/yjs';
import { SlateEditor } from '@yoopta/editor';

export type LocalChange = {
  op: Operation;
  doc: Descendant[];
  origin: unknown;
};

const ORIGIN: WeakMap<Editor, unknown> = new WeakMap();
const LOCAL_CHANGES: WeakMap<Editor, LocalChange[]> = new WeakMap();
const CONNECTED: WeakSet<Editor> = new WeakSet();

export type YjsSlateEditor = SlateEditor & {
  sharedRoot: Y.XmlText;

  localOrigin: unknown;
  positionStorageOrigin: unknown;

  applyRemoteEvents: (events: Y.YEvent<Y.XmlText>[], origin: unknown) => void;

  storeLocalChange: (op: Operation) => void;
  flushLocalChanges: () => void;

  isLocalOrigin: (origin: unknown) => boolean;

  connect: () => void;
  disconnect: () => void;
};

const handleXmlTextEvents = (events: Y.YEvent<Y.XmlText>[], transaction: Y.Transaction) => {
  return (slate: YjsSlateEditor) => {
    if (slate.isLocalOrigin(transaction.origin)) {
      return;
    }

    YjsSlateEditor.applyRemoteEvents(slate, events, transaction.origin);
  };
};

export const YjsSlateEditor = {
  isYjsEditor(value: unknown): value is YjsSlateEditor {
    return (
      Editor.isEditor(value) &&
      (value as YjsSlateEditor).sharedRoot instanceof Y.XmlText &&
      'localOrigin' in value &&
      'positionStorageOrigin' in value &&
      typeof (value as YjsSlateEditor).applyRemoteEvents === 'function' &&
      typeof (value as YjsSlateEditor).storeLocalChange === 'function' &&
      typeof (value as YjsSlateEditor).flushLocalChanges === 'function' &&
      typeof (value as YjsSlateEditor).isLocalOrigin === 'function' &&
      typeof (value as YjsSlateEditor).connect === 'function' &&
      typeof (value as YjsSlateEditor).disconnect === 'function'
    );
  },

  localChanges(slate: YjsSlateEditor): LocalChange[] {
    return LOCAL_CHANGES.get(slate) ?? [];
  },

  applyRemoteEvents(slate: YjsSlateEditor, events: Y.YEvent<Y.XmlText>[], origin: unknown): void {
    YjsSlateEditor.flushLocalChanges(slate);

    Editor.withoutNormalizing(slate, () => {
      YjsSlateEditor.withOrigin(slate, origin, () => {
        applyYjsEvents(slate.sharedRoot, slate, events);
      });
    });
  },

  storeLocalChange(slate: YjsSlateEditor, op: Operation): void {
    LOCAL_CHANGES.set(slate, [
      ...YjsSlateEditor.localChanges(slate),
      { op, doc: slate.children, origin: YjsSlateEditor.origin(slate) },
    ]);
  },

  flushLocalChanges(slate: YjsSlateEditor): void {
    assertDocumentAttachment(slate.sharedRoot);
    const localChanges = YjsSlateEditor.localChanges(slate);
    LOCAL_CHANGES.delete(slate);

    // Group local changes by origin so we can apply them in the correct order
    // with the correct origin with a minimal amount of transactions.
    const txGroups: LocalChange[][] = [];
    localChanges.forEach((change) => {
      const currentGroup = txGroups[txGroups.length - 1];
      if (currentGroup && currentGroup[0].origin === change.origin) {
        return currentGroup.push(change);
      }

      txGroups.push([change]);
    });

    txGroups.forEach((txGroup) => {
      assertDocumentAttachment(slate.sharedRoot);

      slate.sharedRoot.doc.transact(() => {
        txGroup.forEach((change) => {
          assertDocumentAttachment(slate.sharedRoot);
          applySlateOp(slate.sharedRoot, { children: change.doc }, change.op);
        });
      }, txGroup[0].origin);
    });
  },

  connected(slate: YjsSlateEditor): boolean {
    return CONNECTED.has(slate);
  },

  connect(slate: YjsSlateEditor): void {
    if (YjsSlateEditor.connected(slate)) {
      throw new Error('already connected');
    }

    slate.sharedRoot.observeDeep((...args) => handleXmlTextEvents(...args)(slate));
    const content = yTextToSlateElement(slate.sharedRoot);
    slate.children = content.children;
    CONNECTED.add(slate);

    Editor.normalize(slate, { force: true });
    if (!slate.operations.length) {
      slate.onChange();
    }
  },

  disconnect(slate: YjsSlateEditor): void {
    YjsSlateEditor.flushLocalChanges(slate);
    slate.sharedRoot.unobserveDeep((...args) => handleXmlTextEvents(...args)(slate));
    CONNECTED.delete(slate);
  },

  isLocal(slate: YjsSlateEditor): boolean {
    return slate.isLocalOrigin(YjsSlateEditor.origin(slate));
  },

  origin(slate: YjsSlateEditor): unknown {
    const origin = ORIGIN.get(slate);
    return origin !== undefined ? origin : slate.localOrigin;
  },

  withOrigin(slate: YjsSlateEditor, origin: unknown, fn: () => void): void {
    const prev = YjsSlateEditor.origin(slate);
    ORIGIN.set(slate, origin);
    fn();
    ORIGIN.set(slate, prev);
  },

  storePosition(slate: YjsSlateEditor, key: string, point: Point): void {
    const { sharedRoot, positionStorageOrigin: locationStorageOrigin } = slate;
    assertDocumentAttachment(sharedRoot);

    const position = slatePointToRelativePosition(sharedRoot, slate, point);

    sharedRoot.doc.transact(() => {
      setStoredPosition(sharedRoot, key, position);
    }, locationStorageOrigin);
  },

  removeStoredPosition(slate: YjsSlateEditor, key: string): void {
    const { sharedRoot, positionStorageOrigin: locationStorageOrigin } = slate;
    assertDocumentAttachment(sharedRoot);

    sharedRoot.doc.transact(() => {
      removeStoredPosition(sharedRoot, key);
    }, locationStorageOrigin);
  },

  position(slate: YjsSlateEditor, key: string): Point | null | undefined {
    const position = getStoredPosition(slate.sharedRoot, key);
    if (!position) {
      return undefined;
    }

    return relativePositionToSlatePoint(slate.sharedRoot, slate, position);
  },

  storedPositionsRelative(slate: YjsSlateEditor): Record<string, Y.RelativePosition> {
    return getStoredPositions(slate.sharedRoot);
  },
};

export function initializeCollaborativeSlate(slate: Editor, sharedText: Y.XmlText) {
  // Расширяем Slate типами и методами для коллаборации
  const collaborativeSlate = slate as YjsSlateEditor;
  const { apply, onChange } = slate;

  // Добавляем необходимые свойства
  collaborativeSlate.sharedRoot = sharedText;
  collaborativeSlate.localOrigin = Symbol('slate-local-change');
  collaborativeSlate.isLocalOrigin = (origin) => origin === collaborativeSlate.localOrigin;

  // Переопределяем apply для отслеживания локальных изменений
  collaborativeSlate.apply = (op: Operation) => {
    // Если это локальное изменение в подключенном состоянии
    if (YjsSlateEditor.connected(collaborativeSlate) && YjsSlateEditor.isLocal(collaborativeSlate)) {
      // Сохраняем изменение для последующей отправки
      YjsSlateEditor.storeLocalChange(collaborativeSlate, op);
    }

    // Применяем операцию к редактору
    apply(op);
  };

  // Переопределяем onChange для отправки накопленных изменений
  collaborativeSlate.onChange = () => {
    if (YjsSlateEditor.connected(collaborativeSlate)) {
      // Отправляем накопленные изменения в YJS
      YjsSlateEditor.flushLocalChanges(collaborativeSlate);
    }

    onChange();
  };

  // Добавляем методы для работы с изменениями
  collaborativeSlate.storeLocalChange = (op: Operation) => {
    LOCAL_CHANGES.set(collaborativeSlate, [
      ...YjsSlateEditor.localChanges(collaborativeSlate),
      {
        op,
        doc: collaborativeSlate.children,
        origin: YjsSlateEditor.origin(collaborativeSlate),
      },
    ]);
  };

  collaborativeSlate.flushLocalChanges = () => {
    const localChanges = YjsSlateEditor.localChanges(collaborativeSlate);
    LOCAL_CHANGES.delete(collaborativeSlate);

    // Отправляем изменения в YJS
    collaborativeSlate.sharedRoot.doc?.transact(() => {
      localChanges.forEach((change) => {
        applySlateOp(collaborativeSlate.sharedRoot, { children: change.doc }, change.op);
      });
    }, collaborativeSlate.localOrigin);
  };

  return collaborativeSlate;
}

export function withSlateYjs<T extends Editor>(editor: T, sharedRoot: Y.XmlText, { localOrigin }): T & YjsSlateEditor {
  const slate = editor as T & YjsSlateEditor;

  slate.sharedRoot = sharedRoot;

  slate.localOrigin = localOrigin;
  // slate.positionStorageOrigin = positionStorageOrigin ?? DEFAULT_POSITION_STORAGE_ORIGIN;

  slate.applyRemoteEvents = (events, origin) => {
    YjsSlateEditor.flushLocalChanges(slate);

    Editor.withoutNormalizing(slate, () => {
      YjsSlateEditor.withOrigin(slate, origin, () => {
        applyYjsEvents(slate.sharedRoot, slate, events);
      });
    });
  };

  slate.isLocalOrigin = (origin) => origin === slate.localOrigin;

  const handleYEvents = (events: Y.YEvent<Y.XmlText>[], transaction: Y.Transaction) => {
    if (slate.isLocalOrigin(transaction.origin)) {
      return;
    }

    YjsSlateEditor.applyRemoteEvents(slate, events, transaction.origin);
  };

  let autoConnectTimeoutId: ReturnType<typeof setTimeout> | null = null;
  // if (autoConnect) {
  //   autoConnectTimeoutId = setTimeout(() => {
  //     autoConnectTimeoutId = null;
  //     YjsSlateEditor.connect(slate);
  //   });
  // }

  slate.connect = () => {
    if (YjsSlateEditor.connected(slate)) {
      throw new Error('already connected');
    }

    slate.sharedRoot.observeDeep(handleYEvents);
    const content = yTextToSlateElement(slate.sharedRoot);
    console.log('content', content);
    slate.children = content.children;
    CONNECTED.add(slate);

    Editor.normalize(editor, { force: true });
    if (!editor.operations.length) {
      editor.onChange();
    }
  };

  slate.disconnect = () => {
    if (autoConnectTimeoutId) {
      clearTimeout(autoConnectTimeoutId);
    }

    YjsSlateEditor.flushLocalChanges(slate);
    slate.sharedRoot.unobserveDeep(handleYEvents);
    CONNECTED.delete(slate);
  };

  slate.storeLocalChange = (op) => {
    LOCAL_CHANGES.set(slate, [
      ...YjsSlateEditor.localChanges(slate),
      { op, doc: editor.children, origin: YjsSlateEditor.origin(slate) },
    ]);
  };

  slate.flushLocalChanges = () => {
    assertDocumentAttachment(slate.sharedRoot);
    const localChanges = YjsSlateEditor.localChanges(slate);
    LOCAL_CHANGES.delete(slate);

    console.log('flushLocalChanges localChanges', localChanges);

    // Group local changes by origin so we can apply them in the correct order
    // with the correct origin with a minimal amount of transactions.
    const txGroups: LocalChange[][] = [];
    localChanges.forEach((change) => {
      const currentGroup = txGroups[txGroups.length - 1];
      if (currentGroup && currentGroup[0].origin === change.origin) {
        return currentGroup.push(change);
      }

      txGroups.push([change]);
    });

    txGroups.forEach((txGroup) => {
      assertDocumentAttachment(slate.sharedRoot);

      slate.sharedRoot.doc.transact(() => {
        txGroup.forEach((change) => {
          assertDocumentAttachment(slate.sharedRoot);
          console.log('change.doc', change.doc);
          console.log('change.op', change.op);
          applySlateOp(slate.sharedRoot, { children: change.doc }, change.op);
        });
      }, txGroup[0].origin);
    });
  };

  const { apply, onChange } = slate;
  slate.apply = (op) => {
    if (YjsSlateEditor.connected(slate) && YjsSlateEditor.isLocal(slate)) {
      YjsSlateEditor.storeLocalChange(slate, op);
    }

    apply(op);
  };

  slate.onChange = () => {
    if (YjsSlateEditor.connected(slate)) {
      YjsSlateEditor.flushLocalChanges(slate);
    }

    onChange();
  };

  return slate;
}
