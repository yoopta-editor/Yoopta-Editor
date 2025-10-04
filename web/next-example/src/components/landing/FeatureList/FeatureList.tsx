import {
  CheckCircleIcon,
  LucideIcon,
  PackageIcon,
  LayoutIcon,
  SmartphoneIcon,
  SettingsIcon,
  PuzzleIcon,
  PlugIcon,
  TerminalIcon,
  FileTextIcon,
  ImportIcon,
  CodeIcon,
  LightbulbIcon,
} from 'lucide-react';

type Feature = {
  title: string;
  description: string;
  icon: LucideIcon;
  // src?: string;
};

const features: Feature[] = [
  {
    title: 'Easy to use',
    description: 'Save your time by using this editor. Focus on other business tasks.',
    icon: CheckCircleIcon,
  },
  {
    title: 'Ready to use out of the box',
    description:
      'The editor is ready to use right after installation. It includes all necessary features for content creation by default.',
    icon: PackageIcon,
  },
  {
    title: 'Block-based',
    description:
      'The block-based editor allows you to create content using multiple blocks, making it more flexible and powerful.',
    icon: LayoutIcon,
  },
  {
    title: 'Mobile-friendly',
    description: 'Good mobile support allows you to edit content anytime and anywhere.',
    icon: SmartphoneIcon,
  },
  {
    title: 'Everything customizable',
    description:
      'Despite having built-in functionality, you can customize the editor for your needs. Want to add your own styles, theme or behaviour? No problem!',
    icon: SettingsIcon,
  },
  {
    title: 'Extendable',
    description: 'Everything in the editor can be extended and enhanced using plugins and API.',
    icon: PuzzleIcon,
  },
  {
    title: 'Powerful plugins',
    description:
      'The editor comes with many built-in plugins to help you create any type of content.',
    icon: PlugIcon,
  },
  {
    title: 'Commands API',
    description: 'Use commands to control the editor externally.',
    icon: TerminalIcon,
  },
  {
    title: 'Large documents',
    description: 'Edit documents of any size without worrying about performance.',
    icon: FileTextIcon,
  },
  {
    title: 'Exports/Imports',
    description:
      'Export and import content in various formats such as HTML, Markdown, Text, and others.',
    icon: ImportIcon,
  },
  {
    title: 'Create your custom plugins',
    description: 'Create your own plugins to extend the editor’s functionality to suit your needs.',
    icon: CodeIcon,
  },
  {
    title: 'Plans',
    description:
      'Yes, our plans for this editor are also a feature. We have ideas to make it exceptional.',
    icon: LightbulbIcon,
  },
];

export const FeatureList = () => {
  return (
    <div className="mt-6 pb-4 flex max-w-full flex-col items-center gap-6 px-0 md:max-w-screen-md xl:max-w-none">
      <div className="flex max-w-full flex-col items-center text-center md:max-w-screen-md">
        <h2 className="text-center font-heading mt-12 scroll-m-20 pb-2 text-2xl font-semibold tracking-tight first:mt-0">
          Why Yoopta-Editor?
        </h2>
        {/* <p className="mt-0 text-center text-muted-foreground md:w-[700px] text-[#dae2ed] mx-auto">asdsadasd</p> */}
      </div>
      <div className="grid max-w-full grid-cols-1 gap-4 md:max-w-screen-md md:grid-cols-2 xl:max-w-none xl:grid-cols-3 xl:p-0">
        {features.map((feature) => (
          <FeatureListItem key={feature.title} feature={feature} />
        ))}
      </div>
    </div>
  );
};

type FeatureListItemProps = {
  feature: Feature;
};

export const FeatureListItem = ({ feature }: FeatureListItemProps) => {
  const Icon = feature.icon;

  return (
    <div className="card relative flex w-[360px] max-w-full flex-col justify-between gap-1 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 dark:bg-black row-span-2">
      <div className="flex flex-col gap-6 p-8">
        <div className="h-fit w-fit rounded-lg p-1">
          <Icon className="rounded-md" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex flex-row items-center justify-between gap-2">
            <span className="text-md font-bold">{feature.title}</span>
          </div>
          <div className="text-sm sm:min-h-[3.75rem]">{feature.description}</div>
        </div>
      </div>
    </div>
  );
};
