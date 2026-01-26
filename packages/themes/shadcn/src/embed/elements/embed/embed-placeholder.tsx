import { useState } from 'react';
import type { PluginElementRenderProps } from '@yoopta/editor';
import { detectProvider, getSupportedProviders, isEmbedUrl } from '@yoopta/embed';
import { Code, LinkIcon, Map, Music, Play } from 'lucide-react';

import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { cn } from '../../../utils';

type EmbedPlaceholderProps = {
  onInsertUrl: (url: string) => void;
  className?: string;
  attributes: PluginElementRenderProps['attributes'];
  children: React.ReactNode;
};

// Get provider category icon
const getProviderIcon = (type: string) => {
  switch (type) {
    case 'youtube':
    case 'vimeo':
    case 'dailymotion':
    case 'wistia':
    case 'loom':
      return <Play className="h-3 w-3" />;
    case 'spotify':
    case 'soundcloud':
      return <Music className="h-3 w-3" />;
    case 'codepen':
    case 'codesandbox':
      return <Code className="h-3 w-3" />;
    case 'google-maps':
      return <Map className="h-3 w-3" />;
    default:
      return <LinkIcon className="h-3 w-3" />;
  }
};

// Provider badge
const ProviderBadge = ({ name, type }: { name: string; type: string }) => (
  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground">
    {getProviderIcon(type)}
    {name}
  </span>
);

// Link Form Component
type EmbedLinkFormProps = {
  onInsertUrl: (url: string) => void;
};

const EmbedLinkForm = ({ onInsertUrl }: EmbedLinkFormProps) => {
  const [urlInput, setUrlInput] = useState('');
  const [isValidProvider, setIsValidProvider] = useState(false);
  const [providerName, setProviderName] = useState<string | null>(null);

  const handleUrlChange = (value: string) => {
    setUrlInput(value);
    if (value.trim()) {
      const isValid = isEmbedUrl(value.trim());
      setIsValidProvider(isValid);
      if (isValid) {
        const providerType = detectProvider(value.trim());
        const providers = getSupportedProviders();
        const provider = providers.find((p) => p.type === providerType);
        setProviderName(provider?.name ?? null);
      } else {
        setProviderName(null);
      }
    } else {
      setIsValidProvider(false);
      setProviderName(null);
    }
  };

  const handleSubmit = () => {
    if (urlInput.trim()) {
      onInsertUrl(urlInput.trim());
      setUrlInput('');
      setIsValidProvider(false);
      setProviderName(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Input
          placeholder="Paste a URL to embed (YouTube, Vimeo, Twitter, Spotify, etc.)"
          value={urlInput}
          onChange={(e) => handleUrlChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && urlInput.trim() && isValidProvider) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          className="h-10"
        />
        {urlInput.trim() && (
          <div className="text-xs text-muted-foreground">
            {isValidProvider ? (
              <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                {getProviderIcon(detectProvider(urlInput.trim()))}
                {providerName} detected
              </span>
            ) : (
              <span className="text-destructive">
                Unsupported URL. Try YouTube, Vimeo, Twitter, Spotify, Figma, CodePen, etc.
              </span>
            )}
          </div>
        )}
      </div>
      <Button className="w-full" onClick={handleSubmit} disabled={!urlInput.trim() || !isValidProvider}>
        {isValidProvider ? `Embed ${providerName}` : 'Embed content'}
      </Button>
    </div>
  );
};

// Supported Providers Display
const SupportedProviders = () => {
  const providers = getSupportedProviders().filter((p) => p.type !== 'unknown');

  return (
    <div className="mt-4 space-y-2">
      <p className="text-xs text-muted-foreground text-center">Supported providers:</p>
      <div className="flex flex-wrap gap-1.5 justify-center">
        {providers.slice(0, 8).map((provider) => (
          <ProviderBadge key={provider.type} name={provider.name} type={provider.type} />
        ))}
        {providers.length > 8 && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground">
            +{providers.length - 8} more
          </span>
        )}
      </div>
    </div>
  );
};

// Main Component
export const EmbedPlaceholder = ({
  onInsertUrl,
  className,
  attributes,
  children,
}: EmbedPlaceholderProps) => (
  <div
    className={cn('mt-2 relative rounded-lg border bg-background overflow-hidden', className)}
    {...attributes}
    contentEditable={false}
  >
    <div className="p-6">
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-lg bg-muted p-3">
          <LinkIcon className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium">Embed content</p>
          <p className="text-xs text-muted-foreground">Paste a URL from supported platforms</p>
        </div>
      </div>

      <div className="mt-6 max-w-md mx-auto">
        <EmbedLinkForm onInsertUrl={onInsertUrl} />
      </div>

      <SupportedProviders />
    </div>
    {children}
  </div>
);

