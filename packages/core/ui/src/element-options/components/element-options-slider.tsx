import * as Slider from '@radix-ui/react-slider';

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
  return (
    <div className={className} style={style} data-element-options-slider>
      <Slider.Root
        value={[value]}
        onValueChange={([v]) => onValueChange(v)}
        min={min}
        max={max}
        step={step}
        onMouseDown={(e) => e.stopPropagation()}
        data-element-options-slider-root>
        <Slider.Track data-element-options-slider-track>
          <Slider.Range data-element-options-slider-range />
        </Slider.Track>
        <Slider.Thumb data-element-options-slider-thumb />
      </Slider.Root>
      <span data-element-options-slider-value>{value}</span>
    </div>
  );
};

ElementOptionsSlider.displayName = 'ElementOptions.Slider';
