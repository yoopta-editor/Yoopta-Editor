import { PlusIcon, ExternalLinkIcon, MailIcon } from 'lucide-react';
import { Head } from '@/components/Head/Head';
import { ProductHuntButton } from '@/components/landing/ProductHuntButton/ProductHuntButton';
import { GithubButton } from '@/components/landing/GithubButton/GithubButton';
import { Header } from '@/components/landing/Header/Header';
import {
  fetchRepoContributors,
  fetchRepoData,
  fetchRepoSponsors,
  request,
  Sponsors,
} from '@/api/request';
import { GithubContributors } from '@/components/landing/GithubContributors/GithubContributors';
import { Contributor, Repository } from '@/components/landing/types';
import { RoadmapList } from '@/components/landing/RoadmapList/RoadmapList';
import { FeatureList } from '@/components/landing/FeatureList/FeatureList';
import { Divider } from '@/components/landing/Divider/Divider';
import { GithubSponsorButton } from '@/components/landing/GithubSponsorButton/GithubSponsorButton';
import { GithubSponsors } from '@/components/landing/GithubSponsors/GithubSponsors';

type Props = {
  repoData: Repository;
  contributors: Contributor[];
  sponsors: Sponsors;
};

export default function Home({ repoData, sponsors, contributors }: Props) {
  return (
    <div
      className="w-full h-auto min-h-[100vh] text-white animate-gradient"
      style={{
        background: 'radial-gradient(circle at 24.1% 68.8%, #1e232d 0%, #050507 99.4%)',
        animation: ' gradient 15s ease infinite',
        backgroundSize: '400% 400%',
      }}>
      <Head />
      <Header />
      <div className="pt-[72px] md:w-[70%] md:mx-auto flex flex-col items-center px-4 md:px-0">
        <a
          href="https://yoopta.dev/examples/withBaseFullSetup"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-18 h-18 bg-white rounded-full shadow-lg m-2">
          <img src="/yoopta/yoopta-logo.png" alt="Yoopta logo" className="w-14 h-14 rounded-full" />
        </a>
        <h1 className="text-center scroll-m-20 text-4xl font-bold tracking-tight">
          Meet Yoopta-Editor 🚀
        </h1>
        <div className="flex items-center mt-2 flex-col md:flex-row">
          {repoData && <GithubButton repo={repoData} />}
          <a
            href="https://www.buymeacoffee.com/darginec05"
            target="_blank"
            className="hover:ring-2 hover:ring-primary hover:ring-offset-2 rounded-md shadow-md transition duration-150 ease-in-out">
            <img
              src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png"
              alt="Buy Me A Coffee"
              style={{
                height: '36px',
                width: '174px',
              }}
            />
          </a>
          <GithubSponsorButton />
        </div>
        <p className="font-space-grotesk text-lg leading-snug md:text-xl mt-6 md:w-[680px] text-[#FFFFFFB2] text-center">
          Open-source rich-text editor that's truly{' '}
          <b>
            <u>rich</u>
          </b>
          . Install and use it in your project. Easy to to use and fully customizable. Just relax,
          I'm here to solve all your challenges with rich-text editors.
        </p>
        <div className="mt-4 flex flex-col md:flex-row justify-center items-center">
          <button
            onClick={() => window.open('/examples/withBaseFullSetup', '_blank')}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-[#1f6feb] text-primary-foreground shadow hover:bg-[#1f6feb]/90 h-9 px-4 py-2">
            Play with demo's <ExternalLinkIcon size={16} className="ml-2" />
          </button>
          <button
            onClick={() => window.open('/examples/withEmailBuilder/email-builder', '_blank')}
            className="mt-2 ml-0 md:mt-0 md:ml-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-[#1f6feb] text-primary-foreground shadow hover:bg-[#1f6feb]/90 h-9 px-4 py-2">
            Check Email-Builder (new) <MailIcon size={16} className="ml-2" />
          </button>
        </div>

        <div className="mt-4 pb-4">
          <video className="w-full h-auto" autoPlay loop muted playsInline controls>
            <source src="/yoopta/Yoopta_Intro.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <Divider />
        <FeatureList />
        <Divider />
        <RoadmapList />
        <Divider />
        <div className="mt-6 pb-4">
          <h2 className="text-center font-heading mt-12 scroll-m-20 pb-2 text-2xl font-semibold tracking-tight first:mt-0">
            Sponsorship 💖
          </h2>
          <p className="mt-0 text-center text-muted-foreground md:w-[700px] text-[#dae2ed] mx-auto">
            Your sponsorship motivates me to continuously improve the project and helps bring our
            ideas to fruition. Please consider supporting me as a sponsor. Thank you in advance 💙
          </p>
          <div className="w-full flex justify-center mt-2">
            <img
              src="/hold-up-let-him-cook.gif"
              height={150}
              width={400}
              loading="lazy"
              className="w-[400px] h-[250px]"
              alt="Bring my ideas to world"
            />
          </div>
          <GithubSponsors sponsors={sponsors} />
        </div>
        <Divider />
        <GithubContributors contributors={contributors} />
        <Divider />
        <footer className="border-t mt-8">
          <div className="mt-2 pb-6">
            <p className="text-center text-muted-foreground">
              Created by{' '}
              <a
                href="https://x.com/lebovskiYoo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1f6feb] underline">
                Darginec05
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  try {
    const options = { owner: 'Darginec05', repo: 'Yoopta-Editor' };

    const [repoData, contributors, sponsors] = await Promise.allSettled([
      fetchRepoData(options),
      fetchRepoContributors(options),
      fetchRepoSponsors(options),
    ]);

    return {
      props: {
        repoData: repoData.value || null,
        contributors: contributors.value || null,
        sponsors: sponsors.value || null,
      },
    };
  } catch (error) {
    console.error('Failed to fetch repo data', error);
    return {
      props: {
        repoData: null,
      },
    };
  }
}
