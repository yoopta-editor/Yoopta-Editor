# `yoopta-paragraph`

> TODO: description

## Usage

```
const paragraph = require('yoopta-paragraph');

// TODO: DEMONSTRATE API
```

### LinkTool Translation Support

The `LinkTool` allows you to customize the labels and tooltips to match the language of your application. You can easily pass translated text through the `labels` property, making the tool adaptable for different languages.

#### Example Configuration with Translations

Below is an example that sets custom Spanish labels for the "Add" and "Delete" buttons:

```typescript
export const TOOLS: Tools = {
  LinkTool: {
    render: (props: LinkToolRenderProps) =>
      DefaultLinkToolRender({
        labels: {
          addLabel: 'Añadir enlace',    // Label for the Add button
          deleteLabel: 'Eliminar enlace' // Label for the Delete button
        },
        ...props,
      }),
    tool: LinkTool,
  },
};

