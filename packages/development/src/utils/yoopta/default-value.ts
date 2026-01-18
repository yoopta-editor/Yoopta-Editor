import { YooptaContentValue } from '@yoopta/editor';

export const DEFAULT_VALUE = {
  "dc95e2e8-8e5e-42f6-9d3c-5a14e2218308": {
    "id": "dc95e2e8-8e5e-42f6-9d3c-5a14e2218308",
    "type": "Paragraph",
    "value": [
      {
        "id": "1cf25bd7-f096-40ef-a649-e0c9c53afa74",
        "type": "paragraph",
        "children": [
          {
            "text": "Sidebars are one of the most complex components to build. They are central to any application and often contain a lot of moving parts."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 0
    }
  },
  "86ee73cd-96e6-484c-b3e5-080c3715bcfa": {
    "id": "86ee73cd-96e6-484c-b3e5-080c3715bcfa",
    "type": "Paragraph",
    "value": [
      {
        "id": "6459a1c4-54c3-4bed-8fcf-a96996a17efc",
        "type": "paragraph",
        "children": [
          {
            "text": "I don't like building sidebars. So I built 30+ of them. All kinds of configurations. Then I extracted the core components into"
          },
          {
            "text": " "
          },
          {
            "text": "sidebar.tsx",
            "code": true
          },
          {
            "text": "."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 1
    }
  },
  "c14c3210-deb5-4799-af53-5f634e9ca1d2": {
    "id": "c14c3210-deb5-4799-af53-5f634e9ca1d2",
    "type": "Paragraph",
    "value": [
      {
        "id": "f8a0e714-e4ab-4b42-8cc9-31b79f052fad",
        "type": "paragraph",
        "children": [
          {
            "text": "We now have a solid foundation to build on top of. Composable. Themeable. Customizable."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 2
    }
  },
  "12828264-847b-4754-a138-b778de6448c0": {
    "id": "12828264-847b-4754-a138-b778de6448c0",
    "type": "Paragraph",
    "value": [
      {
        "id": "70ee496a-b3f6-46ab-b6a2-19ed326694a2",
        "type": "paragraph",
        "children": [
          {
            "id": "a954da83-1fa2-4791-bc56-dc32d83fef6a",
            "type": "link",
            "props": {
              "url": "https://ui.shadcn.com/blocks",
              "target": "_self",
              "rel": "noopener noreferrer",
              "title": "Browse the Blocks Library",
              "nodeType": "inline"
            },
            "children": [
              {
                "text": "Browse the Blocks Library"
              }
            ]
          },
          {
            "text": "."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 3
    }
  },
  "2f9df5a9-dc1c-48b2-8fb3-3ce9f3c6a2b5": {
    "id": "2f9df5a9-dc1c-48b2-8fb3-3ce9f3c6a2b5",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "1966cffa-806e-41c7-a1a7-5a1cb050972e",
        "type": "heading-two",
        "children": [
          {
            "text": "Installation"
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 4
    }
  },
  "4ff2aeb1-c1c0-4a1e-8618-7bf1cffb392f": {
    "id": "4ff2aeb1-c1c0-4a1e-8618-7bf1cffb392f",
    "type": "HeadingThree",
    "value": [
      {
        "id": "b9c3f64f-29ec-4bc7-b671-707727787ac9",
        "type": "heading-three",
        "children": [
          {
            "text": "Copy and paste the following code into your project."
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 5
    }
  },
  "1760ee0a-047b-4d88-8fa4-592eb379a552": {
    "id": "1760ee0a-047b-4d88-8fa4-592eb379a552",
    "type": "Code",
    "value": [
      {
        "id": "d1c3d4f7-267e-4f26-a182-95026de1c912",
        "type": "code",
        "children": [
          {
            "text": "\"use client\"import * as React from \"react\"import { Slot } from \"@radix-ui/react-slot\"import { cva, type VariantProps } from \"class-variance-authority\"import { PanelLeftIcon } from \"lucide-react\"import { useIsMobile } from \"@/hooks/use-mobile\"import { cn } from \"@/lib/utils\"import { Button } from \"@/components/ui/button\"import { Input } from \"@/components/ui/input\"import { Separator } from \"@/components/ui/separator\"import {  Sheet,  SheetContent,  SheetDescription,  SheetHeader,  SheetTitle,} from \"@/components/ui/sheet\"import { Skeleton } from \"@/components/ui/skeleton\"import {  Tooltip,  TooltipContent,  TooltipProvider,  TooltipTrigger,} from \"@/components/ui/tooltip\"const SIDEBAR_COOKIE_NAME = \"sidebar_state\"const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7const SIDEBAR_WIDTH = \"16rem\"const SIDEBAR_WIDTH_MOBILE = \"18rem\"const SIDEBAR_WIDTH_ICON = \"3rem\"const SIDEBAR_KEYBOARD_SHORTCUT = \"b\"type SidebarContextProps = {  state: \"expanded\" | \"collapsed\"  open: boolean  setOpen: (open: boolean) => void  openMobile: boolean  setOpenMobile: (open: boolean) => void  isMobile: boolean  toggleSidebar: () => void}const SidebarContext = React.createContext<SidebarContextProps | null>(null)function useSidebar() {  const context = React.useContext(SidebarContext)  if (!context) {    throw new Error(\"useSidebar must be used within a SidebarProvider.\")  }  return context}function SidebarProvider({  defaultOpen = true,  open: openProp,  onOpenChange: setOpenProp,  className,  style,  children,  ...props}: React.ComponentProps<\"div\"> & {  defaultOpen?: boolean  open?: boolean  onOpenChange?: (open: boolean) => void}) {  const isMobile = useIsMobile()  const [openMobile, setOpenMobile] = React.useState(false)  // This is the internal state of the sidebar.  // We use openProp and setOpenProp for control from outside the component.  const [_open, _setOpen] = React.useState(defaultOpen)  const open = openProp ?? _open  const setOpen = React.useCallback(    (value: boolean | ((value: boolean) => boolean)) => {      const openState = typeof value === \"function\" ? value(open) : value      if (setOpenProp) {        setOpenProp(openState)      } else {        _setOpen(openState)      }      // This sets the cookie to keep the sidebar state.      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`    },    [setOpenProp, open]  )  // Helper to toggle the sidebar.  const toggleSidebar = React.useCallback(() => {    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open)  }, [isMobile, setOpen, setOpenMobile])  // Adds a keyboard shortcut to toggle the sidebar.  React.useEffect(() => {    const handleKeyDown = (event: KeyboardEvent) => {      if (        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&        (event.metaKey || event.ctrlKey)      ) {        event.preventDefault()        toggleSidebar()      }    }    window.addEventListener(\"keydown\", handleKeyDown)    return () => window.removeEventListener(\"keydown\", handleKeyDown)  }, [toggleSidebar])  // We add a state so that we can do data-state=\"expanded\" or \"collapsed\".  // This makes it easier to style the sidebar with Tailwind classes.  const state = open ? \"expanded\" : \"collapsed\"  const contextValue = React.useMemo<SidebarContextProps>(    () => ({      state,      open,      setOpen,      isMobile,      openMobile,      setOpenMobile,      toggleSidebar,    }),    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]  )  return (    <SidebarContext.Provider value={contextValue}>      <TooltipProvider delayDuration={0}>        <div          data-slot=\"sidebar-wrapper\"          style={            {              \"--sidebar-width\": SIDEBAR_WIDTH,              \"--sidebar-width-icon\": SIDEBAR_WIDTH_ICON,              ...style,            } as React.CSSProperties          }          className={cn(            \"group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full\",            className          )}          {...props}        >          {children}        </div>      </TooltipProvider>    </SidebarContext.Provider>  )}function Sidebar({  side = \"left\",  variant = \"sidebar\",  collapsible = \"offcanvas\",  className,  children,  ...props}: React.ComponentProps<\"div\"> & {  side?: \"left\" | \"right\"  variant?: \"sidebar\" | \"floating\" | \"inset\"  collapsible?: \"offcanvas\" | \"icon\" | \"none\"}) {  const { isMobile, state, openMobile, setOpenMobile } = useSidebar()  if (collapsible === \"none\") {    return (      <div        data-slot=\"sidebar\"        className={cn(          \"bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col\",          className        )}        {...props}      >        {children}      </div>    )  }  if (isMobile) {    return (      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>        <SheetContent          data-sidebar=\"sidebar\"          data-slot=\"sidebar\"          data-mobile=\"true\"          className=\"bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden\"          style={            {              \"--sidebar-width\": SIDEBAR_WIDTH_MOBILE,            } as React.CSSProperties          }          side={side}        >          <SheetHeader className=\"sr-only\">            <SheetTitle>Sidebar</SheetTitle>            <SheetDescription>Displays the mobile sidebar.</SheetDescription>          </SheetHeader>          <div className=\"flex h-full w-full flex-col\">{children}</div>        </SheetContent>      </Sheet>    )  }  return (    <div      className=\"group peer text-sidebar-foreground hidden md:block\"      data-state={state}      data-collapsible={state === \"collapsed\" ? collapsible : \"\"}      data-variant={variant}      data-side={side}      data-slot=\"sidebar\"    >      {/* This is what handles the sidebar gap on desktop */}      <div        data-slot=\"sidebar-gap\"        className={cn(          \"relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear\",          \"group-data-[collapsible=offcanvas]:w-0\",          \"group-data-[side=right]:rotate-180\",          variant === \"floating\" || variant === \"inset\"            ? \"group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]\"            : \"group-data-[collapsible=icon]:w-(--sidebar-width-icon)\"        )}      />      <div        data-slot=\"sidebar-container\"        className={cn(          \"fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex\",          side === \"left\"            ? \"left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]\"            : \"right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]\",          // Adjust the padding for floating and inset variants.          variant === \"floating\" || variant === \"inset\"            ? \"p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]\"            : \"group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l\",          className        )}        {...props}      >        <div          data-sidebar=\"sidebar\"          data-slot=\"sidebar-inner\"          className=\"bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm\"        >          {children}        </div>      </div>    </div>  )}function SidebarTrigger({  className,  onClick,  ...props}: React.ComponentProps<typeof Button>) {  const { toggleSidebar } = useSidebar()  return (    <Button      data-sidebar=\"trigger\"      data-slot=\"sidebar-trigger\"      variant=\"ghost\"      size=\"icon\"      className={cn(\"size-7\", className)}      onClick={(event) => {        onClick?.(event)        toggleSidebar()      }}      {...props}    >      <PanelLeftIcon />      <span className=\"sr-only\">Toggle Sidebar</span>    </Button>  )}function SidebarRail({ className, ...props }: React.ComponentProps<\"button\">) {  const { toggleSidebar } = useSidebar()  return (    <button      data-sidebar=\"rail\"      data-slot=\"sidebar-rail\"      aria-label=\"Toggle Sidebar\"      tabIndex={-1}      onClick={toggleSidebar}      title=\"Toggle Sidebar\"      className={cn(        \"hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] sm:flex\",        \"in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize\",        \"[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize\",        \"hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full\",        \"[[data-side=left][data-collapsible=offcanvas]_&]:-right-2\",        \"[[data-side=right][data-collapsible=offcanvas]_&]:-left-2\",        className      )}      {...props}    />  )}function SidebarInset({ className, ...props }: React.ComponentProps<\"main\">) {  return (    <main      data-slot=\"sidebar-inset\"      className={cn(        \"bg-background relative flex w-full flex-1 flex-col\",        \"md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2\",        className      )}      {...props}    />  )}function SidebarInput({  className,  ...props}: React.ComponentProps<typeof Input>) {  return (    <Input      data-slot=\"sidebar-input\"      data-sidebar=\"input\"      className={cn(\"bg-background h-8 w-full shadow-none\", className)}      {...props}    />  )}function SidebarHeader({ className, ...props }: React.ComponentProps<\"div\">) {  return (    <div      data-slot=\"sidebar-header\"      data-sidebar=\"header\"      className={cn(\"flex flex-col gap-2 p-2\", className)}      {...props}    />  )}function SidebarFooter({ className, ...props }: React.ComponentProps<\"div\">) {  return (    <div      data-slot=\"sidebar-footer\"      data-sidebar=\"footer\"      className={cn(\"flex flex-col gap-2 p-2\", className)}      {...props}    />  )}function SidebarSeparator({  className,  ...props}: React.ComponentProps<typeof Separator>) {  return (    <Separator      data-slot=\"sidebar-separator\"      data-sidebar=\"separator\"      className={cn(\"bg-sidebar-border mx-2 w-auto\", className)}      {...props}    />  )}function SidebarContent({ className, ...props }: React.ComponentProps<\"div\">) {  return (    <div      data-slot=\"sidebar-content\"      data-sidebar=\"content\"      className={cn(        \"flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden\",        className      )}      {...props}    />  )}function SidebarGroup({ className, ...props }: React.ComponentProps<\"div\">) {  return (    <div      data-slot=\"sidebar-group\"      data-sidebar=\"group\"      className={cn(\"relative flex w-full min-w-0 flex-col p-2\", className)}      {...props}    />  )}function SidebarGroupLabel({  className,  asChild = false,  ...props}: React.ComponentProps<\"div\"> & { asChild?: boolean }) {  const Comp = asChild ? Slot : \"div\"  return (    <Comp      data-slot=\"sidebar-group-label\"      data-sidebar=\"group-label\"      className={cn(        \"text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0\",        \"group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0\",        className      )}      {...props}    />  )}function SidebarGroupAction({  className,  asChild = false,  ...props}: React.ComponentProps<\"button\"> & { asChild?: boolean }) {  const Comp = asChild ? Slot : \"button\"  return (    <Comp      data-slot=\"sidebar-group-action\"      data-sidebar=\"group-action\"      className={cn(        \"text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0\",        // Increases the hit area of the button on mobile.        \"after:absolute after:-inset-2 md:after:hidden\",        \"group-data-[collapsible=icon]:hidden\",        className      )}      {...props}    />  )}function SidebarGroupContent({  className,  ...props}: React.ComponentProps<\"div\">) {  return (    <div      data-slot=\"sidebar-group-content\"      data-sidebar=\"group-content\"      className={cn(\"w-full text-sm\", className)}      {...props}    />  )}function SidebarMenu({ className, ...props }: React.ComponentProps<\"ul\">) {  return (    <ul      data-slot=\"sidebar-menu\"      data-sidebar=\"menu\"      className={cn(\"flex w-full min-w-0 flex-col gap-1\", className)}      {...props}    />  )}function SidebarMenuItem({ className, ...props }: React.ComponentProps<\"li\">) {  return (    <li      data-slot=\"sidebar-menu-item\"      data-sidebar=\"menu-item\"      className={cn(\"group/menu-item relative\", className)}      {...props}    />  )}const sidebarMenuButtonVariants = cva(  \"peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0\",  {    variants: {      variant: {        default: \"hover:bg-sidebar-accent hover:text-sidebar-accent-foreground\",        outline:          \"bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]\",      },      size: {        default: \"h-8 text-sm\",        sm: \"h-7 text-xs\",        lg: \"h-12 text-sm group-data-[collapsible=icon]:p-0!\",      },    },    defaultVariants: {      variant: \"default\",      size: \"default\",    },  })function SidebarMenuButton({  asChild = false,  isActive = false,  variant = \"default\",  size = \"default\",  tooltip,  className,  ...props}: React.ComponentProps<\"button\"> & {  asChild?: boolean  isActive?: boolean  tooltip?: string | React.ComponentProps<typeof TooltipContent>} & VariantProps<typeof sidebarMenuButtonVariants>) {  const Comp = asChild ? Slot : \"button\"  const { isMobile, state } = useSidebar()  const button = (    <Comp      data-slot=\"sidebar-menu-button\"      data-sidebar=\"menu-button\"      data-size={size}      data-active={isActive}      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}      {...props}    />  )  if (!tooltip) {    return button  }  if (typeof tooltip === \"string\") {    tooltip = {      children: tooltip,    }  }  return (    <Tooltip>      <TooltipTrigger asChild>{button}</TooltipTrigger>      <TooltipContent        side=\"right\"        align=\"center\"        hidden={state !== \"collapsed\" || isMobile}        {...tooltip}      />    </Tooltip>  )}function SidebarMenuAction({  className,  asChild = false,  showOnHover = false,  ...props}: React.ComponentProps<\"button\"> & {  asChild?: boolean  showOnHover?: boolean}) {  const Comp = asChild ? Slot : \"button\"  return (    <Comp      data-slot=\"sidebar-menu-action\"      data-sidebar=\"menu-action\"      className={cn(        \"text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground peer-hover/menu-button:text-sidebar-accent-foreground absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0\",        // Increases the hit area of the button on mobile.        \"after:absolute after:-inset-2 md:after:hidden\",        \"peer-data-[size=sm]/menu-button:top-1\",        \"peer-data-[size=default]/menu-button:top-1.5\",        \"peer-data-[size=lg]/menu-button:top-2.5\",        \"group-data-[collapsible=icon]:hidden\",        showOnHover &&          \"peer-data-[active=true]/menu-button:text-sidebar-accent-foreground group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0\",        className      )}      {...props}    />  )}function SidebarMenuBadge({  className,  ...props}: React.ComponentProps<\"div\">) {  return (    <div      data-slot=\"sidebar-menu-badge\"      data-sidebar=\"menu-badge\"      className={cn(        \"text-sidebar-foreground pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none\",        \"peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground\",        \"peer-data-[size=sm]/menu-button:top-1\",        \"peer-data-[size=default]/menu-button:top-1.5\",        \"peer-data-[size=lg]/menu-button:top-2.5\",        \"group-data-[collapsible=icon]:hidden\",        className      )}      {...props}    />  )}function SidebarMenuSkeleton({  className,  showIcon = false,  ...props}: React.ComponentProps<\"div\"> & {  showIcon?: boolean}) {  // Random width between 50 to 90%.  const width = React.useMemo(() => {    return `${Math.floor(Math.random() * 40) + 50}%`  }, [])  return (    <div      data-slot=\"sidebar-menu-skeleton\"      data-sidebar=\"menu-skeleton\"      className={cn(\"flex h-8 items-center gap-2 rounded-md px-2\", className)}      {...props}    >      {showIcon && (        <Skeleton          className=\"size-4 rounded-md\"          data-sidebar=\"menu-skeleton-icon\"        />      )}      <Skeleton        className=\"h-4 max-w-(--skeleton-width) flex-1\"        data-sidebar=\"menu-skeleton-text\"        style={          {            \"--skeleton-width\": width,          } as React.CSSProperties        }      />    </div>  )}function SidebarMenuSub({ className, ...props }: React.ComponentProps<\"ul\">) {  return (    <ul      data-slot=\"sidebar-menu-sub\"      data-sidebar=\"menu-sub\"      className={cn(        \"border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5\",        \"group-data-[collapsible=icon]:hidden\",        className      )}      {...props}    />  )}function SidebarMenuSubItem({  className,  ...props}: React.ComponentProps<\"li\">) {  return (    <li      data-slot=\"sidebar-menu-sub-item\"      data-sidebar=\"menu-sub-item\"      className={cn(\"group/menu-sub-item relative\", className)}      {...props}    />  )}function SidebarMenuSubButton({  asChild = false,  size = \"md\",  isActive = false,  className,  ...props}: React.ComponentProps<\"a\"> & {  asChild?: boolean  size?: \"sm\" | \"md\"  isActive?: boolean}) {  const Comp = asChild ? Slot : \"a\"  return (    <Comp      data-slot=\"sidebar-menu-sub-button\"      data-sidebar=\"menu-sub-button\"      data-size={size}      data-active={isActive}      className={cn(        \"text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 outline-hidden focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0\",        \"data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground\",        size === \"sm\" && \"text-xs\",        size === \"md\" && \"text-sm\",        \"group-data-[collapsible=icon]:hidden\",        className      )}      {...props}    />  )}export {  Sidebar,  SidebarContent,  SidebarFooter,  SidebarGroup,  SidebarGroupAction,  SidebarGroupContent,  SidebarGroupLabel,  SidebarHeader,  SidebarInput,  SidebarInset,  SidebarMenu,  SidebarMenuAction,  SidebarMenuBadge,  SidebarMenuButton,  SidebarMenuItem,  SidebarMenuSkeleton,  SidebarMenuSub,  SidebarMenuSubButton,  SidebarMenuSubItem,  SidebarProvider,  SidebarRail,  SidebarSeparator,  SidebarTrigger,  useSidebar,}"
          }
        ],
        "props": {
          "language": "javascript",
          "theme": "github-dark"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 6
    }
  },
  "654ac936-9834-4418-b0df-337ca559481f": {
    "id": "654ac936-9834-4418-b0df-337ca559481f",
    "type": "HeadingThree",
    "value": [
      {
        "id": "158a2b2f-1f3e-4097-b3ac-c73233303b94",
        "type": "heading-three",
        "children": [
          {
            "text": "Update the import paths to match your project setup."
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 7
    }
  },
  "0717c43a-b7a7-410a-aa3d-26344d7f094a": {
    "id": "0717c43a-b7a7-410a-aa3d-26344d7f094a",
    "type": "HeadingThree",
    "value": [
      {
        "id": "61c14afe-1474-4c7c-82d7-6c4046cf7e6a",
        "type": "heading-three",
        "children": [
          {
            "text": "Add the following colors to your CSS file"
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 8
    }
  },
  "404d8d63-cb4f-4734-ac92-763b7d3ef3f8": {
    "id": "404d8d63-cb4f-4734-ac92-763b7d3ef3f8",
    "type": "Paragraph",
    "value": [
      {
        "id": "2aa621f1-32de-4bff-960d-d29e18a535c0",
        "type": "paragraph",
        "children": [
          {
            "text": "We'll go over the colors later in the"
          },
          {
            "text": " "
          },
          {
            "id": "426bdf03-ed71-482c-bcf1-0bdc8ab0b5ee",
            "type": "link",
            "props": {
              "url": "https://ui.shadcn.com/docs/components/sidebar#theming",
              "target": "_self",
              "rel": "noopener noreferrer",
              "title": "theming section",
              "nodeType": "inline"
            },
            "children": [
              {
                "text": "theming section"
              }
            ]
          },
          {
            "text": "."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 9
    }
  },
  "a5d62461-fba8-47a5-a06c-deb6a231e4ca": {
    "id": "a5d62461-fba8-47a5-a06c-deb6a231e4ca",
    "type": "Code",
    "value": [
      {
        "id": "ff4025e8-d73a-4c8d-9e4a-4db144a6250c",
        "type": "code",
        "children": [
          {
            "text": "@layer base {  :root {    --sidebar: oklch(0.985 0 0);    --sidebar-foreground: oklch(0.145 0 0);    --sidebar-primary: oklch(0.205 0 0);    --sidebar-primary-foreground: oklch(0.985 0 0);    --sidebar-accent: oklch(0.97 0 0);    --sidebar-accent-foreground: oklch(0.205 0 0);    --sidebar-border: oklch(0.922 0 0);    --sidebar-ring: oklch(0.708 0 0);  }   .dark {    --sidebar: oklch(0.205 0 0);    --sidebar-foreground: oklch(0.985 0 0);    --sidebar-primary: oklch(0.488 0.243 264.376);    --sidebar-primary-foreground: oklch(0.985 0 0);    --sidebar-accent: oklch(0.269 0 0);    --sidebar-accent-foreground: oklch(0.985 0 0);    --sidebar-border: oklch(1 0 0 / 10%);    --sidebar-ring: oklch(0.439 0 0);  }}"
          }
        ],
        "props": {
          "language": "css",
          "theme": "github-dark"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 10
    }
  },
  "7c0b84bd-6a7b-41f1-84de-5fdaf76ea855": {
    "id": "7c0b84bd-6a7b-41f1-84de-5fdaf76ea855",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "5dace77c-f730-4c92-ac88-b8ae43b82f89",
        "type": "heading-two",
        "children": [
          {
            "text": "Structure"
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 11
    }
  },
  "78024998-654e-4f21-b3e3-1ed207790081": {
    "id": "78024998-654e-4f21-b3e3-1ed207790081",
    "type": "Paragraph",
    "value": [
      {
        "id": "95ffd0c6-96c5-4211-a472-76b5978ce6af",
        "type": "paragraph",
        "children": [
          {
            "text": "A"
          },
          {
            "text": " "
          },
          {
            "text": "Sidebar",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "component is composed of the following parts:"
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 12
    }
  },
  "ac2ddde5-fc70-45af-9abb-81108230fa5d": {
    "id": "ac2ddde5-fc70-45af-9abb-81108230fa5d",
    "type": "BulletedList",
    "value": [
      {
        "id": "a3ad0fe1-e5af-4b20-91c1-42138992f795",
        "type": "bulleted-list",
        "children": [
          {
            "text": "SidebarProvider"
          },
          {
            "text": " "
          },
          {
            "text": "- Handles collapsible state."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 13
    }
  },
  "4d28300e-e75e-4e75-806a-cdaaac5bd87a": {
    "id": "4d28300e-e75e-4e75-806a-cdaaac5bd87a",
    "type": "BulletedList",
    "value": [
      {
        "id": "519708db-1b59-4879-9e6b-bb8cf67e3438",
        "type": "bulleted-list",
        "children": [
          {
            "text": "Sidebar"
          },
          {
            "text": " "
          },
          {
            "text": "- The sidebar container."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 14
    }
  },
  "17b91ba2-8452-4de5-9b39-4775c1f6ea7e": {
    "id": "17b91ba2-8452-4de5-9b39-4775c1f6ea7e",
    "type": "BulletedList",
    "value": [
      {
        "id": "1dad5f14-66ca-41da-a652-517e90cacdb2",
        "type": "bulleted-list",
        "children": [
          {
            "text": "SidebarHeader"
          },
          {
            "text": " "
          },
          {
            "text": "and"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarFooter"
          },
          {
            "text": " "
          },
          {
            "text": "- Sticky at the top and bottom of the sidebar."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 15
    }
  },
  "b4ee2ba0-cf2e-486e-ac9b-e5ca8084acc3": {
    "id": "b4ee2ba0-cf2e-486e-ac9b-e5ca8084acc3",
    "type": "BulletedList",
    "value": [
      {
        "id": "c0523095-5dd9-4024-835a-14a3b63bcebf",
        "type": "bulleted-list",
        "children": [
          {
            "text": "SidebarContent"
          },
          {
            "text": " "
          },
          {
            "text": "- Scrollable content."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 16
    }
  },
  "1d738cb7-cac3-422a-a61f-c45ef0eb9151": {
    "id": "1d738cb7-cac3-422a-a61f-c45ef0eb9151",
    "type": "BulletedList",
    "value": [
      {
        "id": "6f5f9f90-926d-4bcd-8913-aa2fdf233d36",
        "type": "bulleted-list",
        "children": [
          {
            "text": "SidebarGroup"
          },
          {
            "text": " "
          },
          {
            "text": "- Section within the"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarContent"
          },
          {
            "text": "."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 17
    }
  },
  "4f49e858-ab11-45ad-acba-c4df8b8e978d": {
    "id": "4f49e858-ab11-45ad-acba-c4df8b8e978d",
    "type": "BulletedList",
    "value": [
      {
        "id": "5934b81d-e9b0-450d-aaec-597c0fb34714",
        "type": "bulleted-list",
        "children": [
          {
            "text": "SidebarTrigger"
          },
          {
            "text": " "
          },
          {
            "text": "- Trigger for the"
          },
          {
            "text": " "
          },
          {
            "text": "Sidebar"
          },
          {
            "text": "."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 18
    }
  },
  "5dac3adf-588c-4b9d-bb1f-e511d52dd332": {
    "id": "5dac3adf-588c-4b9d-bb1f-e511d52dd332",
    "type": "Image",
    "value": [
      {
        "id": "6de0ad38-6c99-471c-ae6f-4e6cb5b93a6a",
        "type": "image",
        "children": [
          {
            "text": ""
          }
        ],
        "props": {
          "id": "64eb8046-246c-483e-a6f1-10727a7592d6",
          "nodeType": "void",
          "src": "https://ui.shadcn.com/_next/image?url=%2Fimages%2Fsidebar-structure.png&w=1920&q=75",
          "alt": "Sidebar Structure",
          "srcSet": "/_next/image?url=%2Fimages%2Fsidebar-structure.png&w=750&q=75 1x, /_next/image?url=%2Fimages%2Fsidebar-structure.png&w=1920&q=75 2x",
          "fit": "contain",
          "sizes": {
            "width": 650,
            "height": 381
          }
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 19
    }
  },
  "bf98124d-4067-42d9-bd7c-0d06d54adef1": {
    "id": "bf98124d-4067-42d9-bd7c-0d06d54adef1",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "407c505b-856e-480b-a0f6-099ba09de042",
        "type": "heading-two",
        "children": [
          {
            "text": "Usage"
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 20
    }
  },
  "57cd6765-4e28-4883-8e72-975019d98dff": {
    "id": "57cd6765-4e28-4883-8e72-975019d98dff",
    "type": "Code",
    "value": [
      {
        "id": "38461374-ed4d-4959-9677-d1218cdc14d2",
        "type": "code",
        "children": [
          {
            "text": "import { SidebarProvider, SidebarTrigger } from \"@/components/ui/sidebar\"import { AppSidebar } from \"@/components/app-sidebar\" export default function Layout({ children }: { children: React.ReactNode }) {  return (    <SidebarProvider>      <AppSidebar />      <main>        <SidebarTrigger />        {children}      </main>    </SidebarProvider>  )}"
          }
        ],
        "props": {
          "language": "javascript",
          "theme": "github-dark"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 21
    }
  },
  "aaffd78b-9dee-4a60-a678-178fb03885e2": {
    "id": "aaffd78b-9dee-4a60-a678-178fb03885e2",
    "type": "Code",
    "value": [
      {
        "id": "67649837-ae6c-4a31-b743-e48e41aa2c31",
        "type": "code",
        "children": [
          {
            "text": "import {  Sidebar,  SidebarContent,  SidebarFooter,  SidebarGroup,  SidebarHeader,} from \"@/components/ui/sidebar\" export function AppSidebar() {  return (    <Sidebar>      <SidebarHeader />      <SidebarContent>        <SidebarGroup />        <SidebarGroup />      </SidebarContent>      <SidebarFooter />    </Sidebar>  )}"
          }
        ],
        "props": {
          "language": "javascript",
          "theme": "github-dark"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 22
    }
  },
  "2b6e7a9b-3cac-4f90-ac3f-0f8f9d769d54": {
    "id": "2b6e7a9b-3cac-4f90-ac3f-0f8f9d769d54",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "d77f21b2-0a56-445b-ad6c-083fc5a3a233",
        "type": "heading-two",
        "children": [
          {
            "text": "Your First Sidebar"
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 23
    }
  },
  "aa88aa66-75a2-45cf-a250-ecdb0aacfe9f": {
    "id": "aa88aa66-75a2-45cf-a250-ecdb0aacfe9f",
    "type": "Paragraph",
    "value": [
      {
        "id": "9a1503a4-9362-4e04-b966-ab5c2c8ade64",
        "type": "paragraph",
        "children": [
          {
            "text": "Let's start with the most basic sidebar. A collapsible sidebar with a menu."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 24
    }
  },
  "498b9b4c-00f1-4343-81cd-592e45edaf74": {
    "id": "498b9b4c-00f1-4343-81cd-592e45edaf74",
    "type": "HeadingThree",
    "value": [
      {
        "id": "ee09f92c-2897-4fa3-9d57-e1e8e0fa21ab",
        "type": "heading-three",
        "children": [
          {
            "text": "Add a"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarProvider",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "and"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarTrigger",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "at the root of your application."
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 25
    }
  },
  "3adc4cb3-53c1-4f7e-88ec-99b03927ab46": {
    "id": "3adc4cb3-53c1-4f7e-88ec-99b03927ab46",
    "type": "Code",
    "value": [
      {
        "id": "aab5bab4-9123-4603-a5c0-9ecc6637d13f",
        "type": "code",
        "children": [
          {
            "text": "import { SidebarProvider, SidebarTrigger } from \"@/components/ui/sidebar\"import { AppSidebar } from \"@/components/app-sidebar\" export default function Layout({ children }: { children: React.ReactNode }) {  return (    <SidebarProvider>      <AppSidebar />      <main>        <SidebarTrigger />        {children}      </main>    </SidebarProvider>  )}"
          }
        ],
        "props": {
          "language": "javascript",
          "theme": "github-dark"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 26
    }
  },
  "58c902f4-a81f-474b-a05a-55a8532e87a3": {
    "id": "58c902f4-a81f-474b-a05a-55a8532e87a3",
    "type": "HeadingThree",
    "value": [
      {
        "id": "09cf510f-5163-4d6e-b8e5-1c69a0090934",
        "type": "heading-three",
        "children": [
          {
            "text": "Create a new sidebar component at"
          },
          {
            "text": " "
          },
          {
            "text": "components/app-sidebar.tsx",
            "code": true
          },
          {
            "text": "."
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 27
    }
  },
  "72e5a72e-e534-4a70-a430-2cf9fe22bd63": {
    "id": "72e5a72e-e534-4a70-a430-2cf9fe22bd63",
    "type": "Code",
    "value": [
      {
        "id": "7d254348-9ec0-439b-a7df-1e826f06a48a",
        "type": "code",
        "children": [
          {
            "text": "import { Sidebar, SidebarContent } from \"@/components/ui/sidebar\" export function AppSidebar() {  return (    <Sidebar>      <SidebarContent />    </Sidebar>  )}"
          }
        ],
        "props": {
          "language": "javascript",
          "theme": "github-dark"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 28
    }
  },
  "d9dd71c9-bcc4-4101-9a72-e0a6fdb6855c": {
    "id": "d9dd71c9-bcc4-4101-9a72-e0a6fdb6855c",
    "type": "HeadingThree",
    "value": [
      {
        "id": "6769bfe8-ceb1-4c56-91f2-77661a322035",
        "type": "heading-three",
        "children": [
          {
            "text": "Now, let's add a"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarMenu",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "to the sidebar."
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 29
    }
  },
  "b6f92e38-ed3c-41e0-86c0-c76e9184074e": {
    "id": "b6f92e38-ed3c-41e0-86c0-c76e9184074e",
    "type": "Paragraph",
    "value": [
      {
        "id": "d7326352-33b7-425b-be65-1da65e4b9aac",
        "type": "paragraph",
        "children": [
          {
            "text": "We'll use the"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarMenu",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "component in a"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarGroup",
            "code": true
          },
          {
            "text": "."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 30
    }
  },
  "c2e53dba-f51a-4237-b304-2e1fea3ace09": {
    "id": "c2e53dba-f51a-4237-b304-2e1fea3ace09",
    "type": "Code",
    "value": [
      {
        "id": "d7c6ec49-5b17-45cf-adfa-eae487f0723b",
        "type": "code",
        "children": [
          {
            "text": "import { Calendar, Home, Inbox, Search, Settings } from \"lucide-react\" import {  Sidebar,  SidebarContent,  SidebarGroup,  SidebarGroupContent,  SidebarGroupLabel,  SidebarMenu,  SidebarMenuButton,  SidebarMenuItem,} from \"@/components/ui/sidebar\" // Menu items.const items = [  {    title: \"Home\",    url: \"#\",    icon: Home,  },  {    title: \"Inbox\",    url: \"#\",    icon: Inbox,  },  {    title: \"Calendar\",    url: \"#\",    icon: Calendar,  },  {    title: \"Search\",    url: \"#\",    icon: Search,  },  {    title: \"Settings\",    url: \"#\",    icon: Settings,  },] export function AppSidebar() {  return (    <Sidebar>      <SidebarContent>        <SidebarGroup>          <SidebarGroupLabel>Application</SidebarGroupLabel>          <SidebarGroupContent>            <SidebarMenu>              {items.map((item) => (                <SidebarMenuItem key={item.title}>                  <SidebarMenuButton asChild>                    <a href={item.url}>                      <item.icon />                      <span>{item.title}</span>                    </a>                  </SidebarMenuButton>                </SidebarMenuItem>              ))}            </SidebarMenu>          </SidebarGroupContent>        </SidebarGroup>      </SidebarContent>    </Sidebar>  )}"
          }
        ],
        "props": {
          "language": "javascript",
          "theme": "github-dark"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 31
    }
  },
  "19a33091-0263-4a0d-88f3-874ac08da35c": {
    "id": "19a33091-0263-4a0d-88f3-874ac08da35c",
    "type": "HeadingThree",
    "value": [
      {
        "id": "5ff17de7-9454-4a80-9984-feda41b11460",
        "type": "heading-three",
        "children": [
          {
            "text": "You've created your first sidebar."
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 32
    }
  },
  "b5d4e96a-1325-40ff-90fb-024ba84c970c": {
    "id": "b5d4e96a-1325-40ff-90fb-024ba84c970c",
    "type": "Paragraph",
    "value": [
      {
        "id": "42a265a7-58eb-47fb-b48c-3af8ed7e9625",
        "type": "paragraph",
        "children": [
          {
            "text": "You should see something like this:"
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 33
    }
  },
  "6aa067ae-771b-41fd-b39a-d5eb613d6b36": {
    "id": "6aa067ae-771b-41fd-b39a-d5eb613d6b36",
    "type": "Paragraph",
    "value": [
      {
        "id": "737a21db-be11-4b77-9294-13e972ef9490",
        "type": "paragraph",
        "children": [
          {
            "text": "Your first sidebar."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 34
    }
  },
  "043c24bc-7251-4642-b4a3-e73b15a70a73": {
    "id": "043c24bc-7251-4642-b4a3-e73b15a70a73",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "2aca6227-6c63-4587-a2d8-6a484c1983aa",
        "type": "heading-two",
        "children": [
          {
            "text": "Components"
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 35
    }
  },
  "3f62d8b3-305f-4e9d-b376-65e421c1bde7": {
    "id": "3f62d8b3-305f-4e9d-b376-65e421c1bde7",
    "type": "Paragraph",
    "value": [
      {
        "id": "088acebd-fe22-496f-af77-6559fb3ab713",
        "type": "paragraph",
        "children": [
          {
            "text": "The components in"
          },
          {
            "text": " "
          },
          {
            "text": "sidebar.tsx",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "are built to be composable i.e you build your sidebar by putting the provided components together. They also compose well with other shadcn/ui components such as"
          },
          {
            "text": " "
          },
          {
            "text": "DropdownMenu",
            "code": true
          },
          {
            "text": ","
          },
          {
            "text": " "
          },
          {
            "text": "Collapsible",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "or"
          },
          {
            "text": " "
          },
          {
            "text": "Dialog",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "etc."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 36
    }
  },
  "b3d6dd38-42e1-4f5b-9cc6-24cb86d5a9a2": {
    "id": "b3d6dd38-42e1-4f5b-9cc6-24cb86d5a9a2",
    "type": "Paragraph",
    "value": [
      {
        "id": "309c113f-3960-4218-8254-772ad1de248b",
        "type": "paragraph",
        "children": [
          {
            "text": "If you need to change the code in",
            "bold": true
          },
          {
            "text": " ",
            "bold": true
          },
          {
            "text": "sidebar.tsx",
            "code": true,
            "bold": true
          },
          {
            "text": ", you are encouraged to do so. The code is yours. Use",
            "bold": true
          },
          {
            "text": " ",
            "bold": true
          },
          {
            "text": "sidebar.tsx",
            "code": true,
            "bold": true
          },
          {
            "text": " ",
            "bold": true
          },
          {
            "text": "as a starting point and build your own.",
            "bold": true
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 37
    }
  },
  "5e11856a-58a9-4b32-932b-7420dc5c71f8": {
    "id": "5e11856a-58a9-4b32-932b-7420dc5c71f8",
    "type": "Paragraph",
    "value": [
      {
        "id": "9f2b98af-634a-4455-8e74-0b16dc108b78",
        "type": "paragraph",
        "children": [
          {
            "text": "In the next sections, we'll go over each component and how to use them."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 38
    }
  },
  "2e506fc7-cbc8-4ada-8777-24c00b52b0eb": {
    "id": "2e506fc7-cbc8-4ada-8777-24c00b52b0eb",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "be1bc37d-2032-4c5e-9585-2dd4819a13af",
        "type": "heading-two",
        "children": [
          {
            "text": "SidebarProvider"
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 39
    }
  },
  "c576e4fa-dab2-48a6-9782-3c1118006768": {
    "id": "c576e4fa-dab2-48a6-9782-3c1118006768",
    "type": "Paragraph",
    "value": [
      {
        "id": "125e9d29-ada3-4220-b5d5-fda9678a07cf",
        "type": "paragraph",
        "children": [
          {
            "text": "The"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarProvider",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "component is used to provide the sidebar context to the"
          },
          {
            "text": " "
          },
          {
            "text": "Sidebar",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "component. You should always wrap your application in a"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarProvider",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "component."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 40
    }
  },
  "aa85dd1b-32f7-4fc0-8bfa-2901784c68c5": {
    "id": "aa85dd1b-32f7-4fc0-8bfa-2901784c68c5",
    "type": "HeadingThree",
    "value": [
      {
        "id": "d0fa0f76-b919-4c4d-a073-d5db710493ac",
        "type": "heading-three",
        "children": [
          {
            "text": "Props"
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 41
    }
  },
  "c51b80b9-173a-4581-8e9d-2b21a7681a26": {
    "id": "c51b80b9-173a-4581-8e9d-2b21a7681a26",
    "type": "Table",
    "value": [
      {
        "id": "f5d9cf55-cc97-473e-b4f6-2d3bc75a96fa",
        "type": "table",
        "children": [
          {
            "id": "e427c616-f699-4489-ad07-9d7ade4d575e",
            "type": "table-row",
            "children": [
              {
                "id": "48364e81-ea94-4fce-b31d-4b61fbb1de36",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Name"
                  }
                ],
                "props": {
                  "asHeader": true,
                  "width": 200
                }
              },
              {
                "id": "992177ff-d952-446a-beb0-25611bef4373",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Type"
                  }
                ],
                "props": {
                  "asHeader": true,
                  "width": 200
                }
              },
              {
                "id": "24beb391-fb64-440f-bfa1-8d7fb96ef94c",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Description"
                  }
                ],
                "props": {
                  "asHeader": true,
                  "width": 200
                }
              }
            ]
          },
          {
            "id": "198d9989-1279-482a-8e19-1f6c742b58fd",
            "type": "table-row",
            "children": [
              {
                "id": "0418b54c-d434-439d-9713-8cf9085d8461",
                "type": "table-data-cell",
                "children": [
                  {
                    "code": true,
                    "text": "defaultOpen"
                  }
                ],
                "props": {
                  "asHeader": false,
                  "width": 200
                }
              },
              {
                "id": "6d7a50e2-3a41-4818-9f90-29fc66283e69",
                "type": "table-data-cell",
                "children": [
                  {
                    "code": true,
                    "text": "boolean"
                  }
                ],
                "props": {
                  "asHeader": false,
                  "width": 200
                }
              },
              {
                "id": "f39fa386-f747-42c3-a477-d58846ee4b04",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Default open state of the sidebar."
                  }
                ],
                "props": {
                  "asHeader": false,
                  "width": 200
                }
              }
            ]
          },
          {
            "id": "369f855c-593a-4761-8b25-63db43a77ca7",
            "type": "table-row",
            "children": [
              {
                "id": "b0a6d4ec-546e-4067-a27b-a471f0de1ec4",
                "type": "table-data-cell",
                "children": [
                  {
                    "code": true,
                    "text": "open"
                  }
                ],
                "props": {
                  "asHeader": false,
                  "width": 200
                }
              },
              {
                "id": "f7d78a57-aff7-4298-b3c8-8d3b2bfbb467",
                "type": "table-data-cell",
                "children": [
                  {
                    "code": true,
                    "text": "boolean"
                  }
                ],
                "props": {
                  "asHeader": false,
                  "width": 200
                }
              },
              {
                "id": "6c208016-a036-4df5-a62c-18d0c3266fad",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Open state of the sidebar (controlled)."
                  }
                ],
                "props": {
                  "asHeader": false,
                  "width": 200
                }
              }
            ]
          },
          {
            "id": "00c016c3-3cbf-4a30-9c36-41e55e6be5b1",
            "type": "table-row",
            "children": [
              {
                "id": "44f9a6de-2727-4a59-8ea9-c659be9910c9",
                "type": "table-data-cell",
                "children": [
                  {
                    "code": true,
                    "text": "onOpenChange"
                  }
                ],
                "props": {
                  "asHeader": false,
                  "width": 200
                }
              },
              {
                "id": "c13f05a2-7959-481e-85c1-234c803c7b1e",
                "type": "table-data-cell",
                "children": [
                  {
                    "code": true,
                    "text": "(open: boolean) => void"
                  }
                ],
                "props": {
                  "asHeader": false,
                  "width": 200
                }
              },
              {
                "id": "74c7782d-ca59-49a4-926b-546a5c882db3",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Sets open state of the sidebar (controlled)."
                  }
                ],
                "props": {
                  "asHeader": false,
                  "width": 200
                }
              }
            ]
          }
        ],
        "props": {
          "headerRow": true,
          "headerColumn": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 42
    }
  },
  "76687877-d522-475c-9ff6-0ee6fe183f44": {
    "id": "76687877-d522-475c-9ff6-0ee6fe183f44",
    "type": "HeadingThree",
    "value": [
      {
        "id": "e78dac1d-b7f6-4f92-a6e4-2022ff2ffa7c",
        "type": "heading-three",
        "children": [
          {
            "text": "Width"
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 43
    }
  },
  "cda23baf-c024-437b-97f9-8cf3b7edfc50": {
    "id": "cda23baf-c024-437b-97f9-8cf3b7edfc50",
    "type": "Paragraph",
    "value": [
      {
        "id": "b3f90e3d-51bd-4af4-83f4-8c6945a13e42",
        "type": "paragraph",
        "children": [
          {
            "text": "If you have a single sidebar in your application, you can use the"
          },
          {
            "text": " "
          },
          {
            "text": "SIDEBAR_WIDTH",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "and"
          },
          {
            "text": " "
          },
          {
            "text": "SIDEBAR_WIDTH_MOBILE",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "variables in"
          },
          {
            "text": " "
          },
          {
            "text": "sidebar.tsx",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "to set the width of the sidebar."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 44
    }
  },
  "114cf44c-8ae0-48d1-a6cb-0682c98e14ed": {
    "id": "114cf44c-8ae0-48d1-a6cb-0682c98e14ed",
    "type": "Code",
    "value": [
      {
        "id": "0f4b8606-ff28-425e-82b9-a3f5a9de83a1",
        "type": "code",
        "children": [
          {
            "text": "const SIDEBAR_WIDTH = \"16rem\"const SIDEBAR_WIDTH_MOBILE = \"18rem\""
          }
        ],
        "props": {
          "language": "javascript",
          "theme": "github-dark"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 45
    }
  },
  "3238c3cc-82ca-49ed-b525-c05c5678eed9": {
    "id": "3238c3cc-82ca-49ed-b525-c05c5678eed9",
    "type": "Paragraph",
    "value": [
      {
        "id": "85b2dfb8-6a93-4bfc-8d3c-5932eaed90cb",
        "type": "paragraph",
        "children": [
          {
            "text": "For multiple sidebars in your application, you can use the"
          },
          {
            "text": " "
          },
          {
            "text": "style",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "prop to set the width of the sidebar."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 46
    }
  },
  "a41b9d9b-a5a8-46fc-907c-86de6d8bde9a": {
    "id": "a41b9d9b-a5a8-46fc-907c-86de6d8bde9a",
    "type": "Paragraph",
    "value": [
      {
        "id": "8bdd5ecd-252b-4266-90b7-15d0111e4e1f",
        "type": "paragraph",
        "children": [
          {
            "text": "To set the width of the sidebar, you can use the"
          },
          {
            "text": " "
          },
          {
            "text": "--sidebar-width",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "and"
          },
          {
            "text": " "
          },
          {
            "text": "--sidebar-width-mobile",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "CSS variables in the"
          },
          {
            "text": " "
          },
          {
            "text": "style",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "prop."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 47
    }
  },
  "7e77b4ae-0a2d-4196-8386-861ec026af3d": {
    "id": "7e77b4ae-0a2d-4196-8386-861ec026af3d",
    "type": "Code",
    "value": [
      {
        "id": "f4c62969-af34-40f0-8874-80df632faeba",
        "type": "code",
        "children": [
          {
            "text": "<SidebarProvider  style={{    \"--sidebar-width\": \"20rem\",    \"--sidebar-width-mobile\": \"20rem\",  }}>  <Sidebar /></SidebarProvider>"
          }
        ],
        "props": {
          "language": "javascript",
          "theme": "github-dark"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 48
    }
  },
  "fb31d354-c6c9-4835-a3be-4c9871e4b167": {
    "id": "fb31d354-c6c9-4835-a3be-4c9871e4b167",
    "type": "Paragraph",
    "value": [
      {
        "id": "cf44f035-6145-4de0-917e-0c659fadfb5e",
        "type": "paragraph",
        "children": [
          {
            "text": "This will handle the width of the sidebar but also the layout spacing."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 49
    }
  },
  "f246cac4-e777-4bac-a4d4-195454772865": {
    "id": "f246cac4-e777-4bac-a4d4-195454772865",
    "type": "HeadingThree",
    "value": [
      {
        "id": "f9d5a99f-a997-47e4-be60-36ded9d4158a",
        "type": "heading-three",
        "children": [
          {
            "text": "Keyboard Shortcut"
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 50
    }
  },
  "7ef7ea14-f7d5-4fdd-a2f2-84edad2a3933": {
    "id": "7ef7ea14-f7d5-4fdd-a2f2-84edad2a3933",
    "type": "Paragraph",
    "value": [
      {
        "id": "a4741bab-059b-4902-ab2d-ff044f668df0",
        "type": "paragraph",
        "children": [
          {
            "text": "The"
          },
          {
            "text": " "
          },
          {
            "text": "SIDEBAR_KEYBOARD_SHORTCUT",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "variable is used to set the keyboard shortcut used to open and close the sidebar."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 51
    }
  },
  "01bde4ad-7baa-4cd6-a5f4-17637c5f34f2": {
    "id": "01bde4ad-7baa-4cd6-a5f4-17637c5f34f2",
    "type": "Paragraph",
    "value": [
      {
        "id": "db005e2d-b76a-4104-afd0-c09867ae28df",
        "type": "paragraph",
        "children": [
          {
            "text": "To trigger the sidebar, you use the"
          },
          {
            "text": " "
          },
          {
            "text": "cmd+b",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "keyboard shortcut on Mac and"
          },
          {
            "text": " "
          },
          {
            "text": "ctrl+b",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "on Windows."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 52
    }
  },
  "27bddc30-f02b-408e-b9c9-53a5286d95dc": {
    "id": "27bddc30-f02b-408e-b9c9-53a5286d95dc",
    "type": "Paragraph",
    "value": [
      {
        "id": "6fe95324-2284-4cb9-99e2-5740cc9a8ae7",
        "type": "paragraph",
        "children": [
          {
            "text": "You can change the keyboard shortcut by updating the"
          },
          {
            "text": " "
          },
          {
            "text": "SIDEBAR_KEYBOARD_SHORTCUT",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "variable."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 53
    }
  },
  "3e04b485-03a1-4456-a53a-82227e8e8b81": {
    "id": "3e04b485-03a1-4456-a53a-82227e8e8b81",
    "type": "Code",
    "value": [
      {
        "id": "ae057205-41ff-4ddc-b6f2-6b68db89e306",
        "type": "code",
        "children": [
          {
            "text": "const SIDEBAR_KEYBOARD_SHORTCUT = \"b\""
          }
        ],
        "props": {
          "language": "javascript",
          "theme": "github-dark"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 54
    }
  },
  "09fe57e0-b92d-410b-8108-5826f1a482a4": {
    "id": "09fe57e0-b92d-410b-8108-5826f1a482a4",
    "type": "HeadingThree",
    "value": [
      {
        "id": "b1fd4fe2-dddc-4b6d-8576-ff5b4af601df",
        "type": "heading-three",
        "children": [
          {
            "text": "Persisted State"
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 55
    }
  },
  "bfa082bc-218e-465a-ad91-96f9fe47d65a": {
    "id": "bfa082bc-218e-465a-ad91-96f9fe47d65a",
    "type": "Paragraph",
    "value": [
      {
        "id": "c0fa14bf-bc56-42b2-be11-924bb0e6731d",
        "type": "paragraph",
        "children": [
          {
            "text": "The"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarProvider",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "supports persisting the sidebar state across page reloads and server-side rendering. It uses cookies to store the current state of the sidebar. When the sidebar state changes, a default cookie named"
          },
          {
            "text": " "
          },
          {
            "text": "sidebar_state",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "is set with the current open/closed state. This cookie is then read on subsequent page loads to restore the sidebar state."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 56
    }
  },
  "9b424e90-d4e1-4489-8b0d-c45cbc3c9ef8": {
    "id": "9b424e90-d4e1-4489-8b0d-c45cbc3c9ef8",
    "type": "Paragraph",
    "value": [
      {
        "id": "93fab20b-ad48-4048-9ebc-a9cb6d6940e8",
        "type": "paragraph",
        "children": [
          {
            "text": "To persist sidebar state in Next.js, set up your"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarProvider",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "in"
          },
          {
            "text": " "
          },
          {
            "text": "app/layout.tsx",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "like this:"
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 57
    }
  },
  "47e4c8d6-5bca-4012-91fa-eb6e03a9ef28": {
    "id": "47e4c8d6-5bca-4012-91fa-eb6e03a9ef28",
    "type": "Code",
    "value": [
      {
        "id": "010d8971-87e0-4768-a35e-53ba9c0cead6",
        "type": "code",
        "children": [
          {
            "text": "import { cookies } from \"next/headers\" import { SidebarProvider, SidebarTrigger } from \"@/components/ui/sidebar\"import { AppSidebar } from \"@/components/app-sidebar\" export async function Layout({ children }: { children: React.ReactNode }) {  const cookieStore = await cookies()  const defaultOpen = cookieStore.get(\"sidebar_state\")?.value === \"true\"   return (    <SidebarProvider defaultOpen={defaultOpen}>      <AppSidebar />      <main>        <SidebarTrigger />        {children}      </main>    </SidebarProvider>  )}"
          }
        ],
        "props": {
          "language": "javascript",
          "theme": "github-dark"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 58
    }
  },
  "057b5987-fd36-49f5-924b-738092a1c6f6": {
    "id": "057b5987-fd36-49f5-924b-738092a1c6f6",
    "type": "Paragraph",
    "value": [
      {
        "id": "025075d3-fa69-40ce-b7ca-a81ee231ba35",
        "type": "paragraph",
        "children": [
          {
            "text": "You can change the name of the cookie by updating the"
          },
          {
            "text": " "
          },
          {
            "text": "SIDEBAR_COOKIE_NAME",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "variable in"
          },
          {
            "text": " "
          },
          {
            "text": "sidebar.tsx",
            "code": true
          },
          {
            "text": "."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 59
    }
  },
  "490760ae-3569-4fab-a6d7-8cea731ab907": {
    "id": "490760ae-3569-4fab-a6d7-8cea731ab907",
    "type": "Code",
    "value": [
      {
        "id": "f3506a4e-621c-4bac-9c41-5e126b04a41a",
        "type": "code",
        "children": [
          {
            "text": "const SIDEBAR_COOKIE_NAME = \"sidebar_state\""
          }
        ],
        "props": {
          "language": "javascript",
          "theme": "github-dark"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 60
    }
  },
  "b337a14a-e77b-4584-a684-a8d22e98dc1a": {
    "id": "b337a14a-e77b-4584-a684-a8d22e98dc1a",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "65576677-3f1b-4eaa-90e8-28121863bb87",
        "type": "heading-two",
        "children": [
          {
            "text": "Sidebar"
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 61
    }
  },
  "facc2718-25ab-465f-9a49-81effba44840": {
    "id": "facc2718-25ab-465f-9a49-81effba44840",
    "type": "Paragraph",
    "value": [
      {
        "id": "790c1837-6532-4e1d-ba5a-02ff46331ee4",
        "type": "paragraph",
        "children": [
          {
            "text": "The main"
          },
          {
            "text": " "
          },
          {
            "text": "Sidebar",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "component used to render a collapsible sidebar."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 62
    }
  },
  "807bb6ad-6418-4082-aae4-5f7007198f33": {
    "id": "807bb6ad-6418-4082-aae4-5f7007198f33",
    "type": "Code",
    "value": [
      {
        "id": "abc318a1-c22b-405f-a59d-51fc00ffb8d9",
        "type": "code",
        "children": [
          {
            "text": "import { Sidebar } from \"@/components/ui/sidebar\" export function AppSidebar() {  return <Sidebar />}"
          }
        ],
        "props": {
          "language": "javascript",
          "theme": "github-dark"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 63
    }
  },
  "fed8f0e6-29ef-4289-844e-c0a9aadecf5d": {
    "id": "fed8f0e6-29ef-4289-844e-c0a9aadecf5d",
    "type": "HeadingThree",
    "value": [
      {
        "id": "589e6bbe-f3be-41c3-919e-e0ae804d9f1d",
        "type": "heading-three",
        "children": [
          {
            "text": "Props"
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 64
    }
  },
  "f5904192-a1c1-4d76-8b82-1fc42a62a8c2": {
    "id": "f5904192-a1c1-4d76-8b82-1fc42a62a8c2",
    "type": "Table",
    "value": [
      {
        "id": "4943f7ad-3a39-4012-b3f8-b89a7af6d3a6",
        "type": "table",
        "children": [
          {
            "id": "a27dcb7e-7d9b-46ed-8d1e-79e7ee9e4860",
            "type": "table-row",
            "children": [
              {
                "id": "9cacc05b-4516-44f9-ac85-b2ec789211ff",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Property"
                  }
                ],
                "props": {
                  "asHeader": true,
                  "width": 200
                }
              },
              {
                "id": "78ea81b0-683d-4c2d-8fee-855a22f7cc8a",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Type"
                  }
                ],
                "props": {
                  "asHeader": true,
                  "width": 200
                }
              },
              {
                "id": "fc6c7c01-ef45-4138-9e8d-a72c6e0a3571",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Description"
                  }
                ],
                "props": {
                  "asHeader": true,
                  "width": 200
                }
              }
            ]
          },
          {
            "id": "d1df5f9c-066b-40f9-b694-718a406d0800",
            "type": "table-row",
            "children": [
              {
                "id": "d6756fd3-1f0f-460b-96f3-055a67c625de",
                "type": "table-data-cell",
                "children": [
                  {
                    "code": true,
                    "text": "side"
                  }
                ],
                "props": {
                  "asHeader": false,
                  "width": 200
                }
              },
              {
                "id": "ec53caca-8c9a-4928-a92d-aefd7ab4fa4a",
                "type": "table-data-cell",
                "children": [
                  {
                    "code": true,
                    "text": "left"
                  },
                  {
                    "text": " "
                  },
                  {
                    "text": "or"
                  },
                  {
                    "text": " "
                  },
                  {
                    "code": true,
                    "text": "right"
                  }
                ],
                "props": {
                  "asHeader": false,
                  "width": 200
                }
              },
              {
                "id": "dd21d059-45fc-485a-a718-5e8ab0d8c645",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "The side of the sidebar."
                  }
                ],
                "props": {
                  "asHeader": false,
                  "width": 200
                }
              }
            ]
          },
          {
            "id": "72cb5961-c303-4934-abe1-2abd49b362d9",
            "type": "table-row",
            "children": [
              {
                "id": "ff09b92f-f5ab-427a-b4e0-d3e1bd5c80fc",
                "type": "table-data-cell",
                "children": [
                  {
                    "code": true,
                    "text": "variant"
                  }
                ],
                "props": {
                  "asHeader": false,
                  "width": 200
                }
              },
              {
                "id": "9144178f-3531-4c21-9395-09bed8a49232",
                "type": "table-data-cell",
                "children": [
                  {
                    "code": true,
                    "text": "sidebar"
                  },
                  {
                    "text": ","
                  },
                  {
                    "text": " "
                  },
                  {
                    "code": true,
                    "text": "floating"
                  },
                  {
                    "text": ", or"
                  },
                  {
                    "text": " "
                  },
                  {
                    "code": true,
                    "text": "inset"
                  }
                ],
                "props": {
                  "asHeader": false,
                  "width": 200
                }
              },
              {
                "id": "4ce02bd2-133b-401e-8d96-943b6f426ffa",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "The variant of the sidebar."
                  }
                ],
                "props": {
                  "asHeader": false,
                  "width": 200
                }
              }
            ]
          },
          {
            "id": "698e9ccd-db97-4b1c-a950-adc3332ed6e1",
            "type": "table-row",
            "children": [
              {
                "id": "c973231f-4e50-4187-8511-70d6974895ab",
                "type": "table-data-cell",
                "children": [
                  {
                    "code": true,
                    "text": "collapsible"
                  }
                ],
                "props": {
                  "asHeader": false,
                  "width": 200
                }
              },
              {
                "id": "6a52b11b-1c75-49ae-9b04-57cf5a6db524",
                "type": "table-data-cell",
                "children": [
                  {
                    "code": true,
                    "text": "offcanvas"
                  },
                  {
                    "text": ","
                  },
                  {
                    "text": " "
                  },
                  {
                    "code": true,
                    "text": "icon"
                  },
                  {
                    "text": ", or"
                  },
                  {
                    "text": " "
                  },
                  {
                    "code": true,
                    "text": "none"
                  }
                ],
                "props": {
                  "asHeader": false,
                  "width": 200
                }
              },
              {
                "id": "6441a736-406d-48e5-9436-bda4be1a0a9b",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Collapsible state of the sidebar."
                  }
                ],
                "props": {
                  "asHeader": false,
                  "width": 200
                }
              }
            ]
          }
        ],
        "props": {
          "headerRow": true,
          "headerColumn": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 65
    }
  },
  "911a55ab-38fb-4e11-a0a3-8d5550b7d542": {
    "id": "911a55ab-38fb-4e11-a0a3-8d5550b7d542",
    "type": "HeadingThree",
    "value": [
      {
        "id": "7c8c0cfb-1903-49d1-954e-5aa7d7e53573",
        "type": "heading-three",
        "children": [
          {
            "text": "side"
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 66
    }
  },
  "0bf96be5-3086-48d6-99fa-2852ef0309df": {
    "id": "0bf96be5-3086-48d6-99fa-2852ef0309df",
    "type": "Paragraph",
    "value": [
      {
        "id": "5567d8b7-ca9b-456b-abbc-90e60d56406f",
        "type": "paragraph",
        "children": [
          {
            "text": "Use the"
          },
          {
            "text": " "
          },
          {
            "text": "side",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "prop to change the side of the sidebar."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 67
    }
  },
  "ef63f0d2-4001-4361-ae02-18fd322e110b": {
    "id": "ef63f0d2-4001-4361-ae02-18fd322e110b",
    "type": "Paragraph",
    "value": [
      {
        "id": "54edf617-6fd0-4699-b524-92a2dc8d4389",
        "type": "paragraph",
        "children": [
          {
            "text": "Available options are"
          },
          {
            "text": " "
          },
          {
            "text": "left",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "and"
          },
          {
            "text": " "
          },
          {
            "text": "right",
            "code": true
          },
          {
            "text": "."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 68
    }
  },
  "fda3946e-717b-40a6-a715-04082bfbdb89": {
    "id": "fda3946e-717b-40a6-a715-04082bfbdb89",
    "type": "Code",
    "value": [
      {
        "id": "8bea4acf-0049-4b63-b1dc-526a7cc9ef70",
        "type": "code",
        "children": [
          {
            "text": "import { Sidebar } from \"@/components/ui/sidebar\" export function AppSidebar() {  return <Sidebar side=\"left | right\" />}"
          }
        ],
        "props": {
          "language": "javascript",
          "theme": "github-dark"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 69
    }
  },
  "1c2105ba-4d9d-48d0-a6e1-be3bb214d05b": {
    "id": "1c2105ba-4d9d-48d0-a6e1-be3bb214d05b",
    "type": "HeadingThree",
    "value": [
      {
        "id": "7059fb4a-b699-4138-b99b-4ec8c1f5746c",
        "type": "heading-three",
        "children": [
          {
            "text": "variant"
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 70
    }
  },
  "218ab4a1-ce9e-47bc-8211-37f75f0f5191": {
    "id": "218ab4a1-ce9e-47bc-8211-37f75f0f5191",
    "type": "Paragraph",
    "value": [
      {
        "id": "44711176-4c69-4fb8-98ab-e98f8ffd0cce",
        "type": "paragraph",
        "children": [
          {
            "text": "Use the"
          },
          {
            "text": " "
          },
          {
            "text": "variant",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "prop to change the variant of the sidebar."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 71
    }
  },
  "77e5d2a6-4151-488b-94c2-b8ef0e7c98ef": {
    "id": "77e5d2a6-4151-488b-94c2-b8ef0e7c98ef",
    "type": "Paragraph",
    "value": [
      {
        "id": "530aff0e-2621-496b-b859-1ad8a0ba6904",
        "type": "paragraph",
        "children": [
          {
            "text": "Available options are"
          },
          {
            "text": " "
          },
          {
            "text": "sidebar",
            "code": true
          },
          {
            "text": ","
          },
          {
            "text": " "
          },
          {
            "text": "floating",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "and"
          },
          {
            "text": " "
          },
          {
            "text": "inset",
            "code": true
          },
          {
            "text": "."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 72
    }
  },
  "05908ce6-aaf8-4b06-b0ee-0f89f41017b9": {
    "id": "05908ce6-aaf8-4b06-b0ee-0f89f41017b9",
    "type": "Code",
    "value": [
      {
        "id": "258b3cad-e01b-4050-945e-58726e77b65a",
        "type": "code",
        "children": [
          {
            "text": "import { Sidebar } from \"@/components/ui/sidebar\" export function AppSidebar() {  return <Sidebar variant=\"sidebar | floating | inset\" />}"
          }
        ],
        "props": {
          "language": "javascript",
          "theme": "github-dark"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 73
    }
  },
  "9f282cce-2b48-44aa-840c-41d84d08e878": {
    "id": "9f282cce-2b48-44aa-840c-41d84d08e878",
    "type": "Paragraph",
    "value": [
      {
        "id": "36ab21d6-0afe-467e-afff-23896faa7895",
        "type": "paragraph",
        "children": [
          {
            "text": "Note:",
            "bold": true
          },
          {
            "text": " "
          },
          {
            "text": "If you use the"
          },
          {
            "text": " "
          },
          {
            "text": "inset",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "variant, remember to wrap your main content in a"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarInset",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "component."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 74
    }
  },
  "eb26345d-03b3-491f-acbb-5c30b8d3a019": {
    "id": "eb26345d-03b3-491f-acbb-5c30b8d3a019",
    "type": "Code",
    "value": [
      {
        "id": "c4c8a909-a399-4e42-afd6-b11c946b94c9",
        "type": "code",
        "children": [
          {
            "text": "<SidebarProvider>  <Sidebar variant=\"inset\" />  <SidebarInset>    <main>{children}</main>  </SidebarInset></SidebarProvider>"
          }
        ],
        "props": {
          "language": "javascript",
          "theme": "github-dark"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 75
    }
  },
  "fdb2ed46-5b7f-4531-9303-fe87ff9c5a36": {
    "id": "fdb2ed46-5b7f-4531-9303-fe87ff9c5a36",
    "type": "HeadingThree",
    "value": [
      {
        "id": "1e463c33-d583-4f7a-9e01-01a927cd36f9",
        "type": "heading-three",
        "children": [
          {
            "text": "collapsible"
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 76
    }
  },
  "8f700d64-ac30-463f-9008-611f3963cb1f": {
    "id": "8f700d64-ac30-463f-9008-611f3963cb1f",
    "type": "Paragraph",
    "value": [
      {
        "id": "c4c080fe-179e-4caf-84b3-612f7a35b45d",
        "type": "paragraph",
        "children": [
          {
            "text": "Use the"
          },
          {
            "text": " "
          },
          {
            "text": "collapsible",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "prop to make the sidebar collapsible."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 77
    }
  },
  "b0ca52c2-2d77-4ba4-b8ec-4f94ddb75f50": {
    "id": "b0ca52c2-2d77-4ba4-b8ec-4f94ddb75f50",
    "type": "Paragraph",
    "value": [
      {
        "id": "82dcc117-4ad9-454b-862c-ba2ffef9372b",
        "type": "paragraph",
        "children": [
          {
            "text": "Available options are"
          },
          {
            "text": " "
          },
          {
            "text": "offcanvas",
            "code": true
          },
          {
            "text": ","
          },
          {
            "text": " "
          },
          {
            "text": "icon",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "and"
          },
          {
            "text": " "
          },
          {
            "text": "none",
            "code": true
          },
          {
            "text": "."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 78
    }
  },
  "37e846ce-8a6e-4fa0-a9d3-e461dc0ed104": {
    "id": "37e846ce-8a6e-4fa0-a9d3-e461dc0ed104",
    "type": "Code",
    "value": [
      {
        "id": "59ccba28-7c53-4f59-855c-58bed0d033cc",
        "type": "code",
        "children": [
          {
            "text": "import { Sidebar } from \"@/components/ui/sidebar\" export function AppSidebar() {  return <Sidebar collapsible=\"offcanvas | icon | none\" />}"
          }
        ],
        "props": {
          "language": "javascript",
          "theme": "github-dark"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 79
    }
  },
  "ecb246e0-36fa-46af-8a3f-43541ec407ff": {
    "id": "ecb246e0-36fa-46af-8a3f-43541ec407ff",
    "type": "Table",
    "value": [
      {
        "id": "b0c7d721-a6e6-4663-8787-80ccaa732971",
        "type": "table",
        "children": [
          {
            "id": "d4793626-7b7a-49c8-aa38-55e049ac6138",
            "type": "table-row",
            "children": [
              {
                "id": "68560d12-2e9c-4009-9deb-c1af2783a06a",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Prop"
                  }
                ],
                "props": {
                  "asHeader": true,
                  "width": 200
                }
              },
              {
                "id": "31b22639-e1d9-4ecb-9085-38ee94db9fef",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Description"
                  }
                ],
                "props": {
                  "asHeader": true,
                  "width": 200
                }
              }
            ]
          },
          {
            "id": "73e51b69-d0a3-49d8-8a6a-f6fcc9f795c0",
            "type": "table-row",
            "children": [
              {
                "id": "2c234c0d-1a6a-47c2-a9c3-65e5d2b9a02c",
                "type": "table-data-cell",
                "children": [
                  {
                    "code": true,
                    "text": "offcanvas"
                  }
                ],
                "props": {
                  "asHeader": false,
                  "width": 200
                }
              },
              {
                "id": "be9353df-2d8d-4843-a943-ec5cdbb29c78",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "A collapsible sidebar that slides in from the left or right."
                  }
                ],
                "props": {
                  "asHeader": false,
                  "width": 200
                }
              }
            ]
          },
          {
            "id": "0cfe2fe5-a8ec-4339-827a-90643c132d84",
            "type": "table-row",
            "children": [
              {
                "id": "76671b9e-88a0-4b22-a0e1-cec26bf7e7c6",
                "type": "table-data-cell",
                "children": [
                  {
                    "code": true,
                    "text": "icon"
                  }
                ],
                "props": {
                  "asHeader": false,
                  "width": 200
                }
              },
              {
                "id": "8ca3a279-5349-43e6-baaa-b485d2c727b4",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "A sidebar that collapses to icons."
                  }
                ],
                "props": {
                  "asHeader": false,
                  "width": 200
                }
              }
            ]
          },
          {
            "id": "8fadeb3d-b2a0-4521-867d-e426029c9bd4",
            "type": "table-row",
            "children": [
              {
                "id": "8106399b-cb7f-4398-b7de-7d827d1bd924",
                "type": "table-data-cell",
                "children": [
                  {
                    "code": true,
                    "text": "none"
                  }
                ],
                "props": {
                  "asHeader": false,
                  "width": 200
                }
              },
              {
                "id": "50e1735e-6264-481f-a729-7de086bd154b",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "A non-collapsible sidebar."
                  }
                ],
                "props": {
                  "asHeader": false,
                  "width": 200
                }
              }
            ]
          }
        ],
        "props": {
          "headerRow": true,
          "headerColumn": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 80
    }
  },
  "0103e77f-a174-4f75-ac4e-5b4b321b9766": {
    "id": "0103e77f-a174-4f75-ac4e-5b4b321b9766",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "7993f444-1927-4d5e-a2ad-b3297d88db8a",
        "type": "heading-two",
        "children": [
          {
            "text": "useSidebar"
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 81
    }
  },
  "6fd4d9fc-1c6e-47ab-87f7-1bd49da5af91": {
    "id": "6fd4d9fc-1c6e-47ab-87f7-1bd49da5af91",
    "type": "Paragraph",
    "value": [
      {
        "id": "29cdde4b-dd8f-4300-be83-da20cf703049",
        "type": "paragraph",
        "children": [
          {
            "text": "The"
          },
          {
            "text": " "
          },
          {
            "text": "useSidebar",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "hook is used to control the sidebar."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 82
    }
  },
  "80636293-bfe5-4910-b39d-7e01082c8a1d": {
    "id": "80636293-bfe5-4910-b39d-7e01082c8a1d",
    "type": "Code",
    "value": [
      {
        "id": "ec40a1b5-87f7-48d5-8caa-5e2b1b3dcac1",
        "type": "code",
        "children": [
          {
            "text": "import { useSidebar } from \"@/components/ui/sidebar\" export function AppSidebar() {  const {    state,    open,    setOpen,    openMobile,    setOpenMobile,    isMobile,    toggleSidebar,  } = useSidebar()}"
          }
        ],
        "props": {
          "language": "javascript",
          "theme": "github-dark"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 83
    }
  },
  "b7ab9ff9-286f-44f8-a001-1509405e036a": {
    "id": "b7ab9ff9-286f-44f8-a001-1509405e036a",
    "type": "Table",
    "value": [
      {
        "id": "77325c55-aed0-48f1-ae19-e4cb15495633",
        "type": "table",
        "children": [
          {
            "id": "217d7d40-69ab-42fe-a6b1-41b17858cc21",
            "type": "table-row",
            "children": [
              {
                "id": "2b96e4b2-8300-498b-abf8-4cbfece2d4f8",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Property"
                  }
                ],
                "props": {
                  "asHeader": true,
                  "width": 200
                }
              },
              {
                "id": "702341fc-ac41-4cee-99bf-1f4b691b93e5",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Type"
                  }
                ],
                "props": {
                  "asHeader": true,
                  "width": 200
                }
              },
              {
                "id": "6168353f-9df2-462b-8ca7-aff96b984c5a",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Description"
                  }
                ],
                "props": {
                  "asHeader": true,
                  "width": 200
                }
              }
            ]
          },
          {
            "id": "86f10796-6edd-4678-8877-8f700440e77c",
            "type": "table-row",
            "children": [
              {
                "id": "bb4ad394-2dc4-428a-bb35-d99703940d77",
                "type": "table-data-cell",
                "children": [
                  {
                    "code": true,
                    "text": "state"
                  }
                ],
                "props": {
                  "asHeader": false,
                  "width": 200
                }
              },
              {
                "id": "07b70a2c-e230-4224-aa5f-91686e11718a",
                "type": "table-data-cell",
                "children": [
                  {
                    "code": true,
                    "text": "expanded"
                  },
                  {
                    "text": " "
                  },
                  {
                    "text": "or"
                  },
                  {
                    "text": " "
                  },
                  {
                    "code": true,
                    "text": "collapsed"
                  }
                ],
                "props": {
                  "asHeader": false,
                  "width": 200
                }
              },
              {
                "id": "ec153494-48e9-44ce-8b9e-dfc6fc1ec62f",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "The current state of the sidebar."
                  }
                ],
                "props": {
                  "asHeader": false,
                  "width": 200
                }
              }
            ]
          },
          {
            "id": "68b5ad0a-6d33-4b09-b4db-5a4bdce87380",
            "type": "table-row",
            "children": [
              {
                "id": "fce89ac6-29de-4b70-bda5-56af87637fca",
                "type": "table-data-cell",
                "children": [
                  {
                    "code": true,
                    "text": "open"
                  }
                ],
                "props": {
                  "asHeader": false,
                  "width": 200
                }
              },
              {
                "id": "667eed96-5020-47c5-909b-fd8e73298bc0",
                "type": "table-data-cell",
                "children": [
                  {
                    "code": true,
                    "text": "boolean"
                  }
                ],
                "props": {
                  "asHeader": false,
                  "width": 200
                }
              },
              {
                "id": "e0ac2ea4-8392-40dd-af6f-fc19fd2f5dd2",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Whether the sidebar is open."
                  }
                ],
                "props": {
                  "asHeader": false,
                  "width": 200
                }
              }
            ]
          },
          {
            "id": "a161cffd-3503-4c78-a1d8-e86f5aae854d",
            "type": "table-row",
            "children": [
              {
                "id": "fc84ff97-782a-45e5-a5f4-8f7dfa0f2ec5",
                "type": "table-data-cell",
                "children": [
                  {
                    "code": true,
                    "text": "setOpen"
                  }
                ],
                "props": {
                  "asHeader": false,
                  "width": 200
                }
              },
              {
                "id": "2611956e-193c-42c0-ae80-1de42be641cb",
                "type": "table-data-cell",
                "children": [
                  {
                    "code": true,
                    "text": "(open: boolean) => void"
                  }
                ],
                "props": {
                  "asHeader": false,
                  "width": 200
                }
              },
              {
                "id": "d14e8f5e-6ec5-4937-bcb8-9d6b9ecb3919",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Sets the open state of the sidebar."
                  }
                ],
                "props": {
                  "asHeader": false,
                  "width": 200
                }
              }
            ]
          },
          {
            "id": "cb0292a5-e490-4a08-a5b6-a7f1123e6825",
            "type": "table-row",
            "children": [
              {
                "id": "53b8a115-d5b1-493a-a644-fa92c1ad0a86",
                "type": "table-data-cell",
                "children": [
                  {
                    "code": true,
                    "text": "openMobile"
                  }
                ],
                "props": {
                  "asHeader": false,
                  "width": 200
                }
              },
              {
                "id": "0eaa4936-8c9f-4888-8955-f13ccbc69ece",
                "type": "table-data-cell",
                "children": [
                  {
                    "code": true,
                    "text": "boolean"
                  }
                ],
                "props": {
                  "asHeader": false,
                  "width": 200
                }
              },
              {
                "id": "d35798a5-c662-468a-bd15-5da6c696b4de",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Whether the sidebar is open on mobile."
                  }
                ],
                "props": {
                  "asHeader": false,
                  "width": 200
                }
              }
            ]
          },
          {
            "id": "06c902de-978f-48de-ad85-fca4b61ff5e7",
            "type": "table-row",
            "children": [
              {
                "id": "41b17e4e-72f8-4457-afd1-2639fcd289ba",
                "type": "table-data-cell",
                "children": [
                  {
                    "code": true,
                    "text": "setOpenMobile"
                  }
                ],
                "props": {
                  "asHeader": false,
                  "width": 200
                }
              },
              {
                "id": "f3e8ce24-421d-4cff-b29a-59e1a8219adb",
                "type": "table-data-cell",
                "children": [
                  {
                    "code": true,
                    "text": "(open: boolean) => void"
                  }
                ],
                "props": {
                  "asHeader": false,
                  "width": 200
                }
              },
              {
                "id": "d4481b4a-bb65-4371-9b90-45aae9244685",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Sets the open state of the sidebar on mobile."
                  }
                ],
                "props": {
                  "asHeader": false,
                  "width": 200
                }
              }
            ]
          },
          {
            "id": "e5b92182-1078-4677-aa69-8d772ee0818d",
            "type": "table-row",
            "children": [
              {
                "id": "dc7c6745-4782-4f36-a30b-84a30b8b3a75",
                "type": "table-data-cell",
                "children": [
                  {
                    "code": true,
                    "text": "isMobile"
                  }
                ],
                "props": {
                  "asHeader": false,
                  "width": 200
                }
              },
              {
                "id": "4fac07a2-2c44-453a-93d1-1a25ebe2729e",
                "type": "table-data-cell",
                "children": [
                  {
                    "code": true,
                    "text": "boolean"
                  }
                ],
                "props": {
                  "asHeader": false,
                  "width": 200
                }
              },
              {
                "id": "69e893d3-086a-4fa5-ac01-7dc1add77571",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Whether the sidebar is on mobile."
                  }
                ],
                "props": {
                  "asHeader": false,
                  "width": 200
                }
              }
            ]
          },
          {
            "id": "a319016f-6e90-4298-afec-fd196ad8c849",
            "type": "table-row",
            "children": [
              {
                "id": "d63ea033-96d1-40f1-9e0d-148cffa08406",
                "type": "table-data-cell",
                "children": [
                  {
                    "code": true,
                    "text": "toggleSidebar"
                  }
                ],
                "props": {
                  "asHeader": false,
                  "width": 200
                }
              },
              {
                "id": "8fa96aa2-4670-468d-951d-fac53b4354ac",
                "type": "table-data-cell",
                "children": [
                  {
                    "code": true,
                    "text": "() => void"
                  }
                ],
                "props": {
                  "asHeader": false,
                  "width": 200
                }
              },
              {
                "id": "e077a81c-eb0d-4bfe-b664-c0c7429b2ebd",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Toggles the sidebar. Desktop and mobile."
                  }
                ],
                "props": {
                  "asHeader": false,
                  "width": 200
                }
              }
            ]
          }
        ],
        "props": {
          "headerRow": true,
          "headerColumn": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 84
    }
  },
  "04394f7a-5e28-44ca-9db2-7a9b4d775523": {
    "id": "04394f7a-5e28-44ca-9db2-7a9b4d775523",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "ae11105b-c5aa-4ed2-a8fa-39364b88e015",
        "type": "heading-two",
        "children": [
          {
            "text": "SidebarHeader"
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 85
    }
  },
  "467366ae-9309-4404-966a-7d2d5fb35622": {
    "id": "467366ae-9309-4404-966a-7d2d5fb35622",
    "type": "Paragraph",
    "value": [
      {
        "id": "cc434f03-7f5d-4e8c-85ff-63957951b0ad",
        "type": "paragraph",
        "children": [
          {
            "text": "Use the"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarHeader",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "component to add a sticky header to the sidebar."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 86
    }
  },
  "f1b52a3b-0f25-444a-b09f-1037ee61a958": {
    "id": "f1b52a3b-0f25-444a-b09f-1037ee61a958",
    "type": "Paragraph",
    "value": [
      {
        "id": "383aaa0e-d600-43d3-8303-20c5a4b68116",
        "type": "paragraph",
        "children": [
          {
            "text": "The following example adds a"
          },
          {
            "text": " "
          },
          {
            "text": "<DropdownMenu>",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "to the"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarHeader",
            "code": true
          },
          {
            "text": "."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 87
    }
  },
  "cb943071-1af3-4cc5-afce-485f64796447": {
    "id": "cb943071-1af3-4cc5-afce-485f64796447",
    "type": "Paragraph",
    "value": [
      {
        "id": "f3f749e2-8ce2-4be9-83c0-814f26b0260e",
        "type": "paragraph",
        "children": [
          {
            "text": "A sidebar header with a dropdown menu."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 88
    }
  },
  "1f35946e-23cc-4fc3-911e-4024632b609a": {
    "id": "1f35946e-23cc-4fc3-911e-4024632b609a",
    "type": "Code",
    "value": [
      {
        "id": "8ddce985-79f3-47a4-9eec-c840b76bb81d",
        "type": "code",
        "children": [
          {
            "text": "<Sidebar>  <SidebarHeader>    <SidebarMenu>      <SidebarMenuItem>        <DropdownMenu>          <DropdownMenuTrigger asChild>            <SidebarMenuButton>              Select Workspace              <ChevronDown className=\"ml-auto\" />            </SidebarMenuButton>          </DropdownMenuTrigger>          <DropdownMenuContent className=\"w-[--radix-popper-anchor-width]\">            <DropdownMenuItem>              <span>Acme Inc</span>            </DropdownMenuItem>            <DropdownMenuItem>              <span>Acme Corp.</span>            </DropdownMenuItem>          </DropdownMenuContent>        </DropdownMenu>      </SidebarMenuItem>    </SidebarMenu>  </SidebarHeader></Sidebar>"
          }
        ],
        "props": {
          "language": "javascript",
          "theme": "github-dark"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 89
    }
  },
  "6fdfcceb-5f3a-4a62-bcbb-370a5bc7902b": {
    "id": "6fdfcceb-5f3a-4a62-bcbb-370a5bc7902b",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "1061e3d3-d083-49f8-9e5b-e29793296a44",
        "type": "heading-two",
        "children": [
          {
            "text": "SidebarFooter"
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 90
    }
  },
  "ccf2c813-d5fa-4505-aba1-bffe46000003": {
    "id": "ccf2c813-d5fa-4505-aba1-bffe46000003",
    "type": "Paragraph",
    "value": [
      {
        "id": "d00012a5-c79b-4fe7-8b02-818d4180583c",
        "type": "paragraph",
        "children": [
          {
            "text": "Use the"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarFooter",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "component to add a sticky footer to the sidebar."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 91
    }
  },
  "e94b8242-9352-4bf6-a7cf-4f742c2fdea6": {
    "id": "e94b8242-9352-4bf6-a7cf-4f742c2fdea6",
    "type": "Paragraph",
    "value": [
      {
        "id": "efe2dde3-f7fc-44e3-ab61-da401945525f",
        "type": "paragraph",
        "children": [
          {
            "text": "The following example adds a"
          },
          {
            "text": " "
          },
          {
            "text": "<DropdownMenu>",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "to the"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarFooter",
            "code": true
          },
          {
            "text": "."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 92
    }
  },
  "5e76fa14-4e62-4d47-84d4-f2acf3751399": {
    "id": "5e76fa14-4e62-4d47-84d4-f2acf3751399",
    "type": "Paragraph",
    "value": [
      {
        "id": "621326a0-b195-4acb-ae3d-49174bc044a9",
        "type": "paragraph",
        "children": [
          {
            "text": "A sidebar footer with a dropdown menu."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 93
    }
  },
  "80415ba3-2a4f-4355-b6ae-1ce2df462160": {
    "id": "80415ba3-2a4f-4355-b6ae-1ce2df462160",
    "type": "Code",
    "value": [
      {
        "id": "bc8cf465-23dc-48ab-9155-bd672dbeb062",
        "type": "code",
        "children": [
          {
            "text": "export function AppSidebar() {  return (    <SidebarProvider>      <Sidebar>        <SidebarHeader />        <SidebarContent />        <SidebarFooter>          <SidebarMenu>            <SidebarMenuItem>              <DropdownMenu>                <DropdownMenuTrigger asChild>                  <SidebarMenuButton>                    <User2 /> Username                    <ChevronUp className=\"ml-auto\" />                  </SidebarMenuButton>                </DropdownMenuTrigger>                <DropdownMenuContent                  side=\"top\"                  className=\"w-[--radix-popper-anchor-width]\"                >                  <DropdownMenuItem>                    <span>Account</span>                  </DropdownMenuItem>                  <DropdownMenuItem>                    <span>Billing</span>                  </DropdownMenuItem>                  <DropdownMenuItem>                    <span>Sign out</span>                  </DropdownMenuItem>                </DropdownMenuContent>              </DropdownMenu>            </SidebarMenuItem>          </SidebarMenu>        </SidebarFooter>      </Sidebar>    </SidebarProvider>  )}"
          }
        ],
        "props": {
          "language": "javascript",
          "theme": "github-dark"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 94
    }
  },
  "78f23f5c-c7ef-4f80-b19c-80a7f7ba7f3b": {
    "id": "78f23f5c-c7ef-4f80-b19c-80a7f7ba7f3b",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "fd157735-68b2-468a-b1ed-5c91fbb2be87",
        "type": "heading-two",
        "children": [
          {
            "text": "SidebarContent"
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 95
    }
  },
  "981fa6b3-040b-474c-a59f-9dbc1192558f": {
    "id": "981fa6b3-040b-474c-a59f-9dbc1192558f",
    "type": "Paragraph",
    "value": [
      {
        "id": "6231a4fb-bfec-4161-8f91-b78c15df277c",
        "type": "paragraph",
        "children": [
          {
            "text": "The"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarContent",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "component is used to wrap the content of the sidebar. This is where you add your"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarGroup",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "components. It is scrollable."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 96
    }
  },
  "ea786b4b-0043-44d2-864b-50c3df0ed00d": {
    "id": "ea786b4b-0043-44d2-864b-50c3df0ed00d",
    "type": "Code",
    "value": [
      {
        "id": "1a4eb787-19af-4c8e-8268-ee6383b21e17",
        "type": "code",
        "children": [
          {
            "text": "import { Sidebar, SidebarContent } from \"@/components/ui/sidebar\" export function AppSidebar() {  return (    <Sidebar>      <SidebarContent>        <SidebarGroup />        <SidebarGroup />      </SidebarContent>    </Sidebar>  )}"
          }
        ],
        "props": {
          "language": "javascript",
          "theme": "github-dark"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 97
    }
  },
  "190b9a6d-e21d-4437-af44-588e0779ae79": {
    "id": "190b9a6d-e21d-4437-af44-588e0779ae79",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "7474ea66-36ff-4052-9336-63472de95bff",
        "type": "heading-two",
        "children": [
          {
            "text": "SidebarGroup"
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 98
    }
  },
  "be638451-61d3-4eac-af00-d53aba922538": {
    "id": "be638451-61d3-4eac-af00-d53aba922538",
    "type": "Paragraph",
    "value": [
      {
        "id": "a31229e2-e99c-426b-87c4-9e4b556ebe90",
        "type": "paragraph",
        "children": [
          {
            "text": "Use the"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarGroup",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "component to create a section within the sidebar."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 99
    }
  },
  "c73fdb29-a14f-4f68-8f04-e327dae35343": {
    "id": "c73fdb29-a14f-4f68-8f04-e327dae35343",
    "type": "Paragraph",
    "value": [
      {
        "id": "1e4b47ad-afd9-4f62-ac96-c8bb9c3916b1",
        "type": "paragraph",
        "children": [
          {
            "text": "A"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarGroup",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "has a"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarGroupLabel",
            "code": true
          },
          {
            "text": ", a"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarGroupContent",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "and an optional"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarGroupAction",
            "code": true
          },
          {
            "text": "."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 100
    }
  },
  "77bcda25-b7d6-46a0-8b73-8e9d2d935907": {
    "id": "77bcda25-b7d6-46a0-8b73-8e9d2d935907",
    "type": "Paragraph",
    "value": [
      {
        "id": "442938e1-068d-42ba-b1c5-45d8e7865017",
        "type": "paragraph",
        "children": [
          {
            "text": "A sidebar group."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 101
    }
  },
  "43dc27b4-3669-4921-a6c9-760ee70c9ac1": {
    "id": "43dc27b4-3669-4921-a6c9-760ee70c9ac1",
    "type": "Code",
    "value": [
      {
        "id": "4adbe999-4b8a-464e-8488-99b5923d18d3",
        "type": "code",
        "children": [
          {
            "text": "import { Sidebar, SidebarContent, SidebarGroup } from \"@/components/ui/sidebar\" export function AppSidebar() {  return (    <Sidebar>      <SidebarContent>        <SidebarGroup>          <SidebarGroupLabel>Application</SidebarGroupLabel>          <SidebarGroupAction>            <Plus /> <span className=\"sr-only\">Add Project</span>          </SidebarGroupAction>          <SidebarGroupContent></SidebarGroupContent>        </SidebarGroup>      </SidebarContent>    </Sidebar>  )}"
          }
        ],
        "props": {
          "language": "javascript",
          "theme": "github-dark"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 102
    }
  },
  "ffccd3f6-f1b0-47b2-b46d-b993cb8b773e": {
    "id": "ffccd3f6-f1b0-47b2-b46d-b993cb8b773e",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "2bd765d4-283d-47bf-9cd4-27238d5f0837",
        "type": "heading-two",
        "children": [
          {
            "text": "Collapsible SidebarGroup"
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 103
    }
  },
  "56cb9efd-fd89-47f4-a461-9f9fff23dc34": {
    "id": "56cb9efd-fd89-47f4-a461-9f9fff23dc34",
    "type": "Paragraph",
    "value": [
      {
        "id": "6c26875d-e9e3-4e0f-81ff-3ffc3d684e56",
        "type": "paragraph",
        "children": [
          {
            "text": "To make a"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarGroup",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "collapsible, wrap it in a"
          },
          {
            "text": " "
          },
          {
            "text": "Collapsible",
            "code": true
          },
          {
            "text": "."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 104
    }
  },
  "35cd853d-2722-4f39-88e2-6532d12602f9": {
    "id": "35cd853d-2722-4f39-88e2-6532d12602f9",
    "type": "Paragraph",
    "value": [
      {
        "id": "63722ac9-8f6c-4ef0-9bcd-c25ed9211394",
        "type": "paragraph",
        "children": [
          {
            "text": "A collapsible sidebar group."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 105
    }
  },
  "4c323ad3-479c-4d94-aabb-3f436104c540": {
    "id": "4c323ad3-479c-4d94-aabb-3f436104c540",
    "type": "Code",
    "value": [
      {
        "id": "15ef8608-aa91-4749-9e1e-d88610d2fc5a",
        "type": "code",
        "children": [
          {
            "text": "export function AppSidebar() {  return (    <Collapsible defaultOpen className=\"group/collapsible\">      <SidebarGroup>        <SidebarGroupLabel asChild>          <CollapsibleTrigger>            Help            <ChevronDown className=\"ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180\" />          </CollapsibleTrigger>        </SidebarGroupLabel>        <CollapsibleContent>          <SidebarGroupContent />        </CollapsibleContent>      </SidebarGroup>    </Collapsible>  )}"
          }
        ],
        "props": {
          "language": "javascript",
          "theme": "github-dark"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 106
    }
  },
  "dac12822-e030-4a2f-aa9f-093669a17758": {
    "id": "dac12822-e030-4a2f-aa9f-093669a17758",
    "type": "Paragraph",
    "value": [
      {
        "id": "3fbe18ea-19a9-4f0c-a9db-9d0f5964e1ab",
        "type": "paragraph",
        "children": [
          {
            "text": "Note:",
            "bold": true
          },
          {
            "text": " "
          },
          {
            "text": "We wrap the"
          },
          {
            "text": " "
          },
          {
            "text": "CollapsibleTrigger",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "in a"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarGroupLabel",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "to render a button."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 107
    }
  },
  "3a95a8f7-6f95-4772-b704-d6907980d8f9": {
    "id": "3a95a8f7-6f95-4772-b704-d6907980d8f9",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "813424dd-d6f5-4711-89b2-a3c290d2803e",
        "type": "heading-two",
        "children": [
          {
            "text": "SidebarGroupAction"
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 108
    }
  },
  "85f222a2-aea7-4efd-a8d4-3c4c23214800": {
    "id": "85f222a2-aea7-4efd-a8d4-3c4c23214800",
    "type": "Paragraph",
    "value": [
      {
        "id": "7bcbcaea-5a54-4653-b221-f1e7ac9056b7",
        "type": "paragraph",
        "children": [
          {
            "text": "Use the"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarGroupAction",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "component to add an action button to the"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarGroup",
            "code": true
          },
          {
            "text": "."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 109
    }
  },
  "bfbbae5f-ef7c-46c7-94b9-8fbee3c2e492": {
    "id": "bfbbae5f-ef7c-46c7-94b9-8fbee3c2e492",
    "type": "Paragraph",
    "value": [
      {
        "id": "dbadf30b-e2a0-43c5-9d3f-682e83d4969d",
        "type": "paragraph",
        "children": [
          {
            "text": "A sidebar group with an action button."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 110
    }
  },
  "1c52529c-5112-4a3d-ab90-89159b5eb9f7": {
    "id": "1c52529c-5112-4a3d-ab90-89159b5eb9f7",
    "type": "Code",
    "value": [
      {
        "id": "d761f9b0-25f5-420c-bb11-05c818e4dbf0",
        "type": "code",
        "children": [
          {
            "text": "export function AppSidebar() {  return (    <SidebarGroup>      <SidebarGroupLabel asChild>Projects</SidebarGroupLabel>      <SidebarGroupAction title=\"Add Project\">        <Plus /> <span className=\"sr-only\">Add Project</span>      </SidebarGroupAction>      <SidebarGroupContent />    </SidebarGroup>  )}"
          }
        ],
        "props": {
          "language": "javascript",
          "theme": "github-dark"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 111
    }
  },
  "81a44ffa-5a6d-4a5f-b653-96f56b304828": {
    "id": "81a44ffa-5a6d-4a5f-b653-96f56b304828",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "ceea0f47-a1a0-4167-8d87-d84f69aa2062",
        "type": "heading-two",
        "children": [
          {
            "text": "SidebarMenu"
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 112
    }
  },
  "7c3d318f-ae39-4464-a560-53c7086070dd": {
    "id": "7c3d318f-ae39-4464-a560-53c7086070dd",
    "type": "Paragraph",
    "value": [
      {
        "id": "ef5b170d-5c5e-4145-af20-c8764d4926be",
        "type": "paragraph",
        "children": [
          {
            "text": "The"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarMenu",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "component is used for building a menu within a"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarGroup",
            "code": true
          },
          {
            "text": "."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 113
    }
  },
  "7b6e8635-de08-4b26-adb7-d7f544faef0d": {
    "id": "7b6e8635-de08-4b26-adb7-d7f544faef0d",
    "type": "Paragraph",
    "value": [
      {
        "id": "014709d3-aa0f-4cba-bee4-7482d345f02d",
        "type": "paragraph",
        "children": [
          {
            "text": "A"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarMenu",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "component is composed of"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarMenuItem",
            "code": true
          },
          {
            "text": ","
          },
          {
            "text": " "
          },
          {
            "text": "SidebarMenuButton",
            "code": true
          },
          {
            "text": ","
          },
          {
            "text": " "
          },
          {
            "text": "<SidebarMenuAction />",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "and"
          },
          {
            "text": " "
          },
          {
            "text": "<SidebarMenuSub />",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "components."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 114
    }
  },
  "4a0c799e-f63f-44b4-98e2-f644c25cb4a6": {
    "id": "4a0c799e-f63f-44b4-98e2-f644c25cb4a6",
    "type": "Image",
    "value": [
      {
        "id": "7593ffc3-bb9d-4a1d-bae6-bf99f0ac5400",
        "type": "image",
        "children": [
          {
            "text": ""
          }
        ],
        "props": {
          "id": "27c94700-c524-40e8-9261-3f635427592d",
          "nodeType": "void",
          "src": "https://ui.shadcn.com/_next/image?url=%2Fimages%2Fsidebar-menu.png&w=1920&q=75",
          "alt": "Sidebar Menu",
          "srcSet": "/_next/image?url=%2Fimages%2Fsidebar-menu.png&w=750&q=75 1x, /_next/image?url=%2Fimages%2Fsidebar-menu.png&w=1920&q=75 2x",
          "fit": "contain",
          "sizes": {
            "width": 650,
            "height": 381
          }
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 115
    }
  },
  "17b2fc4a-e411-4c52-9827-1d5b3d109d82": {
    "id": "17b2fc4a-e411-4c52-9827-1d5b3d109d82",
    "type": "Paragraph",
    "value": [
      {
        "id": "ced0fbce-97d6-4cc3-839e-80f54a521f8c",
        "type": "paragraph",
        "children": [
          {
            "text": "Here's an example of a"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarMenu",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "component rendering a list of projects."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 116
    }
  },
  "168cb569-9bb6-4aca-9eb4-d9d5a42e83c3": {
    "id": "168cb569-9bb6-4aca-9eb4-d9d5a42e83c3",
    "type": "Paragraph",
    "value": [
      {
        "id": "24a32048-59b3-4c06-abc2-f12085a68182",
        "type": "paragraph",
        "children": [
          {
            "text": "A sidebar menu with a list of projects."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 117
    }
  },
  "e7f09c46-bfed-4768-8a3f-ef34a8c14794": {
    "id": "e7f09c46-bfed-4768-8a3f-ef34a8c14794",
    "type": "Code",
    "value": [
      {
        "id": "371bbd00-bc7d-4490-9dfa-008e682eeb36",
        "type": "code",
        "children": [
          {
            "text": "<Sidebar>  <SidebarContent>    <SidebarGroup>      <SidebarGroupLabel>Projects</SidebarGroupLabel>      <SidebarGroupContent>        <SidebarMenu>          {projects.map((project) => (            <SidebarMenuItem key={project.name}>              <SidebarMenuButton asChild>                <a href={project.url}>                  <project.icon />                  <span>{project.name}</span>                </a>              </SidebarMenuButton>            </SidebarMenuItem>          ))}        </SidebarMenu>      </SidebarGroupContent>    </SidebarGroup>  </SidebarContent></Sidebar>"
          }
        ],
        "props": {
          "language": "javascript",
          "theme": "github-dark"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 118
    }
  },
  "c4bb021d-995a-418f-9699-c9a1397bfeec": {
    "id": "c4bb021d-995a-418f-9699-c9a1397bfeec",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "f2dc4e32-eedf-468f-b70f-ab38ffb83fbe",
        "type": "heading-two",
        "children": [
          {
            "text": "SidebarMenuButton"
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 119
    }
  },
  "bb0ee887-976d-4095-b813-448262203877": {
    "id": "bb0ee887-976d-4095-b813-448262203877",
    "type": "Paragraph",
    "value": [
      {
        "id": "ba9919ad-16e4-4967-804f-fe14d1ef023e",
        "type": "paragraph",
        "children": [
          {
            "text": "The"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarMenuButton",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "component is used to render a menu button within a"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarMenuItem",
            "code": true
          },
          {
            "text": "."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 120
    }
  },
  "7d687793-943a-46ac-8dbe-e6da0df3b6eb": {
    "id": "7d687793-943a-46ac-8dbe-e6da0df3b6eb",
    "type": "HeadingThree",
    "value": [
      {
        "id": "b4f541a7-35cb-425f-b1ab-45e3821166d5",
        "type": "heading-three",
        "children": [
          {
            "text": "Link or Anchor"
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 121
    }
  },
  "68eda21b-1e33-4132-82ca-5b842981377b": {
    "id": "68eda21b-1e33-4132-82ca-5b842981377b",
    "type": "Paragraph",
    "value": [
      {
        "id": "eb684564-c295-4336-8943-04c603b2683f",
        "type": "paragraph",
        "children": [
          {
            "text": "By default, the"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarMenuButton",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "renders a button but you can use the"
          },
          {
            "text": " "
          },
          {
            "text": "asChild",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "prop to render a different component such as a"
          },
          {
            "text": " "
          },
          {
            "text": "Link",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "or an"
          },
          {
            "text": " "
          },
          {
            "text": "a",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "tag."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 122
    }
  },
  "1ad25ef7-12dd-4aa2-b926-452f40f8ea88": {
    "id": "1ad25ef7-12dd-4aa2-b926-452f40f8ea88",
    "type": "Code",
    "value": [
      {
        "id": "7accbee8-1768-48c2-b28b-6b12ece9b4b3",
        "type": "code",
        "children": [
          {
            "text": "<SidebarMenuButton asChild>  <a href=\"#\">Home</a></SidebarMenuButton>"
          }
        ],
        "props": {
          "language": "javascript",
          "theme": "github-dark"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 123
    }
  },
  "36892058-02b2-4972-ab21-bec426f4786a": {
    "id": "36892058-02b2-4972-ab21-bec426f4786a",
    "type": "HeadingThree",
    "value": [
      {
        "id": "aa5a2172-bb0d-4be3-b2f0-a97214383053",
        "type": "heading-three",
        "children": [
          {
            "text": "Icon and Label"
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 124
    }
  },
  "23b2886f-5a52-4480-a2b6-ec114346a61b": {
    "id": "23b2886f-5a52-4480-a2b6-ec114346a61b",
    "type": "Paragraph",
    "value": [
      {
        "id": "7e21eb16-5e36-467b-96a4-24d0e6add222",
        "type": "paragraph",
        "children": [
          {
            "text": "You can render an icon and a truncated label inside the button. Remember to wrap the label in a"
          },
          {
            "text": " "
          },
          {
            "text": "<span>",
            "code": true
          },
          {
            "text": "."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 125
    }
  },
  "0b6ac2cf-1202-4701-bd3a-a41be07a1802": {
    "id": "0b6ac2cf-1202-4701-bd3a-a41be07a1802",
    "type": "Code",
    "value": [
      {
        "id": "fba0e9de-3a33-44c2-866a-1bf49ecce080",
        "type": "code",
        "children": [
          {
            "text": "<SidebarMenuButton asChild>  <a href=\"#\">    <Home />    <span>Home</span>  </a></SidebarMenuButton>"
          }
        ],
        "props": {
          "language": "javascript",
          "theme": "github-dark"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 126
    }
  },
  "70689d73-17bb-4c73-a02c-6ac867bbf671": {
    "id": "70689d73-17bb-4c73-a02c-6ac867bbf671",
    "type": "HeadingThree",
    "value": [
      {
        "id": "011546b1-c803-4f7c-84f1-ed1549b3895c",
        "type": "heading-three",
        "children": [
          {
            "text": "isActive"
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 127
    }
  },
  "73c20caa-179a-4021-8c4f-8cf2ee681898": {
    "id": "73c20caa-179a-4021-8c4f-8cf2ee681898",
    "type": "Paragraph",
    "value": [
      {
        "id": "59920bf2-9d2f-4b40-9e01-b73e55819976",
        "type": "paragraph",
        "children": [
          {
            "text": "Use the"
          },
          {
            "text": " "
          },
          {
            "text": "isActive",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "prop to mark a menu item as active."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 128
    }
  },
  "49bf8f2b-2f60-4cdf-ab1c-b269745c324e": {
    "id": "49bf8f2b-2f60-4cdf-ab1c-b269745c324e",
    "type": "Code",
    "value": [
      {
        "id": "857db2bb-4dd5-428b-a66d-53b0e701c560",
        "type": "code",
        "children": [
          {
            "text": "<SidebarMenuButton asChild isActive>  <a href=\"#\">Home</a></SidebarMenuButton>"
          }
        ],
        "props": {
          "language": "javascript",
          "theme": "github-dark"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 129
    }
  },
  "31f7efbb-9d96-4d3e-9d16-5f162c10f29f": {
    "id": "31f7efbb-9d96-4d3e-9d16-5f162c10f29f",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "83a7a529-ea44-4c1d-9442-18bd9672a18e",
        "type": "heading-two",
        "children": [
          {
            "text": "SidebarMenuAction"
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 130
    }
  },
  "321f54ab-38d5-4646-b520-d428492cfca5": {
    "id": "321f54ab-38d5-4646-b520-d428492cfca5",
    "type": "Paragraph",
    "value": [
      {
        "id": "9470e8e9-32c6-4a39-92ca-0916f2834fab",
        "type": "paragraph",
        "children": [
          {
            "text": "The"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarMenuAction",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "component is used to render a menu action within a"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarMenuItem",
            "code": true
          },
          {
            "text": "."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 131
    }
  },
  "bc1bbd34-2cee-479f-9889-fd701a771f24": {
    "id": "bc1bbd34-2cee-479f-9889-fd701a771f24",
    "type": "Paragraph",
    "value": [
      {
        "id": "a52e325e-6706-40d4-892e-af73c65b49c6",
        "type": "paragraph",
        "children": [
          {
            "text": "This button works independently of the"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarMenuButton",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "i.e you can have the"
          },
          {
            "text": " "
          },
          {
            "text": "<SidebarMenuButton />",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "as a clickable link and the"
          },
          {
            "text": " "
          },
          {
            "text": "<SidebarMenuAction />",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "as a button."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 132
    }
  },
  "fd50d39c-22c5-41f4-b64c-bc60b40b1ded": {
    "id": "fd50d39c-22c5-41f4-b64c-bc60b40b1ded",
    "type": "Code",
    "value": [
      {
        "id": "4b37721c-87a6-4334-a44f-3adfce4911e8",
        "type": "code",
        "children": [
          {
            "text": "<SidebarMenuItem>  <SidebarMenuButton asChild>    <a href=\"#\">      <Home />      <span>Home</span>    </a>  </SidebarMenuButton>  <SidebarMenuAction>    <Plus /> <span className=\"sr-only\">Add Project</span>  </SidebarMenuAction></SidebarMenuItem>"
          }
        ],
        "props": {
          "language": "javascript",
          "theme": "github-dark"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 133
    }
  },
  "04131d4f-a456-4b7c-990c-e8f19644cd17": {
    "id": "04131d4f-a456-4b7c-990c-e8f19644cd17",
    "type": "HeadingThree",
    "value": [
      {
        "id": "eef074e3-3665-4e53-acb2-15a028dc6947",
        "type": "heading-three",
        "children": [
          {
            "text": "DropdownMenu"
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 134
    }
  },
  "55418aa0-163c-400d-9d33-4f7f7b3f07ac": {
    "id": "55418aa0-163c-400d-9d33-4f7f7b3f07ac",
    "type": "Paragraph",
    "value": [
      {
        "id": "3d5d73c7-623b-40dc-84bc-7e10ef46287e",
        "type": "paragraph",
        "children": [
          {
            "text": "Here's an example of a"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarMenuAction",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "component rendering a"
          },
          {
            "text": " "
          },
          {
            "text": "DropdownMenu",
            "code": true
          },
          {
            "text": "."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 135
    }
  },
  "51e7e377-ccdd-40ec-9d4f-512c91e87f4e": {
    "id": "51e7e377-ccdd-40ec-9d4f-512c91e87f4e",
    "type": "Paragraph",
    "value": [
      {
        "id": "5e60f0df-c200-4556-a72b-8dc12bdfa217",
        "type": "paragraph",
        "children": [
          {
            "text": "A sidebar menu action with a dropdown menu."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 136
    }
  },
  "a4e4b4c4-7fe6-404b-a864-b8544f7dd9d7": {
    "id": "a4e4b4c4-7fe6-404b-a864-b8544f7dd9d7",
    "type": "Code",
    "value": [
      {
        "id": "3d80c35d-97a3-45c1-9371-0ae22a01ae3b",
        "type": "code",
        "children": [
          {
            "text": "<SidebarMenuItem>  <SidebarMenuButton asChild>    <a href=\"#\">      <Home />      <span>Home</span>    </a>  </SidebarMenuButton>  <DropdownMenu>    <DropdownMenuTrigger asChild>      <SidebarMenuAction>        <MoreHorizontal />      </SidebarMenuAction>    </DropdownMenuTrigger>    <DropdownMenuContent side=\"right\" align=\"start\">      <DropdownMenuItem>        <span>Edit Project</span>      </DropdownMenuItem>      <DropdownMenuItem>        <span>Delete Project</span>      </DropdownMenuItem>    </DropdownMenuContent>  </DropdownMenu></SidebarMenuItem>"
          }
        ],
        "props": {
          "language": "javascript",
          "theme": "github-dark"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 137
    }
  },
  "fd10a590-7343-4014-a663-9eeb270d730b": {
    "id": "fd10a590-7343-4014-a663-9eeb270d730b",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "90e032b2-64a0-4c6d-bd5f-bb0c2f6c45f3",
        "type": "heading-two",
        "children": [
          {
            "text": "SidebarMenuSub"
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 138
    }
  },
  "08c2d4d1-c57e-4b3d-8d16-ef3554d89126": {
    "id": "08c2d4d1-c57e-4b3d-8d16-ef3554d89126",
    "type": "Paragraph",
    "value": [
      {
        "id": "ffe7616d-1edf-4889-8b87-5bb8fd1b239e",
        "type": "paragraph",
        "children": [
          {
            "text": "The"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarMenuSub",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "component is used to render a submenu within a"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarMenu",
            "code": true
          },
          {
            "text": "."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 139
    }
  },
  "2c52d04b-d616-4d01-b5eb-0d57f1e00cfe": {
    "id": "2c52d04b-d616-4d01-b5eb-0d57f1e00cfe",
    "type": "Paragraph",
    "value": [
      {
        "id": "537df3e9-a69d-47a7-81f4-023ce41712a0",
        "type": "paragraph",
        "children": [
          {
            "text": "Use"
          },
          {
            "text": " "
          },
          {
            "text": "<SidebarMenuSubItem />",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "and"
          },
          {
            "text": " "
          },
          {
            "text": "<SidebarMenuSubButton />",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "to render a submenu item."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 140
    }
  },
  "071f1bca-5e0e-49ed-a93d-7470129abf2f": {
    "id": "071f1bca-5e0e-49ed-a93d-7470129abf2f",
    "type": "Paragraph",
    "value": [
      {
        "id": "c649e5a5-cc6c-43c3-a268-def139848ef1",
        "type": "paragraph",
        "children": [
          {
            "text": "A sidebar menu with a submenu."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 141
    }
  },
  "2a29f47d-f65f-4e0e-9e69-dcdc183849f6": {
    "id": "2a29f47d-f65f-4e0e-9e69-dcdc183849f6",
    "type": "Code",
    "value": [
      {
        "id": "1d9e3fec-9d5a-4e63-856b-255679a25e70",
        "type": "code",
        "children": [
          {
            "text": "<SidebarMenuItem>  <SidebarMenuButton />  <SidebarMenuSub>    <SidebarMenuSubItem>      <SidebarMenuSubButton />    </SidebarMenuSubItem>    <SidebarMenuSubItem>      <SidebarMenuSubButton />    </SidebarMenuSubItem>  </SidebarMenuSub></SidebarMenuItem>"
          }
        ],
        "props": {
          "language": "javascript",
          "theme": "github-dark"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 142
    }
  },
  "27bd83b3-0f70-498a-a5ae-3acadefaf513": {
    "id": "27bd83b3-0f70-498a-a5ae-3acadefaf513",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "76de75a0-28cf-487f-a0fe-2204a107e0eb",
        "type": "heading-two",
        "children": [
          {
            "text": "Collapsible SidebarMenu"
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 143
    }
  },
  "6eb5c68e-bf81-4ec8-9ecf-e68523d52300": {
    "id": "6eb5c68e-bf81-4ec8-9ecf-e68523d52300",
    "type": "Paragraph",
    "value": [
      {
        "id": "cfec38c0-d8fb-4ae4-852e-3057e8606376",
        "type": "paragraph",
        "children": [
          {
            "text": "To make a"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarMenu",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "component collapsible, wrap it and the"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarMenuSub",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "components in a"
          },
          {
            "text": " "
          },
          {
            "text": "Collapsible",
            "code": true
          },
          {
            "text": "."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 144
    }
  },
  "14684527-b7a9-4559-b2d3-9b2db440b88b": {
    "id": "14684527-b7a9-4559-b2d3-9b2db440b88b",
    "type": "Paragraph",
    "value": [
      {
        "id": "2fef47e8-7278-437b-a1eb-d1178f8b4a72",
        "type": "paragraph",
        "children": [
          {
            "text": "A collapsible sidebar menu."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 145
    }
  },
  "ec5d0cb6-824a-440b-9744-c1e76af9d58b": {
    "id": "ec5d0cb6-824a-440b-9744-c1e76af9d58b",
    "type": "Code",
    "value": [
      {
        "id": "ca38d0d2-25d0-413a-8607-f003f1b771a2",
        "type": "code",
        "children": [
          {
            "text": "<SidebarMenu>  <Collapsible defaultOpen className=\"group/collapsible\">    <SidebarMenuItem>      <CollapsibleTrigger asChild>        <SidebarMenuButton />      </CollapsibleTrigger>      <CollapsibleContent>        <SidebarMenuSub>          <SidebarMenuSubItem />        </SidebarMenuSub>      </CollapsibleContent>    </SidebarMenuItem>  </Collapsible></SidebarMenu>"
          }
        ],
        "props": {
          "language": "javascript",
          "theme": "github-dark"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 146
    }
  },
  "b86ace74-d831-437e-ac41-2b536f0bee6e": {
    "id": "b86ace74-d831-437e-ac41-2b536f0bee6e",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "53f3a4a4-9772-474c-890d-ae4d7546dbe1",
        "type": "heading-two",
        "children": [
          {
            "text": "SidebarMenuBadge"
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 147
    }
  },
  "f0eebd42-b349-47a3-85a4-5cdd626b6472": {
    "id": "f0eebd42-b349-47a3-85a4-5cdd626b6472",
    "type": "Paragraph",
    "value": [
      {
        "id": "6274a15a-81ce-412d-a326-fdaca8856dc2",
        "type": "paragraph",
        "children": [
          {
            "text": "The"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarMenuBadge",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "component is used to render a badge within a"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarMenuItem",
            "code": true
          },
          {
            "text": "."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 148
    }
  },
  "cc4b6e71-c20d-4c4e-b6ee-ffd28a1efaef": {
    "id": "cc4b6e71-c20d-4c4e-b6ee-ffd28a1efaef",
    "type": "Paragraph",
    "value": [
      {
        "id": "dda7de8d-9426-4524-aa67-487e48a80cea",
        "type": "paragraph",
        "children": [
          {
            "text": "A sidebar menu with a badge."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 149
    }
  },
  "6a871b5c-515a-4367-9a20-bb2b1cd2c6a1": {
    "id": "6a871b5c-515a-4367-9a20-bb2b1cd2c6a1",
    "type": "Code",
    "value": [
      {
        "id": "97a67747-4bbd-4746-8349-f70f64d4b0fa",
        "type": "code",
        "children": [
          {
            "text": "<SidebarMenuItem>  <SidebarMenuButton />  <SidebarMenuBadge>24</SidebarMenuBadge></SidebarMenuItem>"
          }
        ],
        "props": {
          "language": "javascript",
          "theme": "github-dark"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 150
    }
  },
  "59d6a046-85c0-4331-b3b9-1abf5fcde362": {
    "id": "59d6a046-85c0-4331-b3b9-1abf5fcde362",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "110d815a-f612-4754-a654-f8dd6c14cda5",
        "type": "heading-two",
        "children": [
          {
            "text": "SidebarMenuSkeleton"
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 151
    }
  },
  "5ddbecba-5d26-4764-a39f-16fc2fdd0901": {
    "id": "5ddbecba-5d26-4764-a39f-16fc2fdd0901",
    "type": "Paragraph",
    "value": [
      {
        "id": "43bc6532-bdae-4595-8949-4dc33d306dbb",
        "type": "paragraph",
        "children": [
          {
            "text": "The"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarMenuSkeleton",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "component is used to render a skeleton for a"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarMenu",
            "code": true
          },
          {
            "text": ". You can use this to show a loading state when using React Server Components, SWR or react-query."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 152
    }
  },
  "48f8524d-7ada-4a6f-8510-a9c59759e220": {
    "id": "48f8524d-7ada-4a6f-8510-a9c59759e220",
    "type": "Code",
    "value": [
      {
        "id": "c7871d88-3b74-432a-bcb3-c2da032029cd",
        "type": "code",
        "children": [
          {
            "text": "function NavProjectsSkeleton() {  return (    <SidebarMenu>      {Array.from({ length: 5 }).map((_, index) => (        <SidebarMenuItem key={index}>          <SidebarMenuSkeleton />        </SidebarMenuItem>      ))}    </SidebarMenu>  )}"
          }
        ],
        "props": {
          "language": "javascript",
          "theme": "github-dark"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 153
    }
  },
  "61fc2084-5258-4cc9-b33f-d1f8ab1bd709": {
    "id": "61fc2084-5258-4cc9-b33f-d1f8ab1bd709",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "e928d06b-462f-4b72-bc61-fc9a1727788d",
        "type": "heading-two",
        "children": [
          {
            "text": "SidebarSeparator"
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 154
    }
  },
  "b42dae1b-a428-4508-b094-68b2cf7610b6": {
    "id": "b42dae1b-a428-4508-b094-68b2cf7610b6",
    "type": "Paragraph",
    "value": [
      {
        "id": "c5d93be1-0afb-40e4-8356-f56bfbc57a2c",
        "type": "paragraph",
        "children": [
          {
            "text": "The"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarSeparator",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "component is used to render a separator within a"
          },
          {
            "text": " "
          },
          {
            "text": "Sidebar",
            "code": true
          },
          {
            "text": "."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 155
    }
  },
  "807b6bec-4126-4abb-b5d3-03e0595f44b4": {
    "id": "807b6bec-4126-4abb-b5d3-03e0595f44b4",
    "type": "Code",
    "value": [
      {
        "id": "df068e95-11b1-47f4-b9be-7bd4b19dce5f",
        "type": "code",
        "children": [
          {
            "text": "<Sidebar>  <SidebarHeader />  <SidebarSeparator />  <SidebarContent>    <SidebarGroup />    <SidebarSeparator />    <SidebarGroup />  </SidebarContent></Sidebar>"
          }
        ],
        "props": {
          "language": "javascript",
          "theme": "github-dark"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 156
    }
  },
  "049487cc-b4cd-4562-bd83-de564e81877b": {
    "id": "049487cc-b4cd-4562-bd83-de564e81877b",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "417175ae-a98b-40d2-94b8-860f2bfe6aed",
        "type": "heading-two",
        "children": [
          {
            "text": "SidebarTrigger"
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 157
    }
  },
  "3d4e0373-c4e0-4617-9b3c-7c79fb394f54": {
    "id": "3d4e0373-c4e0-4617-9b3c-7c79fb394f54",
    "type": "Paragraph",
    "value": [
      {
        "id": "ab07e5c0-6a00-4b4a-bd30-b487b607633b",
        "type": "paragraph",
        "children": [
          {
            "text": "Use the"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarTrigger",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "component to render a button that toggles the sidebar."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 158
    }
  },
  "12832116-ac29-4911-8bd9-acbbc80429ec": {
    "id": "12832116-ac29-4911-8bd9-acbbc80429ec",
    "type": "Paragraph",
    "value": [
      {
        "id": "ecf0e3f7-205e-477b-b47d-01d038eed095",
        "type": "paragraph",
        "children": [
          {
            "text": "The"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarTrigger",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "component must be used within a"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarProvider",
            "code": true
          },
          {
            "text": "."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 159
    }
  },
  "2f763dee-8636-4c38-b616-aa0ff0f1c2d0": {
    "id": "2f763dee-8636-4c38-b616-aa0ff0f1c2d0",
    "type": "Code",
    "value": [
      {
        "id": "99425cb0-102c-4a0d-bd71-393d9d2a5f6d",
        "type": "code",
        "children": [
          {
            "text": "<SidebarProvider>  <Sidebar />  <main>    <SidebarTrigger />  </main></SidebarProvider>"
          }
        ],
        "props": {
          "language": "javascript",
          "theme": "github-dark"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 160
    }
  },
  "8fce19a0-bcb1-468a-916e-f0c3b252eae9": {
    "id": "8fce19a0-bcb1-468a-916e-f0c3b252eae9",
    "type": "HeadingThree",
    "value": [
      {
        "id": "b0d6cd9f-7248-4c78-a865-6e3433d3a2ed",
        "type": "heading-three",
        "children": [
          {
            "text": "Custom Trigger"
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 161
    }
  },
  "86fe8a06-9fee-4d53-8323-894c229d172f": {
    "id": "86fe8a06-9fee-4d53-8323-894c229d172f",
    "type": "Paragraph",
    "value": [
      {
        "id": "73cbf7aa-240d-4e70-a505-cfb553963ce7",
        "type": "paragraph",
        "children": [
          {
            "text": "To create a custom trigger, you can use the"
          },
          {
            "text": " "
          },
          {
            "text": "useSidebar",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "hook."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 162
    }
  },
  "20f6a983-6bc9-4d4d-8616-253d2fbe6f8f": {
    "id": "20f6a983-6bc9-4d4d-8616-253d2fbe6f8f",
    "type": "Code",
    "value": [
      {
        "id": "1ec21957-3cf1-4b41-ab5e-23b30769eb6a",
        "type": "code",
        "children": [
          {
            "text": "import { useSidebar } from \"@/components/ui/sidebar\" export function CustomTrigger() {  const { toggleSidebar } = useSidebar()   return <button onClick={toggleSidebar}>Toggle Sidebar</button>}"
          }
        ],
        "props": {
          "language": "javascript",
          "theme": "github-dark"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 163
    }
  },
  "07a6dce3-8af7-495d-99b0-069d7063d302": {
    "id": "07a6dce3-8af7-495d-99b0-069d7063d302",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "e567c5e4-8b5f-4152-848a-94335b703b6d",
        "type": "heading-two",
        "children": [
          {
            "text": "SidebarRail"
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 164
    }
  },
  "a28f52b4-cddb-4b95-992e-20c10a262c65": {
    "id": "a28f52b4-cddb-4b95-992e-20c10a262c65",
    "type": "Paragraph",
    "value": [
      {
        "id": "f6bb845d-0cf5-47e1-a794-7459a540bcac",
        "type": "paragraph",
        "children": [
          {
            "text": "The"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarRail",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "component is used to render a rail within a"
          },
          {
            "text": " "
          },
          {
            "text": "Sidebar",
            "code": true
          },
          {
            "text": ". This rail can be used to toggle the sidebar."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 165
    }
  },
  "58606e19-8636-4f1e-95a0-cc62bb8222a7": {
    "id": "58606e19-8636-4f1e-95a0-cc62bb8222a7",
    "type": "Code",
    "value": [
      {
        "id": "08b5b517-c80a-432c-95b2-afd9b9ec4990",
        "type": "code",
        "children": [
          {
            "text": "<Sidebar>  <SidebarHeader />  <SidebarContent>    <SidebarGroup />  </SidebarContent>  <SidebarFooter />  <SidebarRail /></Sidebar>"
          }
        ],
        "props": {
          "language": "javascript",
          "theme": "github-dark"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 166
    }
  },
  "56ab7fba-9030-43e2-a429-eaca070611d9": {
    "id": "56ab7fba-9030-43e2-a429-eaca070611d9",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "a2fdb80f-ff8b-4c2c-b249-ec017670ddf2",
        "type": "heading-two",
        "children": [
          {
            "text": "Data Fetching"
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 167
    }
  },
  "1b406c97-ca5c-48a8-8d3d-70bc9e05c54a": {
    "id": "1b406c97-ca5c-48a8-8d3d-70bc9e05c54a",
    "type": "HeadingThree",
    "value": [
      {
        "id": "7eaddb4e-6221-4621-b944-7d9f949eedb9",
        "type": "heading-three",
        "children": [
          {
            "text": "React Server Components"
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 168
    }
  },
  "2688ca91-3d5d-4d26-a381-7598a0223bf3": {
    "id": "2688ca91-3d5d-4d26-a381-7598a0223bf3",
    "type": "Paragraph",
    "value": [
      {
        "id": "2e0e941a-6161-4170-adfc-45b81db38677",
        "type": "paragraph",
        "children": [
          {
            "text": "Here's an example of a"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarMenu",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "component rendering a list of projects using React Server Components."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 169
    }
  },
  "22e2948a-4bf5-4dbb-beb1-a5000350c5ff": {
    "id": "22e2948a-4bf5-4dbb-beb1-a5000350c5ff",
    "type": "Paragraph",
    "value": [
      {
        "id": "49db61b0-0855-4e6e-aa89-528b33022d93",
        "type": "paragraph",
        "children": [
          {
            "text": "A sidebar menu using React Server Components."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 170
    }
  },
  "55e8988b-ab28-470c-8106-f1fcc8e6e8d9": {
    "id": "55e8988b-ab28-470c-8106-f1fcc8e6e8d9",
    "type": "Code",
    "value": [
      {
        "id": "d14b7517-8110-4a4e-9616-d8c61f5a4054",
        "type": "code",
        "children": [
          {
            "text": "function NavProjectsSkeleton() {  return (    <SidebarMenu>      {Array.from({ length: 5 }).map((_, index) => (        <SidebarMenuItem key={index}>          <SidebarMenuSkeleton showIcon />        </SidebarMenuItem>      ))}    </SidebarMenu>  )}"
          }
        ],
        "props": {
          "language": "javascript",
          "theme": "github-dark"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 171
    }
  },
  "4c7519a3-780d-4311-b986-356006997282": {
    "id": "4c7519a3-780d-4311-b986-356006997282",
    "type": "Code",
    "value": [
      {
        "id": "bf4b8b68-4863-4e90-b674-938c154fd051",
        "type": "code",
        "children": [
          {
            "text": "async function NavProjects() {  const projects = await fetchProjects()   return (    <SidebarMenu>      {projects.map((project) => (        <SidebarMenuItem key={project.name}>          <SidebarMenuButton asChild>            <a href={project.url}>              <project.icon />              <span>{project.name}</span>            </a>          </SidebarMenuButton>        </SidebarMenuItem>      ))}    </SidebarMenu>  )}"
          }
        ],
        "props": {
          "language": "javascript",
          "theme": "github-dark"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 172
    }
  },
  "0f462eb9-49e2-4059-922e-0062869edc26": {
    "id": "0f462eb9-49e2-4059-922e-0062869edc26",
    "type": "Code",
    "value": [
      {
        "id": "d2ee8b76-7eb9-4a63-b7ce-efffa9032676",
        "type": "code",
        "children": [
          {
            "text": "function AppSidebar() {  return (    <Sidebar>      <SidebarContent>        <SidebarGroup>          <SidebarGroupLabel>Projects</SidebarGroupLabel>          <SidebarGroupContent>            <React.Suspense fallback={<NavProjectsSkeleton />}>              <NavProjects />            </React.Suspense>          </SidebarGroupContent>        </SidebarGroup>      </SidebarContent>    </Sidebar>  )}"
          }
        ],
        "props": {
          "language": "javascript",
          "theme": "github-dark"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 173
    }
  },
  "437da40a-d791-4b05-b23b-988ed8fd7866": {
    "id": "437da40a-d791-4b05-b23b-988ed8fd7866",
    "type": "HeadingThree",
    "value": [
      {
        "id": "f67e5a58-5797-4a5c-ad45-127f834b3b3d",
        "type": "heading-three",
        "children": [
          {
            "text": "SWR and React Query"
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 174
    }
  },
  "51c8eba9-e015-4c90-bd92-0d8df506d45d": {
    "id": "51c8eba9-e015-4c90-bd92-0d8df506d45d",
    "type": "Paragraph",
    "value": [
      {
        "id": "177aaec9-4c58-4a1e-a1c8-fe766edefed0",
        "type": "paragraph",
        "children": [
          {
            "text": "You can use the same approach with"
          },
          {
            "text": " "
          },
          {
            "id": "c988c5fd-9812-4642-ae6d-d7782d879c03",
            "type": "link",
            "props": {
              "url": "https://swr.vercel.app/",
              "target": "_self",
              "rel": "noopener noreferrer",
              "title": "SWR",
              "nodeType": "inline"
            },
            "children": [
              {
                "text": "SWR"
              }
            ]
          },
          {
            "text": " "
          },
          {
            "text": "or"
          },
          {
            "text": " "
          },
          {
            "id": "148287c5-1e3c-4165-809d-5568d67352fc",
            "type": "link",
            "props": {
              "url": "https://tanstack.com/query/latest/docs/framework/react/overview",
              "target": "_self",
              "rel": "noopener noreferrer",
              "title": "react-query",
              "nodeType": "inline"
            },
            "children": [
              {
                "text": "react-query"
              }
            ]
          },
          {
            "text": "."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 175
    }
  },
  "5c44a3b3-c57e-4df0-8570-873b87e87fa4": {
    "id": "5c44a3b3-c57e-4df0-8570-873b87e87fa4",
    "type": "Code",
    "value": [
      {
        "id": "596f792c-684d-40b0-b632-20db5fc59e66",
        "type": "code",
        "children": [
          {
            "text": "function NavProjects() {  const { data, isLoading } = useSWR(\"/api/projects\", fetcher)   if (isLoading) {    return (      <SidebarMenu>        {Array.from({ length: 5 }).map((_, index) => (          <SidebarMenuItem key={index}>            <SidebarMenuSkeleton showIcon />          </SidebarMenuItem>        ))}      </SidebarMenu>    )  }   if (!data) {    return ...  }   return (    <SidebarMenu>      {data.map((project) => (        <SidebarMenuItem key={project.name}>          <SidebarMenuButton asChild>            <a href={project.url}>              <project.icon />              <span>{project.name}</span>            </a>          </SidebarMenuButton>        </SidebarMenuItem>      ))}    </SidebarMenu>  )}"
          }
        ],
        "props": {
          "language": "javascript",
          "theme": "github-dark"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 176
    }
  },
  "156389ac-e999-4774-ba43-c0a73a99a7aa": {
    "id": "156389ac-e999-4774-ba43-c0a73a99a7aa",
    "type": "Code",
    "value": [
      {
        "id": "6fcc7ed4-8ba0-47ca-8c1b-0b2f75315597",
        "type": "code",
        "children": [
          {
            "text": "function NavProjects() {  const { data, isLoading } = useQuery()   if (isLoading) {    return (      <SidebarMenu>        {Array.from({ length: 5 }).map((_, index) => (          <SidebarMenuItem key={index}>            <SidebarMenuSkeleton showIcon />          </SidebarMenuItem>        ))}      </SidebarMenu>    )  }   if (!data) {    return ...  }   return (    <SidebarMenu>      {data.map((project) => (        <SidebarMenuItem key={project.name}>          <SidebarMenuButton asChild>            <a href={project.url}>              <project.icon />              <span>{project.name}</span>            </a>          </SidebarMenuButton>        </SidebarMenuItem>      ))}    </SidebarMenu>  )}"
          }
        ],
        "props": {
          "language": "javascript",
          "theme": "github-dark"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 177
    }
  },
  "e4ec9cb7-500b-464d-894c-98bf49108219": {
    "id": "e4ec9cb7-500b-464d-894c-98bf49108219",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "6db765c7-833f-4c28-b0c3-62e1d1b435da",
        "type": "heading-two",
        "children": [
          {
            "text": "Controlled Sidebar"
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 178
    }
  },
  "ed317d83-dbd0-4154-92df-616deeb73640": {
    "id": "ed317d83-dbd0-4154-92df-616deeb73640",
    "type": "Paragraph",
    "value": [
      {
        "id": "108f046e-b436-4582-a9d9-865ec9a493ef",
        "type": "paragraph",
        "children": [
          {
            "text": "Use the"
          },
          {
            "text": " "
          },
          {
            "text": "open",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "and"
          },
          {
            "text": " "
          },
          {
            "text": "onOpenChange",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "props to control the sidebar."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 179
    }
  },
  "5cbc8032-288c-4a8f-b5a7-f172abd974fd": {
    "id": "5cbc8032-288c-4a8f-b5a7-f172abd974fd",
    "type": "Paragraph",
    "value": [
      {
        "id": "97314ec6-ce01-4889-90c8-91706fda644f",
        "type": "paragraph",
        "children": [
          {
            "text": "A controlled sidebar."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 180
    }
  },
  "9bb0cb0d-fa47-48f7-bc0d-7aece9eb3c97": {
    "id": "9bb0cb0d-fa47-48f7-bc0d-7aece9eb3c97",
    "type": "Code",
    "value": [
      {
        "id": "26c07269-6fc9-4a63-8b7d-3e00fef7c786",
        "type": "code",
        "children": [
          {
            "text": "export function AppSidebar() {  const [open, setOpen] = React.useState(false)   return (    <SidebarProvider open={open} onOpenChange={setOpen}>      <Sidebar />    </SidebarProvider>  )}"
          }
        ],
        "props": {
          "language": "javascript",
          "theme": "github-dark"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 181
    }
  },
  "c308e693-5031-420e-b341-b55d8525fda3": {
    "id": "c308e693-5031-420e-b341-b55d8525fda3",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "e5b95cdb-1aba-435e-8ac8-fdcfee73d00e",
        "type": "heading-two",
        "children": [
          {
            "text": "Theming"
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 182
    }
  },
  "c9e4d64e-5d03-4eb9-9314-1ded183edada": {
    "id": "c9e4d64e-5d03-4eb9-9314-1ded183edada",
    "type": "Paragraph",
    "value": [
      {
        "id": "f5c9b061-2366-4e84-b6a5-b5db8f092bdb",
        "type": "paragraph",
        "children": [
          {
            "text": "We use the following CSS variables to theme the sidebar."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 183
    }
  },
  "d7516baf-410f-4882-bc6c-36526dba1b7c": {
    "id": "d7516baf-410f-4882-bc6c-36526dba1b7c",
    "type": "Code",
    "value": [
      {
        "id": "4b2e837b-a18c-4bbe-997b-d54a5b73eb48",
        "type": "code",
        "children": [
          {
            "text": "@layer base {  :root {    --sidebar-background: 0 0% 98%;    --sidebar-foreground: 240 5.3% 26.1%;    --sidebar-primary: 240 5.9% 10%;    --sidebar-primary-foreground: 0 0% 98%;    --sidebar-accent: 240 4.8% 95.9%;    --sidebar-accent-foreground: 240 5.9% 10%;    --sidebar-border: 220 13% 91%;    --sidebar-ring: 217.2 91.2% 59.8%;  }   .dark {    --sidebar-background: 240 5.9% 10%;    --sidebar-foreground: 240 4.8% 95.9%;    --sidebar-primary: 0 0% 98%;    --sidebar-primary-foreground: 240 5.9% 10%;    --sidebar-accent: 240 3.7% 15.9%;    --sidebar-accent-foreground: 240 4.8% 95.9%;    --sidebar-border: 240 3.7% 15.9%;    --sidebar-ring: 217.2 91.2% 59.8%;  }}"
          }
        ],
        "props": {
          "language": "css",
          "theme": "github-dark"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 184
    }
  },
  "06146588-34b9-432a-9edf-fd3218ed85bd": {
    "id": "06146588-34b9-432a-9edf-fd3218ed85bd",
    "type": "Paragraph",
    "value": [
      {
        "id": "bf6d7fdf-122a-4d6f-b81e-d228825d2c49",
        "type": "paragraph",
        "children": [
          {
            "text": "We intentionally use different variables for the sidebar and the rest of the application",
            "bold": true
          },
          {
            "text": " "
          },
          {
            "text": "to make it easy to have a sidebar that is styled differently from the rest of the application. Think a sidebar with a darker shade from the main application."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 185
    }
  },
  "d04ffc10-b6ce-4609-b2d5-6fc2058a4360": {
    "id": "d04ffc10-b6ce-4609-b2d5-6fc2058a4360",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "3dc2a5c4-c2c3-4fd0-9fbf-47bbef1335da",
        "type": "heading-two",
        "children": [
          {
            "text": "Styling"
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 186
    }
  },
  "bd37c7a7-ce31-4686-b2d6-feb796e3aaef": {
    "id": "bd37c7a7-ce31-4686-b2d6-feb796e3aaef",
    "type": "Paragraph",
    "value": [
      {
        "id": "dec95412-d26f-49fe-96bf-7c9b63708e95",
        "type": "paragraph",
        "children": [
          {
            "text": "Here are some tips for styling the sidebar based on different states."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 187
    }
  },
  "ab463def-58ce-4cc7-9ce0-0494c45c4f80": {
    "id": "ab463def-58ce-4cc7-9ce0-0494c45c4f80",
    "type": "BulletedList",
    "value": [
      {
        "id": "7c91369a-7c5f-4c10-81bb-addc0f9c2445",
        "type": "bulleted-list",
        "children": [
          {
            "text": "Styling an element based on the sidebar collapsible state."
          },
          {
            "text": " "
          },
          {
            "text": "The following will hide the"
          },
          {
            "text": " "
          },
          {
            "text": "SidebarGroup"
          },
          {
            "text": " "
          },
          {
            "text": "when the sidebar is in"
          },
          {
            "text": " "
          },
          {
            "text": "icon"
          },
          {
            "text": " "
          },
          {
            "text": "mode."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 188
    }
  },
  "b86a0688-147d-4d47-8797-07951cf151e6": {
    "id": "b86a0688-147d-4d47-8797-07951cf151e6",
    "type": "Code",
    "value": [
      {
        "id": "fd419e3a-96b0-4594-b5fd-3b0ca041ffac",
        "type": "code",
        "children": [
          {
            "text": "<Sidebar collapsible=\"icon\">  <SidebarContent>    <SidebarGroup className=\"group-data-[collapsible=icon]:hidden\" />  </SidebarContent></Sidebar>"
          }
        ],
        "props": {
          "language": "javascript",
          "theme": "github-dark"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 189
    }
  },
  "6813137a-2255-4511-b7c5-cb14b6d92429": {
    "id": "6813137a-2255-4511-b7c5-cb14b6d92429",
    "type": "BulletedList",
    "value": [
      {
        "id": "a9cf3dbe-8356-4ce6-a744-7d779c5701aa",
        "type": "bulleted-list",
        "children": [
          {
            "text": "Styling a menu action based on the menu button active state."
          },
          {
            "text": " "
          },
          {
            "text": "The following will force the menu action to be visible when the menu button is active."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 190
    }
  },
  "7f156f09-cdb9-48bc-9343-9521343f89df": {
    "id": "7f156f09-cdb9-48bc-9343-9521343f89df",
    "type": "Code",
    "value": [
      {
        "id": "b3b72289-ce36-41a8-b989-c5359007574c",
        "type": "code",
        "children": [
          {
            "text": "<SidebarMenuItem>  <SidebarMenuButton />  <SidebarMenuAction className=\"peer-data-[active=true]/menu-button:opacity-100\" /></SidebarMenuItem>"
          }
        ],
        "props": {
          "language": "javascript",
          "theme": "github-dark"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 191
    }
  },
  "99de2115-f01a-4fe7-97c0-04cc730628d5": {
    "id": "99de2115-f01a-4fe7-97c0-04cc730628d5",
    "type": "Paragraph",
    "value": [
      {
        "id": "08c065be-38fb-40fa-8f34-8c80260288e0",
        "type": "paragraph",
        "children": [
          {
            "text": "You can find more tips on using states for styling in this"
          },
          {
            "text": " "
          },
          {
            "id": "f6399442-00b3-464c-b5f0-749cf382f32f",
            "type": "link",
            "props": {
              "url": "https://x.com/shadcn/status/1842329158879420864",
              "target": "_self",
              "rel": "noopener noreferrer",
              "title": "Twitter thread",
              "nodeType": "inline"
            },
            "children": [
              {
                "text": "Twitter thread"
              }
            ]
          },
          {
            "text": "."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 192
    }
  },
  "29c97cb7-9a35-4138-bdce-3efe2612afb7": {
    "id": "29c97cb7-9a35-4138-bdce-3efe2612afb7",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "dfe5c0c9-31c1-4f7e-b89d-b7c42a84c78e",
        "type": "heading-two",
        "children": [
          {
            "text": "Changelog"
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 193
    }
  },
  "82b95f2b-5f2f-4ea2-a4d4-88ac74180f35": {
    "id": "82b95f2b-5f2f-4ea2-a4d4-88ac74180f35",
    "type": "HeadingThree",
    "value": [
      {
        "id": "4ed532de-dca1-492b-89fe-28f70a0e88b9",
        "type": "heading-three",
        "children": [
          {
            "text": "2024-10-30 Cookie handling in setOpen"
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 194
    }
  },
  "ab04bdf0-4cdb-415f-b3e0-b49c40ba935f": {
    "id": "ab04bdf0-4cdb-415f-b3e0-b49c40ba935f",
    "type": "BulletedList",
    "value": [
      {
        "id": "f160bbac-096f-42e3-9855-67d67dd7e43d",
        "type": "bulleted-list",
        "children": [
          {
            "text": "#5593"
          },
          {
            "text": " "
          },
          {
            "text": "- Improved setOpen callback logic in"
          },
          {
            "text": " "
          },
          {
            "text": "<SidebarProvider>"
          },
          {
            "text": "."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 195
    }
  },
  "0c7eb940-e7e9-4b50-b356-99ac1f376685": {
    "id": "0c7eb940-e7e9-4b50-b356-99ac1f376685",
    "type": "Paragraph",
    "value": [
      {
        "id": "7e8c6116-3a3d-44d6-bbb2-fca1c1078102",
        "type": "paragraph",
        "children": [
          {
            "text": "Update the"
          },
          {
            "text": " "
          },
          {
            "text": "setOpen",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "callback in"
          },
          {
            "text": " "
          },
          {
            "text": "<SidebarProvider>",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "as follows:"
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 196
    }
  },
  "9d03923d-8948-4245-9ddf-58b7cae89e29": {
    "id": "9d03923d-8948-4245-9ddf-58b7cae89e29",
    "type": "Code",
    "value": [
      {
        "id": "5b4a7421-a4cd-48f2-823c-7ea36e8b30f7",
        "type": "code",
        "children": [
          {
            "text": "const setOpen = React.useCallback(  (value: boolean | ((value: boolean) => boolean)) => {    const openState = typeof value === \"function\" ? value(open) : value    if (setOpenProp) {      setOpenProp(openState)    } else {      _setOpen(openState)    }     // This sets the cookie to keep the sidebar state.    document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`  },  [setOpenProp, open])"
          }
        ],
        "props": {
          "language": "javascript",
          "theme": "github-dark"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 197
    }
  },
  "61eba41d-965c-4888-bd44-02ed916d4594": {
    "id": "61eba41d-965c-4888-bd44-02ed916d4594",
    "type": "HeadingThree",
    "value": [
      {
        "id": "34a253d5-6733-4ee7-8cfc-034b21fd9eda",
        "type": "heading-three",
        "children": [
          {
            "text": "2024-10-21 Fixed"
          },
          {
            "text": " "
          },
          {
            "text": "text-sidebar-foreground",
            "code": true
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 198
    }
  },
  "a658fbe9-d33b-4de3-8a02-e3e4c2fedb15": {
    "id": "a658fbe9-d33b-4de3-8a02-e3e4c2fedb15",
    "type": "BulletedList",
    "value": [
      {
        "id": "1cc2e44e-2ee8-47b5-84e9-bc30bf8afabc",
        "type": "bulleted-list",
        "children": [
          {
            "text": "#5491"
          },
          {
            "text": " "
          },
          {
            "text": "- Moved"
          },
          {
            "text": " "
          },
          {
            "text": "text-sidebar-foreground"
          },
          {
            "text": " "
          },
          {
            "text": "from"
          },
          {
            "text": " "
          },
          {
            "text": "<SidebarProvider>"
          },
          {
            "text": " "
          },
          {
            "text": "to"
          },
          {
            "text": " "
          },
          {
            "text": "<Sidebar>"
          },
          {
            "text": " "
          },
          {
            "text": "component."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 199
    }
  },
  "2580ca3e-3fe6-40e8-8d16-84ea65862f5e": {
    "id": "2580ca3e-3fe6-40e8-8d16-84ea65862f5e",
    "type": "HeadingThree",
    "value": [
      {
        "id": "46afd8ef-918e-4ecc-a198-e5d481546cec",
        "type": "heading-three",
        "children": [
          {
            "text": "2024-10-20 Typo in"
          },
          {
            "text": " "
          },
          {
            "text": "useSidebar",
            "code": true
          },
          {
            "text": " "
          },
          {
            "text": "hook."
          }
        ],
        "props": {
          "nodeType": "block",
          "withAnchor": false
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 200
    }
  }
} as unknown as YooptaContentValue;
