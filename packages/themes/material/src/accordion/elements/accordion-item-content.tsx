import AccordionDetails from '@mui/material/AccordionDetails';
import type { PluginElementRenderProps } from '@yoopta/editor';

export const AccordionItemContent = (props: PluginElementRenderProps) => {
  const { attributes, children } = props;

  return (
    <AccordionDetails
      {...attributes}
      sx={{
        padding: 2,
        color: 'text.secondary',
      }}>
      {children}
    </AccordionDetails>
  );
};
