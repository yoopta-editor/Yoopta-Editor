import { useState } from 'react';
import { Settings2 } from 'lucide-react';

import { Button } from '../../../ui/button';
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
import { Switch } from '../../../ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../ui/tooltip';
import type { VideoElementProps, ObjectFit } from '../../types';

type VideoInlineToolbarSettingsProps = {
  fit: ObjectFit | null;
  settings: {
    controls?: boolean;
    loop?: boolean;
    muted?: boolean;
    autoPlay?: boolean;
  };
  onUpdate: (props: Partial<VideoElementProps>) => void;
};

const FIT_LABELS: Partial<Record<ObjectFit, { label: string; description: string }>> = {
  contain: { label: 'Contain', description: 'Fit within bounds' },
  cover: { label: 'Cover', description: 'Fill and crop' },
  fill: { label: 'Fill', description: 'Stretch to fit' },
};

export const VideoInlineToolbarSettings = ({
  fit,
  settings,
  onUpdate,
}: VideoInlineToolbarSettingsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSettingsUpdate = (newSettings: Partial<typeof settings>) => {
    onUpdate({
      settings: {
        ...settings,
        ...newSettings,
      },
    });
  };

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
            <h4 className="font-semibold">Video settings</h4>
            <p className="text-xs text-muted-foreground">Customize video playback and display</p>
          </div>
          <Separator />

          <div className="space-y-1">
            <Label htmlFor="object-fit" className="text-sm font-medium">
              How video fits
            </Label>
            <Select
              value={fit || 'contain'}
              onValueChange={(value: ObjectFit) => onUpdate({ fit: value })}>
              <SelectTrigger id="object-fit" className="h-9 w-full">
                <SelectValue placeholder="Select how video fits">
                  <div className="flex items-center gap-2">
                    <div className="font-medium">{FIT_LABELS[fit || 'contain']?.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {FIT_LABELS[fit || 'contain']?.description}
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

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="controls" className="text-sm font-medium">
                  Show controls
                </Label>
                <p className="text-xs text-muted-foreground">Display video player controls</p>
              </div>
              <Switch
                id="controls"
                checked={settings.controls ?? false}
                onCheckedChange={(checked) => handleSettingsUpdate({ controls: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="loop" className="text-sm font-medium">
                  Loop video
                </Label>
                <p className="text-xs text-muted-foreground">Automatically replay when finished</p>
              </div>
              <Switch
                id="loop"
                checked={settings.loop ?? false}
                onCheckedChange={(checked) => handleSettingsUpdate({ loop: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="muted" className="text-sm font-medium">
                  Muted
                </Label>
                <p className="text-xs text-muted-foreground">Start video without sound</p>
              </div>
              <Switch
                id="muted"
                checked={settings.muted ?? false}
                onCheckedChange={(checked) => handleSettingsUpdate({ muted: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autoplay" className="text-sm font-medium">
                  Autoplay
                </Label>
                <p className="text-xs text-muted-foreground">
                  Start playing automatically (may require muted)
                </p>
              </div>
              <Switch
                id="autoplay"
                checked={settings.autoPlay ?? false}
                onCheckedChange={(checked) => handleSettingsUpdate({ autoPlay: checked })}
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

