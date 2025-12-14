import Accordion from '@mui/material/Accordion';
import type { PluginElementRenderProps } from '@yoopta/editor';

export const AccordionListItem = (props: PluginElementRenderProps) => {
  const { attributes, children, element } = props;
  const isExpanded = element.props?.isExpanded ?? false;

  return (
    <Accordion
      expanded={isExpanded}
      {...attributes}
      sx={{
        boxShadow: 'none',
        borderBottom: '1px solid',
        borderColor: 'divider',
        '&:before': {
          display: 'none',
        },
        '&:last-child': {
          borderBottom: 'none',
        },
      }}>
      {children}
    </Accordion>
  );
};
