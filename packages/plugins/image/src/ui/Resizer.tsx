const Resizer = ({ position }) => (
  <div
    contentEditable={false}
    className={`yoo-image-absolute yoo-image-pointer-events-none yoo-image-flex yoo-image-items-center yoo-image-justify-center yoo-image-z-10 yoo-image-opacity-1 yoo-image-h-full yoo-image-w-[15px] yoo-image-cursor-col-resize yoo-image-transition-opacity yoo-image-duration-150 yoo-image-ease-in ${
      position === 'left' ? 'yoo-image-left-0 yoo-image-top-0' : 'yoo-image-right-0 yoo-image-top-0'
    }`}>
    <div className="yoo-image-opacity-100 yoo-image-transition-opacity yoo-image-duration-300 yoo-image-ease-in yoo-image-rounded-[20px] yoo-image-bg-[rgba(15,15,15,0.6)] yoo-image-border yoo-image-border-solid yoo-image-border-[rgba(255,255,255,0.9)] yoo-image-w-[6px] yoo-image-h-[48px] yoo-image-max-h-[50%] yoo-image-shadow-[0_0_0_.5px_#FFF]" />
  </div>
);

export { Resizer };
