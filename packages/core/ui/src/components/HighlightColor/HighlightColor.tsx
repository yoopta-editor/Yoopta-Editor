import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { PaletteIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useDebouncedCallback } from 'use-debounce';
import { Portal } from '../Portal/Portal';

import './highlight-color.css';

export interface HighlightColorProps {
  className?: string;
  style?: React.CSSProperties;
  editor?: any; // YooEditor type
  highlightColors?: React.CSSProperties;
  onClose?: () => void;
  isOpen?: boolean;
  refs?: { setFloating: (el: any) => void };
  floatingStyles?: React.CSSProperties;
}

const COLOR_PRESETS = {
  text: [
    { name: 'Default', value: 'black' },
    { name: 'Gray', value: '#787774' },
    { name: 'Brown', value: '#976D57' },
    { name: 'Orange', value: '#CC772F' },
    { name: 'Yellow', value: '#C29243' },
    { name: 'Green', value: '#548064' },
    { name: 'Blue', value: '#477DA5' },
    { name: 'Purple', value: '#A48BBE' },
    { name: 'Pink', value: '#B35588' },
    { name: 'Red', value: '#C4554D' },
  ],
  background: [
    { name: 'Default', value: 'unset' },
    { name: 'Gray', value: '#F1F1EF' },
    { name: 'Brown', value: '#F3EEEE' },
    { name: 'Orange', value: '#F8ECDF' },
    { name: 'Yellow', value: '#FAF3DD' },
    { name: 'Green', value: '#EEF3ED' },
    { name: 'Blue', value: '#E9F3F7' },
    { name: 'Purple', value: '#F6F3F8' },
    { name: 'Pink', value: '#F9F2F5' },
    { name: 'Red', value: '#FAECEC' },
  ],
};

const COLOR_PICKER_STYLES = {
  width: '100%',
  height: 170,
};

const HighlightColor = ({
  className,
  style,
  editor,
  highlightColors = {},
  onClose,
  isOpen = true,
  refs,
  floatingStyles,
}: HighlightColorProps) => {
  const [tab, setTab] = useState<'text' | 'background'>('text');
  const [showColorPicker, setShowColorPicker] = useState(true);
  const [localColor, setLocalColor] = useState<string | null>(null);

  const debouncedUpdateColor = useDebouncedCallback((type: 'color' | 'backgroundColor', color: string) => {
    if (editor?.formats?.highlight) {
      const value = editor.formats.highlight.getValue();
      if (value?.[type] === color) {
        editor.formats.highlight.update({ ...highlightColors, [type]: undefined });
      } else {
        editor.formats.highlight.update({ ...highlightColors, [type]: color });
      }
    }
    setLocalColor(null);
  }, 50);

  const handleColorChange = (type: 'color' | 'backgroundColor', color: string, shouldDebounce?: boolean) => {
    console.log('shouldDebounce', shouldDebounce);
    if (shouldDebounce) {
      setLocalColor(color);
      debouncedUpdateColor(type, color);
    } else {
      // console.log('editor?.formats?.highlight', editor?.formats?.highlight);
      // const value = editor.formats?.highlight?.getValue();
      // console.log('value', value);
      // if (value?.[type] === color) {
      //   editor.formats.highlight.update({ ...highlightColors, [type]: undefined });
      // } else {
      // }
      console.log('editor.formats', editor.formats);
      editor.formats.highlight.update({ ...highlightColors, [type]: color });
    }
  };

  const getItemStyles = (type: 'color' | 'backgroundColor', color: string) => {
    return {
      backgroundColor: color,
      position: 'relative' as const,
    };
  };

  const getPresetClassName = (type: 'color' | 'backgroundColor', color: string) => {
    const currentColor = localColor || highlightColors?.[type];
    const isActive = currentColor === color;
    return cn('yoo-highlight-color-preset', isActive && 'yoo-highlight-color-preset-active');
  };

  const containerStyle = floatingStyles ? { ...floatingStyles, ...style } : style;

  if (!isOpen) return null;

  return (
    <Portal id="yoo-highlight-color-portal">
      <div
        style={containerStyle}
        ref={refs?.setFloating}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        className={cn('yoo-highlight-color-root', className)}
      >
        <div className="yoo-highlight-color-content">
          <div className="yoo-highlight-color-tabs">
            <button
              type="button"
              className={cn('yoo-highlight-color-tab', tab === 'text' && 'yoo-highlight-color-tab-active')}
              onClick={() => setTab('text')}
            >
              Text
            </button>
            <button
              type="button"
              className={cn('yoo-highlight-color-tab', tab === 'background' && 'yoo-highlight-color-tab-active')}
              onClick={() => setTab('background')}
            >
              Background
            </button>
          </div>

          <div className="yoo-highlight-color-presets">
            {COLOR_PRESETS[tab].map(({ name, value }) => (
              <button
                type="button"
                key={name}
                title={name}
                className={getPresetClassName(tab === 'text' ? 'color' : 'backgroundColor', value)}
                style={getItemStyles(tab === 'text' ? 'color' : 'backgroundColor', value)}
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  handleColorChange(tab === 'text' ? 'color' : 'backgroundColor', value);
                }}
              />
            ))}
          </div>

          {/* Custom Color Section */}
          <div className="yoo-highlight-color-custom">
            <button
              type="button"
              className="yoo-highlight-color-custom-toggle"
              onClick={() => setShowColorPicker(!showColorPicker)}
            >
              Color Picker
              <PaletteIcon className="yoo-highlight-color-icon" />
            </button>

            {showColorPicker && (
              <div className="yoo-highlight-color-picker">
                <HexColorPicker
                  color={localColor || highlightColors?.[tab === 'text' ? 'color' : 'backgroundColor'] || '#000000'}
                  onChange={(color) => handleColorChange(tab === 'text' ? 'color' : 'backgroundColor', color, true)}
                  style={COLOR_PICKER_STYLES}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
};

export { HighlightColor };
