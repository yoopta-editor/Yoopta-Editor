const Resizer = ({ position }) => (
  <div
    contentEditable={false}
    className={`yoo-video-absolute yoo-video-pointer-events-none yoo-video-flex yoo-video-items-center yoo-video-justify-center yoo-video-z-10 yoo-video-opacity-1 yoo-video-h-full yoo-video-w-[15px] yoo-video-cursor-col-resize yoo-video-transition-opacity yoo-video-duration-150 yoo-video-ease-in ${
      position === 'left' ? 'yoo-video-left-0 yoo-video-top-0' : 'yoo-video-right-0 yoo-video-top-0'
    }`}>
    <div className="yoo-video-opacity-100 yoo-video-transition-opacity yoo-video-duration-300 yoo-video-ease-in yoo-video-rounded-[20px] yoo-video-bg-[rgba(15,15,15,0.6)] yoo-video-border yoo-video-border-solid yoo-video-border-[rgba(255,255,255,0.9)] yoo-video-w-[6px] yoo-video-h-[48px] yoo-video-max-h-[50%] yoo-video-shadow-[0_0_0_.5px_#FFF]" />
  </div>
);

export { Resizer };
