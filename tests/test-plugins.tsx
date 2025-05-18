import React from 'react';
import { YooptaPlugin } from '../packages/core/editor/src/plugins';

export const InlinePlugin = new YooptaPlugin({
  type: 'Inline',
  elements: {
    inline: {
      render: (props) => <span {...props.attributes}>{props.children}</span>,
      props: { nodeType: 'inline' },
    },
  },
});

export const DefaultParagraphPlugin = new YooptaPlugin({
  type: 'Paragraph',
  elements: {
    paragraph: {
      render: (props) => <p {...props.attributes}>{props.children}</p>,
      props: { nodeType: 'block' },
    },
  },
  options: {
    shortcuts: ['p', 'text', 'para'],
    display: {
      title: 'Paragraph',
      description: 'Paragraph block',
    },
  },
});

export const BlockPluginWithProps = new YooptaPlugin({
  type: 'BlockPluginWithProps',
  elements: {
    block: {
      render: (props) => <div {...props.attributes}>{props.children}</div>,
      props: { nodeType: 'block', checked: false },
    },
  },
});

const ComplexPluginWithSeveralElements = new YooptaPlugin({
  type: 'ComplexPluginWithSeveralElements',
  elements: {
    'root-element': {
      render: (props) => <div {...props.attributes}>{props.children}</div>,
      props: { nodeType: 'block' },
      children: ['first-child-element'],
    },
    'first-child-element': {
      render: (props) => <div {...props.attributes}>{props.children}</div>,
      props: { nodeType: 'block' },
      children: ['second-child-element'],
    },
    'second-child-element': {
      render: (props) => <div {...props.attributes}>{props.children}</div>,
      props: { nodeType: 'block' },
    },
  },
});

const ComplexPluginWithSeveralElementsAndChildren = new YooptaPlugin({
  type: 'SuperCarousel',
  elements: {
    'super-carousel': {
      children: ['selector-item', 'carousel-list', 'user-input'],
      asRoot: true,
      render: ({ attributes, children, element }) => {
        return (
          <div {...attributes} style={{ border: '1px solid red', padding: 10 }}>
            {children}
          </div>
        );
      },
    },
    'carousel-list': {
      children: ['carousel-item', 'carousel-item', 'carousel-item'],
      render: ({ attributes, children, element }) => {
        return (
          <div {...attributes} style={{ border: '1px solid red', display: 'flex', padding: 10 }}>
            {children}
          </div>
        );
      },
    },
    'carousel-item': {
      children: ['carousel-item-image'],
      render: ({ attributes, children, element }) => {
        return (
          <div {...attributes} style={{ border: '1px solid green', padding: 10, width: 150 }}>
            {children}
          </div>
        );
      },
    },
    'carousel-item-image': {
      children: [],
      render: ({ attributes, children, element }) => {
        return (
          <div {...attributes} contentEditable={false} style={{ border: '1px solid blue', padding: 10 }}>
            {children}
            <img
              src="https://res.cloudinary.com/ench-app/image/upload/v1731103395/c0dc98f5-da0b-430a-b9b4-144f9a25b3b9_rqcqcc_utkcnh.webp"
              width={150}
              height={150}
            />
          </div>
        );
      },
      props: {
        nodeType: 'void',
      },
    },
    'user-input': {
      children: [],
      render: ({ attributes, children, element }) => {
        return (
          <div {...attributes} style={{ border: '1px solid yellow', padding: 10 }}>
            {children}
          </div>
        );
      },
    },
    'selector-item': {
      children: ['location-selector', 'date-selector'],
      render: ({ attributes, children, element }) => {
        return (
          <div {...attributes} style={{ border: '1px solid pink', padding: 10, display: 'flex', width: '100%' }}>
            {children}
          </div>
        );
      },
    },
    'location-selector': {
      children: [],
      render: ({ attributes, children, element }) => {
        return (
          <div {...attributes} contentEditable={false} style={{ border: '1px solid pink', padding: 10, flex: 1 }}>
            {children}
            <input type="date" />
          </div>
        );
      },
      props: {
        nodeType: 'void',
      },
    },
    'date-selector': {
      children: [],
      render: ({ attributes, children, element }) => {
        return (
          <div {...attributes} contentEditable={false} style={{ border: '1px solid purple', padding: 10, flex: 1 }}>
            {children}
            <input type="date" />
          </div>
        );
      },
      props: {
        nodeType: 'void',
      },
    },
  },
});

export const TEST_PLUGIN_LIST = [
  InlinePlugin,
  DefaultParagraphPlugin,
  BlockPluginWithProps,
  ComplexPluginWithSeveralElements,
  ComplexPluginWithSeveralElementsAndChildren,
];
