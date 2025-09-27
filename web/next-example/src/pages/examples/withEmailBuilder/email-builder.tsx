import dynamic from 'next/dynamic';

const EmailBuilderExample = dynamic(
  () =>
    import('@/components/EmailBuilderExample/EmailBuilderExample').then(
      (mod) => mod.EmailBuilderExample,
    ),
  { ssr: false },
);

const EmailBuilderPage = () => {
  return <EmailBuilderExample />;
};

export default EmailBuilderPage;
