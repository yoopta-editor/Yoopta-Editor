import type { SlateElement, YooEditor } from '@yoopta/editor';
import { Blocks, generateId } from '@yoopta/editor';
import type { Location } from 'slate';
import { Editor, Element, Path, Transforms } from 'slate';

import type { CarouselContainerElement } from '../types';

type DeleteCarouselOptions = {
  carouselId: string;
  blockId: string;
};

type MoveUpOptions = {
  carouselId: string;
  blockId: string;
};

type MoveDownOptions = {
  carouselId: string;
  blockId: string;
};

type AddCarouselOptions = {
  blockId: string;
  afterCarouselId?: string;
  at?: Location;
};

export type CarouselCommands = {
  buildCarouselElements: (
    editor: YooEditor,
    options?: { items?: number },
  ) => CarouselContainerElement;
  addCarousel: (editor: YooEditor, options?: AddCarouselOptions) => void;
  deleteCarousel: (editor: YooEditor, options?: DeleteCarouselOptions) => void;
  moveUp: (editor: YooEditor, options?: MoveUpOptions) => void;
  moveDown: (editor: YooEditor, options?: MoveDownOptions) => void;
};

export const CarouselCommands: CarouselCommands = {
  buildCarouselElements(editor, options) {
    const items = options?.items ?? 2;
    const carouselItems: SlateElement[] = [];

    for (let i = 0; i < items; i += 1) {
      carouselItems.push(
        editor.y('carousel-list-item', {
          props: { order: i },
          children: [editor.y.text(`Carousel ${i + 1}`)],
        }) as SlateElement,
      );
    }

    return editor.y('carousel-container', {
      children: carouselItems,
    }) as CarouselContainerElement;
  },

  addCarousel(editor, options) {
    const slate = Blocks.getBlockSlate(editor, { id: options?.blockId });
    if (!slate) return;

    // Find carousel-container
    const containerNodes = Editor.nodes<SlateElement>(slate, {
      at: [0],
      match: (n) => Element.isElement(n) && (n as SlateElement).type === 'carousel-container',
    });

    const containerEntry = Array.from(containerNodes)[0];
    if (!containerEntry) return;

    const [, containerPath] = containerEntry;

    // Find carousel-list
    const listNodes = Editor.nodes<SlateElement>(slate, {
      at: containerPath,
      match: (n) => Element.isElement(n) && (n as SlateElement).type === 'carousel-list',
    });

    const listEntry = Array.from(listNodes)[0];
    if (!listEntry) return;

    const [, listPath] = listEntry;

    // Find all carousel-list-item elements
    const carouselNodes = Editor.nodes<SlateElement>(slate, {
      at: listPath,
      match: (n) => Element.isElement(n) && (n as SlateElement).type === 'carousel-list-item',
    });

    const carousel = Array.from(carouselNodes);

    let insertCarouselPath: number[];
    let newOrder: number;

    // If options.at is provided, use it
    if (options?.at && Path.isPath(options.at)) {
      insertCarouselPath = Path.next(options.at);
      const targetCarousel = carousel.find(([, path]) => Path.equals(path, options.at as Path));
      newOrder = targetCarousel
        ? ((targetCarousel[0] as SlateElement).props?.order as number) + 1
        : carousel.length;
    } else if (options?.afterCarouselId) {
      // Find carousel with matching id and insert after it
      const targetCarousel = carousel.find(
        ([node]) => (node as SlateElement).id === options.afterCarouselId,
      );
      if (targetCarousel) {
        const [, path] = targetCarousel;
        insertCarouselPath = Path.next(path);
        newOrder = ((targetCarousel[0] as SlateElement).props?.order as number) + 1;
      } else {
        insertCarouselPath = [...listPath, carousel.length];
        newOrder = carousel.length;
      }
    } else if (slate.selection) {
      // If there's a selection, find current carousel and insert after it
      const selectionPath = slate.selection.anchor.path;

      let currentCarouselPath: number[] | undefined;
      let currentCarouselOrder: number | undefined;

      const parentEntry = Editor.above(slate, {
        at: selectionPath,
        match: (n) => Element.isElement(n) && (n as SlateElement).type === 'carousel-list-item',
      });

      if (parentEntry) {
        const [node, path] = parentEntry;
        currentCarouselPath = path;
        currentCarouselOrder = (node as SlateElement).props?.order as number;
      } else {
        for (const [node, path] of carousel) {
          if (Path.isDescendant(selectionPath, path) || Path.equals(selectionPath, path)) {
            currentCarouselPath = path;
            currentCarouselOrder = (node as SlateElement).props?.order as number;
            break;
          }
        }
      }

      if (currentCarouselPath !== undefined && currentCarouselOrder !== undefined) {
        insertCarouselPath = Path.next(currentCarouselPath);
        newOrder = currentCarouselOrder + 1;
      } else {
        insertCarouselPath = [...listPath, carousel.length];
        newOrder = carousel.length;
      }
    } else {
      // No selection, insert at the end
      insertCarouselPath = [...listPath, carousel.length];
      newOrder = carousel.length;
    }

    // Update order for all carousel after the insertion point
    const carouselToUpdate: [number[], number][] = [];
    for (const [node, path] of carousel) {
      const carouselOrder = (node as SlateElement).props?.order as number;
      if (carouselOrder >= newOrder) {
        carouselToUpdate.push([path, carouselOrder + 1]);
      }
    }

    const newCarouselId = generateId();
    const newCarouselItem = editor.y('carousel-list-item', {
      id: newCarouselId,
      props: { order: newOrder },
      children: [
        editor.y('carousel-list-item-heading', {
          children: [editor.y.text(`Carousel ${newOrder + 1}`)],
        }),
        editor.y('carousel-list-item-content', {
          children: [editor.y.text('')],
        }),
      ],
    });

    Editor.withoutNormalizing(slate, () => {
      // Update orders for carousel after insertion
      for (const [path, newCarouselOrder] of carouselToUpdate) {
        Transforms.setNodes<SlateElement>(
          slate,
          {
            props: {
              ...((slate.children[path[0]] as SlateElement).props ?? {}),
              order: newCarouselOrder,
            },
          },
          { at: path },
        );
      }

      // Insert new carousel
      Transforms.insertNodes(slate, newCarouselItem, { at: insertCarouselPath });

      // Focus on new carousel heading
      const nextLeafPath = [...insertCarouselPath, 0, 0];
      setTimeout(() => {
        Transforms.select(slate, { offset: 0, path: nextLeafPath });
      }, 0);
    });
  },

  deleteCarousel(editor, options) {
    const slate = Blocks.getBlockSlate(editor, { id: options?.blockId });
    if (!slate) return;

    // Find carousel-container
    const containerNodes = Editor.nodes<SlateElement>(slate, {
      at: [0],
      match: (n) => Element.isElement(n) && (n as SlateElement).type === 'carousel-container',
    });

    const containerEntry = Array.from(containerNodes)[0];
    if (!containerEntry) return;

    const [, containerPath] = containerEntry;

    // Find carousel-list
    const listNodes = Editor.nodes<SlateElement>(slate, {
      at: containerPath,
      match: (n) => Element.isElement(n) && (n as SlateElement).type === 'carousel-list',
    });

    const listEntry = Array.from(listNodes)[0];
    if (!listEntry) return;

    const [, listPath] = listEntry;

    // Find all carousel-list-item elements
    const carouselNodes = Editor.nodes<SlateElement>(slate, {
      at: listPath,
      match: (n) => Element.isElement(n) && (n as SlateElement).type === 'carousel-list-item',
    });

    const carousel = Array.from(carouselNodes);

    Editor.withoutNormalizing(slate, () => {
      if (carousel.length === 1) {
        Blocks.deleteBlock(editor, { blockId: options!.blockId });
        return;
      }

      // Find carousel with matching id
      const targetCarousel = carousel.find(
        ([node]) => (node as SlateElement).id === options?.carouselId,
      );
      if (!targetCarousel) return;

      const [targetNode, targetPath] = targetCarousel;
      const targetOrder = (targetNode as SlateElement).props?.order as number;

      // Update order for all carousel after the deleted carousel
      const carouselToUpdate: [number[], number][] = [];
      for (const [node, path] of carousel) {
        if (Path.equals(path, targetPath)) continue;
        const carouselOrder = (node as SlateElement).props?.order as number;
        if (carouselOrder > targetOrder) {
          carouselToUpdate.push([path, carouselOrder - 1]);
        }
      }

      // Update orders
      for (const [path, newCarouselOrder] of carouselToUpdate) {
        Transforms.setNodes<SlateElement>(
          slate,
          {
            props: {
              ...((slate.children[path[0]] as SlateElement).props ?? {}),
              order: newCarouselOrder,
            },
          },
          { at: path },
        );
      }

      // Remove the carousel
      Transforms.removeNodes(slate, { at: targetPath });
    });
  },

  moveUp(editor, options) {
    const slate = Blocks.getBlockSlate(editor, { id: options?.blockId });
    if (!slate) return;

    // Find carousel-container
    const containerNodes = Editor.nodes<SlateElement>(slate, {
      at: [0],
      match: (n) => Element.isElement(n) && (n as SlateElement).type === 'carousel-container',
    });

    const containerEntry = Array.from(containerNodes)[0];
    if (!containerEntry) return;

    const [, containerPath] = containerEntry;

    // Find carousel-list
    const listNodes = Editor.nodes<SlateElement>(slate, {
      at: containerPath,
      match: (n) => Element.isElement(n) && (n as SlateElement).type === 'carousel-list',
    });

    const listEntry = Array.from(listNodes)[0];
    if (!listEntry) return;

    const [, listPath] = listEntry;

    // Find all carousel-list-item elements
    const carouselNodes = Editor.nodes<SlateElement>(slate, {
      at: listPath,
      match: (n) => Element.isElement(n) && (n as SlateElement).type === 'carousel-list-item',
    });

    const carousel = Array.from(carouselNodes);

    // Find target carousel
    const targetCarousel = carousel.find(
      ([node]) => (node as SlateElement).id === options?.carouselId,
    );
    if (!targetCarousel) return;

    const [targetNode, targetPath] = targetCarousel;
    const targetOrder = (targetNode as SlateElement).props?.order as number;

    // Can't move up if already first
    if (targetOrder === 0) return;

    // Find previous carousel
    const previousCarousel = carousel.find(
      ([node]) => (node as SlateElement).props?.order === targetOrder - 1,
    );
    if (!previousCarousel) return;

    const [, previousPath] = previousCarousel;

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

    // Find carousel-container
    const containerNodes = Editor.nodes<SlateElement>(slate, {
      at: [0],
      match: (n) => Element.isElement(n) && (n as SlateElement).type === 'carousel-container',
    });

    const containerEntry = Array.from(containerNodes)[0];
    if (!containerEntry) return;

    const [, containerPath] = containerEntry;

    // Find carousel-list
    const listNodes = Editor.nodes<SlateElement>(slate, {
      at: containerPath,
      match: (n) => Element.isElement(n) && (n as SlateElement).type === 'carousel-list',
    });

    const listEntry = Array.from(listNodes)[0];
    if (!listEntry) return;

    const [, listPath] = listEntry;

    // Find all carousel-list-item elements
    const carouselNodes = Editor.nodes<SlateElement>(slate, {
      at: listPath,
      match: (n) => Element.isElement(n) && (n as SlateElement).type === 'carousel-list-item',
    });

    const carousel = Array.from(carouselNodes);

    // Find target carousel
    const targetCarousel = carousel.find(
      ([node]) => (node as SlateElement).id === options?.carouselId,
    );
    if (!targetCarousel) return;

    const [targetNode, targetPath] = targetCarousel;
    const targetOrder = (targetNode as SlateElement).props?.order as number;

    // Can't move down if already last
    const maxOrder = Math.max(
      ...carousel.map(([node]) => (node as SlateElement).props?.order as number),
    );
    if (targetOrder === maxOrder) return;

    // Find next carousel
    const nextCarousel = carousel.find(
      ([node]) => (node as SlateElement).props?.order === targetOrder + 1,
    );
    if (!nextCarousel) return;

    const [, nextPath] = nextCarousel;

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
