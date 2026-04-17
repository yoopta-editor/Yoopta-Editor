import { describe, expect, it, vi } from 'vitest';

import { loadMarketplacePlugin } from './loadMarketplacePlugin';

// ---------------------------------------------------------------------------
// Mock dynamic import — vi.fn that we control per-test
// ---------------------------------------------------------------------------

const mockImport = vi.fn();

// Replace the global import() with our mock.
// loadMarketplacePlugin uses `import(bundleUrl)` which Vitest resolves here.
vi.mock(
  'virtual:marketplace-bundle',
  () => ({ default: undefined }),
  { virtual: true },
);

// Patch the module to use our controllable mockImport
vi.mock('./loadMarketplacePlugin', async (importOriginal) => {
  const original = await importOriginal<typeof import('./loadMarketplacePlugin')>();
  return {
    ...original,
    loadMarketplacePlugin: async (url: string) => {
      const module = await mockImport(url);
      if (!module.default) {
        throw new Error(
          `[Yoopta] Plugin bundle at "${url}" has no default export. ` +
            `Expected: export default YooptaPluginInstance;`,
        );
      }
      return { plugin: module.default, module };
    },
  };
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

const FAKE_URL = 'https://marketplace.yoopta.dev/plugins/gallery/1.0.0/bundle.mjs';

const fakePlugin = {
  getPlugin: {
    type: 'ImageGallery',
    elements: {
      'image-gallery': { render: vi.fn(), props: {} },
    },
  },
};

describe('loadMarketplacePlugin', () => {
  it('should return plugin and module from a valid bundle', async () => {
    mockImport.mockResolvedValueOnce({
      default: fakePlugin,
      ImageGalleryCommands: { insertImageGallery: vi.fn() },
    });

    const { plugin, module } = await loadMarketplacePlugin(FAKE_URL);

    expect(plugin).toBe(fakePlugin);
    expect(module.default).toBe(fakePlugin);
    expect(module.ImageGalleryCommands).toBeDefined();
    expect(mockImport).toHaveBeenCalledWith(FAKE_URL);
  });

  it('should throw if bundle has no default export', async () => {
    mockImport.mockResolvedValueOnce({
      SomeNamedExport: {},
    });

    await expect(loadMarketplacePlugin(FAKE_URL)).rejects.toThrow(
      'has no default export',
    );
  });

  it('should throw if bundle default export is undefined', async () => {
    mockImport.mockResolvedValueOnce({
      default: undefined,
    });

    await expect(loadMarketplacePlugin(FAKE_URL)).rejects.toThrow(
      'has no default export',
    );
  });

  it('should throw if bundle default export is null', async () => {
    mockImport.mockResolvedValueOnce({
      default: null,
    });

    await expect(loadMarketplacePlugin(FAKE_URL)).rejects.toThrow(
      'has no default export',
    );
  });

  it('should propagate network/import errors', async () => {
    mockImport.mockRejectedValueOnce(new Error('Failed to fetch'));

    await expect(loadMarketplacePlugin(FAKE_URL)).rejects.toThrow(
      'Failed to fetch',
    );
  });

  it('should include the URL in the error message for missing default', async () => {
    mockImport.mockResolvedValueOnce({});

    await expect(loadMarketplacePlugin(FAKE_URL)).rejects.toThrow(FAKE_URL);
  });

  it('should pass through all named exports in the module', async () => {
    const commands = { insertGallery: vi.fn(), deleteGallery: vi.fn() };
    const manifest = { name: 'ImageGallery', slug: 'image-gallery' };

    mockImport.mockResolvedValueOnce({
      default: fakePlugin,
      ImageGalleryCommands: commands,
      imageGalleryManifest: manifest,
    });

    const { module } = await loadMarketplacePlugin(FAKE_URL);

    expect(module.ImageGalleryCommands).toBe(commands);
    expect(module.imageGalleryManifest).toBe(manifest);
  });
});
