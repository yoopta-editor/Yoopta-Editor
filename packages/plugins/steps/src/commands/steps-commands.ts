import type { SlateElement, YooEditor } from '@yoopta/editor';
import { Blocks, generateId } from '@yoopta/editor';
import type { Location } from 'slate';
import { Editor, Element, Path, Transforms } from 'slate';

import type { StepContainerElement } from '../types';

type DeleteStepOptions = {
  stepId: string;
  blockId: string;
};

type MoveUpOptions = {
  stepId: string;
  blockId: string;
};

type MoveDownOptions = {
  stepId: string;
  blockId: string;
};

type AddStepOptions = {
  blockId: string;
  afterStepId?: string;
  at?: Location;
};

export type StepsCommands = {
  buildStepsElements: (editor: YooEditor, options?: { items?: number }) => StepContainerElement;
  addStep: (editor: YooEditor, options?: AddStepOptions) => void;
  deleteStep: (editor: YooEditor, options?: DeleteStepOptions) => void;
  moveUp: (editor: YooEditor, options?: MoveUpOptions) => void;
  moveDown: (editor: YooEditor, options?: MoveDownOptions) => void;
};

export const StepsCommands: StepsCommands = {
  buildStepsElements(editor, options) {
    const items = options?.items ?? 2;
    const stepItems: SlateElement[] = [];

    for (let i = 0; i < items; i += 1) {
      stepItems.push(
        editor.y('step-list-item', {
          props: { order: i },
          children: [
            editor.y('step-list-item-heading', { children: [editor.y.text(`Step ${i + 1}`)] }),
            editor.y('step-list-item-content', {
              children: [editor.y.text(`Step ${i + 1} content`)],
            }),
          ],
        }) as SlateElement,
      );
    }

    return editor.y('step-container', {
      children: [
        editor.y('step-list', {
          children: stepItems,
        }),
      ],
    }) as StepContainerElement;
  },

  addStep(editor, options) {
    const slate = Blocks.getBlockSlate(editor, { id: options?.blockId });
    if (!slate) return;

    // Find step-container
    const containerNodes = Editor.nodes<SlateElement>(slate, {
      at: [0],
      match: (n) => Element.isElement(n) && (n as SlateElement).type === 'step-container',
    });

    const containerEntry = Array.from(containerNodes)[0];
    if (!containerEntry) return;

    const [, containerPath] = containerEntry;

    // Find step-list
    const listNodes = Editor.nodes<SlateElement>(slate, {
      at: containerPath,
      match: (n) => Element.isElement(n) && (n as SlateElement).type === 'step-list',
    });

    const listEntry = Array.from(listNodes)[0];
    if (!listEntry) return;

    const [, listPath] = listEntry;

    // Find all step-list-item elements
    const stepNodes = Editor.nodes<SlateElement>(slate, {
      at: listPath,
      match: (n) => Element.isElement(n) && (n as SlateElement).type === 'step-list-item',
    });

    const steps = Array.from(stepNodes);

    let insertStepPath: number[];
    let newOrder: number;

    // If options.at is provided, use it
    if (options?.at && Path.isPath(options.at)) {
      insertStepPath = Path.next(options.at);
      const targetStep = steps.find(([, path]) => Path.equals(path, options.at as Path));
      newOrder = targetStep
        ? ((targetStep[0] as SlateElement).props?.order as number) + 1
        : steps.length;
    } else if (options?.afterStepId) {
      // Find step with matching id and insert after it
      const targetStep = steps.find(([node]) => (node as SlateElement).id === options.afterStepId);
      if (targetStep) {
        const [, path] = targetStep;
        insertStepPath = Path.next(path);
        newOrder = ((targetStep[0] as SlateElement).props?.order as number) + 1;
      } else {
        insertStepPath = [...listPath, steps.length];
        newOrder = steps.length;
      }
    } else if (slate.selection) {
      // If there's a selection, find current step and insert after it
      const selectionPath = slate.selection.anchor.path;

      let currentStepPath: number[] | undefined;
      let currentStepOrder: number | undefined;

      const parentEntry = Editor.above(slate, {
        at: selectionPath,
        match: (n) => Element.isElement(n) && (n as SlateElement).type === 'step-list-item',
      });

      if (parentEntry) {
        const [node, path] = parentEntry;
        currentStepPath = path;
        currentStepOrder = (node as SlateElement).props?.order as number;
      } else {
        for (const [node, path] of steps) {
          if (Path.isDescendant(selectionPath, path) || Path.equals(selectionPath, path)) {
            currentStepPath = path;
            currentStepOrder = (node as SlateElement).props?.order as number;
            break;
          }
        }
      }

      if (currentStepPath !== undefined && currentStepOrder !== undefined) {
        insertStepPath = Path.next(currentStepPath);
        newOrder = currentStepOrder + 1;
      } else {
        insertStepPath = [...listPath, steps.length];
        newOrder = steps.length;
      }
    } else {
      // No selection, insert at the end
      insertStepPath = [...listPath, steps.length];
      newOrder = steps.length;
    }

    // Update order for all steps after the insertion point
    const stepsToUpdate: [number[], number][] = [];
    for (const [node, path] of steps) {
      const stepOrder = (node as SlateElement).props?.order as number;
      if (stepOrder >= newOrder) {
        stepsToUpdate.push([path, stepOrder + 1]);
      }
    }

    const newStepId = generateId();
    const newStepItem = editor.y('step-list-item', {
      id: newStepId,
      props: { order: newOrder },
      children: [
        editor.y('step-list-item-heading', { children: [editor.y.text(`Step ${newOrder + 1}`)] }),
        editor.y('step-list-item-content', {
          children: [editor.y.text('')],
        }),
      ],
    });

    Editor.withoutNormalizing(slate, () => {
      // Update orders for steps after insertion
      for (const [path, newStepOrder] of stepsToUpdate) {
        Transforms.setNodes<SlateElement>(
          slate,
          {
            props: {
              ...((slate.children[path[0]] as SlateElement).props ?? {}),
              order: newStepOrder,
            },
          },
          { at: path },
        );
      }

      // Insert new step
      Transforms.insertNodes(slate, newStepItem, { at: insertStepPath });

      // Focus on new step heading
      const nextLeafPath = [...insertStepPath, 0, 0];
      setTimeout(() => {
        Transforms.select(slate, { offset: 0, path: nextLeafPath });
      }, 0);
    });
  },

  deleteStep(editor, options) {
    const slate = Blocks.getBlockSlate(editor, { id: options?.blockId });
    if (!slate) return;

    // Find step-container
    const containerNodes = Editor.nodes<SlateElement>(slate, {
      at: [0],
      match: (n) => Element.isElement(n) && (n as SlateElement).type === 'step-container',
    });

    const containerEntry = Array.from(containerNodes)[0];
    if (!containerEntry) return;

    const [, containerPath] = containerEntry;

    // Find step-list
    const listNodes = Editor.nodes<SlateElement>(slate, {
      at: containerPath,
      match: (n) => Element.isElement(n) && (n as SlateElement).type === 'step-list',
    });

    const listEntry = Array.from(listNodes)[0];
    if (!listEntry) return;

    const [, listPath] = listEntry;

    // Find all step-list-item elements
    const stepNodes = Editor.nodes<SlateElement>(slate, {
      at: listPath,
      match: (n) => Element.isElement(n) && (n as SlateElement).type === 'step-list-item',
    });

    const steps = Array.from(stepNodes);

    Editor.withoutNormalizing(slate, () => {
      if (steps.length === 1) {
        Blocks.deleteBlock(editor, { blockId: options!.blockId });
        return;
      }

      // Find step with matching id
      const targetStep = steps.find(([node]) => (node as SlateElement).id === options?.stepId);
      if (!targetStep) return;

      const [targetNode, targetPath] = targetStep;
      const targetOrder = (targetNode as SlateElement).props?.order as number;

      // Update order for all steps after the deleted step
      const stepsToUpdate: [number[], number][] = [];
      for (const [node, path] of steps) {
        if (Path.equals(path, targetPath)) continue;
        const stepOrder = (node as SlateElement).props?.order as number;
        if (stepOrder > targetOrder) {
          stepsToUpdate.push([path, stepOrder - 1]);
        }
      }

      // Update orders
      for (const [path, newStepOrder] of stepsToUpdate) {
        Transforms.setNodes<SlateElement>(
          slate,
          {
            props: {
              ...((slate.children[path[0]] as SlateElement).props ?? {}),
              order: newStepOrder,
            },
          },
          { at: path },
        );
      }

      // Remove the step
      Transforms.removeNodes(slate, { at: targetPath });
    });
  },

  moveUp(editor, options) {
    const slate = Blocks.getBlockSlate(editor, { id: options?.blockId });
    if (!slate) return;

    // Find step-container
    const containerNodes = Editor.nodes<SlateElement>(slate, {
      at: [0],
      match: (n) => Element.isElement(n) && (n as SlateElement).type === 'step-container',
    });

    const containerEntry = Array.from(containerNodes)[0];
    if (!containerEntry) return;

    const [, containerPath] = containerEntry;

    // Find step-list
    const listNodes = Editor.nodes<SlateElement>(slate, {
      at: containerPath,
      match: (n) => Element.isElement(n) && (n as SlateElement).type === 'step-list',
    });

    const listEntry = Array.from(listNodes)[0];
    if (!listEntry) return;

    const [, listPath] = listEntry;

    // Find all step-list-item elements
    const stepNodes = Editor.nodes<SlateElement>(slate, {
      at: listPath,
      match: (n) => Element.isElement(n) && (n as SlateElement).type === 'step-list-item',
    });

    const steps = Array.from(stepNodes);

    // Find target step
    const targetStep = steps.find(([node]) => (node as SlateElement).id === options?.stepId);
    if (!targetStep) return;

    const [targetNode, targetPath] = targetStep;
    const targetOrder = (targetNode as SlateElement).props?.order as number;

    // Can't move up if already first
    if (targetOrder === 0) return;

    // Find previous step
    const previousStep = steps.find(
      ([node]) => (node as SlateElement).props?.order === targetOrder - 1,
    );
    if (!previousStep) return;

    const [, previousPath] = previousStep;

    Editor.withoutNormalizing(slate, () => {
      // Swap orders
      Transforms.setNodes<SlateElement>(
        slate,
        {
          props: {
            ...((slate.children[targetPath[0]] as SlateElement).props ?? {}),
            order: targetOrder - 1,
          },
        },
        { at: targetPath },
      );

      Transforms.setNodes<SlateElement>(
        slate,
        {
          props: {
            ...((slate.children[previousPath[0]] as SlateElement).props ?? {}),
            order: targetOrder,
          },
        },
        { at: previousPath },
      );

      // Swap positions in DOM
      const targetNodeData = Editor.node(slate, targetPath)[0];
      const previousNodeData = Editor.node(slate, previousPath)[0];

      Transforms.removeNodes(slate, { at: targetPath });
      Transforms.insertNodes(slate, targetNodeData, { at: previousPath });

      Transforms.removeNodes(slate, { at: Path.next(previousPath) });
      Transforms.insertNodes(slate, previousNodeData, { at: Path.next(previousPath) });
    });
  },

  moveDown(editor, options) {
    const slate = Blocks.getBlockSlate(editor, { id: options?.blockId });
    if (!slate) return;

    // Find step-container
    const containerNodes = Editor.nodes<SlateElement>(slate, {
      at: [0],
      match: (n) => Element.isElement(n) && (n as SlateElement).type === 'step-container',
    });

    const containerEntry = Array.from(containerNodes)[0];
    if (!containerEntry) return;

    const [, containerPath] = containerEntry;

    // Find step-list
    const listNodes = Editor.nodes<SlateElement>(slate, {
      at: containerPath,
      match: (n) => Element.isElement(n) && (n as SlateElement).type === 'step-list',
    });

    const listEntry = Array.from(listNodes)[0];
    if (!listEntry) return;

    const [, listPath] = listEntry;

    // Find all step-list-item elements
    const stepNodes = Editor.nodes<SlateElement>(slate, {
      at: listPath,
      match: (n) => Element.isElement(n) && (n as SlateElement).type === 'step-list-item',
    });

    const steps = Array.from(stepNodes);

    // Find target step
    const targetStep = steps.find(([node]) => (node as SlateElement).id === options?.stepId);
    if (!targetStep) return;

    const [targetNode, targetPath] = targetStep;
    const targetOrder = (targetNode as SlateElement).props?.order as number;

    // Can't move down if already last
    const maxOrder = Math.max(
      ...steps.map(([node]) => (node as SlateElement).props?.order as number),
    );
    if (targetOrder === maxOrder) return;

    // Find next step
    const nextStep = steps.find(
      ([node]) => (node as SlateElement).props?.order === targetOrder + 1,
    );
    if (!nextStep) return;

    const [, nextPath] = nextStep;

    Editor.withoutNormalizing(slate, () => {
      // Swap orders
      Transforms.setNodes<SlateElement>(
        slate,
        {
          props: {
            ...((slate.children[targetPath[0]] as SlateElement).props ?? {}),
            order: targetOrder + 1,
          },
        },
        { at: targetPath },
      );

      Transforms.setNodes<SlateElement>(
        slate,
        {
          props: {
            ...((slate.children[nextPath[0]] as SlateElement).props ?? {}),
            order: targetOrder,
          },
        },
        { at: nextPath },
      );

      // Swap positions in DOM
      const targetNodeData = Editor.node(slate, targetPath)[0];
      const nextNodeData = Editor.node(slate, nextPath)[0];

      Transforms.removeNodes(slate, { at: nextPath });
      Transforms.insertNodes(slate, nextNodeData, { at: targetPath });

      Transforms.removeNodes(slate, { at: targetPath });
      Transforms.insertNodes(slate, targetNodeData, { at: Path.next(targetPath) });
    });
  },
};
