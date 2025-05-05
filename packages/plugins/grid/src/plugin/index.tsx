import { YooptaPlugin } from '@yoopta/editor';
import { GridElementMap } from '../types';
import { GridRender } from '../ui/Grid';
import { GridItemRender } from '../ui/GridItem';
import { GridItemContentRender } from '../ui/GridItemContent';
import { GridItemHeaderRender } from '../ui/GridItemHeader';
import { GridItemMediaRender } from '../ui/GridItemMedia';
import { GridItemSubtitleRender } from '../ui/GridItemSubtitle';
import { GridItemTitleRender } from '../ui/GridItemTitle';

const GridCard = new YooptaPlugin<GridElementMap>({
  type: 'GridCard',
  elements: {
    grid: {
      render: GridRender,
      asRoot: true,
      props: {
        columns: 2,
        gap: 'md',
        padding: 'none',
        containerWidth: 'full',
        background: 'transparent',
        border: false,
      },
      children: ['grid-item'],
      editors: {
        columns: {
          type: 'select',
          label: 'Columns',
          description: 'Number of columns or auto-fit behavior',
          options: [
            { label: 'Auto-fit', value: 'auto-fit' },
            { label: 'Auto-fill', value: 'auto-fill' },
            { label: '2 Columns', value: 2 },
            { label: '3 Columns', value: 3 },
            { label: '4 Columns', value: 4 },
          ],
        },
        gap: {
          type: 'select',
          label: 'Gap',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Small', value: 'sm' },
            { label: 'Medium', value: 'md' },
            { label: 'Large', value: 'lg' },
          ],
        },
        background: {
          type: 'color',
          label: 'Background',
          presets: [
            'transparent',
            '#000000',
            '#FFFFFF',
            '#F3F4F6',
            '#EF4444',
            '#F59E0B',
            '#10B981',
            '#3B82F6',
            '#6366F1',
            '#8B5CF6',
          ],
        },
        border: {
          type: 'toggle',
          label: 'Show Border',
        },
      },
    },
    'grid-item': {
      render: GridItemRender,
      props: {
        colspan: 1,
        rowspan: 1,
        variant: 'default',
        aspectRatio: '1/1',
        background: 'none',
        border: false,
      },
      children: ['grid-item-header', 'grid-item-content'],
    },
    'grid-item-header': {
      render: GridItemHeaderRender,
      props: { align: 'left' },
      children: ['grid-item-image'],
    },
    'grid-item-content': {
      render: GridItemContentRender,
      props: {
        padding: 'md',
      },
      children: ['grid-item-title', 'grid-item-description'],
      editors: {
        padding: {
          type: 'select',
          label: 'Padding',
          options: [
            { label: 'Small', value: 'sm' },
            { label: 'Medium', value: 'md' },
            { label: 'Large', value: 'lg' },
          ],
        },
      },
    },
    'grid-item-title': {
      render: GridItemTitleRender,
      props: {
        size: 'md',
      },
      editors: {
        size: {
          type: 'select',
          label: 'Size',
          options: [
            { label: 'Small', value: 'sm' },
            { label: 'Medium', value: 'md' },
            { label: 'Large', value: 'lg' },
          ],
        },
      },
    },
    'grid-item-description': {
      render: GridItemSubtitleRender,
    },
    'grid-item-image': {
      render: GridItemMediaRender,
      props: {
        fit: 'fill',
        nodeType: 'void',
        src: '',
        sizes: { width: 650, height: 500 },
      },
      editors: {
        fit: {
          type: 'select',
          label: 'Fit',
          options: [
            { label: 'Cover', value: 'cover' },
            { label: 'Contain', value: 'contain' },
            { label: 'Fill', value: 'fill' },
          ],
        },
        src: {
          type: 'upload',
          label: 'Image URL',
        },
        sizes: {
          type: 'range',
          label: 'Size',
          options: [
            { label: 'Width', min: 0, max: 1000 },
            { label: 'Height', min: 0, max: 1000 },
          ],
        },
      },
    },
  },
  extensions: (slate, editor) => {
    const { isSelectable } = slate;

    slate.isSelectable = (element) => {
      if (element.type === 'grid-item-image') {
        return false;
      }

      return isSelectable(element);
    };

    return slate;
  },
});

export { GridCard };
