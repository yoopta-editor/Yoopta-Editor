import { ChangeEvent, useEffect, useState } from 'react';
import {LinkToolRenderProps, LinkToolTranslationProps} from '../types';
import ChevronUp from '../icons/chevronup.svg';
import { useYooptaEditor } from '@yoopta/editor';

const DefaultLinkToolRender = (props: LinkToolRenderProps) => {
  const { withLink = true, withTitle = true, withAdditionalProps = true, labels } = props;
  const mergedLabels: LinkToolTranslationProps = {
    titleLabel: 'Link Title',
    titlePlaceholder: 'Edit link title',
    linkLabel: 'Link URL',
    linkPlaceholder: 'Edit link URL',
    additionalPropsLabel:'Additional props',
    targetLabel: 'Link target',
    targetPlaceholder: 'Edit link target',
    relLabel: 'Link rel',
    relPlaceholder: 'Edit link rel',
    updateLabel: 'Update',
    addLabel: 'Add',
    deleteLabel: 'Delete link',
    ...labels
  }
  const editor = useYooptaEditor();
  const defaultLinkProps = editor.plugins?.LinkPlugin?.elements?.link?.props;

  const [link, setLink] = useState(props?.link || defaultLinkProps);
  const [isAdditionalPropsOpen, setAdditionPropsOpen] = useState(false);

  const onChange = (e: ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    setLink((p) => ({ ...p, [target.name]: target.value }));
  };

  useEffect(() => {
    const hasUrl = !!props.link.url;
    if (hasUrl) setLink(props.link);
    if (!hasUrl && defaultLinkProps) {
      setLink({
        ...props.link,
        rel: defaultLinkProps.rel || props.link.rel || '',
        target: defaultLinkProps.target || props.link.target || '_self',
      });
    }
  }, [props.link]);

  const onSave = () => {
    if (!link.url) return;
    props.onSave(link);
  };

  const onDelete = () => {
    props.onDelete();
  };

  return (
    <div className="yoopta-link-tool yoo-link-tool-shadow-y-[4px]">
      {withTitle && (
        <div>
          <label htmlFor="title" className="yoopta-link-tool-label">
            {mergedLabels.titleLabel}
          </label>
          <input
            id="title"
            type="text"
            className="yoopta-link-tool-input"
            name="title"
            value={link.title || ''}
            onChange={onChange}
            placeholder={mergedLabels.titlePlaceholder}
            autoComplete="off"
          />
        </div>
      )}
      {withLink && (
        <div className={withTitle ? 'yoo-link-tool-mt-2' : ''}>
          <label htmlFor="url" className="yoopta-link-tool-label">
            {mergedLabels.linkLabel}
          </label>
          <input
            id="url"
            type="text"
            className="yoopta-link-tool-input"
            name="url"
            value={link.url || ''}
            onChange={onChange}
            placeholder={mergedLabels.linkPlaceholder}
            autoComplete="off"
          />
        </div>
      )}
      {withAdditionalProps && (
          <button
              type="button"
              className="yoopta-button yoopta-link-tool-label !yoo-link-tool-font-[500] yoo-link-tool-mt-2 !yoo-link-tool-mb-0 !yoo-link-tool-flex yoo-link-tool-justify-between yoo-link-tool-items-center yoo-link-tool-w-full"
              onClick={() => setAdditionPropsOpen((p) => !p)}
          >
            {mergedLabels.additionalPropsLabel}
            <ChevronUp style={{transform: isAdditionalPropsOpen ? `rotate(180deg)` : `rotate(0deg)`}}/>
          </button>
      )}

      {isAdditionalPropsOpen && (
          <>
            <div className="yoo-link-tool-mt-2">
              <label htmlFor="target" className="yoopta-link-tool-label">
                {mergedLabels.targetLabel}
              </label>
              <input
                  id="target"
                  type="text"
                  className="yoopta-link-tool-input"
                  name="target"
                  value={link.target}
                  onChange={onChange}
                  placeholder={mergedLabels.targetPlaceholder}
              autoComplete="off"
            />
          </div>
          <div className="yoo-link-tool-mt-2">
            <label htmlFor="rel" className="yoopta-link-tool-label">
              {mergedLabels.relLabel}
            </label>
            <input
              id="rel"
              type="text"
              className="yoopta-link-tool-input"
              name="rel"
              value={link.rel}
              onChange={onChange}
              placeholder={mergedLabels.relPlaceholder}
              autoComplete="off"
            />
          </div>
        </>
      )}
      <div className="yoo-link-tool-mt-2 yoo-link-tool-flex yoo-link-tool-justify-between">
        <button
          type="button"
          className="yoopta-button yoo-link-tool-bg-[#1183ff] yoo-link-tool-text-[#fff] yoo-link-tool-text-sm yoo-link-tool-font-medium yoo-link-tool-py-[5px] yoo-link-tool-px-[10px] yoo-link-tool-rounded-md yoo-link-tool-shadow-sm disabled:yoo-link-tool-opacity-50"
          disabled={!link.url}
          onClick={onSave}
        >
          {props.link.url ? mergedLabels.updateLabel : mergedLabels.addLabel}
        </button>
        <button
          type="button"
          className="yoopta-button yoo-link-tool-ml-2 yoo-link-tool-bg-[#f4f4f5] yoo-link-tool-text-[#000] yoo-link-tool-text-sm yoo-link-tool-font-medium yoo-link-tool-py-[5px] yoo-link-tool-px-[10px] yoo-link-tool-rounded-md yoo-link-tool-shadow-sm disabled:yoo-link-tool-opacity-50"
          onClick={onDelete}
        >
          {mergedLabels.deleteLabel}
        </button>
      </div>
    </div>
  );
};

export { DefaultLinkToolRender };
