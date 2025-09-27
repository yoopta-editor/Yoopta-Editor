import NextLink from 'next/link';

function WithMultiPageEditors() {
  return (
    <div className="md:py-[100px] md:pl-[200px] md:pr-[80px] px-[20px] pt-[80px] pb-[40px] flex justify-center">
      <div className="max-w-[750px]">
        <h1 className="scroll-m-20 text-3xl font-bold tracking-tight">With Multi Page Editors</h1>
        <p className="text-base text-muted-foreground mt-4">
          Sometimes you need to show a list of pages where each page has its own content for the
          editor. In many cases, there is a problem with updating content when you navigate between
          pages. So, this example is just for these cases. Follow the{' '}
          <NextLink
            href="/examples/withMultiPageEditors/page_1"
            className="text-[#007aff] hover:underline transition-all">
            link here
          </NextLink>{' '}
          to see how it works and its source code
        </p>
      </div>
    </div>
  );
}

export default WithMultiPageEditors;
