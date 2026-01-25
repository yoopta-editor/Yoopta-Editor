import './element-options.css';

import { ElementOptionsColorPicker } from './components/element-options-color-picker';
import { ElementOptionsContent } from './components/element-options-content';
import { ElementOptionsGroup } from './components/element-options-group';
import { ElementOptionsInput } from './components/element-options-input';
import { ElementOptionsLabel } from './components/element-options-label';
import { ElementOptionsRoot } from './components/element-options-root';
import { ElementOptionsSelect } from './components/element-options-select';
import { ElementOptionsSeparator } from './components/element-options-separator';
import { ElementOptionsSlider } from './components/element-options-slider';
import { ElementOptionsToggle } from './components/element-options-toggle';
import { ElementOptionsTrigger } from './components/element-options-trigger';

// Export types
export type {
  Side,
  Align,
  ElementOptionsContextValue,
  ElementOptionsRootProps,
  ElementOptionsTriggerProps,
  ElementOptionsContentProps,
  ElementOptionsGroupProps,
  ElementOptionsLabelProps,
  ElementOptionsSeparatorProps,
  ElementOptionsSelectProps,
  ElementOptionsColorPickerProps,
  ElementOptionsToggleProps,
  ElementOptionsSliderProps,
  ElementOptionsInputProps,
  SelectOption,
} from './types';

// Export context and hooks
export {
  ElementOptionsContext,
  useElementOptionsContext,
  useElementOptions,
  useUpdateElementProps,
} from './context/element-options-context';

// Export individual components
export { ElementOptionsRoot } from './components/element-options-root';
export { ElementOptionsTrigger } from './components/element-options-trigger';
export { ElementOptionsContent } from './components/element-options-content';
export { ElementOptionsGroup } from './components/element-options-group';
export { ElementOptionsLabel } from './components/element-options-label';
export { ElementOptionsSeparator } from './components/element-options-separator';
export { ElementOptionsSelect } from './components/element-options-select';
export { ElementOptionsColorPicker } from './components/element-options-color-picker';
export { ElementOptionsToggle } from './components/element-options-toggle';
export { ElementOptionsSlider } from './components/element-options-slider';
export { ElementOptionsInput } from './components/element-options-input';

// Export compound component
export const ElementOptions = Object.assign(ElementOptionsRoot, {
  Root: ElementOptionsRoot,
  Trigger: ElementOptionsTrigger,
  Content: ElementOptionsContent,
  Group: ElementOptionsGroup,
  Label: ElementOptionsLabel,
  Separator: ElementOptionsSeparator,
  Select: ElementOptionsSelect,
  ColorPicker: ElementOptionsColorPicker,
  Toggle: ElementOptionsToggle,
  Slider: ElementOptionsSlider,
  Input: ElementOptionsInput,
});
