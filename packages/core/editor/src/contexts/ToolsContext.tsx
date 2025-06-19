import { createContext, useContext, useMemo } from 'react';
import { useYooptaReadOnly } from './YooptaContext';

export type ToolProps<RenderProps = any, ToolProps = any> = {
  render: React.ComponentType<RenderProps>;
  tool: React.ComponentType<ToolProps>;
  props?: Record<string, unknown>;
};

export type Tools = {
  ActionMenu: ToolProps;
  Toolbar: ToolProps;
  LinkTool: ToolProps;
  [key: string]: ToolProps;
};

export type ToolsContextType = {
  [key: string]: ToolProps['render'];
};

const ToolsContext = createContext<ToolsContextType | undefined>(undefined);

type Props = {
  tools?: Partial<Tools>;
  children: React.ReactNode;
};

export const ToolsProvider = ({ children, tools }: Props) => {
  const isReadOnly = useYooptaReadOnly();

  const contextValue = useMemo(() => {
    if (!tools) return {};

    return Object.keys(tools).reduce((acc, toolname) => {
      return {
        ...acc,
        [toolname]: tools[toolname]?.render,
      };
    }, {});
  }, [tools]);

  const toolsRender = useMemo(() => {
    if (!tools || isReadOnly) return null;

    return Object.keys(tools).map((toolname) => {
      const Tool = tools?.[toolname]?.tool;
      const render = tools?.[toolname]?.render;
      const props = tools?.[toolname]?.props;
      if (!Tool) return null;
      // @ts-ignore - fixme
      return <Tool key={toolname} render={render} {...props} />;
    });
  }, [tools]);

  return (
    <ToolsContext.Provider value={contextValue}>
      <>
        {toolsRender}
        {children}
      </>
    </ToolsContext.Provider>
  );
};

export const useYooptaTools = (): ToolsContextType => {
  const context = useContext(ToolsContext);
  if (context === undefined) {
    throw new Error('useYooptaTools must be used within a ToolsProvider');
  }

  return context;
};
