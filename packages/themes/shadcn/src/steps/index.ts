import { StepContainer } from './elements/steps-container';
import { StepList } from './elements/steps-list';
import { StepListItem } from './elements/steps-list-item';
import { StepListItemContent } from './elements/steps-list-item-content';
import { StepListItemHeading } from './elements/steps-list-item-heading';

export const StepsUI = {
  'step-container': {
    render: StepContainer,
  },
  'step-list': {
    render: StepList,
  },
  'step-list-item': {
    render: StepListItem,
  },
  'step-list-item-heading': {
    render: StepListItemHeading,
  },
  'step-list-item-content': {
    render: StepListItemContent,
  },
};
