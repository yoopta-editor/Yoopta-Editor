import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { AccordionListItemProps } from '@yoopta/accordion';
import { PluginElementRenderProps } from '@yoopta/editor';

// https://ui.shadcn.com/docs/components/typography
export function AccordionList(props: PluginElementRenderProps) {
  return (
    <Accordion type="multiple" {...props.attributes}>
      {props.children}
    </Accordion>
  );
}

export function AccordionListItem(props: PluginElementRenderProps) {
  const { isExpanded } = props.element.props as AccordionListItemProps;

  return (
    <AccordionItem value={props.element.id} {...props.attributes}>
      {props.children}
    </AccordionItem>
  );
}

export function AccordionListItemHeading(props: PluginElementRenderProps) {
  return <AccordionTrigger {...props.attributes}>{props.children}</AccordionTrigger>;
}

export function AccordionListItemContent(props: PluginElementRenderProps) {
  return <AccordionContent {...props.attributes}>{props.children}</AccordionContent>;
}
