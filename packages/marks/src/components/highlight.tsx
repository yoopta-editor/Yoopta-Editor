import type { YooptaMarkProps } from '@yoopta/editor';
import { createYooptaMark } from '@yoopta/editor';

export type LeafColorProps = {
  color: string;
  backgroundColor: string;
  backgroundImage?: string;
  backgroundClip?: string;
  webkitTextFillColor?: string;
};

export const Highlight = createYooptaMark<YooptaMarkProps<'highlight', LeafColorProps>>({
  type: 'highlight',
  render: (props) => {
    const highlight = props.leaf?.highlight;

    const style = {
      color: highlight?.color,
      backgroundColor: highlight?.backgroundColor,
      backgroundImage: highlight?.backgroundImage,
      WebkitTextFillColor: highlight?.webkitTextFillColor,
      backgroundClip: highlight?.backgroundClip,
    };

    return (
      <span style={style} className="yoopta-mark-highlight">
        {props.children}
      </span>
    );
  },
});
