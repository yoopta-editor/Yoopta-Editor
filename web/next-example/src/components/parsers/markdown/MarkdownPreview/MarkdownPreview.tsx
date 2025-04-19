import YooptaEditor, { createYooptaEditor, YooEditor, YooptaContentValue } from '@yoopta/editor';
import parsers from '@yoopta/exports';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CounterClockwiseClockIcon } from '@radix-ui/react-icons';
import { Separator } from '@/components/ui/separator';
import { useDebounce } from 'use-debounce';
import copy from 'copy-to-clipboard';
import { MARKDOWN_EDITOR_DEFAULT_VALUE } from './defaultEditorValue';
import ActionMenuList, { DefaultActionMenuRender } from '@yoopta/action-menu-list';
import { Tools } from '@yoopta/editor';
import LinkTool, { DefaultLinkToolRender } from '@yoopta/link-tool';
import Toolbar, { DefaultToolbarRender } from '@yoopta/toolbar';
import Paragraph from '@yoopta/paragraph';
import Blockquote from '@yoopta/blockquote';
import Embed from '@yoopta/embed';
import Image from '@yoopta/image';
import Link from '@yoopta/link';
import Callout from '@yoopta/callout';
import Video from '@yoopta/video';
import File from '@yoopta/file';
import Accordion from '@yoopta/accordion';
import { NumberedList, BulletedList, TodoList } from '@yoopta/lists';
import { Bold, Italic, CodeMark, Underline, Strike, Highlight } from '@yoopta/marks';
import { HeadingOne, HeadingThree, HeadingTwo } from '@yoopta/headings';
import Table from '@yoopta/table';
import Code from '@yoopta/code';
import Divider from '@yoopta/divider';
import CodeMirror, { BasicSetupOptions } from '@uiw/react-codemirror';
import { markdown as codemirrorMarkdown } from '@codemirror/lang-markdown';

import { uploadToCloudinary } from '@/utils/cloudinary';
import { useEffect, useMemo, useState } from 'react';

import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { Head } from '@/components/Head/Head';

const LANGUAGES_MAP = {
  markdown: {
    type: 'markdown',
    name: 'Markdown',
    extension: codemirrorMarkdown(),
  },
};

export const TOOLS: Tools = {
  ActionMenu: {
    render: DefaultActionMenuRender,
    tool: ActionMenuList,
  },
  Toolbar: {
    render: DefaultToolbarRender,
    tool: Toolbar,
  },
  LinkTool: {
    render: DefaultLinkToolRender,
    tool: LinkTool,
  },
};

const codeMirrorSetup: BasicSetupOptions = {
  lineNumbers: false,
  autocompletion: false,
  foldGutter: false,
  highlightActiveLineGutter: false,
  highlightActiveLine: false,
  tabSize: 2,
};

const plugins = [
  Paragraph,
  Table,
  Accordion,
  HeadingOne,
  HeadingTwo,
  Divider,
  HeadingThree,
  Blockquote,
  Callout,
  NumberedList,
  BulletedList,
  TodoList,
  Code,
  Link,
  Embed,
  Image.extend({
    options: {
      async onUpload(file) {
        const data = await uploadToCloudinary(file, 'image');

        return {
          src: data.secure_url,
          alt: 'cloudinary',
          sizes: {
            width: data.width,
            height: data.height,
          },
        };
      },
    },
  }),
  Video.extend({
    options: {
      onUpload: async (file) => {
        const data = await uploadToCloudinary(file, 'video');
        return {
          src: data.secure_url,
          alt: 'cloudinary',
          sizes: {
            width: data.width,
            height: data.height,
          },
        };
      },
      onUploadPoster: async (file) => {
        const image = await uploadToCloudinary(file, 'image');
        return image.secure_url;
      },
    },
  }),
  File.extend({
    options: {
      onUpload: async (file) => {
        const response = await uploadToCloudinary(file, 'auto');
        return { src: response.secure_url, format: response.format, name: response.name, size: response.bytes };
      },
    },
  }),
];

const MARKS = [Bold, Italic, CodeMark, Underline, Strike, Highlight];

type ResultHTMLProps = {
  editor: YooEditor;
  value: YooptaContentValue;
};

const ResultMD = ({ editor, value }: ResultHTMLProps) => {
  const [debounceValue] = useDebounce(value, 1000);
  const [markdown, setMarkdown] = useState<string>('');

  useEffect(() => {
    const mdString = editor.getMarkdown(debounceValue);
    // or
    // const mdString = parsers.markdown.serialize(editor, debounceValue);
    setMarkdown(mdString);
  }, [debounceValue]);

  const onChange = (value: string) => {
    setMarkdown(value);
  };

  return (
    <div className="h-full bg-muted">
      {/* @ts-ignore */}
      <CodeMirror
        value={markdown}
        height="100%"
        extensions={[LANGUAGES_MAP.markdown.extension]}
        onChange={onChange}
        width="720"
        theme={vscodeDark}
        className="yoopta-code-cm-editor w-full h-full bg-muted"
        // readOnly
        basicSetup={codeMirrorSetup}
        style={{ caretColor: 'red', tabSize: 2 }}
      />
    </div>
  );
};

type EditorProps = {
  editor: YooEditor;
  value: YooptaContentValue;
  onChange: (v: YooptaContentValue) => void;
};

const Editor = ({ editor, onChange, value }: EditorProps) => {
  const handleChange = (value: YooptaContentValue) => {
    onChange(value);
  };

  return (
    <YooptaEditor
      id="markdown"
      style={{
        width: '100%',
        paddingBottom: 0,
      }}
      className="h-full min-h-[300px] lg:min-h-[700px] xl:min-h-[700px] rounded-md border border-input bg-transparent text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring px-[3.5rem] py-[1.5rem]"
      placeholder="Start building your markdown..."
      editor={editor}
      plugins={plugins}
      marks={MARKS}
      selectionBoxRoot={false}
      tools={TOOLS}
      value={value}
      onChange={handleChange}
    />
  );
};

const MarkdownPreview = () => {
  const editor: YooEditor = useMemo(() => createYooptaEditor(), []);
  const [value, setValue] = useState<YooptaContentValue>({});

  const onChange = (data: YooptaContentValue) => {
    setValue(data);
  };

  useEffect(() => {
    editor.withoutSavingHistory(() => {
      editor.setEditorValue(MARKDOWN_EDITOR_DEFAULT_VALUE);
      editor.focus();
    });
  }, []);

  const onCopy = () => {
    const mdString = editor.getMarkdown(value);

    copy(mdString);
    console.log(mdString);
    window.alert('Markdown content copied to clipboard or logged to console');
  };

  return (
    <div className="container relative py-8">
      <Head title="Markdown Playground" description="Deserialize/serialize your content from/to markdown" />
      <section>
        <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow">
          <div className="hidden h-full flex-col md:flex">
            <div className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
              <h2 className="text-lg font-semibold text-nowrap">Markdown playground</h2>
              <div className="ml-auto flex w-full space-x-2 sm:justify-end"></div>
            </div>
            <Separator />
            <Tabs defaultValue="editor/deserialized" className="flex-1">
              <div className="container h-full py-6">
                {/* <div className="grid h-full items-stretch gap-6 md:grid-cols-[1fr_200px]"> */}
                <div className="grid h-full items-stretch gap-6">
                  <div className="hidden flex-col space-y-4 sm:flex md:order-2"></div>
                  <div className="md:order-1">
                    <TabsContent value="editor" className="mt-0 border-0 p-0">
                      <div className="flex h-full flex-col space-y-4">
                        <Editor editor={editor} value={value} onChange={onChange} />

                        <div className="flex items-center space-x-2">
                          <Button onClick={onCopy}>Get markdown content</Button>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="editor/deserialized" className="mt-0 border-0 p-0">
                      <div className="flex flex-col space-y-4">
                        <div className="grid h-full grid-rows-2 gap-6 lg:grid-cols-2 lg:grid-rows-1">
                          <Editor editor={editor} value={value} onChange={onChange} />
                          <div className="rounded-md border">
                            <ResultMD value={value} editor={editor} />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button onClick={onCopy}>Get markdown content</Button>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="deserialized" className="mt-0 border-0 p-0">
                      <div className="flex flex-col space-y-4">
                        <div className="grid h-full gap-6 lg:grid-cols-2">
                          <div className="flex flex-col space-y-4">
                            <div className="flex flex-1 flex-col space-y-2">
                              <Label htmlFor="input">Input</Label>
                              <Editor editor={editor} value={value} onChange={onChange} />
                            </div>
                          </div>
                          <div className="mt-[21px] min-h-[400px] rounded-md border bg-muted lg:min-h-[700px]" />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button onClick={onCopy}>Get markdown</Button>
                          <Button variant="secondary">
                            {/* @ts-ignore */}
                            <CounterClockwiseClockIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </div>
                </div>
              </div>
            </Tabs>
          </div>
        </div>
      </section>
    </div>
  );
};

export { MarkdownPreview };
