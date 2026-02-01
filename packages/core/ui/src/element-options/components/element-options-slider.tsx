import type { ElementOptionsSliderProps } from '../types';

export const ElementOptionsSlider = ({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  className,
  style,
}: ElementOptionsSliderProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange(Number(e.target.value));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div
      className={className}
      style={style}
      data-element-options-slider
      onMouseDown={handleMouseDown}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        data-element-options-slider-input
        style={{
          // CSS variable for styling the track fill
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ['--slider-percentage' as any]: `${percentage}%`,
        }}
      />
      <span data-element-options-slider-value>{value}</span>
    </div>
  );
};

ElementOptionsSlider.displayName = 'ElementOptions.Slider';

