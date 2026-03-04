import type { YooptaContentValue } from "@yoopta/editor";

export const fullSetupInitialValue: YooptaContentValue = {
  "fs-h1": {
    "id": "fs-h1",
    "type": "HeadingOne",
    "value": [
      {
        "id": "fs-h1-el",
        "type": "heading-one",
        "children": [
          {
            "text": "Welcome to Yoopta Editor"
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 0,
      "depth": 0
    }
  },
  "fs-intro": {
    "id": "fs-intro",
    "type": "Paragraph",
    "value": [
      {
        "id": "fs-intro-el",
        "type": "paragraph",
        "children": [
          {
            "text": "This is a "
          },
          {
            "text": "full-featured",
            "bold": true
          },
          {
            "text": " example showcasing every plugin, mark, and UI component that Yoopta Editor offers. "
          },
          {
            "text": "Type",
            "italic": true
          },
          {
            "text": " "
          },
          {
            "text": "/",
            "code": true
          },
          {
            "text": " anywhere to open the slash command menu, or use the floating toolbar to format text."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 1,
      "depth": 0
    }
  },
  "fs-divider-1": {
    "id": "fs-divider-1",
    "type": "Divider",
    "value": [
      {
        "id": "fs-divider-1-el",
        "type": "divider",
        "children": [
          {
            "text": ""
          }
        ],
        "props": {
          "nodeType": "void",
          "theme": "solid"
        }
      }
    ],
    "meta": {
      "order": 2,
      "depth": 0
    }
  },
  "fs-h2-text": {
    "id": "fs-h2-text",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "fs-h2-text-el",
        "type": "heading-two",
        "children": [
          {
            "text": "Text Formatting"
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 3,
      "depth": 0
    }
  },
  "fs-marks-p": {
    "id": "fs-marks-p",
    "type": "Paragraph",
    "value": [
      {
        "id": "fs-marks-p-el",
        "type": "paragraph",
        "children": [
          {
            "text": "Yoopta supports rich text marks: "
          },
          {
            "text": "bold",
            "bold": true
          },
          {
            "text": ", "
          },
          {
            "text": "italic",
            "italic": true
          },
          {
            "text": ", "
          },
          {
            "text": "underline",
            "underline": true
          },
          {
            "text": ", "
          },
          {
            "text": "strikethrough",
            "strike": true
          },
          {
            "text": ", "
          },
          {
            "text": "inline code",
            "code": true
          },
          {
            "text": ", and "
          },
          {
            "text": "highlighted text",
            "highlight": {
              "color": "#000",
              "backgroundColor": "#fef08a"
            }
          },
          {
            "text": ". You can combine them: "
          },
          {
            "text": "bold + italic",
            "bold": true,
            "italic": true
          },
          {
            "text": " or "
          },
          {
            "text": "all at once",
            "bold": true,
            "italic": true,
            "underline": true
          },
          {
            "text": "."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 4,
      "depth": 0
    }
  },
  "fs-h2-blocks": {
    "id": "fs-h2-blocks",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "fs-h2-blocks-el",
        "type": "heading-two",
        "children": [
          {
            "text": "Block Types"
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 5,
      "depth": 0
    }
  },
  "fs-h3-quote": {
    "id": "fs-h3-quote",
    "type": "HeadingThree",
    "value": [
      {
        "id": "fs-h3-quote-el",
        "type": "heading-three",
        "children": [
          {
            "text": "Blockquote"
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 6,
      "depth": 0
    }
  },
  "fs-bq": {
    "id": "fs-bq",
    "type": "Blockquote",
    "value": [
      {
        "id": "fs-bq-el",
        "type": "blockquote",
        "children": [
          {
            "text": "The best way to predict the future is to invent it.",
            "italic": true
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 7,
      "depth": 0
    }
  },
  "fs-h3-callout": {
    "id": "fs-h3-callout",
    "type": "HeadingThree",
    "value": [
      {
        "id": "fs-h3-callout-el",
        "type": "heading-three",
        "children": [
          {
            "text": "Callout"
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 8,
      "depth": 0
    }
  },
  "fs-callout": {
    "id": "fs-callout",
    "type": "Callout",
    "value": [
      {
        "id": "fs-callout-el",
        "type": "callout",
        "children": [
          {
            "text": "Callout blocks are great for highlighting important information, tips, or warnings in your content."
          }
        ],
        "props": {
          "nodeType": "block",
          "theme": "info"
        }
      }
    ],
    "meta": {
      "order": 9,
      "depth": 0
    }
  },
  "fs-h3-lists": {
    "id": "fs-h3-lists",
    "type": "HeadingThree",
    "value": [
      {
        "id": "fs-h3-lists-el",
        "type": "heading-three",
        "children": [
          {
            "text": "Lists"
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 10,
      "depth": 0
    }
  },
  "fs-p-lists": {
    "id": "fs-p-lists",
    "type": "Paragraph",
    "value": [
      {
        "id": "fs-p-lists-el",
        "type": "paragraph",
        "children": [
          {
            "text": "Bulleted, numbered, and to-do lists with "
          },
          {
            "text": "nesting support",
            "bold": true
          },
          {
            "text": ":"
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 11,
      "depth": 0
    }
  },
  "fs-bl-1": {
    "id": "fs-bl-1",
    "type": "BulletedList",
    "value": [
      {
        "id": "fs-bl-1-el",
        "type": "bulleted-list",
        "children": [
          {
            "text": "Drag and drop blocks to reorder content"
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 12,
      "depth": 0
    }
  },
  "fs-bl-2": {
    "id": "fs-bl-2",
    "type": "BulletedList",
    "value": [
      {
        "id": "fs-bl-2-el",
        "type": "bulleted-list",
        "children": [
          {
            "text": "20+ block plugins available out of the box"
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 13,
      "depth": 0
    }
  },
  "fs-bl-3": {
    "id": "fs-bl-3",
    "type": "BulletedList",
    "value": [
      {
        "id": "fs-bl-3-el",
        "type": "bulleted-list",
        "children": [
          {
            "text": "Fully extensible plugin architecture"
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 14,
      "depth": 0
    }
  },
  "fs-nl-1": {
    "id": "fs-nl-1",
    "type": "NumberedList",
    "value": [
      {
        "id": "fs-nl-1-el",
        "type": "numbered-list",
        "children": [
          {
            "text": "Install with "
          },
          {
            "text": "npm install @yoopta/editor",
            "code": true
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 15,
      "depth": 0
    }
  },
  "fs-nl-2": {
    "id": "fs-nl-2",
    "type": "NumberedList",
    "value": [
      {
        "id": "fs-nl-2-el",
        "type": "numbered-list",
        "children": [
          {
            "text": "Add plugins you need"
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 16,
      "depth": 0
    }
  },
  "fs-nl-3": {
    "id": "fs-nl-3",
    "type": "NumberedList",
    "value": [
      {
        "id": "fs-nl-3-el",
        "type": "numbered-list",
        "children": [
          {
            "text": "Render the editor and start building"
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 17,
      "depth": 0
    }
  },
  "fs-todo-1": {
    "id": "fs-todo-1",
    "type": "TodoList",
    "value": [
      {
        "id": "fs-todo-1-el",
        "type": "todo-list",
        "children": [
          {
            "text": "Try the slash command menu"
          }
        ],
        "props": {
          "nodeType": "block",
          "checked": true
        }
      }
    ],
    "meta": {
      "order": 18,
      "depth": 0
    }
  },
  "fs-todo-2": {
    "id": "fs-todo-2",
    "type": "TodoList",
    "value": [
      {
        "id": "fs-todo-2-el",
        "type": "todo-list",
        "children": [
          {
            "text": "Drag blocks to reorder them"
          }
        ],
        "props": {
          "nodeType": "block",
          "checked": false
        }
      }
    ],
    "meta": {
      "order": 19,
      "depth": 0
    }
  },
  "fs-todo-3": {
    "id": "fs-todo-3",
    "type": "TodoList",
    "value": [
      {
        "id": "fs-todo-3-el",
        "type": "todo-list",
        "children": [
          {
            "text": "Export to HTML or Markdown"
          }
        ],
        "props": {
          "nodeType": "block",
          "checked": false
        }
      }
    ],
    "meta": {
      "order": 20,
      "depth": 0
    }
  },
  "fs-divider-2": {
    "id": "fs-divider-2",
    "type": "Divider",
    "value": [
      {
        "id": "fs-divider-2-el",
        "type": "divider",
        "children": [
          {
            "text": ""
          }
        ],
        "props": {
          "nodeType": "void",
          "theme": "solid"
        }
      }
    ],
    "meta": {
      "order": 21,
      "depth": 0
    }
  },
  "fs-h2-code": {
    "id": "fs-h2-code",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "fs-h2-code-el",
        "type": "heading-two",
        "children": [
          {
            "text": "Code Blocks"
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 22,
      "depth": 0
    }
  },
  "fs-p-code": {
    "id": "fs-p-code",
    "type": "Paragraph",
    "value": [
      {
        "id": "fs-p-code-el",
        "type": "paragraph",
        "children": [
          {
            "text": "Syntax-highlighted code blocks with language selection:"
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 23,
      "depth": 0
    }
  },
  "fs-code": {
    "id": "fs-code",
    "type": "Code",
    "value": [
      {
        "id": "fs-code-el",
        "type": "code",
        "children": [
          {
            "text": "import { createYooptaEditor } from '@yoopta/editor';\nimport Paragraph from '@yoopta/paragraph';\n\nconst plugins = [Paragraph];\nconst editor = createYooptaEditor({ plugins });\n\n// Ready to build amazing editing experiences!"
          }
        ],
        "props": {
          "nodeType": "void",
          "language": "typescript",
          "theme": "github-dark"
        }
      }
    ],
    "meta": {
      "order": 24,
      "depth": 0
    }
  },
  "fs-h2-advanced": {
    "id": "fs-h2-advanced",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "fs-h2-advanced-el",
        "type": "heading-two",
        "children": [
          {
            "text": "Advanced Blocks"
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 25,
      "depth": 0
    }
  },
  "fs-h3-table": {
    "id": "fs-h3-table",
    "type": "HeadingThree",
    "value": [
      {
        "id": "fs-h3-table-el",
        "type": "heading-three",
        "children": [
          {
            "text": "Tables"
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 26,
      "depth": 0
    }
  },
  "fs-p-table": {
    "id": "fs-p-table",
    "type": "Paragraph",
    "value": [
      {
        "id": "fs-p-table-el",
        "type": "paragraph",
        "children": [
          {
            "text": "Tables support adding/removing rows and columns, resizing, and rich text inside cells."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 27,
      "depth": 0
    }
  },
  "fs-table": {
    "id": "fs-table",
    "type": "Table",
    "value": [
      {
        "id": "fs-table-el",
        "type": "table",
        "children": [
          {
            "id": "fs-tr-1",
            "type": "table-row",
            "children": [
              {
                "id": "fs-td-1-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Feature",
                    "bold": true
                  }
                ],
                "props": {
                  "nodeType": "block",
                  "asHeader": true,
                  "width": 200
                }
              },
              {
                "id": "fs-td-1-2",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Description",
                    "bold": true
                  }
                ],
                "props": {
                  "nodeType": "block",
                  "asHeader": true,
                  "width": 300
                }
              },
              {
                "id": "fs-td-1-3",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Status",
                    "bold": true
                  }
                ],
                "props": {
                  "nodeType": "block",
                  "asHeader": true,
                  "width": 120
                }
              }
            ],
            "props": {
              "nodeType": "block"
            }
          },
          {
            "id": "fs-tr-2",
            "type": "table-row",
            "children": [
              {
                "id": "fs-td-2-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Block plugins"
                  }
                ],
                "props": {
                  "nodeType": "block",
                  "width": 200
                }
              },
              {
                "id": "fs-td-2-2",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "20+ content block types"
                  }
                ],
                "props": {
                  "nodeType": "block",
                  "width": 300
                }
              },
              {
                "id": "fs-td-2-3",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Stable"
                  }
                ],
                "props": {
                  "nodeType": "block",
                  "width": 120
                }
              }
            ],
            "props": {
              "nodeType": "block"
            }
          },
          {
            "id": "fs-tr-3",
            "type": "table-row",
            "children": [
              {
                "id": "fs-td-3-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Collaboration"
                  }
                ],
                "props": {
                  "nodeType": "block",
                  "width": 200
                }
              },
              {
                "id": "fs-td-3-2",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Real-time editing via Yjs"
                  }
                ],
                "props": {
                  "nodeType": "block",
                  "width": 300
                }
              },
              {
                "id": "fs-td-3-3",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Beta"
                  }
                ],
                "props": {
                  "nodeType": "block",
                  "width": 120
                }
              }
            ],
            "props": {
              "nodeType": "block"
            }
          },
          {
            "id": "fs-tr-4",
            "type": "table-row",
            "children": [
              {
                "id": "fs-td-4-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Theming"
                  }
                ],
                "props": {
                  "nodeType": "block",
                  "width": 200
                }
              },
              {
                "id": "fs-td-4-2",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Shadcn, Material, or custom themes"
                  }
                ],
                "props": {
                  "nodeType": "block",
                  "width": 300
                }
              },
              {
                "id": "fs-td-4-3",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Stable"
                  }
                ],
                "props": {
                  "nodeType": "block",
                  "width": 120
                }
              }
            ],
            "props": {
              "nodeType": "block"
            }
          }
        ],
        "props": {
          "nodeType": "block",
          "headerRow": true
        }
      }
    ],
    "meta": {
      "order": 28,
      "depth": 0
    }
  },
  "fs-h3-image": {
    "id": "fs-h3-image",
    "type": "HeadingThree",
    "value": [
      {
        "id": "fs-h3-image-el",
        "type": "heading-three",
        "children": [
          {
            "text": "Image"
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 29,
      "depth": 0
    }
  },
  "fs-p-image": {
    "id": "fs-p-image",
    "type": "Paragraph",
    "value": [
      {
        "id": "fs-p-image-el",
        "type": "paragraph",
        "children": [
          {
            "text": "Upload images or paste a URL. Supports resizing, captions, and alignment."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 30,
      "depth": 0
    }
  },
  "fs-image": {
    "id": "fs-image",
    "type": "Image",
    "value": [
      {
        "id": "fs-image-el",
        "type": "image",
        "children": [
          {
            "text": ""
          }
        ],
        "props": {
          "nodeType": "void",
          "src": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=450&fit=crop",
          "alt": "Developer workspace with code on screen",
          "srcSet": null,
          "bgColor": null,
          "fit": "cover",
          "sizes": {
            "width": 750,
            "height": 420
          }
        }
      }
    ],
    "meta": {
      "order": 31,
      "depth": 0
    }
  },
  "fs-h3-embed": {
    "id": "fs-h3-embed",
    "type": "HeadingThree",
    "value": [
      {
        "id": "fs-h3-embed-el",
        "type": "heading-three",
        "children": [
          {
            "text": "Embed"
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 32,
      "depth": 0
    }
  },
  "fs-p-embed": {
    "id": "fs-p-embed",
    "type": "Paragraph",
    "value": [
      {
        "id": "fs-p-embed-el",
        "type": "paragraph",
        "children": [
          {
            "text": "Embed content from YouTube, Figma, CodeSandbox, Twitter, and more:"
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 33,
      "depth": 0
    }
  },
  "fs-divider-media": {
    "id": "fs-divider-media",
    "type": "Divider",
    "value": [
      {
        "id": "fs-divider-media-el",
        "type": "divider",
        "children": [
          {
            "text": ""
          }
        ],
        "props": {
          "nodeType": "void",
          "theme": "solid"
        }
      }
    ],
    "meta": {
      "order": 35,
      "depth": 0
    }
  },
  "fs-h2-nested": {
    "id": "fs-h2-nested",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "fs-h2-nested-el",
        "type": "heading-two",
        "children": [
          {
            "text": "Nested & Structured Blocks"
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 36,
      "depth": 0
    }
  },
  "fs-p-nested": {
    "id": "fs-p-nested",
    "type": "Paragraph",
    "value": [
      {
        "id": "fs-p-nested-el",
        "type": "paragraph",
        "children": [
          {
            "text": "These blocks have "
          },
          {
            "text": "nested elements",
            "bold": true
          },
          {
            "text": " — multiple editable sections inside a single block."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 37,
      "depth": 0
    }
  },
  "fs-h3-accordion": {
    "id": "fs-h3-accordion",
    "type": "HeadingThree",
    "value": [
      {
        "id": "fs-h3-accordion-el",
        "type": "heading-three",
        "children": [
          {
            "text": "Accordion"
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 38,
      "depth": 0
    }
  },
  "fs-accordion": {
    "id": "fs-accordion",
    "type": "Accordion",
    "value": [
      {
        "id": "fs-acc-list",
        "type": "accordion-list",
        "children": [
          {
            "id": "fs-acc-item-1",
            "type": "accordion-list-item",
            "children": [
              {
                "id": "fs-acc-heading-1",
                "type": "accordion-list-item-heading",
                "children": [
                  {
                    "text": "What is Yoopta Editor?"
                  }
                ],
                "props": {
                  "nodeType": "block"
                }
              },
              {
                "id": "fs-acc-content-1",
                "type": "accordion-list-item-content",
                "children": [
                  {
                    "text": "An open-source rich-text editor for React with a headless plugin architecture, 20+ built-in plugins, and full customization."
                  }
                ],
                "props": {
                  "nodeType": "block"
                }
              }
            ],
            "props": {
              "nodeType": "block",
              "isExpanded": true
            }
          },
          {
            "id": "fs-acc-item-2",
            "type": "accordion-list-item",
            "children": [
              {
                "id": "fs-acc-heading-2",
                "type": "accordion-list-item-heading",
                "children": [
                  {
                    "text": "Can I create custom plugins?"
                  }
                ],
                "props": {
                  "nodeType": "block"
                }
              },
              {
                "id": "fs-acc-content-2",
                "type": "accordion-list-item-content",
                "children": [
                  {
                    "text": "Yes! Use the YooptaPlugin class to define custom block types with their own render, commands, and parsers."
                  }
                ],
                "props": {
                  "nodeType": "block"
                }
              }
            ],
            "props": {
              "nodeType": "block",
              "isExpanded": false
            }
          },
          {
            "id": "fs-acc-item-3",
            "type": "accordion-list-item",
            "children": [
              {
                "id": "fs-acc-heading-3",
                "type": "accordion-list-item-heading",
                "children": [
                  {
                    "text": "Does it support collaboration?"
                  }
                ],
                "props": {
                  "nodeType": "block"
                }
              },
              {
                "id": "fs-acc-content-3",
                "type": "accordion-list-item-content",
                "children": [
                  {
                    "text": "Yes — the @yoopta/collaboration package provides real-time co-editing via Yjs with remote cursors and presence."
                  }
                ],
                "props": {
                  "nodeType": "block"
                }
              }
            ],
            "props": {
              "nodeType": "block",
              "isExpanded": false
            }
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 39,
      "depth": 0
    }
  },
  "fs-h3-tabs": {
    "id": "fs-h3-tabs",
    "type": "HeadingThree",
    "value": [
      {
        "id": "fs-h3-tabs-el",
        "type": "heading-three",
        "children": [
          {
            "text": "Tabs"
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 40,
      "depth": 0
    }
  },
  "fs-tabs": {
    "id": "fs-tabs",
    "type": "Tabs",
    "value": [
      {
        "id": "fs-tabs-container",
        "type": "tabs-container",
        "children": [
          {
            "id": "fs-tabs-list",
            "type": "tabs-list",
            "children": [
              {
                "id": "fs-tab-h-1",
                "type": "tabs-item-heading",
                "children": [
                  {
                    "text": "React"
                  }
                ],
                "props": {
                  "nodeType": "block"
                }
              },
              {
                "id": "fs-tab-h-2",
                "type": "tabs-item-heading",
                "children": [
                  {
                    "text": "Vue"
                  }
                ],
                "props": {
                  "nodeType": "block"
                }
              },
              {
                "id": "fs-tab-h-3",
                "type": "tabs-item-heading",
                "children": [
                  {
                    "text": "Svelte"
                  }
                ],
                "props": {
                  "nodeType": "block"
                }
              }
            ],
            "props": {
              "nodeType": "block"
            }
          },
          {
            "id": "fs-tab-c-1",
            "type": "tabs-item-content",
            "children": [
              {
                "text": "Yoopta is built for React and works with any React framework — Next.js, Remix, Vite, or plain CRA."
              }
            ],
            "props": {
              "nodeType": "block",
              "referenceId": "fs-tab-h-1"
            }
          },
          {
            "id": "fs-tab-c-2",
            "type": "tabs-item-content",
            "children": [
              {
                "text": "Vue support is not available yet, but the headless architecture makes it possible in the future."
              }
            ],
            "props": {
              "nodeType": "block",
              "referenceId": "fs-tab-h-2"
            }
          },
          {
            "id": "fs-tab-c-3",
            "type": "tabs-item-content",
            "children": [
              {
                "text": "Svelte is on the radar. The plugin system is framework-agnostic at the data layer."
              }
            ],
            "props": {
              "nodeType": "block",
              "referenceId": "fs-tab-h-3"
            }
          }
        ],
        "props": {
          "nodeType": "block",
          "activeTabId": "fs-tab-h-1"
        }
      }
    ],
    "meta": {
      "order": 41,
      "depth": 0
    }
  },
  "fs-h3-steps": {
    "id": "fs-h3-steps",
    "type": "HeadingThree",
    "value": [
      {
        "id": "fs-h3-steps-el",
        "type": "heading-three",
        "children": [
          {
            "text": "Steps"
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 42,
      "depth": 0
    }
  },
  "fs-steps": {
    "id": "fs-steps",
    "type": "Steps",
    "value": [
      {
        "id": "fs-step-container",
        "type": "step-container",
        "children": [
          {
            "id": "fs-step-list",
            "type": "step-list",
            "children": [
              {
                "id": "fs-step-item-1",
                "type": "step-list-item",
                "children": [
                  {
                    "id": "fs-step-h-1",
                    "type": "step-list-item-heading",
                    "children": [
                      {
                        "text": "Install dependencies"
                      }
                    ],
                    "props": {
                      "nodeType": "block"
                    }
                  },
                  {
                    "id": "fs-step-c-1",
                    "type": "step-list-item-content",
                    "children": [
                      {
                        "text": "Run "
                      },
                      {
                        "text": "npm install @yoopta/editor slate slate-react slate-dom",
                        "code": true
                      },
                      {
                        "text": " to get started."
                      }
                    ],
                    "props": {
                      "nodeType": "block"
                    }
                  }
                ],
                "props": {
                  "nodeType": "block",
                  "order": 1
                }
              },
              {
                "id": "fs-step-item-2",
                "type": "step-list-item",
                "children": [
                  {
                    "id": "fs-step-h-2",
                    "type": "step-list-item-heading",
                    "children": [
                      {
                        "text": "Add plugins"
                      }
                    ],
                    "props": {
                      "nodeType": "block"
                    }
                  },
                  {
                    "id": "fs-step-c-2",
                    "type": "step-list-item-content",
                    "children": [
                      {
                        "text": "Pick the plugins you need — paragraph, headings, lists, images, code, and more."
                      }
                    ],
                    "props": {
                      "nodeType": "block"
                    }
                  }
                ],
                "props": {
                  "nodeType": "block",
                  "order": 2
                }
              },
              {
                "id": "fs-step-item-3",
                "type": "step-list-item",
                "children": [
                  {
                    "id": "fs-step-h-3",
                    "type": "step-list-item-heading",
                    "children": [
                      {
                        "text": "Render the editor"
                      }
                    ],
                    "props": {
                      "nodeType": "block"
                    }
                  },
                  {
                    "id": "fs-step-c-3",
                    "type": "step-list-item-content",
                    "children": [
                      {
                        "text": "Create the editor instance and render <YooptaEditor />. That's it — you're live."
                      }
                    ],
                    "props": {
                      "nodeType": "block"
                    }
                  }
                ],
                "props": {
                  "nodeType": "block",
                  "order": 3
                }
              }
            ],
            "props": {
              "nodeType": "block"
            }
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 43,
      "depth": 0
    }
  },
  "fs-h3-codegroup": {
    "id": "fs-h3-codegroup",
    "type": "HeadingThree",
    "value": [
      {
        "id": "fs-h3-codegroup-el",
        "type": "heading-three",
        "children": [
          {
            "text": "Code Group"
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 44,
      "depth": 0
    }
  },
  "fs-p-codegroup": {
    "id": "fs-p-codegroup",
    "type": "Paragraph",
    "value": [
      {
        "id": "fs-p-codegroup-el",
        "type": "paragraph",
        "children": [
          {
            "text": "Tabbed code blocks — perfect for showing the same example in multiple languages:"
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 45,
      "depth": 0
    }
  },
  "fs-codegroup": {
    "id": "fs-codegroup",
    "type": "CodeGroup",
    "value": [
      {
        "id": "fs-cg-container",
        "type": "code-group-container",
        "children": [
          {
            "id": "fs-cg-list",
            "type": "code-group-list",
            "children": [
              {
                "id": "fs-cg-tab-1",
                "type": "code-group-item-heading",
                "children": [
                  {
                    "text": "npm"
                  }
                ],
                "props": {
                  "nodeType": "block"
                }
              },
              {
                "id": "fs-cg-tab-2",
                "type": "code-group-item-heading",
                "children": [
                  {
                    "text": "yarn"
                  }
                ],
                "props": {
                  "nodeType": "block"
                }
              },
              {
                "id": "fs-cg-tab-3",
                "type": "code-group-item-heading",
                "children": [
                  {
                    "text": "pnpm"
                  }
                ],
                "props": {
                  "nodeType": "block"
                }
              }
            ],
            "props": {
              "nodeType": "block"
            }
          },
          {
            "id": "fs-cg-content-1",
            "type": "code-group-content",
            "children": [
              {
                "text": "npm install @yoopta/editor slate slate-react slate-dom"
              }
            ],
            "props": {
              "nodeType": "block",
              "referenceId": "fs-cg-tab-1",
              "language": "bash"
            }
          },
          {
            "id": "fs-cg-content-2",
            "type": "code-group-content",
            "children": [
              {
                "text": "yarn add @yoopta/editor slate slate-react slate-dom"
              }
            ],
            "props": {
              "nodeType": "block",
              "referenceId": "fs-cg-tab-2",
              "language": "bash"
            }
          },
          {
            "id": "fs-cg-content-3",
            "type": "code-group-content",
            "children": [
              {
                "text": "pnpm add @yoopta/editor slate slate-react slate-dom"
              }
            ],
            "props": {
              "nodeType": "block",
              "referenceId": "fs-cg-tab-3",
              "language": "bash"
            }
          }
        ],
        "props": {
          "nodeType": "block",
          "activeTabId": "fs-cg-tab-1",
          "theme": "github-dark"
        }
      }
    ],
    "meta": {
      "order": 46,
      "depth": 0
    }
  },
  "fs-divider-3": {
    "id": "fs-divider-3",
    "type": "Divider",
    "value": [
      {
        "id": "fs-divider-3-el",
        "type": "divider",
        "children": [
          {
            "text": ""
          }
        ],
        "props": {
          "nodeType": "void",
          "theme": "dashed"
        }
      }
    ],
    "meta": {
      "order": 47,
      "depth": 0
    }
  },
  "fs-h2-interact": {
    "id": "fs-h2-interact",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "fs-h2-interact-el",
        "type": "heading-two",
        "children": [
          {
            "text": "Try It Yourself"
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 48,
      "depth": 0
    }
  },
  "fs-p-interact": {
    "id": "fs-p-interact",
    "type": "Paragraph",
    "value": [
      {
        "id": "fs-p-interact-el",
        "type": "paragraph",
        "children": [
          {
            "text": "This editor is fully interactive. Try these:"
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 49,
      "depth": 0
    }
  },
  "fs-bl-try-1": {
    "id": "fs-bl-try-1",
    "type": "BulletedList",
    "value": [
      {
        "id": "fs-bl-try-1-el",
        "type": "bulleted-list",
        "children": [
          {
            "text": "Type "
          },
          {
            "text": "/",
            "code": true
          },
          {
            "text": " to open the slash command menu and insert any block type"
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 50,
      "depth": 0
    }
  },
  "fs-bl-try-2": {
    "id": "fs-bl-try-2",
    "type": "BulletedList",
    "value": [
      {
        "id": "fs-bl-try-2-el",
        "type": "bulleted-list",
        "children": [
          {
            "text": "Select text to see the "
          },
          {
            "text": "floating toolbar",
            "bold": true
          },
          {
            "text": " with formatting options"
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 51,
      "depth": 0
    }
  },
  "fs-bl-try-3": {
    "id": "fs-bl-try-3",
    "type": "BulletedList",
    "value": [
      {
        "id": "fs-bl-try-3-el",
        "type": "bulleted-list",
        "children": [
          {
            "text": "Hover on the left of any block to "
          },
          {
            "text": "drag",
            "bold": true
          },
          {
            "text": " it or open "
          },
          {
            "text": "block actions",
            "bold": true
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 52,
      "depth": 0
    }
  },
  "fs-bl-try-4": {
    "id": "fs-bl-try-4",
    "type": "BulletedList",
    "value": [
      {
        "id": "fs-bl-try-4-el",
        "type": "bulleted-list",
        "children": [
          {
            "text": "Use keyboard shortcuts like "
          },
          {
            "text": "Cmd+B",
            "code": true
          },
          {
            "text": " for bold, "
          },
          {
            "text": "Cmd+I",
            "code": true
          },
          {
            "text": " for italic, "
          },
          {
            "text": "Cmd+Z",
            "code": true
          },
          {
            "text": " to undo"
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 53,
      "depth": 0
    }
  },
  "fs-callout-tip": {
    "id": "fs-callout-tip",
    "type": "Callout",
    "value": [
      {
        "id": "fs-callout-tip-el",
        "type": "callout",
        "children": [
          {
            "text": "Check out the other examples in the sidebar to see Yoopta Editor in different use cases: email builder, Slack-like chat, collaborative editing, and more."
          }
        ],
        "props": {
          "nodeType": "block",
          "theme": "success"
        }
      }
    ],
    "meta": {
      "order": 54,
      "depth": 0
    }
  },
  "04971ec6-aa38-425c-a46c-39739510866e": {
    "id": "04971ec6-aa38-425c-a46c-39739510866e",
    "type": "Embed",
    "meta": {
      "depth": 0,
      "order": 34
    },
    "value": [
      {
        "id": "5fda8518-4379-49c4-81c1-56e0d7bf730f",
        "type": "embed",
        "props": {
          "provider": {
            "type": "youtube",
            "id": "zP1kTYQkTeM",
            "url": "https://youtu.be/zP1kTYQkTeM?si=Tg4K578ZzY6AkTD0",
            "embedUrl": "https://www.youtube.com/embed/zP1kTYQkTeM"
          },
          "sizes": {
            "width": 811,
            "height": 466
          },
          "nodeType": "void"
        },
        "children": [
          {
            "text": ""
          }
        ]
      }
    ]
  }
}
