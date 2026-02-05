import type { YooptaContentValue } from "@yoopta/editor";

/**
 * Playground initial value: every plugin from full-setup, all marks (Bold, Italic, Underline, Strike, Code, Highlight),
 * and short descriptions of UI components. For marketing "wow" effect and editor v6 showcase.
 */
export const playgroundInitialValue = {
  "pg-toc": {
    "id": "pg-toc",
    "type": "TableOfContents",
    "value": [
      {
        "id": "pg-toc-el",
        "type": "table-of-contents",
        "children": [
          {
            "text": ""
          }
        ],
        "props": {
          "nodeType": "void",
          "depth": 3,
          "title": "Table of Contents",
          "headingTypes": [
            "HeadingOne",
            "HeadingTwo",
            "HeadingThree"
          ],
          "showNumbers": false,
          "collapsible": true
        }
      }
    ],
    "meta": {
      "order": 2,
      "depth": 0
    }
  },
  "pg-p-intro": {
    "id": "pg-p-intro",
    "type": "Paragraph",
    "value": [
      {
        "id": "pg-p-intro-el",
        "type": "paragraph",
        "children": [
          {
            "text": "A "
          },
          {
            "text": "headless",
            "bold": true
          },
          {
            "text": ", "
          },
          {
            "text": "plugin-based",
            "italic": true
          },
          {
            "text": " rich-text editor for React. Built with love — "
          },
          {
            "text": "20+ block types",
            "bold": true
          },
          {
            "text": ", optional themes ("
          },
          {
            "text": "@yoopta/themes-shadcn",
            "code": true
          },
          {
            "text": "), full control over your UI and full control of your content via powerful API"
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
  "pg-h2-marks": {
    "id": "pg-h2-marks",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "pg-h2-marks-el",
        "type": "heading-two",
        "children": [
          {
            "text": "Text marks (Bold, Italic, Underline, Strike, CodeMark, Highlight)"
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
  "pg-p-marks": {
    "id": "pg-p-marks",
    "type": "Paragraph",
    "value": [
      {
        "id": "pg-p-marks-el",
        "type": "paragraph",
        "children": [
          {
            "text": "Select text to format: Bold",
            "bold": true
          },
          {
            "text": " · Italic",
            "italic": true
          },
          {
            "text": " · Underline",
            "underline": true
          },
          {
            "text": " · Strikethrough",
            "strike": true
          },
          {
            "text": "Code",
            "code": true
          },
          {
            "text": " · Highlight",
            "highlight": {
              "backgroundColor": "#bbf7d0"
            }
          },
          {
            "text": " (with colors). All from "
          },
          {
            "text": "@yoopta/marks",
            "code": true
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
      "order": 7,
      "depth": 0
    }
  },
  "pg-h2-plugins": {
    "id": "pg-h2-plugins",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "pg-h2-plugins-el",
        "type": "heading-two",
        "children": [
          {
            "text": "Available plugins"
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 9,
      "depth": 0
    }
  },
  "pg-table-plugins": {
    "id": "pg-table-plugins",
    "type": "Table",
    "value": [
      {
        "id": "pg-table-plugins-el",
        "type": "table",
        "children": [
          {
            "id": "pg-tpl-tr-0",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tpl-td-0-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Plugin"
                  }
                ],
                "props": {
                  "asHeader": true
                }
              },
              {
                "id": "pg-tpl-td-0-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Package"
                  }
                ],
                "props": {
                  "asHeader": true
                }
              }
            ]
          },
          {
            "id": "pg-tpl-tr-1",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tpl-td-1-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "accordion"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tpl-td-1-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "@yoopta/accordion"
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tpl-tr-2",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tpl-td-2-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "blockquote"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tpl-td-2-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "@yoopta/blockquote"
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tpl-tr-3",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tpl-td-3-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "callout"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tpl-td-3-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "@yoopta/callout"
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tpl-tr-4",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tpl-td-4-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "carousel"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tpl-td-4-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "@yoopta/carousel"
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tpl-tr-5",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tpl-td-5-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "code"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tpl-td-5-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "@yoopta/code"
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tpl-tr-6",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tpl-td-6-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "divider"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tpl-td-6-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "@yoopta/divider"
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tpl-tr-7",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tpl-td-7-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "embed"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tpl-td-7-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "@yoopta/embed"
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tpl-tr-8",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tpl-td-8-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "file"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tpl-td-8-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "@yoopta/file"
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tpl-tr-9",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tpl-td-9-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "headings"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tpl-td-9-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "@yoopta/headings"
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tpl-tr-10",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tpl-td-10-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "image"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tpl-td-10-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "@yoopta/image"
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tpl-tr-11",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tpl-td-11-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "link"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tpl-td-11-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "@yoopta/link"
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tpl-tr-12",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tpl-td-12-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "lists"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tpl-td-12-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "@yoopta/lists"
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tpl-tr-13",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tpl-td-13-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "mention"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tpl-td-13-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "@yoopta/mention"
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tpl-tr-14",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tpl-td-14-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "paragraph"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tpl-td-14-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "@yoopta/paragraph"
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tpl-tr-15",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tpl-td-15-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "steps"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tpl-td-15-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "@yoopta/steps"
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tpl-tr-16",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tpl-td-16-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "table"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tpl-td-16-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "@yoopta/table"
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tpl-tr-17",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tpl-td-17-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "table-of-contents"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tpl-td-17-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "@yoopta/table-of-contents"
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tpl-tr-18",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tpl-td-18-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "tabs"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tpl-td-18-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "@yoopta/tabs"
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tpl-tr-19",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tpl-td-19-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "video"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tpl-td-19-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "@yoopta/video"
                  }
                ],
                "props": {}
              }
            ]
          }
        ],
        "props": {
          "headerRow": true,
          "headerColumn": false,
          "columnWidths": [
            180,
            220
          ]
        }
      }
    ],
    "meta": {
      "order": 10,
      "depth": 0
    }
  },
  "pg-h2-ui": {
    "id": "pg-h2-ui",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "pg-h2-ui-el",
        "type": "heading-two",
        "children": [
          {
            "text": "UI components (@yoopta/ui)"
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
  "pg-list-ui-1": {
    "id": "pg-list-ui-1",
    "type": "BulletedList",
    "value": [
      {
        "id": "pg-list-ui-el-1",
        "type": "bulleted-list",
        "children": [
          {
            "text": "FloatingToolbar",
            "code": true
          },
          {
            "text": " — appears on selection: Bold, Italic, Highlight, etc. "
          }
        ]
      }
    ],
    "meta": {
      "order": 13,
      "depth": 0
    }
  },
  "pg-list-ui-2": {
    "id": "pg-list-ui-2",
    "type": "BulletedList",
    "value": [
      {
        "id": "pg-list-ui-el-2",
        "type": "bulleted-list",
        "children": [
          {
            "text": "SlashCommandMenu",
            "code": true
          },
          {
            "text": " — type / to insert any block"
          }
        ]
      }
    ],
    "meta": {
      "order": 14,
      "depth": 0
    }
  },
  "pg-list-ui-3": {
    "id": "pg-list-ui-3",
    "type": "BulletedList",
    "value": [
      {
        "id": "pg-list-ui-el-3",
        "type": "bulleted-list",
        "children": [
          {
            "text": "FloatingBlockActions",
            "code": true
          },
          {
            "text": " — hover: add block (+), drag handle, open BlockOptions"
          }
        ]
      }
    ],
    "meta": {
      "order": 15,
      "depth": 0
    }
  },
  "pg-list-ui-4": {
    "id": "pg-list-ui-4",
    "type": "BulletedList",
    "value": [
      {
        "id": "pg-list-ui-el-4",
        "type": "bulleted-list",
        "children": [
          {
            "text": "BlockOptions",
            "code": true
          },
          {
            "text": " — duplicate, delete, turn into another block"
          }
        ]
      }
    ],
    "meta": {
      "order": 16,
      "depth": 0
    }
  },
  "pg-list-ui-5": {
    "id": "pg-list-ui-5",
    "type": "BulletedList",
    "value": [
      {
        "id": "pg-list-ui-el-5",
        "type": "bulleted-list",
        "children": [
          {
            "text": "SelectionBox",
            "code": true
          },
          {
            "text": " — drag to select multiple blocks"
          }
        ]
      }
    ],
    "meta": {
      "order": 17,
      "depth": 0
    }
  },
  "pg-list-ui-6": {
    "id": "pg-list-ui-6",
    "type": "BulletedList",
    "value": [
      {
        "id": "pg-list-ui-el-6",
        "type": "bulleted-list",
        "children": [
          {
            "text": "BlockDndContext",
            "code": true
          },
          {
            "text": " + "
          },
          {
            "text": "SortableBlock",
            "code": true
          },
          {
            "text": " — drag and drop to reorder"
          }
        ]
      }
    ],
    "meta": {
      "order": 18,
      "depth": 0
    }
  },
  "pg-p-ui-note": {
    "id": "pg-p-ui-note",
    "type": "Paragraph",
    "value": [
      {
        "id": "pg-p-ui-note-el",
        "type": "paragraph",
        "children": [
          {
            "text": "All UI is rendered as "
          },
          {
            "text": "children",
            "code": true
          },
          {
            "text": " of "
          },
          {
            "text": "<YooptaEditor>",
            "code": true
          },
          {
            "text": " and uses "
          },
          {
            "text": "useYooptaEditor()",
            "code": true
          },
          {
            "text": " from context. v6: no plugins/marks/value on the component — use "
          },
          {
            "text": "createYooptaEditor({ plugins, marks })",
            "code": true
          },
          {
            "text": " and "
          },
          {
            "text": "setEditorValue",
            "code": true
          },
          {
            "text": " / "
          },
          {
            "text": "onChange",
            "code": true
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
      "order": 20,
      "depth": 0
    }
  },
  "pg-divider": {
    "id": "pg-divider",
    "type": "Divider",
    "value": [
      {
        "id": "pg-divider-el",
        "type": "divider",
        "children": [
          {
            "text": ""
          }
        ],
        "props": {
          "color": "#e5e5e5",
          "theme": "solid",
          "nodeType": "void"
        }
      }
    ],
    "meta": {
      "order": 21,
      "depth": 0
    }
  },
  "pg-accordion": {
    "id": "pg-accordion",
    "type": "Accordion",
    "value": [
      {
        "id": "pg-accordion-list",
        "type": "accordion-list",
        "children": [
          {
            "id": "pg-acc-item-1",
            "type": "accordion-list-item",
            "props": {
              "isExpanded": true
            },
            "children": [
              {
                "id": "pg-acc-heading-1",
                "type": "accordion-list-item-heading",
                "children": [
                  {
                    "text": "What is Yoopta Editor?"
                  }
                ]
              },
              {
                "id": "pg-acc-content-1",
                "type": "accordion-list-item-content",
                "children": [
                  {
                    "text": "A headless, plugin-based rich-text editor for React built on Slate.js. You get full control over the UI: use @yoopta/themes-shadcn for ready-made blocks or build your own. No lock-in — your content, your design."
                  }
                ]
              }
            ]
          },
          {
            "id": "pg-acc-item-2",
            "type": "accordion-list-item",
            "props": {
              "isExpanded": false
            },
            "children": [
              {
                "id": "pg-acc-heading-2",
                "type": "accordion-list-item-heading",
                "children": [
                  {
                    "text": "Headless vs themed"
                  }
                ]
              },
              {
                "id": "pg-acc-content-2",
                "type": "accordion-list-item-content",
                "children": [
                  {
                    "text": "Out of the box, blocks render with minimal structure (headless). Apply a theme to get styled UI: applyTheme(plugins) from @yoopta/themes-shadcn, or extend a single plugin — e.g. Callout.extend({ elements: CalloutUI }) — and mix with your own components."
                  }
                ]
              }
            ]
          },
          {
            "id": "pg-acc-item-3",
            "type": "accordion-list-item",
            "props": {
              "isExpanded": false
            },
            "children": [
              {
                "id": "pg-acc-heading-3",
                "type": "accordion-list-item-heading",
                "children": [
                  {
                    "text": "Quick tips"
                  }
                ]
              },
              {
                "id": "pg-acc-content-3",
                "type": "accordion-list-item-content",
                "children": [
                  {
                    "text": "Type / to open the block menu. Select text to see the floating toolbar (Bold, Italic, Highlight). Hover a block for the + button and drag handle. Use SelectionBox to select multiple blocks, then move or delete. All UI lives as children of <YooptaEditor> and uses useYooptaEditor()."
                  }
                ]
              }
            ]
          },
          {
            "id": "pg-acc-item-4",
            "type": "accordion-list-item",
            "props": {
              "isExpanded": true
            },
            "children": [
              {
                "id": "pg-acc-heading-4",
                "type": "accordion-list-item-heading",
                "children": [
                  {
                    "text": "Extend and customize"
                  }
                ]
              },
              {
                "id": "pg-acc-content-4",
                "type": "accordion-list-item-content",
                "children": [
                  {
                    "text": "Plugins support .extend({ elements, options }): override render per element, add custom upload/onSearch, or inject elements from other plugins (e.g. Headings inside Callout). Marks are toggled via Marks.toggle(editor, { type: 'bold' }). Export to HTML, Markdown, or plain text with @yoopta/exports."
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    "meta": {
      "order": 22,
      "depth": 0
    }
  },
  "pg-quote": {
    "id": "pg-quote",
    "type": "Blockquote",
    "value": [
      {
        "id": "pg-quote-el",
        "type": "blockquote",
        "children": [
          {
            "text": "Everything here is editable. Type / to add more blocks. Drag the handle to reorder. Select multiple blocks with the selection box."
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
  "pg-code": {
    "id": "pg-code",
    "type": "Code",
    "value": [
      {
        "id": "pg-code-el",
        "type": "code",
        "children": [
          {
            "text": "const editor = createYooptaEditor({ plugins, marks });\n<YooptaEditor editor={editor} onChange={onChange}>\n  <FloatingToolbar />\n  <SlashCommandMenu />\n</YooptaEditor>"
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
  "pg-tabs": {
    "id": "pg-tabs",
    "type": "Tabs",
    "value": [
      {
        "id": "pg-tabs-container",
        "type": "tabs-container",
        "props": {
          "activeTabId": "pg-tab-1"
        },
        "children": [
          {
            "id": "pg-tabs-list",
            "type": "tabs-list",
            "children": [
              {
                "id": "pg-tab-1",
                "type": "tabs-item-heading",
                "children": [
                  {
                    "text": "Quick start"
                  }
                ]
              },
              {
                "id": "pg-tab-2",
                "type": "tabs-item-heading",
                "children": [
                  {
                    "text": "API"
                  }
                ]
              }
            ]
          },
          {
            "id": "pg-tabs-content-1",
            "type": "tabs-item-content",
            "props": {
              "referenceId": "pg-tab-1"
            },
            "children": [
              {
                "text": "Install: "
              },
              {
                "text": "npm install @yoopta/editor @yoopta/ui",
                "code": true
              },
              {
                "text": ". Create editor with "
              },
              {
                "text": "createYooptaEditor({ plugins, marks })",
                "code": true
              },
              {
                "text": ". Add "
              },
              {
                "text": "<YooptaEditor>",
                "code": true
              },
              {
                "text": " with toolbar and slash menu as children."
              }
            ]
          },
          {
            "id": "pg-tabs-content-2",
            "type": "tabs-item-content",
            "props": {
              "referenceId": "pg-tab-2"
            },
            "children": [
              {
                "text": "Editor API: "
              },
              {
                "text": "insertBlock, deleteBlock, getEditorValue, setEditorValue. Namespace APIs: Blocks.*, Elements.*, Marks.*",
                "code": true
              },
              {
                "text": " from "
              },
              {
                "text": "@yoopta/editor",
                "underline": true
              },
              {
                "text": "."
              }
            ]
          }
        ]
      }
    ],
    "meta": {
      "order": 25,
      "depth": 0
    }
  },
  "pg-steps": {
    "id": "pg-steps",
    "type": "Steps",
    "value": [
      {
        "id": "pg-step-container",
        "type": "step-container",
        "children": [
          {
            "id": "pg-step-list",
            "type": "step-list",
            "children": [
              {
                "id": "pg-step-item-1",
                "type": "step-list-item",
                "props": {
                  "order": 0
                },
                "children": [
                  {
                    "id": "pg-step-heading-1",
                    "type": "step-list-item-heading",
                    "children": [
                      {
                        "text": "Install packages"
                      }
                    ]
                  },
                  {
                    "id": "pg-step-content-1",
                    "type": "step-list-item-content",
                    "children": [
                      {
                        "text": "yarn add "
                      },
                      {
                        "text": "@yoopta/editor @yoopta/ui @yoopta/paragraph @yoopta/headings @yoopta/marks",
                        "code": true
                      }
                    ]
                  }
                ]
              },
              {
                "id": "pg-step-item-2",
                "type": "step-list-item",
                "props": {
                  "order": 1
                },
                "children": [
                  {
                    "id": "pg-step-heading-2",
                    "type": "step-list-item-heading",
                    "children": [
                      {
                        "text": "Create editor"
                      }
                    ]
                  },
                  {
                    "id": "pg-step-content-2",
                    "type": "step-list-item-content",
                    "children": [
                      {
                        "text": "const editor = createYooptaEditor({ plugins: [Paragraph, ...], marks: [Bold, Italic, ...] })",
                        "code": true
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    "meta": {
      "order": 26,
      "depth": 0
    }
  },
  "pg-codegroup": {
    "id": "pg-codegroup",
    "type": "CodeGroup",
    "value": [
      {
        "id": "pg-codegroup-container",
        "type": "code-group-container",
        "props": {
          "activeTabId": "pg-cg-tab-2",
          "theme": "github-dark"
        },
        "children": [
          {
            "id": "pg-codegroup-list",
            "type": "code-group-list",
            "children": [
              {
                "id": "pg-cg-tab-1",
                "type": "code-group-item-heading",
                "children": [
                  {
                    "text": "editor.tsx"
                  }
                ]
              },
              {
                "id": "pg-cg-tab-2",
                "type": "code-group-item-heading",
                "children": [
                  {
                    "text": "plugins.ts"
                  }
                ]
              }
            ]
          },
          {
            "id": "pg-codegroup-content-1",
            "type": "code-group-content",
            "props": {
              "referenceId": "pg-cg-tab-1",
              "language": "typescript"
            },
            "children": [
              {
                "text": "const editor = createYooptaEditor({ plugins, marks });\nreturn <YooptaEditor editor={editor} onChange={onChange} />;"
              }
            ]
          },
          {
            "id": "pg-codegroup-content-2",
            "type": "code-group-content",
            "props": {
              "referenceId": "pg-cg-tab-2",
              "language": "typescript"
            },
            "children": [
              {
                "text": "import Paragraph from '@yoopta/paragraph';\nimport Headings from '@yoopta/headings';\nexport const plugins = [Paragraph, Headings.HeadingOne, Headings.HeadingTwo];"
              }
            ]
          }
        ]
      }
    ],
    "meta": {
      "order": 27,
      "depth": 0
    }
  },
  "pg-h2-blocks-api": {
    "id": "pg-h2-blocks-api",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "pg-h2-blocks-api-el",
        "type": "heading-two",
        "children": [
          {
            "text": "Blocks API"
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
  "pg-table-blocks": {
    "id": "pg-table-blocks",
    "type": "Table",
    "value": [
      {
        "id": "pg-table-blocks-el",
        "type": "table",
        "children": [
          {
            "id": "pg-tbl-tr-0",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tbl-td-0-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Method"
                  }
                ],
                "props": {
                  "asHeader": true
                }
              },
              {
                "id": "pg-tbl-td-0-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Description"
                  }
                ],
                "props": {
                  "asHeader": true
                }
              }
            ]
          },
          {
            "id": "pg-tbl-tr-1",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tbl-td-1-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "insertBlock"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tbl-td-1-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Insert a new block at a position"
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tbl-tr-2",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tbl-td-2-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "deleteBlock"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tbl-td-2-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Remove a block from the editor"
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tbl-tr-3",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tbl-td-3-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "moveBlock"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tbl-td-3-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Move block to another position"
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tbl-tr-4",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tbl-td-4-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "focusBlock"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tbl-td-4-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Focus a block by id or order"
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tbl-tr-5",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tbl-td-5-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "splitBlock"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tbl-td-5-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Split block at current selection"
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tbl-tr-6",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tbl-td-6-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "increaseBlockDepth"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tbl-td-6-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Indent / nest block (e.g. in lists)"
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tbl-tr-7",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tbl-td-7-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "decreaseBlockDepth"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tbl-td-7-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Outdent block"
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tbl-tr-8",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tbl-td-8-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "duplicateBlock"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tbl-td-8-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Duplicate a block with new id"
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tbl-tr-9",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tbl-td-9-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "updateBlock"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tbl-td-9-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Update block data, value, or meta"
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tbl-tr-10",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tbl-td-10-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "toggleBlock"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tbl-td-10-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Change block type while keeping content"
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tbl-tr-11",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tbl-td-11-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "getBlock"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tbl-td-11-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Get block data by id or order"
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tbl-tr-12",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tbl-td-12-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "getBlockSlate"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tbl-td-12-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Get Slate editor instance for a block"
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tbl-tr-13",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tbl-td-13-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "buildBlockData"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tbl-td-13-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Build block data structure (for insert)"
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tbl-tr-14",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tbl-td-14-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "mergeBlock"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tbl-td-14-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Merge block with previous block"
                  }
                ],
                "props": {}
              }
            ]
          }
        ],
        "props": {
          "headerRow": true,
          "headerColumn": false,
          "columnWidths": [
            200,
            320
          ]
        }
      }
    ],
    "meta": {
      "order": 30,
      "depth": 0
    }
  },
  "pg-h2-elements-api": {
    "id": "pg-h2-elements-api",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "pg-h2-elements-api-el",
        "type": "heading-two",
        "children": [
          {
            "text": "Elements API"
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 31,
      "depth": 0
    }
  },
  "pg-table-elements": {
    "id": "pg-table-elements",
    "type": "Table",
    "value": [
      {
        "id": "pg-table-elements-el",
        "type": "table",
        "children": [
          {
            "id": "pg-tel-tr-0",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tel-td-0-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Method"
                  }
                ],
                "props": {
                  "asHeader": true
                }
              },
              {
                "id": "pg-tel-td-0-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Description"
                  }
                ],
                "props": {
                  "asHeader": true
                }
              }
            ]
          },
          {
            "id": "pg-tel-tr-1",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tel-td-1-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "insertElement"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tel-td-1-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Insert a new element into a block"
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tel-tr-2",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tel-td-2-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "updateElement"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tel-td-2-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Update element props or children"
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tel-tr-3",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tel-td-3-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "deleteElement"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tel-td-3-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Remove an element from a block"
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tel-tr-4",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tel-td-4-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "getElement"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tel-td-4-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Get element by path or matcher"
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tel-tr-5",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tel-td-5-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "getElements"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tel-td-5-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Get all elements in a block"
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tel-tr-6",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tel-td-6-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "getElementEntry"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tel-td-6-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Get Slate node entry for element"
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tel-tr-7",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tel-td-7-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "getElementPath"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tel-td-7-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Get path to element in block"
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tel-tr-8",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tel-td-8-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "getElementRect"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tel-td-8-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Get DOM rect for element"
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tel-tr-9",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tel-td-9-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "getParentElementPath"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tel-td-9-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Get path to parent element"
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tel-tr-10",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tel-td-10-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "getElementChildren"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tel-td-10-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Get child elements of an element"
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tel-tr-11",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tel-td-11-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "isElementEmpty"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tel-td-11-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Check if element has no content"
                  }
                ],
                "props": {}
              }
            ]
          }
        ],
        "props": {
          "headerRow": true,
          "headerColumn": false,
          "columnWidths": [
            200,
            320
          ]
        }
      }
    ],
    "meta": {
      "order": 32,
      "depth": 0
    }
  },
  "pg-h2-marks-api": {
    "id": "pg-h2-marks-api",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "pg-h2-marks-api-el",
        "type": "heading-two",
        "children": [
          {
            "text": "Marks API"
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
  "pg-table-marks": {
    "id": "pg-table-marks",
    "type": "Table",
    "value": [
      {
        "id": "pg-table-marks-el",
        "type": "table",
        "children": [
          {
            "id": "pg-tmk-tr-0",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tmk-td-0-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Method"
                  }
                ],
                "props": {
                  "asHeader": true
                }
              },
              {
                "id": "pg-tmk-td-0-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Description"
                  }
                ],
                "props": {
                  "asHeader": true
                }
              }
            ]
          },
          {
            "id": "pg-tmk-tr-1",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tmk-td-1-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "getValue"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tmk-td-1-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Get mark value (e.g. highlight color)"
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tmk-tr-2",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tmk-td-2-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "isActive"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tmk-td-2-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Check if mark is active at selection"
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tmk-tr-3",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tmk-td-3-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "toggle"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tmk-td-3-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Toggle mark on selection"
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tmk-tr-4",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tmk-td-4-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "update"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tmk-td-4-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Add or update mark with value"
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tmk-tr-5",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tmk-td-5-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "add"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tmk-td-5-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Add mark to selection"
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tmk-tr-6",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tmk-td-6-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "remove"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tmk-td-6-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Remove mark from selection"
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tmk-tr-7",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tmk-td-7-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "getAll"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tmk-td-7-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Get all marks at selection or block"
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tmk-tr-8",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tmk-td-8-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "clear"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tmk-td-8-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Clear all marks from selection or block"
                  }
                ],
                "props": {}
              }
            ]
          }
        ],
        "props": {
          "headerRow": true,
          "headerColumn": false,
          "columnWidths": [
            200,
            320
          ]
        }
      }
    ],
    "meta": {
      "order": 34,
      "depth": 0
    }
  },
  "pg-h2-coming-soon": {
    "id": "pg-h2-coming-soon",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "pg-h2-coming-soon-el",
        "type": "heading-two",
        "children": [
          {
            "text": "Coming soon"
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 35,
      "depth": 0
    }
  },
  "pg-table-coming-soon": {
    "id": "pg-table-coming-soon",
    "type": "Table",
    "value": [
      {
        "id": "pg-table-coming-soon-el",
        "type": "table",
        "children": [
          {
            "id": "pg-tcs-tr-0",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tcs-td-0-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Feature"
                  }
                ],
                "props": {
                  "asHeader": true
                }
              },
              {
                "id": "pg-tcs-td-0-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Description"
                  }
                ],
                "props": {
                  "asHeader": true
                }
              }
            ]
          },
          {
            "id": "pg-tcs-tr-1",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tcs-td-1-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Real-time Collaboration"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tcs-td-1-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Work together in real-time with your team. See cursors, selections, and changes as they happen."
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tcs-tr-2",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tcs-td-2-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "AI Inline Editing"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tcs-td-2-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Intelligent text suggestions, rewrites, and expansions powered by AI directly in the editor."
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tcs-tr-3",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tcs-td-3-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Sidebar Block elements editor"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tcs-td-3-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Advanced element editing panel for complex blocks like tabs, carousels, tables, code and embeds."
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tcs-tr-4",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tcs-td-4-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "AI Plugin Prompt Generator"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tcs-td-4-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Generate custom plugins from natural language descriptions. Describe what you need, get working code."
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tcs-tr-5",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tcs-td-5-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Plugin Marketplace"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tcs-td-5-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Discover and share plugins with the community. Build once, distribute everywhere."
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tcs-tr-6",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tcs-td-6-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Theme builder"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tcs-td-6-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Visual theme builder with live preview. Export themes and share with others."
                  }
                ],
                "props": {}
              }
            ]
          },
          {
            "id": "pg-tcs-tr-7",
            "type": "table-row",
            "children": [
              {
                "id": "pg-tcs-td-7-0",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "MDX Export & Import"
                  }
                ],
                "props": {}
              },
              {
                "id": "pg-tcs-td-7-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Seamlessly export and import MDX content. Perfect for documentation sites, blogs, and content management."
                  }
                ],
                "props": {}
              }
            ]
          }
        ],
        "props": {
          "headerRow": true,
          "headerColumn": false,
          "columnWidths": [
            220,
            380
          ]
        }
      }
    ],
    "meta": {
      "order": 36,
      "depth": 0
    }
  },
  "pg-todo-1": {
    "id": "pg-todo-1",
    "type": "TodoList",
    "value": [
      {
        "id": "pg-todo-1-el",
        "type": "todo-list",
        "children": [
          {
            "text": "Try the slash menu (/) to add blocks"
          }
        ],
        "props": {
          "checked": false
        }
      }
    ],
    "meta": {
      "order": 37,
      "depth": 0
    }
  },
  "pg-todo-2": {
    "id": "pg-todo-2",
    "type": "TodoList",
    "value": [
      {
        "id": "pg-todo-2-el",
        "type": "todo-list",
        "children": [
          {
            "text": "Select text to see FloatingToolbar"
          }
        ],
        "props": {
          "checked": false
        }
      }
    ],
    "meta": {
      "order": 38,
      "depth": 0
    }
  },
  "pg-todo-3": {
    "id": "pg-todo-3",
    "type": "TodoList",
    "value": [
      {
        "id": "pg-todo-3-el",
        "type": "todo-list",
        "children": [
          {
            "text": "Star the repo and read the docs"
          }
        ],
        "props": {
          "checked": true
        }
      }
    ],
    "meta": {
      "order": 39,
      "depth": 0
    }
  },
  "pg-num-1": {
    "id": "pg-num-1",
    "type": "NumberedList",
    "value": [
      {
        "id": "pg-num-1-el",
        "type": "numbered-list",
        "children": [
          {
            "text": "Install: "
          },
          {
            "text": "@yoopta/editor, @yoopta/ui, plugins, @yoopta/marks",
            "code": true
          }
        ]
      }
    ],
    "meta": {
      "order": 41,
      "depth": 0
    }
  },
  "pg-num-2": {
    "id": "pg-num-2",
    "type": "NumberedList",
    "value": [
      {
        "id": "pg-num-2-el",
        "type": "numbered-list",
        "children": [
          {
            "text": "Create editor with "
          },
          {
            "text": "createYooptaEditor({ plugins, marks })",
            "code": true
          }
        ]
      }
    ],
    "meta": {
      "order": 42,
      "depth": 0
    }
  },
  "pg-num-3": {
    "id": "pg-num-3",
    "type": "NumberedList",
    "value": [
      {
        "id": "pg-num-3-el",
        "type": "numbered-list",
        "children": [
          {
            "text": "Render "
          },
          {
            "text": "<YooptaEditor>",
            "code": true
          },
          {
            "text": " with toolbar, slash menu, etc. as children"
          }
        ]
      }
    ],
    "meta": {
      "order": 43,
      "depth": 0
    }
  },
  "pg-embed": {
    "id": "pg-embed",
    "type": "Embed",
    "value": [
      {
        "id": "pg-embed-el",
        "type": "embed",
        "children": [
          {
            "text": ""
          }
        ],
        "props": {
          "provider": null,
          "sizes": {
            "width": 650,
            "height": 400
          },
          "nodeType": "void"
        }
      }
    ],
    "meta": {
      "order": 44,
      "depth": 0,
      "align": "center"
    }
  },
  "pg-image": {
    "id": "pg-image",
    "type": "Image",
    "value": [
      {
        "id": "pg-image-el",
        "type": "image",
        "children": [
          {
            "text": ""
          }
        ],
        "props": {
          "nodeType": "void",
          "id": "playground-image-1",
          "src": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
          "alt": "Yoopta Editor",
          "sizes": {
            "width": 600,
            "height": 400
          }
        }
      }
    ],
    "meta": {
      "order": 45,
      "depth": 0,
      "align": "center"
    }
  },
  "pg-video": {
    "id": "pg-video",
    "type": "Video",
    "value": [
      {
        "id": "pg-video-el",
        "type": "video",
        "children": [
          {
            "text": ""
          }
        ],
        "props": {
          "nodeType": "void",
          "src": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          "provider": {
            "type": "youtube",
            "id": "dQw4w9WgXcQ",
            "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          },
          "sizes": {
            "width": 640,
            "height": 360
          }
        }
      }
    ],
    "meta": {
      "order": 46,
      "depth": 0,
      "align": "center"
    }
  },
  "pg-file": {
    "id": "pg-file",
    "type": "File",
    "value": [
      {
        "id": "pg-file-el",
        "type": "file",
        "children": [
          {
            "text": ""
          }
        ],
        "props": {
          "id": "playground-file-1",
          "src": "#",
          "name": "example.pdf",
          "size": 1024,
          "format": "pdf"
        }
      }
    ],
    "meta": {
      "order": 48,
      "depth": 0
    }
  },
  "pg-p-cta": {
    "id": "pg-p-cta",
    "type": "Paragraph",
    "value": [
      {
        "id": "pg-p-cta-el",
        "type": "paragraph",
        "children": [
          {
            "text": "This playground uses every plugin and mark from the full-setup. "
          },
          {
            "text": "Edit anything",
            "bold": true
          },
          {
            "text": ", add blocks with "
          },
          {
            "text": "/",
            "code": true
          },
          {
            "text": ", and explore the editor. "
          },
          {
            "text": "Yoopta Editor v6",
            "bold": true
          },
          {
            "text": " — headless, themeable, and ready for production."
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
  "56612492-881d-4aa5-9f7b-6370e417f9d4": {
    "id": "56612492-881d-4aa5-9f7b-6370e417f9d4",
    "type": "Paragraph",
    "value": [
      {
        "id": "06861183-71dd-4a7b-bb2b-b291a779d891",
        "type": "paragraph",
        "children": [
          {
            "text": ""
          }
        ]
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 1
    }
  },
  "959b545c-4fe0-489f-a4c2-3d064155de05": {
    "id": "959b545c-4fe0-489f-a4c2-3d064155de05",
    "type": "Paragraph",
    "value": [
      {
        "id": "1805a4b1-3af5-4756-a684-50ce7fff4943",
        "type": "paragraph",
        "children": [
          {
            "text": ""
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 19
    }
  },
  "cf912bed-a4f9-4590-80db-0e3a0747f4cb": {
    "id": "cf912bed-a4f9-4590-80db-0e3a0747f4cb",
    "type": "Paragraph",
    "value": [
      {
        "id": "a61b6279-02a0-49b7-9dfc-3dae9df6ff11",
        "type": "paragraph",
        "children": [
          {
            "text": ""
          }
        ]
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 3
    }
  },
  "f808493b-18a4-454a-b299-fed3c05cc778": {
    "id": "f808493b-18a4-454a-b299-fed3c05cc778",
    "type": "Paragraph",
    "value": [
      {
        "id": "aa44104a-bf6d-447b-8f30-8e3254a38a4f",
        "type": "paragraph",
        "children": [
          {
            "text": ""
          }
        ]
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 5
    }
  },
  "253b2746-0ae1-4f53-ac49-41368c99b24a": {
    "id": "253b2746-0ae1-4f53-ac49-41368c99b24a",
    "type": "Paragraph",
    "value": [
      {
        "id": "fcbf499e-20b4-4b90-bdc6-0a8fc54b1dc3",
        "type": "paragraph",
        "children": [
          {
            "text": ""
          }
        ]
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 8
    }
  },
  "c4422128-55db-4147-8941-169c7f098a17": {
    "id": "c4422128-55db-4147-8941-169c7f098a17",
    "type": "Paragraph",
    "value": [
      {
        "id": "a28c4e32-62a0-4e15-9312-c443a6d7c678",
        "type": "paragraph",
        "children": [
          {
            "text": ""
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 11
    }
  },
  "d265f980-9606-40df-bca6-c6a6d0247068": {
    "id": "d265f980-9606-40df-bca6-c6a6d0247068",
    "type": "Paragraph",
    "value": [
      {
        "id": "227ad4f4-a298-46b9-8efa-32393a97b454",
        "type": "paragraph",
        "children": [
          {
            "text": ""
          }
        ]
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 47
    }
  },
  "e1534d09-eaab-4762-8f8a-a2736ab5afa3": {
    "id": "e1534d09-eaab-4762-8f8a-a2736ab5afa3",
    "type": "HeadingTwo",
    "meta": {
      "order": 50,
      "depth": 0
    },
    "value": [
      {
        "id": "fc282d71-7788-4b32-8806-bcc051b8754a",
        "type": "heading-two",
        "props": {
          "withAnchor": false
        },
        "children": [
          {
            "text": "Links: "
          },
          {
            "id": "pg-link-1",
            "type": "link",
            "props": {
              "url": "https://docs.yoopta.dev",
              "target": "_blank",
              "rel": "noopener noreferrer",
              "title": "Documentation",
              "nodeType": "inline"
            },
            "children": [
              {
                "text": "Documentation"
              }
            ]
          },
          {
            "text": " · "
          },
          {
            "id": "pg-link-2",
            "type": "link",
            "props": {
              "url": "https://github.com/Darginec05/Yoopta-Editor",
              "target": "_blank",
              "rel": "noopener noreferrer",
              "title": "GitHub",
              "nodeType": "inline"
            },
            "children": [
              {
                "text": "GitHub"
              }
            ]
          },
          {
            "text": " — get started and star the repo!"
          }
        ]
      }
    ]
  },
  "d4d2e77a-3797-476b-bf55-ca71b4c9000f": {
    "id": "d4d2e77a-3797-476b-bf55-ca71b4c9000f",
    "type": "Paragraph",
    "value": [
      {
        "id": "fa667196-2631-4aec-9f34-abb21117eaad",
        "type": "paragraph",
        "children": [
          {
            "text": ""
          }
        ]
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 52
    }
  },
  "d81a33fe-3083-47e5-ac46-f3f96a87eb09": {
    "id": "d81a33fe-3083-47e5-ac46-f3f96a87eb09",
    "type": "HeadingOne",
    "meta": {
      "depth": 0,
      "order": 0
    },
    "value": [
      {
        "id": "4d892576-03f0-4a44-a9ee-1e6001b5af06",
        "type": "heading-one",
        "props": {
          "nodeType": "block"
        },
        "children": [
          {
            "text": "Welcome to Yoopta Editor"
          }
        ]
      }
    ]
  },
  "f7cec4fc-e2ff-45a0-bc68-63eff3f83111": {
    "id": "f7cec4fc-e2ff-45a0-bc68-63eff3f83111",
    "type": "Paragraph",
    "value": [
      {
        "id": "10f0964d-f6ef-4eda-b5a2-edb098f694bd",
        "type": "paragraph",
        "children": [
          {
            "text": ""
          }
        ]
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 28
    }
  },
  "11463223-8c71-41d4-b3ea-d9e04663b5ed": {
    "id": "11463223-8c71-41d4-b3ea-d9e04663b5ed",
    "type": "Paragraph",
    "value": [
      {
        "id": "803127cc-7c65-4fc6-857a-5814ef9cfef4",
        "type": "paragraph",
        "children": [
          {
            "text": ""
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 40
    }
  },
  "dcd9f5e4-c9ee-4c0e-8368-bc321b70158f": {
    "id": "dcd9f5e4-c9ee-4c0e-8368-bc321b70158f",
    "type": "Paragraph",
    "value": [
      {
        "id": "7641fe47-61f0-4658-8a5d-9558de7048c9",
        "type": "paragraph",
        "children": [
          {
            "text": ""
          }
        ]
      }
    ],
    "meta": {
      "align": "left",
      "depth": 0,
      "order": 49
    }
  }
} as unknown as YooptaContentValue;
