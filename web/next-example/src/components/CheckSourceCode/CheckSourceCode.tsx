import { ExternalLinkIcon, StarIcon, ArrowBigLeftDash } from 'lucide-react';

type Props = {
  example?: string;
  directLink?: string;
  withBackButton?: boolean;
};

const CheckSourceCode = ({ example, withBackButton = false, directLink }: Props) => {
  return (
    <div
      className={`fixed px-2 md:top-2 md:right-0 right-[18px] top-[14.5px] flex z-50 justify-between w-${
        withBackButton ? 'full' : 'auto'
      }`}>
      <div className="flex">
        {withBackButton && (
          <button
            onClick={() => {
              window.open(`https://yoopta.dev/examples/withBaseFullSetup`, '_self');
            }}
            className="relative mx-2 px-3 py-1 text-[14px] rounded text-white flex items-center bg-[#000]">
            <ArrowBigLeftDash size={15} className="mr-2" fill="#fff" color="#fff" />
            Go to Examples
          </button>
        )}
      </div>
      <div className="flex">
        <button
          onClick={() => {
            window.open(`https://github.com/Darginec05/Yoopta-Editor`, '_blank');
          }}
          className="relative mx-2 px-3 py-1 text-[14px] rounded text-white flex items-center bg-[#000]">
          Give us star
          <StarIcon size={15} className="ml-2" fill="#faca15" color="#faca15" />
        </button>
        <button
          onClick={() =>
            window.open(
              directLink ||
                `https://github.com/Darginec05/Yoopta-Editor/blob/master/web/next-example/src/components/examples/${example}/index.tsx`,
              '_blank',
            )
          }
          className="relative mx-2 px-3 py-1 text-[14px] rounded text-white flex items-center bg-[#007aff]">
          Source code
          <ExternalLinkIcon size={15} className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export { CheckSourceCode };
