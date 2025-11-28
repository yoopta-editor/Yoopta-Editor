import { cn } from '@/lib/utils';
import type { PluginElementRenderProps } from '@yoopta/editor';
import { YooptaPlugin, useYooptaEditor } from '@yoopta/editor';
import { Package, Trash2 } from 'lucide-react';

type OrderDetailsActionElementsMap = any;

const Card = ({ children }) => children;

const OrderDetailsContainerRender = (props: PluginElementRenderProps) => {
  const editor = useYooptaEditor();

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const hasContent = Object.keys(editor.getEditorValue()).length > 0;
    if (hasContent) {
      editor.toggleBlock('Paragraph', {
        deleteText: true,
        focus: true,
      });
    } else {
      editor.deleteBlock({ blockId: props.blockId });
    }
  };

  return (
    <Card
      {...props.attributes}
      className={cn(
        'group transition-all duration-300 ease-in-out hover:shadow-md relative',
        'p-4 gap-0 !border-[#e5e7eb] !border-solid !border-[1px]',
      )}>
      <button
        contentEditable={false}
        onClick={handleDelete}
        className="cursor-pointer absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8"
        aria-label="Delete order details action">
        <Trash2 className="h-4 w-4" />
      </button>

      {props.children}
    </Card>
  );
};

const OrderDetailsOrderIdRender = (props: PluginElementRenderProps) => (
  <div className="flex text-xs gap-1" {...props.attributes}>
    <span className="font-bold" contentEditable={false}>
      Order ID:
    </span>
    <span>{props.children}</span>
  </div>
);

const OrderDetailsAddress1Render = (props: PluginElementRenderProps) => (
  <div className="flex text-xs gap-1" {...props.attributes}>
    <span className="font-bold" contentEditable={false}>
      Address (line 1):
    </span>
    <span>{props.children}</span>
  </div>
);

const OrderDetailsAddress2Render = (props: PluginElementRenderProps) => (
  <div className="flex text-xs gap-1" {...props.attributes}>
    <span className="font-bold" contentEditable={false}>
      Address (line 2):
    </span>
    <span>{props.children}</span>
  </div>
);

const OrderDetailsCityRender = (props: PluginElementRenderProps) => (
  <div className="flex text-xs gap-1" {...props.attributes}>
    <span className="font-bold" contentEditable={false}>
      City:
    </span>
    <span>{props.children}</span>
  </div>
);

const OrderDetailsZipRender = (props: PluginElementRenderProps) => (
  <div className="flex text-xs gap-1" {...props.attributes}>
    <span className="font-bold" contentEditable={false}>
      Zip:
    </span>
    <span>{props.children}</span>
  </div>
);

const OrderDetailsFirstNameRender = (props: PluginElementRenderProps) => (
  <div className="flex text-xs gap-1" {...props.attributes}>
    <span className="font-bold" contentEditable={false}>
      First Name:
    </span>
    <span>{props.children}</span>
  </div>
);

const OrderDetailsLastNameRender = (props: PluginElementRenderProps) => (
  <div className="flex text-xs gap-1" {...props.attributes}>
    <span className="font-bold" contentEditable={false}>
      Last Name:
    </span>
    <span>{props.children}</span>
  </div>
);

export const OrderDetailsActionPlugin = new YooptaPlugin<OrderDetailsActionElementsMap>({
  type: 'OrderDetailsAction',
  elements: (
    <order-details-container render={OrderDetailsContainerRender}>
      <order-details-order-id render={OrderDetailsOrderIdRender} />
      <order-details-address-1 render={OrderDetailsAddress1Render} />
      <order-details-address-2 render={OrderDetailsAddress2Render} />
      <order-details-city render={OrderDetailsCityRender} />
      <order-details-zip render={OrderDetailsZipRender} />
      <order-details-first-name render={OrderDetailsFirstNameRender} />
      <order-details-last-name render={OrderDetailsLastNameRender} />
    </order-details-container>
  ),

  options: {
    display: {
      title: 'Order Details',
      description: 'Provide order details to the customer',
    },
  },
});
