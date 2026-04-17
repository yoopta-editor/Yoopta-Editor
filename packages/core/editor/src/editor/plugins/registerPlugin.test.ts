import { beforeEach, describe, expect, it, vi } from 'vitest';

import { registerPlugin, unregisterPlugin } from './registerPlugin';
import type { Plugin } from '../../plugins/types';
import { buildPlugins } from '../../utils/editor-builders';
import type { YooEditor } from '../types';

// ---------------------------------------------------------------------------
// Helpers — minimal mock objects
// ---------------------------------------------------------------------------

function mockPlugin(type: string, elements?: Record<string, any>): any {
  return {
    getPlugin: {
      type,
      elements: elements ?? {
        [type.toLowerCase()]: {
          render: vi.fn(),
          props: {},
          asRoot: true,
        },
      },
    },
  };
}

function mockEditor(
  existingPluginTypes: string[] = ['Paragraph'],
): YooEditor {
  // Build real plugins via buildPlugins so injection metadata is present
  const rawPlugins: Plugin<any>[] = existingPluginTypes.map((type) => ({
    type,
    elements: {
      [type.toLowerCase()]: {
        render: vi.fn(),
        props: {},
        asRoot: true,
      },
    },
  }));

  const plugins = buildPlugins(rawPlugins);

  const emitFn = vi.fn();

  return {
    plugins,
    children: {},
    blockEditorsMap: {},
    emit: emitFn,
  } as unknown as YooEditor;
}

// ---------------------------------------------------------------------------
// registerPlugin
// ---------------------------------------------------------------------------

describe('registerPlugin', () => {
  let editor: YooEditor;

  beforeEach(() => {
    editor = mockEditor(['Paragraph']);
  });

  it('should add a new plugin to editor.plugins', () => {
    const gallery = mockPlugin('ImageGallery');

    registerPlugin(editor, gallery);

    expect(editor.plugins).toHaveProperty('ImageGallery');
    expect(editor.plugins.ImageGallery.type).toBe('ImageGallery');
  });

  it('should preserve existing plugins', () => {
    const gallery = mockPlugin('ImageGallery');

    registerPlugin(editor, gallery);

    expect(editor.plugins).toHaveProperty('Paragraph');
    expect(editor.plugins).toHaveProperty('ImageGallery');
  });

  it('should emit plugin:register event', () => {
    const gallery = mockPlugin('ImageGallery');

    registerPlugin(editor, gallery);

    expect(editor.emit).toHaveBeenCalledWith('plugin:register', {
      type: 'ImageGallery',
    });
  });

  it('should not emit event if plugin is already registered', () => {
    const paragraph = mockPlugin('Paragraph');

    registerPlugin(editor, paragraph);

    expect(editor.emit).not.toHaveBeenCalled();
  });

  it('should skip registration if plugin type already exists', () => {
    const paragraph = mockPlugin('Paragraph');

    registerPlugin(editor, paragraph);

    // Should still have exactly the original Paragraph, not a duplicate
    expect(Object.keys(editor.plugins).filter((k) => k === 'Paragraph')).toHaveLength(1);
  });

  it('should resolve inline element injection for new plugin', () => {
    // Start with Paragraph + Link (inline)
    editor = mockEditor(['Paragraph']);

    // Register an inline plugin
    const link = mockPlugin('Link', {
      link: {
        render: vi.fn(),
        props: { nodeType: 'inline' },
      },
    });

    registerPlugin(editor, link);

    // Paragraph (block plugin) should now have the link inline element
    expect(editor.plugins.Paragraph.elements).toHaveProperty('link');
  });

  it('should resolve injectElementsFromPlugins when registering the injected plugin', () => {
    // Start with Callout that wants Paragraph injection
    const rawCallout: Plugin<any> = {
      type: 'Callout',
      elements: {
        callout: {
          render: vi.fn(),
          props: {},
          asRoot: true,
          injectElementsFromPlugins: ['Paragraph'],
        },
      },
    };

    editor.plugins = buildPlugins([rawCallout]);

    // Now register Paragraph — Callout should get paragraph injected
    const paragraph = mockPlugin('Paragraph');
    registerPlugin(editor, paragraph);

    expect(editor.plugins.Callout.elements).toHaveProperty('paragraph');
  });

  it('should handle multiple sequential registrations', () => {
    const gallery = mockPlugin('ImageGallery');
    const pricing = mockPlugin('PricingTable');

    registerPlugin(editor, gallery);
    registerPlugin(editor, pricing);

    expect(editor.plugins).toHaveProperty('Paragraph');
    expect(editor.plugins).toHaveProperty('ImageGallery');
    expect(editor.plugins).toHaveProperty('PricingTable');
    expect(Object.keys(editor.plugins).length).toBeGreaterThanOrEqual(3);
  });
});

// ---------------------------------------------------------------------------
// unregisterPlugin
// ---------------------------------------------------------------------------

describe('unregisterPlugin', () => {
  let editor: YooEditor;

  beforeEach(() => {
    editor = mockEditor(['Paragraph', 'ImageGallery']);

    // Add some blocks of different types
    editor.children = {
      'block-1': {
        id: 'block-1',
        type: 'Paragraph',
        value: [{ id: 'el-1', type: 'paragraph', children: [{ text: 'hello' }] }],
        meta: { order: 0, depth: 0 },
      },
      'block-2': {
        id: 'block-2',
        type: 'ImageGallery',
        value: [{ id: 'el-2', type: 'imagegallery', children: [{ text: '' }] }],
        meta: { order: 1, depth: 0 },
      },
      'block-3': {
        id: 'block-3',
        type: 'ImageGallery',
        value: [{ id: 'el-3', type: 'imagegallery', children: [{ text: '' }] }],
        meta: { order: 2, depth: 0 },
      },
    };

    editor.blockEditorsMap = {
      'block-1': {} as any,
      'block-2': {} as any,
      'block-3': {} as any,
    };
  });

  it('should remove the plugin from editor.plugins', () => {
    unregisterPlugin(editor, 'ImageGallery');

    expect(editor.plugins).not.toHaveProperty('ImageGallery');
    expect(editor.plugins).toHaveProperty('Paragraph');
  });

  it('should remove all blocks of the unregistered plugin type', () => {
    unregisterPlugin(editor, 'ImageGallery');

    expect(editor.children).not.toHaveProperty('block-2');
    expect(editor.children).not.toHaveProperty('block-3');
    expect(editor.children).toHaveProperty('block-1');
  });

  it('should remove block editors for removed blocks', () => {
    unregisterPlugin(editor, 'ImageGallery');

    expect(editor.blockEditorsMap).not.toHaveProperty('block-2');
    expect(editor.blockEditorsMap).not.toHaveProperty('block-3');
    expect(editor.blockEditorsMap).toHaveProperty('block-1');
  });

  it('should emit plugin:unregister event', () => {
    unregisterPlugin(editor, 'ImageGallery');

    expect(editor.emit).toHaveBeenCalledWith('plugin:unregister', {
      type: 'ImageGallery',
    });
  });

  it('should not emit event if plugin does not exist', () => {
    unregisterPlugin(editor, 'NonExistent');

    expect(editor.emit).not.toHaveBeenCalled();
  });

  it('should handle unregistering when no blocks of that type exist', () => {
    // Remove all ImageGallery blocks first
    delete editor.children['block-2'];
    delete editor.children['block-3'];

    unregisterPlugin(editor, 'ImageGallery');

    expect(editor.plugins).not.toHaveProperty('ImageGallery');
    expect(editor.children).toHaveProperty('block-1');
  });

  it('should rebuild injection after unregistering an inline plugin', () => {
    // Setup: Paragraph + Link (inline)
    editor = mockEditor(['Paragraph']);

    const link = mockPlugin('Link', {
      link: {
        render: vi.fn(),
        props: { nodeType: 'inline' },
      },
    });
    registerPlugin(editor, link);

    // Verify link was injected
    expect(editor.plugins.Paragraph.elements).toHaveProperty('link');

    // Unregister Link
    unregisterPlugin(editor, 'Link');

    // Link element should be removed from Paragraph
    expect(editor.plugins.Paragraph.elements).not.toHaveProperty('link');
    expect(editor.plugins).not.toHaveProperty('Link');
  });
});

// ---------------------------------------------------------------------------
// Round-trip: register then unregister
// ---------------------------------------------------------------------------

describe('register + unregister round-trip', () => {
  it('should return editor.plugins to original state after register+unregister', () => {
    const editor = mockEditor(['Paragraph']);
    const originalPluginTypes = Object.keys(editor.plugins).sort();

    const gallery = mockPlugin('ImageGallery');
    registerPlugin(editor, gallery);

    expect(Object.keys(editor.plugins)).toContain('ImageGallery');

    unregisterPlugin(editor, 'ImageGallery');

    const finalPluginTypes = Object.keys(editor.plugins)
      .filter((k) => k !== 'ImageGallery')
      .sort();

    // Should have at least the original plugins back
    for (const type of originalPluginTypes) {
      expect(finalPluginTypes).toContain(type);
    }
    expect(editor.plugins).not.toHaveProperty('ImageGallery');
  });
});
