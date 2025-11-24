import * as SheetPrimitive from '@radix-ui/react-dialog';
import { SheetRoot, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { ViewVerticalIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import NextLink from 'next/link';
import { StarIcon, Send, Code2Icon, FileHeart } from 'lucide-react';

type Props = React.ComponentPropsWithoutRef<typeof SheetPrimitive.Root> & {
  className?: string;
  trigger?: React.ReactNode;
  children?: React.ReactNode;
};

const Sheet = ({ open, onOpenChange, children, trigger, className }: Props) => {
  return (
    <SheetRoot open={open} onOpenChange={onOpenChange}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent side="left" className={className}>
        {children}
      </SheetContent>
    </SheetRoot>
  );
};

const MobileNavigation = () => {
  return (
    <Sheet
      className="pr-3 pl-3 bg-[#0d1116]"
      trigger={
        <Button
          variant="ghost"
          className="mr-2 px-3 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
          <ViewVerticalIcon className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      }>
      <div className="pb-2 pt-4 border-b text-white">
        <nav className="flex items-center space-x-6 text-sm font-medium ml-0">
          <NextLink
            href="https://github.com/Darginec05/Yoopta-Editor"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center">
            <div className="rounded-full bg-white relative w-[30px] h-[30px]">
              <img
                src="/yoopta/yoopta-logo.png"
                width={30}
                height={30}
                alt="yooptae editor logo"
                className="absolute top-0 left-0"
              />
            </div>
            <span className="text-white text-base">opta ˆ-ˆ</span>
          </NextLink>
        </nav>
      </div>
      <div className="flex flex-col space-y-2 text-white mt-2">
        <NextLink
          href="https://github.com/yoopta-editor/Yoopta-Editor?tab=readme-ov-file#welcome-to-yoopta-editorv4"
          target="_blank"
          rel="noopener noreferrer"
          className="mr-4 flex items-center">
          Docs
          <FileHeart size={15} className="ml-2" color="#1f6feb" />
        </NextLink>
        <NextLink href="/examples/withBaseFullSetup" className="mr-4 flex items-center">
          Examples
          <Code2Icon size={15} className="ml-2" color="#00ca56" />
        </NextLink>
        <NextLink
          href="https://github.com/sponsors/Darginec05"
          target="_blank"
          rel="noopener noreferrer"
          className="mr-4 flex items-center">
          Sponsor <span className="ml-2">💖</span>
        </NextLink>
        <NextLink
          href="https://github.com/Darginec05/Yoopta-Editor"
          target="_blank"
          rel="noopener noreferrer"
          className="mr-4 flex items-center">
          Give us star
          <StarIcon size={15} className="ml-2" fill="#faca15" color="#faca15" />
        </NextLink>
        <NextLink
          href="https://discord.com/invite/Dt8rhSTjsn"
          target="_blank"
          rel="noopener noreferrer"
          className="mr-4 flex items-center">
          Community
          <Send size={15} className="ml-2" color="#2e9fdc" />
        </NextLink>
      </div>
    </Sheet>
  );
};

export { MobileNavigation };
