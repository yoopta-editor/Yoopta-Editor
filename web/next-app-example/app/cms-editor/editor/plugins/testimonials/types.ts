import type { SlateElement } from '@yoopta/editor';

export type TestimonialsColumns = 1 | 2 | 3;
export type TestimonialsVariant = 'cards' | 'minimal' | 'quote';
export type TestimonialsPaddingY = 'sm' | 'md' | 'lg' | 'xl';

export type TestimonialsProps = {
  columns: TestimonialsColumns;
  variant: TestimonialsVariant;
  paddingY: TestimonialsPaddingY;
  backgroundColor: string;
};

export type TestimonialsHeadingProps = {
  color: string;
};

export type TestimonialsDescriptionProps = {
  color: string;
};

export type TestimonialCardProps = {
  avatar: string;
  rating: number;
  accentColor: string;
};

export type TestimonialQuoteProps = {
  color: string;
};

export type TestimonialAuthorProps = {
  color: string;
};

export type TestimonialRoleProps = {
  color: string;
};

export type TestimonialsElement = SlateElement<'testimonials', TestimonialsProps>;
export type TestimonialsHeadingElement = SlateElement<'testimonials-heading', TestimonialsHeadingProps>;
export type TestimonialsDescriptionElement = SlateElement<'testimonials-description', TestimonialsDescriptionProps>;
export type TestimonialCardElement = SlateElement<'testimonial-card', TestimonialCardProps>;
export type TestimonialQuoteElement = SlateElement<'testimonial-quote', TestimonialQuoteProps>;
export type TestimonialAuthorElement = SlateElement<'testimonial-author', TestimonialAuthorProps>;
export type TestimonialRoleElement = SlateElement<'testimonial-role', TestimonialRoleProps>;

export type TestimonialsElementMap = {
  testimonials: TestimonialsElement;
  'testimonials-heading': TestimonialsHeadingElement;
  'testimonials-description': TestimonialsDescriptionElement;
  'testimonial-card': TestimonialCardElement;
  'testimonial-quote': TestimonialQuoteElement;
  'testimonial-author': TestimonialAuthorElement;
  'testimonial-role': TestimonialRoleElement;
};
