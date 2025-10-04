import type { ReactNode } from 'react';

type Props = {
  className?: string;
  children?: ReactNode;
  width?: number;
  height?: number;
};

const Loader = ({ className, width, height, children }: Props) => (
    <div className={className}>
      {children}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-loader-2 yoo-file-h-4 yoo-file-w-4 yoo-file-animate-spin">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    </div>
  );

export { Loader };
