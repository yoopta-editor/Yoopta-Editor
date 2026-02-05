import type { YooptaContentValue } from "@yoopta/editor";

/**
 * Initial value for video intro recording.
 * Showcases variety of blocks in a visually appealing way.
 */
export const videoIntroInitialValue: YooptaContentValue = {
  "vi-h1": {
    "id": "vi-h1",
    "type": "HeadingOne",
    "value": [
      {
        "id": "vi-h1-el",
        "type": "heading-one",
        "children": [
          {
            "text": "Welcome to "
          },
          {
            "text": "Yoopta",
            "bold": true,
            "highlight": {
              "color": "#dd6262"
            }
          },
          {
            "bold": true,
            "text": " Editor"
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
  "vi-p-intro": {
    "id": "vi-p-intro",
    "type": "Paragraph",
    "value": [
      {
        "id": "vi-p-intro-el",
        "type": "paragraph",
        "children": [
          {
            "text": "The "
          },
          {
            "text": "open-source",
            "bold": true
          },
          {
            "text": ", "
          },
          {
            "text": "headless",
            "italic": true
          },
          {
            "text": " rich-text editor for React. Build "
          },
          {
            "text": "Notion-like",
            "bold": true,
            "italic": true
          },
          {
            "text": " experiences in minutes."
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
  "vi-divider-1": {
    "id": "vi-divider-1",
    "type": "Divider",
    "value": [
      {
        "id": "vi-divider-1-el",
        "type": "divider",
        "children": [
          {
            "text": ""
          }
        ],
        "props": {
          "nodeType": "void",
          "color": "#e5e5e5",
          "theme": "gradient"
        }
      }
    ],
    "meta": {
      "order": 2,
      "depth": 0
    }
  },
  "vi-h2-features": {
    "id": "vi-h2-features",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "vi-h2-features-el",
        "type": "heading-two",
        "children": [
          {
            "text": "Why developers love it"
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
  "vi-callout": {
    "id": "vi-callout",
    "type": "Callout",
    "value": [
      {
        "id": "vi-callout-el",
        "type": "callout",
        "children": [
          {
            "text": "20+ plugins"
          },
          {
            "text": " • "
          },
          {
            "text": "Drag & drop"
          },
          {
            "text": " • "
          },
          {
            "text": "Keyboard shortcuts"
          },
          {
            "text": " • "
          },
          {
            "text": "Themes"
          },
          {
            "text": " • "
          },
          {
            "text": "TypeScript"
          }
        ],
        "props": {
          "nodeType": "block",
          "theme": "info"
        }
      }
    ],
    "meta": {
      "order": 4,
      "depth": 0
    }
  },
  "vi-bl-1": {
    "id": "vi-bl-1",
    "type": "BulletedList",
    "value": [
      {
        "id": "vi-bl-1-el",
        "type": "bulleted-list",
        "children": [
          {
            "text": "Block-based architecture — each block is independent",
            "underline": true
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
  "vi-bl-2": {
    "id": "vi-bl-2",
    "type": "BulletedList",
    "value": [
      {
        "id": "vi-bl-2-el",
        "type": "bulleted-list",
        "children": [
          {
            "text": "Pre-built UI components — toolbar, slash menu, block options",
            "underline": true
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
  "vi-bl-3": {
    "id": "vi-bl-3",
    "type": "BulletedList",
    "value": [
      {
        "id": "vi-bl-3-el",
        "type": "bulleted-list",
        "children": [
          {
            "text": "Export to HTML, Markdown, Email — built-in serializers",
            "underline": true
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
  "vi-h2-code": {
    "id": "vi-h2-code",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "vi-h2-code-el",
        "type": "heading-two",
        "children": [
          {
            "text": "Quick setup",
            "underline": true
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
  "vi-code": {
    "id": "vi-code",
    "type": "Code",
    "value": [
      {
        "id": "vi-code-el",
        "type": "code",
        "children": [
          {
            "text": "import YooptaEditor, { createYooptaEditor } from '@yoopta/editor';\nimport Paragraph from '@yoopta/paragraph';\n\nconst plugins = [Paragraph];\nconst editor = createYooptaEditor({ plugins });\n\n<YooptaEditor editor={editor} />"
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
      "order": 9,
      "depth": 0
    }
  },
  "vi-h2-blocks": {
    "id": "vi-h2-blocks",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "vi-h2-blocks-el",
        "type": "heading-two",
        "children": [
          {
            "text": "Rich block types"
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
  "vi-table": {
    "id": "vi-table",
    "type": "Table",
    "value": [
      {
        "id": "vi-table-el",
        "type": "table",
        "children": [
          {
            "id": "vi-tr-1",
            "type": "table-row",
            "children": [
              {
                "id": "afe55849-3ac0-4379-a241-a5e036da60b8",
                "type": "table-data-cell",
                "children": [
                  {
                    "id": "vi-th-1",
                    "type": "table-head-cell",
                    "children": [
                      {
                        "text": "Category",
                        "bold": true
                      }
                    ],
                    "props": {
                      "nodeType": "block",
                      "asHeader": true,
                      "width": 150
                    }
                  }
                ]
              },
              {
                "id": "5fe03f02-0a9f-499c-bd3f-a375fc6c9971",
                "type": "table-data-cell",
                "children": [
                  {
                    "id": "vi-th-2",
                    "type": "table-head-cell",
                    "children": [
                      {
                        "text": "Plugins",
                        "bold": true
                      }
                    ],
                    "props": {
                      "nodeType": "block",
                      "asHeader": true,
                      "width": 300
                    }
                  }
                ]
              }
            ],
            "props": {
              "nodeType": "block"
            }
          },
          {
            "id": "vi-tr-2",
            "type": "table-row",
            "children": [
              {
                "id": "vi-td-1",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Text"
                  }
                ],
                "props": {
                  "nodeType": "block",
                  "width": 150
                }
              },
              {
                "id": "vi-td-2",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Paragraph, Headings, Blockquote, Lists"
                  }
                ],
                "props": {
                  "nodeType": "block",
                  "width": 300
                }
              }
            ],
            "props": {
              "nodeType": "block"
            }
          },
          {
            "id": "vi-tr-3",
            "type": "table-row",
            "children": [
              {
                "id": "vi-td-3",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Media"
                  }
                ],
                "props": {
                  "nodeType": "block",
                  "width": 150
                }
              },
              {
                "id": "vi-td-4",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Image, Video, File, Embed, Carousel"
                  }
                ],
                "props": {
                  "nodeType": "block",
                  "width": 300
                }
              }
            ],
            "props": {
              "nodeType": "block"
            }
          },
          {
            "id": "vi-tr-4",
            "type": "table-row",
            "children": [
              {
                "id": "vi-td-5",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Layout"
                  }
                ],
                "props": {
                  "nodeType": "block",
                  "width": 150
                }
              },
              {
                "id": "vi-td-6",
                "type": "table-data-cell",
                "children": [
                  {
                    "text": "Table, Accordion, Tabs, Steps, Callout"
                  }
                ],
                "props": {
                  "nodeType": "block",
                  "width": 300
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
      "order": 11,
      "depth": 0
    }
  },
  "vi-blockquote": {
    "id": "vi-blockquote",
    "type": "Blockquote",
    "value": [
      {
        "id": "vi-blockquote-el",
        "type": "blockquote",
        "children": [
          {
            "text": "Finally, a rich-text editor that just works. Saved me weeks of development time."
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
  "vi-p-author": {
    "id": "vi-p-author",
    "type": "Paragraph",
    "value": [
      {
        "id": "vi-p-author-el",
        "type": "paragraph",
        "children": [
          {
            "text": "— A happy developer using Yoopta",
            "italic": true
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
  "vi-divider-2": {
    "id": "vi-divider-2",
    "type": "Divider",
    "value": [
      {
        "id": "vi-divider-2-el",
        "type": "divider",
        "children": [
          {
            "text": ""
          }
        ],
        "props": {
          "nodeType": "void",
          "color": "#e5e5e5",
          "theme": "gradient"
        }
      }
    ],
    "meta": {
      "order": 14,
      "depth": 0
    }
  },
  "vi-h2-cta": {
    "id": "vi-h2-cta",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "vi-h2-cta-el",
        "type": "heading-two",
        "children": [
          {
            "text": "Get started today"
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
  "vi-todo-1": {
    "id": "vi-todo-1",
    "type": "TodoList",
    "value": [
      {
        "id": "vi-todo-1-el",
        "type": "todo-list",
        "children": [
          {
            "text": "npm install @yoopta/editor"
          }
        ],
        "props": {
          "nodeType": "block",
          "checked": true
        }
      }
    ],
    "meta": {
      "order": 16,
      "depth": 0
    }
  },
  "vi-todo-2": {
    "id": "vi-todo-2",
    "type": "TodoList",
    "value": [
      {
        "id": "vi-todo-2-el",
        "type": "todo-list",
        "children": [
          {
            "text": "Add plugins you need"
          }
        ],
        "props": {
          "nodeType": "block",
          "checked": true
        }
      }
    ],
    "meta": {
      "order": 17,
      "depth": 0
    }
  },
  "vi-todo-3": {
    "id": "vi-todo-3",
    "type": "TodoList",
    "value": [
      {
        "id": "vi-todo-3-el",
        "type": "todo-list",
        "children": [
          {
            "text": "Build something amazing"
          }
        ],
        "props": {
          "nodeType": "block",
          "checked": false
        }
      }
    ],
    "meta": {
      "order": 18,
      "depth": 0
    }
  },
  "vi-p-final": {
    "id": "vi-p-final",
    "type": "Paragraph",
    "value": [
      {
        "id": "vi-p-final-el",
        "type": "paragraph",
        "children": [
          {
            "text": "Free"
          },
          {
            "text": " • "
          },
          {
            "text": "Open Source"
          },
          {
            "text": " • "
          },
          {
            "text": "MIT License"
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 19,
      "depth": 0,
      "align": "center"
    }
  }
}
