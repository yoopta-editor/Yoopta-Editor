import * as React from 'react';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { cva, type VariantProps } from 'class-variance-authority';

import { Sidebar } from 'lucide-react';
import { cn } from '@/utils/cn';
import Link from 'next/link';
import { useTheme } from 'next-themes';

const SheetRoot = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;

const SheetClose = SheetPrimitive.Close;

const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      'fixed inset-0 z-50  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className,
    )}
    {...props}
    ref={ref}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva(
  'overflow-y-auto fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
  {
    variants: {
      side: {
        top: 'inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
        bottom:
          'inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
        left: 'inset-y-0 left-0 h-full w-[300px] border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm',
        right:
          'inset-y-0 right-0 h-full w-[300px] border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  },
);

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = 'right', className, children, onOpenChange, ...props }, ref) => (
  <SheetPortal>
    {/* <SheetOverlay /> */}
    <SheetPrimitive.Content ref={ref} className={cn(sheetVariants({ side }), className)} {...props}>
      {children}
      <SheetPrimitive.Close
        onClick={onOpenChange}
        className="opacity-70 absolute right-4 top-4 rounded-sm lg:hidden ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
        <Cross2Icon className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />
);
SheetHeader.displayName = 'SheetHeader';

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
    {...props}
  />
);
SheetFooter.displayName = 'SheetFooter';

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold text-foreground', className)}
    {...props}
  />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

type SheetProps = {
  items: { id: string; title: string; href: string }[];
  path: string;
  title?: string;
  description?: string | React.ReactNode;
};

const Sheet = ({ items, path, title, description }: SheetProps) => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 640);
  const [isOpen, onOpenChange] = React.useState(!isMobile);
  const { setTheme } = useTheme();

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // React.useEffect(() => {
  //   // https://github.com/radix-ui/primitives/issues/1386
  //   onOpenChange(true);
  // }, []);

  const rootProps = {
    modal: false,
  };

  if (isMobile) {
    rootProps.modal = true;
  }

  return (
    <div className="overflow-auto fixed left-0 top-0 h-auto px-4 py-4 border-r border-b flex items-center w-[100vw] bg-white md:bg-transparent md:w-auto md:h-full md:block">
      <SheetRoot defaultOpen={!isMobile} open={isOpen} {...rootProps}>
        <SheetTrigger onClick={() => onOpenChange((p) => !p)}>
          <Sidebar size={24} />
        </SheetTrigger>
        <SheetContent side="left" autoFocus={false} onOpenChange={() => onOpenChange((p) => !p)}>
          <SheetHeader>
            <SheetTitle>{title || 'Yoopta examples'}</SheetTitle>
            {description || (
              <SheetDescription>
                Wanna more examples?
                <br />
                <a
                  href="https://github.com/Darginec05/Yoopta-Editor/issues/new?assignees=&labels=Example+Request&projects=&template=example_request.yml&title=%5BExample+Request%5D%3A+"
                  target="_blank"
                  rel="noopener"
                  className="text-sky-500">
                  Report it in repo
                </a>
              </SheetDescription>
            )}

            <div className="py-2">
              {items &&
                items.map((item) => {
                  const isCurrent = item.href === path;

                  return (
                    <div key={item.id}>
                      <Link
                        href={item.href}
                        className="group flex w-full items-center text-start rounded-md border border-transparent px-2 py-1 hover:underline text-muted-foreground transition-all"
                        onClick={() => setTheme('light')}
                        style={
                          isCurrent ? { color: '#007aff', textDecoration: 'underline' } : undefined
                        }>
                        {item.title}
                      </Link>
                    </div>
                  );
                })}
            </div>
          </SheetHeader>
        </SheetContent>
      </SheetRoot>
    </div>
  );
};

export {
  Sheet,
  SheetRoot,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
