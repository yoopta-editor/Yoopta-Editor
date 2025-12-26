import { useEffect, useState } from 'react';
import type { PluginElementRenderProps } from '@yoopta/editor';

import type { CarouselApi } from '../../ui/carousel';
import { Carousel, CarouselContent, CarouselNext, CarouselPrevious } from '../../ui/carousel';

export const CarouselContainer = (props: PluginElementRenderProps) => {
  const { attributes, children } = props;
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="flex w-full justify-center data-[align=center]:items-center data-[align=end]:items-end data-[align=start]:items-start">
      <div className="mx-auto max-w-xs">
        <Carousel
          {...attributes}
          setApi={setApi}
          opts={{ align: 'start', axis: 'x', loop: true }}
          orientation="horizontal"
          className="w-full max-w-sm">
          <CarouselContent>{children}</CarouselContent>
          <CarouselPrevious contentEditable={false} className="select-none" />
          <CarouselNext contentEditable={false} className="select-none" />
        </Carousel>
        <div
          contentEditable={false}
          className="select-none text-muted-foreground py-2 text-center text-sm">
          Slide {current} of {count}
        </div>
      </div>
    </div>
  );
};
