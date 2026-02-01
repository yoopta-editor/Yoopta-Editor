import type { PluginElementRenderProps } from '@yoopta/editor';

import { Card, CardContent } from '../../ui/card';
import { CarouselItem } from '../../ui/carousel';

export const CarouselListItem = (props: PluginElementRenderProps) => {
  const { children } = props;

  return (
    <CarouselItem className="md:basis-1/2 lg:basis-1/3">
      <div className="p-1">
        <Card>
          <CardContent className="flex aspect-square items-center justify-center p-6">
            {children}
          </CardContent>
        </Card>
      </div>
    </CarouselItem>
  );
};
