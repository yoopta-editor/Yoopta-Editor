import type { CSSProperties, ReactNode } from 'react';
import type { SlateElement, YooEditor } from '@yoopta/editor';

// Shared positioning types
export type Side = 'top' | 'right' | 'bottom' | 'left';
export type Align = 'start' | 'center' | 'end';

// Context types
export type ElementOptionsContextValue = {
  blockId: string;
  element: SlateElement;
  editor: YooEditor;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

// Component props
export type ElementOptionsRootProps = {
  blockId: string;
  element: SlateElement;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export type ElementOptionsTriggerProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export type ElementOptionsContentProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  side?: Side;
  align?: Align;
  sideOffset?: number;
  alignOffset?: number;
};

export type ElementOptionsGroupProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export type ElementOptionsLabelProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export type ElementOptionsSeparatorProps = {
  className?: string;
  style?: CSSProperties;
};

// Select component types
export type SelectOption<T = string> = {
  value: T;
  label: string;
  icon?: ReactNode;
  color?: string;
};

export type ElementOptionsSelectProps<T = string> = {
  value: T;
  options: SelectOption<T>[];
  onValueChange: (value: T) => void;
  placeholder?: string;
  className?: string;
  style?: CSSProperties;
  renderOption?: (option: SelectOption<T>) => ReactNode;
  renderValue?: (option: SelectOption<T> | undefined) => ReactNode;
};

// Color picker types
export type ElementOptionsColorPickerProps = {
  value: string;
  onChange: (color: string) => void;
  presetColors?: string[];
  className?: string;
  style?: CSSProperties;
};

// Toggle types
export type ElementOptionsToggleProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  className?: string;
  style?: CSSProperties;
};

// Slider types
export type ElementOptionsSliderProps = {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  style?: CSSProperties;
};

// Input types
export type ElementOptionsInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'number' | 'url';
  className?: string;
  style?: CSSProperties;
};
