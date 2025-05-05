import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Input } from '../ui/input';
import { cn } from 'src/lib/utils';

interface SliderEditorProps {
  id: string;
  value: number;
  name: string;
  description?: string;
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  onChange: (id: string, value: any) => void;
  className?: string;
}

export function SliderEditor({
  id,
  name,
  label,
  value,
  description,
  min: propMin,
  max: propMax,
  step: propStep,
  onChange,
  className,
}: SliderEditorProps) {
  const min = propMin ?? 0;
  const max = propMax ?? 100;
  const step = propStep ?? 1;

  return (
    <div className={cn('space-y-2', className)}>
      <Label className="yoo-elements-text-xs yoo-elements-font-medium yoo-elements-text-gray-700">
        {label}
        {description && (
          <span className="yoo-elements-text-xs yoo-elements-font-normal yoo-elements-text-gray-500 yoo-elements-ml-1">
            ({description})
          </span>
        )}
      </Label>

      <div className="flex space-x-2">
        <Slider
          id={id}
          min={min}
          max={max}
          step={step}
          value={[value]}
          onValueChange={(value) => onChange(id, value[0])}
          className="flex-1 my-1.5"
        />
        {/* <Input
          type="number"
          value={value}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            if (!isNaN(value)) {
              onChange(id, value);
            }
          }}
          min={min}
          max={max}
          step={step}
          className="w-16"
        /> */}
      </div>

      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </div>
  );
}
