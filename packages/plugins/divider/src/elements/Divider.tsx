import { PluginElementRenderProps, useBlockData, useYooptaEditor } from '@yoopta/editor';
import { DividerBlockOptions } from '../components/DividerBlockOptions';

const DividerRender = ({ extendRender, ...props }: PluginElementRenderProps) => {
  const { className = '', ...htmlAttrs } = props.HTMLAttributes || {};
  const editor = useYooptaEditor();
  const blockData = useBlockData(props.blockId);

  if (extendRender) return extendRender(props);

  const color = props.element.props?.color || '#e5e7eb';
  const theme = props.element.props?.theme || 'solid';

  const getDividerContent = () => {
    switch (theme) {
      case 'dashed':
        return <hr className="yoopta-divider-dashed" style={{ borderColor: color }} />;
      case 'dotted':
        return (
          <div className="yoopta-divider-dotted">
            <div style={{ backgroundColor: color }} />
            <div style={{ backgroundColor: color }} />
            <div style={{ backgroundColor: color }} />
          </div>
        );
      case 'gradient':
        return (
          <div
            className="yoopta-divider-gradient"
            style={{ background: `linear-gradient(to right, transparent, ${color}, transparent)` }}
          />
        );
      default:
        return <hr className="yoopta-divider-solid" style={{ borderColor: color }} />;
    }
  };

  const onClick = (event: React.MouseEvent) => {
    editor.setPath({ current: blockData.meta.order, selected: [blockData.meta.order] });
  };

  return (
    <div
      onClick={onClick}
      {...htmlAttrs}
      className={`${className} yoopta-divider`}
      {...props.attributes}
      contentEditable={false}>
      {!editor.readOnly && (
        <DividerBlockOptions block={blockData} editor={editor} props={props.element.props} />
      )}
      {getDividerContent()}
      {props.children}
    </div>
  );
};

export { DividerRender };
