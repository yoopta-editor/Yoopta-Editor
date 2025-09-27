import { Sponsors } from '@/api/request';
import { PlusIcon } from 'lucide-react';

type Props = {
  sponsors: Sponsors;
};

export const GithubSponsors = ({ sponsors }: Props) => {
  if (!sponsors || !sponsors?.current) return null;

  return (
    <div>
      <h4 className="text-center mt-4 text-lg font-semibold">Sponsors 💖</h4>
      {sponsors?.current && (
        <div className="w-full flex-wrap flex justify-center py-2">
          {sponsors?.current?.map((sponsor) => (
            <a
              key={sponsor.username}
              href={`https://github.com/${sponsor.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-18 h-18 rounded-full shadow-lg m-2">
              <img
                src={sponsor.avatar}
                alt={`${sponsor.username} avatar`}
                className="w-14 h-14 rounded-full"
              />
            </a>
          ))}
        </div>
      )}
      {sponsors?.past && (
        <div className="w-full flex-wrap flex justify-center">
          {sponsors?.past?.map((sponsor) => (
            <a
              key={sponsor.username}
              href={`https://github.com/${sponsor.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-18 h-18 rounded-full shadow-lg m-2">
              <img
                src={sponsor.avatar}
                alt={`${sponsor.username} avatar`}
                className="w-14 h-14 rounded-full"
              />
            </a>
          ))}
        </div>
      )}
      <div className="w-full flex-wrap flex justify-center">
        <a
          href="https://github.com/sponsors/Darginec05"
          target="_blank"
          rel="noopener noreferrer"
          title="Become sponsor"
          className="flex items-center justify-center w-18 h-18 bg-[#181c21] rounded-full shadow-lg m-2">
          <PlusIcon size={30} color="#1f6feb" className="w-14 h-14 rounded-full animate-pulse" />
        </a>
      </div>
    </div>
  );
};
