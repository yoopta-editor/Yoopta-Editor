import { useEffect, useMemo, useState } from 'react';
import { html as codemirrorHTML } from '@codemirror/lang-html';
import { CounterClockwiseClockIcon } from '@radix-ui/react-icons';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import type { BasicSetupOptions } from '@uiw/react-codemirror';
import CodeMirror from '@uiw/react-codemirror';
import type { YooEditor, YooptaContentValue } from '@yoopta/editor';
import YooptaEditor, { createYooptaEditor } from '@yoopta/editor';
import parsers from '@yoopta/exports';
import copy from 'copy-to-clipboard';
import jsBeatify from 'js-beautify';
import { useDebounce } from 'use-debounce';

import { HTML_EDITOR_DEFAULT_VALUE } from './defaultEditorValue';
import { MARKS } from '../../../../utils/yoopta/marks';
import { YOOPTA_PLUGINS } from '../../../../utils/yoopta/plugins';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import { Separator } from '@/components/ui/separator';
import { TOOLS } from '@/utils/yoopta/tools';

import { ExportSelector } from '../../ExportSelector/ExportSelector';

const LANGUAGES_MAP = {
  html: {
    type: 'html',
    name: 'HTML',
    extension: codemirrorHTML(),
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

type ResultHTMLProps = {
  editor: YooEditor;
  value: YooptaContentValue;
};

const ResultHTML = ({ editor, value }: ResultHTMLProps) => {
  const [debounceValue] = useDebounce(value, 1000);
  const [html, setHTML] = useState<string>('');

  useEffect(() => {
    const htmlString = parsers.html.serialize(editor, debounceValue);
    const beautifiedHTML = jsBeatify.html_beautify(htmlString, {
      indent_with_tabs: false,
      indent_size: 2,
    });

    setHTML(beautifiedHTML);
  }, [debounceValue]);

  const onChange = (value: string) => {
    setHTML(value);
  };

  return (
    <div className="h-full bg-muted">
      {/* @ts-ignore */}
      <CodeMirror
        value={html}
        height="100%"
        extensions={[LANGUAGES_MAP.html.extension]}
        onChange={onChange}
        width="720"
        theme={vscodeDark}
        readOnly
        className="yoopta-code-cm-editor w-full h-full bg-muted"
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
      id="html"
      style={{
        width: '100%',
        paddingBottom: 0,
      }}
      className="h-full min-h-[300px] lg:min-h-[700px] xl:min-h-[700px] rounded-md border border-input bg-transparent text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring px-[3.5rem] py-[1.5rem]"
      placeholder="Start building your html..."
      editor={editor}
      plugins={YOOPTA_PLUGINS}
      marks={MARKS}
      selectionBoxElement={false}
      tools={TOOLS}
      value={value}
      onChange={handleChange}
    />
  );
};

const HtmlPreview = () => {
  const editor: YooEditor = useMemo(() => createYooptaEditor(), []);
  const [value, setValue] = useState<YooptaContentValue>(HTML_EDITOR_DEFAULT_VALUE);

  const onChange = (data: YooptaContentValue) => {
    setValue(data);
  };

  const onCopy = () => {
    const htmlString = editor.getHTML(value);
    const beautifiedHTML = jsBeatify.html_beautify(htmlString, {
      indent_with_tabs: false,
      indent_size: 2,
    });

    copy(beautifiedHTML);
    console.log(beautifiedHTML);
    window.alert('HTML content copied to clipboard or logged to console');
  };

  return (
    <div className="container relative py-8">
      <section>
        <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow">
          <div className="hidden h-full flex-col md:flex">
            <div className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
              <h2 className="text-lg font-semibold text-nowrap">HTML playground</h2>
              <div className="ml-auto flex w-full space-x-2 sm:justify-end">
                <ExportSelector presets={[{ id: 'kke', name: 'name' }]} />
              </div>
            </div>
            <Separator />
            <Tabs defaultValue="editor/deserialized" className="flex-1">
              <div className="container h-full py-6">
                {/* <div className="grid h-full items-stretch gap-6 md:grid-cols-[1fr_200px]"> */}
                <div className="grid h-full items-stretch gap-6">
                  <div className="hidden flex-col space-y-4 sm:flex md:order-2" />
                  <div className="md:order-1">
                    <TabsContent value="editor" className="mt-0 border-0 p-0">
                      <div className="flex h-full flex-col space-y-4">
                        <Editor editor={editor} value={value} onChange={onChange} />

                        <div className="flex items-center space-x-2">
                          <Button onClick={onCopy}>Get html content</Button>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="editor/deserialized" className="mt-0 border-0 p-0">
                      <div className="flex flex-col space-y-4">
                        <div className="grid h-full grid-rows-2 gap-6 lg:grid-cols-2 lg:grid-rows-1">
                          <Editor editor={editor} value={value} onChange={onChange} />
                          <div className="rounded-md border">
                            <ResultHTML value={value} editor={editor} />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button onClick={onCopy}>Get html content</Button>
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
                          <Button onClick={onCopy}>Get html</Button>
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

export { HtmlPreview };
