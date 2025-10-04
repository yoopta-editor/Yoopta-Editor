import { Head } from '@/components/Head/Head';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import PAGES_DATA from '../../../components/examples/withMultiPageEditors/db.json';
import { EveryPageContent } from '@/components/examples/withMultiPageEditors/EveryPageContent';
import { CheckSourceCode } from '@/components/CheckSourceCode/CheckSourceCode';

const Sheet = dynamic(() => import('@/components/ui/sheet').then((mod) => mod.Sheet), {
  ssr: false,
});

const DynamicPageComponent = () => {
  const router = useRouter();

  const pages = Object.keys(PAGES_DATA).map((pageId) => {
    return {
      title: PAGES_DATA[pageId].title,
      id: pageId,
      href: `/examples/withMultiPageEditors/${pageId}`,
    };
  });

  return (
    <div>
      <Head />
      <EveryPageContent pageId={router.query.page} />
      <CheckSourceCode directLink="https://github.com/Darginec05/Yoopta-Editor/blob/master/web/next-example/src/pages/examples/withMultiPageEditors/[page].tsx" />
      <Sheet title="List of pages" description={<></>} items={pages} path={router.asPath} />
    </div>
  );
};

export default DynamicPageComponent;
