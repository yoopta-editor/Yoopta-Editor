import { useState } from 'react';
import { Settings2 } from 'lucide-react';

import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { Label } from '../../../ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../../../ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../ui/select';
import { Separator } from '../../../ui/separator';
import { Slider } from '../../../ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../ui/tooltip';
import type { ImageElementProps, ObjectFit } from '../../types';

type ImageInlineToolbarSettingsProps = {
  fit: ObjectFit;
  alt: string;
  borderRadius: number;
  onUpdate: (props: Partial<ImageElementProps>) => void;
};

const FIT_LABELS: Partial<Record<ObjectFit, { label: string; description: string }>> = {
  contain: { label: 'Contain', description: 'Fit within bounds' },
  cover: { label: 'Cover', description: 'Fill and crop' },
  fill: { label: 'Fill', description: 'Stretch to fit' },
};

export const ImageInlineToolbarSettings = ({
  fit,
  alt,
  borderRadius,
  onUpdate,
}: ImageInlineToolbarSettingsProps) => {
  const [localAlt, setLocalAlt] = useState(alt);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button variant={isOpen ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7">
                <Settings2 className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>Settings</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <PopoverContent
        className="w-80 p-3"
        align="start"
        contentEditable={false}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold">Image settings</h4>
            <p className="text-xs text-muted-foreground">Customize how the image appears</p>
          </div>
          <Separator />
          <div className="space-y-1">
            <Label htmlFor="alt-text" className="text-sm font-medium">
              Alt text
            </Label>
            <Input
              id="alt-text"
              value={localAlt}
              onChange={(e) => setLocalAlt(e.target.value)}
              onBlur={() => onUpdate({ alt: localAlt })}
              placeholder="Describe this image..."
              className="h-9"
            />
            <p className="text-xs text-muted-foreground">Important for accessibility and SEO</p>
          </div>

          <div className="space-y-1 z-50">
            <Label htmlFor="object-fit" className="text-sm font-medium">
              How image fits
            </Label>
            <Select value={fit} onValueChange={(value: ObjectFit) => onUpdate({ fit: value })}>
              <SelectTrigger id="object-fit" className="h-9 w-full">
                <SelectValue placeholder="Select how image fits">
                  <div className="flex items-center gap-2">
                    <div className="font-medium">{FIT_LABELS[fit]?.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {FIT_LABELS[fit]?.description}
                    </div>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="contain" className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded border">
                        <div className="h-4 w-3 rounded bg-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{FIT_LABELS.contain?.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {FIT_LABELS.contain?.description}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="cover" className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded border">
                        <div className="h-8 w-6 rounded bg-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{FIT_LABELS.cover?.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {FIT_LABELS.cover?.description}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="fill" className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded border">
                        <div className="h-8 w-8 rounded bg-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{FIT_LABELS.fill?.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {FIT_LABELS.fill?.description}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Border radius</Label>
              <span className="text-sm text-muted-foreground">{borderRadius}px</span>
            </div>
            <Slider
              value={[borderRadius]}
              onValueChange={([value]) => onUpdate({ borderRadius: value })}
              max={50}
              step={1}
              className="w-full"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
