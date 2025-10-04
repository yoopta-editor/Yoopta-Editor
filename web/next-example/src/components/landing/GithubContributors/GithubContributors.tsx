import Image from 'next/image';
import { Contributor } from '../types';

type Props = {
  contributors: Contributor[];
};

export const GithubContributors = ({ contributors }: Props) => {
  if (!contributors) return null;

  return (
    <div className="mt-6 pb-4 flex max-w-screen-md flex-col gap-4 lg:max-w-screen-lg">
      <div>
        <h2 className="text-center font-heading mt-12 scroll-m-20 pb-2 text-2xl font-semibold tracking-tight first:mt-0">
          Contributors
        </h2>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {contributors.map((contributor) => (
          <ContributorItem key={contributor.id} contributor={contributor} />
        ))}
      </div>
    </div>
  );
};

const ContributorItem = ({ contributor }: { contributor: Contributor }) => {
  return (
    <a
      className="[text-underline-position:from-font]"
      href={contributor.html_url}
      target="_blank"
      rel="noopener noreferrer">
      <Image
        src={contributor.avatar_url}
        alt={contributor.login}
        width={64}
        height={64}
        className="size-12 rounded-full md:size-14"
      />
    </a>
  );
};
