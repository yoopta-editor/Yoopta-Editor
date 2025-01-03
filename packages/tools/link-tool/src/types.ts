import { YooEditor } from '@yoopta/editor';

export type Link = {
  url: string;
  title: string;
  rel?: string;
  target?: string;
};

export type LinkToolTranslationProps = {
  /** The label displayed above the input field for the link title */
  titleLabel?: string;

  /** Placeholder text for the title input field */
  titlePlaceholder?: string;

  /** The label displayed above the input field for the link URL */
  linkLabel?: string;

  /** Placeholder text for the link URL input field */
  linkPlaceholder?: string;

  /** Label for additional properties section (e.g., rel and target attributes) */
  additionalPropsLabel?: string;

  /** Label for the target attribute (i.e., to specify where to open the link) */
  targetLabel?: string;

  /** Placeholder text for the target attribute input */
  targetPlaceholder?: string;

  /** Label for the rel attribute (defines the relationship between the current page and the linked resource) */
  relLabel?: string;

  /** Placeholder text for the rel attribute input */
  relPlaceholder?: string;

  /** Label for the button that updates an existing link */
  updateLabel?: string;

  /** Label for the button that adds a new link */
  addLabel?: string;

  /** Label for the button that deletes the link */
  deleteLabel?: string;
}

export type LinkToolRenderProps = {
  editor: YooEditor;
  link: Link;
  withLink?: boolean;
  withTitle?: boolean;
  withAdditionalProps?: boolean;
  onSave: (link: Link) => void;
  onDelete: () => void;
  labels?: LinkToolTranslationProps;
};
