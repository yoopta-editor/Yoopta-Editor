export type YooptaMark<TProps> = {
  type: string;
  hotkey?: string;
  render: (props: TProps) => JSX.Element;
};

export type YooptaMarkParams<TProps> = {
  type: string;
  hotkey?: string;
  render: (props: TProps) => JSX.Element;
};

export function createYooptaMark<TProps>({
  type,
  hotkey,
  render,
}: YooptaMarkParams<TProps>): YooptaMark<TProps> {
  return {
    type,
    hotkey,
    render,
  };
}
