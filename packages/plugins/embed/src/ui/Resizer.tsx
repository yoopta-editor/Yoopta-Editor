const Resizer = ({ position }) => (
  <div
    contentEditable={false}
    className={`yoo-embed-absolute yoo-embed-pointer-events-none yoo-embed-flex yoo-embed-items-center yoo-embed-justify-center yoo-embed-z-10 yoo-embed-opacity-1 yoo-embed-h-full yoo-embed-w-[15px] yoo-embed-cursor-col-resize yoo-embed-transition-opacity yoo-embed-duration-150 yoo-embed-ease-in ${
      position === 'left' ? 'yoo-embed-left-0 yoo-embed-top-0' : 'yoo-embed-right-0 yoo-embed-top-0'
    }`}>
    <div className="yoo-embed-opacity-100 yoo-embed-transition-opacity yoo-embed-duration-300 yoo-embed-ease-in yoo-embed-rounded-[20px] yoo-embed-bg-[rgba(15,15,15,0.6)] yoo-embed-border yoo-embed-border-[rgba(255,255,255,0.9)] yoo-embed-w-[6px] yoo-embed-h-[48px] yoo-embed-max-h-[50%] yoo-embed-shadow-[0_0_0_.5px_#FFF]" />
  </div>
);

export { Resizer };
