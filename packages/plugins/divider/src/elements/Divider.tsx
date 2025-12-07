import type { PluginElementRenderProps } from '@yoopta/editor';

const DividerRender = (props: PluginElementRenderProps) => {
  const color = props.element.props?.color || '#e5e7eb';
  const theme = props.element.props?.theme || 'solid';

  const getDividerContent = () => {
    switch (theme) {
      case 'dashed':
        return <hr style={{ borderColor: color }} />;
      case 'dotted':
        return (
          <div>
            <div style={{ backgroundColor: color }} />
            <div style={{ backgroundColor: color }} />
            <div style={{ backgroundColor: color }} />
          </div>
        );
      case 'gradient':
        return (
          <div
            style={{ background: `linear-gradient(to right, transparent, ${color}, transparent)` }}
          />
        );
      default:
        return <hr style={{ borderColor: color }} />;
    }
  };

  return (
    <div {...props.attributes} contentEditable={false}>
      {getDividerContent()}
      {props.children}
    </div>
  );
};

export { DividerRender };
