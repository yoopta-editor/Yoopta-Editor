import { CodeGroupContainer } from './elements/code-group-container';
import { CodeGroupContent } from './elements/code-group-content';
import { CodeGroupItemHeading } from './elements/code-group-item-heading';
import { CodeGroupList } from './elements/code-group-list';
import './styles.css';

export const CodeGroupUI = {
  'code-group-container': {
    render: CodeGroupContainer,
  },
  'code-group-list': {
    render: CodeGroupList,
  },
  'code-group-item-heading': {
    render: CodeGroupItemHeading,
  },
  'code-group-content': {
    render: CodeGroupContent,
  },
};
