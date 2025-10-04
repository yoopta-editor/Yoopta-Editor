import type { RenderElementProps } from 'slate-react';

import { DailyMotion } from '../providers/DailyMotion';
import { Figma } from '../providers/Figma';
import Instagram from '../providers/Instagram';
import { Loom } from '../providers/Loom';
import Twitter from '../providers/Twitter';
import { Vimeo } from '../providers/Vimeo';
import { Wistia } from '../providers/Wistia';
import { YouTube } from '../providers/Youtube';
import type { EmbedElementProps } from '../types';

type EmbedComponentProps = Omit<EmbedElementProps, 'sizes'> & {
  width: number | 'auto';
  height: number | 'auto';
  blockId: string;
} & Pick<RenderElementProps, 'attributes' | 'children'>;

const PROVIDERS = {
  vimeo: Vimeo,
  youtube: YouTube,
  dailymotion: DailyMotion,
  figma: Figma,
  twitter: Twitter,
  instagram: Instagram,
  loom: Loom,
  wistia: Wistia,
};

const EmbedComponent = ({
  width,
  height,
  provider,
  blockId,
  attributes,
  children,
}: EmbedComponentProps) => {
  if (!provider) return null;

  if (provider && provider.id && provider.type && PROVIDERS[provider.type]) {
    const Provider = PROVIDERS[provider.type];

    return (
      <Provider
        provider={provider}
        width={width}
        height={height}
        blockId={blockId}
        attributes={attributes}>
        {children}
      </Provider>
    );
  }

  return (
    <div className="yoo-embed-w-full" {...attributes}>
      <iframe
        src={provider.url}
        width="100%"
        height="100%"
        frameBorder={0}
        allowFullScreen
        className="yoo-embed-absolute yoo-embed-top-0 yoo-embed-left-0"
      />
      {children}
    </div>
  );
};

export { EmbedComponent, EmbedComponentProps };
