import NextLink from 'next/link';
import { StarIcon, Send, Code2Icon, FileHeart } from 'lucide-react';
import { MobileNavigation } from '../MobileNavigation/MobileNavigation';

export const Header = () => {
  return (
    <header
      className="z-10 supports-backdrop-blur:bg-background/60 fixed top-0 z-2 w-full border-b border-[hsl(var(--border))] backdrop-blur"
      style={{
        background: 'radial-gradient(circle at 24.1% 68.8%, #1e232d 0%, #050507 99.4%)',
        animation: ' gradient 15s ease infinite',
        backgroundSize: '400% 400%',
      }}>
      <div className="container flex h-14 items-center !pl-0">
        <div className="mr-4 hidden md:flex">
          <nav className="flex items-center space-x-6 text-sm font-medium ml-6">
            <NextLink
              href="https://github.com/Darginec05/Yoopta-Editor"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center">
              <div className="rounded-full bg-white relative w-[42px] h-[42px]">
                <img
                  src="/yoopta/yoopta-logo.png"
                  width={42}
                  height={42}
                  alt="yooptae editor logo"
                  className="absolute top-0 left-0"
                />
              </div>
              <span className="text-white text-base">opta ˆ-ˆ</span>
            </NextLink>
          </nav>
        </div>
        <MobileNavigation />
        <div className="flex flex-1 items-center justify-end">
          <div className="flex items-center text-nowrap mt-0 w-full justify-end md:w-auto md:justify-start">
            <NextLink
              href="https://yoodocs.space/yoopta-editor/yoopta/introduction-rsK_1fODIL"
              target="_blank"
              rel="noopener noreferrer"
              className="md:mr-4 mr-1 flex items-center">
              <span className="md:block hidden">Docs</span>
              <FileHeart size={15} className="ml-2" color="#1f6feb" />
            </NextLink>
            <NextLink href="/examples/withBaseFullSetup" className="md:mr-4 mr-1 flex items-center">
              <span className="md:block hidden">Examples</span>
              <Code2Icon size={15} className="ml-2" color="#00ca56" />
            </NextLink>
            <NextLink
              href="https://github.com/sponsors/Darginec05"
              target="_blank"
              rel="noopener noreferrer"
              className="md:mr-4 mr-1 flex items-center">
              <span className="md:block hidden">Sponsor</span>
              <span className="ml-2">💖</span>
            </NextLink>
            <NextLink
              href="https://github.com/Darginec05/Yoopta-Editor"
              target="_blank"
              rel="noopener noreferrer"
              className="md:mr-4 mr-1 flex items-center">
              <span className="md:block hidden">Give us star</span>
              <StarIcon size={15} className="ml-2" fill="#faca15" color="#faca15" />
            </NextLink>
            <NextLink
              href="https://discord.com/invite/Dt8rhSTjsn"
              target="_blank"
              rel="noopener noreferrer"
              className="md:mr-0 mr-0 flex items-center">
              <span className="md:block hidden">Community</span>
              <Send size={15} className="ml-2" color="#2e9fdc" />
            </NextLink>
          </div>
        </div>
      </div>
    </header>
  );
};
