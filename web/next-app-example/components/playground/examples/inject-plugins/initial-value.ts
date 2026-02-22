import type { YooptaContentValue } from "@yoopta/editor";

export const injectPluginsInitialValue: YooptaContentValue = {
  "ip-h1": {
    "id": "ip-h1",
    "type": "HeadingOne",
    "value": [
      {
        "id": "ip-h1-el",
        "type": "heading-one",
        "children": [
          {
            "text": "Plugin Injection: Nested Blocks"
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
  "ip-intro": {
    "id": "ip-intro",
    "type": "Paragraph",
    "value": [
      {
        "id": "ip-intro-el",
        "type": "paragraph",
        "children": [
          {
            "text": "Yoopta's "
          },
          {
            "text": "injectElementsFromPlugins",
            "code": true
          },
          {
            "text": " lets you embed blocks from other plugins inside container plugins like "
          },
          {
            "text": "Accordion",
            "bold": true
          },
          {
            "text": ", "
          },
          {
            "text": "Tabs",
            "bold": true
          },
          {
            "text": ", "
          },
          {
            "text": "Steps",
            "bold": true
          },
          {
            "text": ", and "
          },
          {
            "text": "Carousel",
            "bold": true
          },
          {
            "text": ". Click into any leaf area below and type "
          },
          {
            "text": "/",
            "code": true
          },
          {
            "text": " to insert paragraphs, callouts, code blocks, or images directly inside these containers."
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
  "ip-divider-1": {
    "id": "ip-divider-1",
    "type": "Divider",
    "value": [
      {
        "id": "ip-divider-1-el",
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
  "ip-h2-accordion": {
    "id": "ip-h2-accordion",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "ip-h2-accordion-el",
        "type": "heading-two",
        "children": [
          {
            "text": "Accordion with Injected Plugins"
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
  "ip-p-accordion": {
    "id": "ip-p-accordion",
    "type": "Paragraph",
    "value": [
      {
        "id": "ip-p-accordion-el",
        "type": "paragraph",
        "children": [
          {
            "text": "This accordion has "
          },
          {
            "text": "Paragraph, Callout, Code, and Image",
            "bold": true
          },
          {
            "text": " injected. Expand each item and use the slash command inside the content area to insert rich blocks."
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
  "ip-accordion": {
    "id": "ip-accordion",
    "type": "Accordion",
    "value": [
      {
        "id": "ip-acc-list",
        "type": "accordion-list",
        "children": [
          {
            "id": "ip-acc-item-1",
            "type": "accordion-list-item",
            "children": [
              {
                "id": "ip-acc-heading-1",
                "type": "accordion-list-item-heading",
                "children": [
                  {
                    "text": "What is plugin injection?"
                  }
                ]
              },
              {
                "id": "ip-acc-content-1",
                "type": "accordion-list-item-content",
                "children": [
                  {
                    "text": "Plugin injection allows leaf elements in container plugins to accept blocks from other plugins. For example, this accordion content area can contain paragraphs, callouts, code blocks, and images — not just plain text."
                  }
                ]
              }
            ],
            "props": {
              "isExpanded": true
            }
          },
          {
            "id": "ip-acc-item-2",
            "type": "accordion-list-item",
            "children": [
              {
                "id": "ip-acc-heading-2",
                "type": "accordion-list-item-heading",
                "children": [
                  {
                    "text": "How do I use it?"
                  }
                ]
              },
              {
                "id": "ip-acc-content-2",
                "type": "accordion-list-item-content",
                "children": [
                  {
                    "id": "31b10b1a-43c2-4f19-8b0f-29837c12b5bf",
                    "type": "callout",
                    "children": [
                      {
                        "text": "Callout inside Accordio"
                      }
                    ],
                    "props": {
                      "theme": "default",
                      "nodeType": "block"
                    }
                  }
                ]
              }
            ],
            "props": {
              "isExpanded": true
            }
          },
          {
            "id": "ip-acc-item-3",
            "type": "accordion-list-item",
            "children": [
              {
                "id": "ip-acc-heading-3",
                "type": "accordion-list-item-heading",
                "children": [
                  {
                    "text": "Try it yourself"
                  }
                ]
              },
              {
                "id": "ip-acc-content-3",
                "type": "accordion-list-item-content",
                "children": [
                  {
                    "text": "Click here and type / to insert a code block, callout, or image inside this accordion item."
                  }
                ]
              }
            ],
            "props": {
              "isExpanded": true
            }
          }
        ]
      }
    ],
    "meta": {
      "order": 5,
      "depth": 0
    }
  },
  "ip-code-accordion": {
    "id": "ip-code-accordion",
    "type": "Code",
    "value": [
      {
        "id": "ip-code-accordion-el",
        "type": "code",
        "children": [
          {
            "text": "Accordion.extend({\n  injectElementsFromPlugins: [Paragraph, Callout, Code.Code, Image],\n})"
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
      "order": 6,
      "depth": 0
    }
  },
  "ip-divider-2": {
    "id": "ip-divider-2",
    "type": "Divider",
    "value": [
      {
        "id": "ip-divider-2-el",
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
      "order": 7,
      "depth": 0
    }
  },
  "ip-h2-tabs": {
    "id": "ip-h2-tabs",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "ip-h2-tabs-el",
        "type": "heading-two",
        "children": [
          {
            "text": "Tabs with Injected Plugins"
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
  "ip-p-tabs": {
    "id": "ip-p-tabs",
    "type": "Paragraph",
    "value": [
      {
        "id": "ip-p-tabs-el",
        "type": "paragraph",
        "children": [
          {
            "text": "These tabs allow inserting "
          },
          {
            "text": "rich content",
            "bold": true
          },
          {
            "text": " in each tab's content area. Switch between tabs and use the slash command to add blocks inside each one."
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
  "ip-tabs": {
    "id": "ip-tabs",
    "type": "Tabs",
    "value": [
      {
        "id": "ip-tabs-container",
        "type": "tabs-container",
        "children": [
          {
            "id": "ip-tabs-list",
            "type": "tabs-list",
            "children": [
              {
                "id": "ip-tab-1",
                "type": "tabs-item-heading",
                "children": [
                  {
                    "text": "Javascript"
                  }
                ]
              },
              {
                "id": "ip-tab-2",
                "type": "tabs-item-heading",
                "children": [
                  {
                    "text": "Typescript"
                  }
                ]
              },
              {
                "id": "ip-tab-3",
                "type": "tabs-item-heading",
                "children": [
                  {
                    "text": "Callout"
                  }
                ]
              }
            ]
          },
          {
            "id": "ip-tab-content-1",
            "type": "tabs-item-content",
            "children": [
              {
                "id": "43f47146-61df-4e30-8603-d272f14a8dfd",
                "type": "code",
                "children": [
                  {
                    "text": "const kekCeburek = \"\""
                  }
                ],
                "props": {
                  "language": "javascript",
                  "theme": "github-dark"
                }
              }
            ],
            "props": {
              "referenceId": "ip-tab-1"
            }
          },
          {
            "id": "ip-tab-content-2",
            "type": "tabs-item-content",
            "children": [
              {
                "id": "af3a470a-0d30-44ea-b3d1-bc44f1aeca6c",
                "type": "code",
                "children": [
                  {
                    "text": "type KekCeburek = {}"
                  }
                ],
                "props": {
                  "language": "typescript",
                  "theme": "github-dark",
                  "activeTabId": "ip-tab-2"
                }
              }
            ],
            "props": {
              "referenceId": "ip-tab-2"
            }
          },
          {
            "id": "ip-tab-content-3",
            "type": "tabs-item-content",
            "children": [
              {
                "id": "18a08415-941e-496c-98bb-aabf52d459e3",
                "type": "callout",
                "children": [
                  {
                    "text": "Callout is here "
                  }
                ],
                "props": {
                  "theme": "info",
                  "nodeType": "block"
                }
              }
            ],
            "props": {
              "referenceId": "ip-tab-3"
            }
          }
        ],
        "props": {
          "activeTabId": "ip-tab-3"
        }
      }
    ],
    "meta": {
      "order": 10,
      "depth": 0
    }
  },
  "ip-code-tabs": {
    "id": "ip-code-tabs",
    "type": "Code",
    "value": [
      {
        "id": "ip-code-tabs-el",
        "type": "code",
        "children": [
          {
            "text": "Tabs.extend({\n  injectElementsFromPlugins: [Paragraph, Callout, Code.Code, Image],\n})"
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
      "order": 11,
      "depth": 0
    }
  },
  "ip-divider-3": {
    "id": "ip-divider-3",
    "type": "Divider",
    "value": [
      {
        "id": "ip-divider-3-el",
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
      "order": 12,
      "depth": 0
    }
  },
  "ip-h2-steps": {
    "id": "ip-h2-steps",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "ip-h2-steps-el",
        "type": "heading-two",
        "children": [
          {
            "text": "Steps with Injected Plugins"
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
  "ip-p-steps": {
    "id": "ip-p-steps",
    "type": "Paragraph",
    "value": [
      {
        "id": "ip-p-steps-el",
        "type": "paragraph",
        "children": [
          {
            "text": "Step-by-step guides become much more useful when each step can contain "
          },
          {
            "text": "code snippets",
            "bold": true
          },
          {
            "text": ", "
          },
          {
            "text": "callouts",
            "bold": true
          },
          {
            "text": ", or "
          },
          {
            "text": "images",
            "bold": true
          },
          {
            "text": ". Try using the slash command in the step content areas below."
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
  "ip-steps": {
    "id": "ip-steps",
    "type": "Steps",
    "value": [
      {
        "id": "ip-step-container",
        "type": "step-container",
        "children": [
          {
            "id": "ip-step-list",
            "type": "step-list",
            "children": [
              {
                "id": "ip-step-item-1",
                "type": "step-list-item",
                "children": [
                  {
                    "id": "ip-step-heading-1",
                    "type": "step-list-item-heading",
                    "children": [
                      {
                        "text": "Install the packages"
                      }
                    ]
                  },
                  {
                    "id": "ip-step-content-1",
                    "type": "step-list-item-content",
                    "children": [
                      {
                        "text": "Run npm install @yoopta/editor @yoopta/accordion @yoopta/paragraph to get started. Type / here to add a code block with the exact command."
                      }
                    ]
                  }
                ]
              },
              {
                "id": "ip-step-item-2",
                "type": "step-list-item",
                "children": [
                  {
                    "id": "ip-step-heading-2",
                    "type": "step-list-item-heading",
                    "children": [
                      {
                        "text": "Configure plugin injection"
                      }
                    ]
                  },
                  {
                    "id": "ip-step-content-2",
                    "type": "step-list-item-content",
                    "children": [
                      {
                        "text": "Use .extend() to add injectElementsFromPlugins to any container plugin. This tells Yoopta which block types are allowed inside the container's leaf elements."
                      }
                    ]
                  }
                ]
              },
              {
                "id": "ip-step-item-3",
                "type": "step-list-item",
                "children": [
                  {
                    "id": "ip-step-heading-3",
                    "type": "step-list-item-heading",
                    "children": [
                      {
                        "text": "Use the slash command inside containers"
                      }
                    ]
                  },
                  {
                    "id": "ip-step-content-3",
                    "type": "step-list-item-content",
                    "children": [
                      {
                        "text": "When your cursor is inside a leaf element with injected plugins, the slash command menu will only show the allowed plugin types. Try it right here!"
                      }
                    ]
                  }
                ]
              },
              {
                "id": "c80b4674-cd41-477a-817b-b5a9407e1af5",
                "type": "step-list-item",
                "children": [
                  {
                    "id": "3d54674e-744c-4182-bfc2-ef3757c33da8",
                    "type": "step-list-item-heading",
                    "children": [
                      {
                        "text": "Here is example for Steps plugin"
                      }
                    ],
                    "props": {
                      "nodeType": "block"
                    }
                  },
                  {
                    "id": "ca3b21c4-f0e4-48fc-8d9e-0b2c88e82828",
                    "type": "step-list-item-content",
                    "children": [
                      {
                        "id": "615708ec-afdb-48da-8690-d58c3190a5ec",
                        "type": "code",
                        "children": [
                          {
                            "text": "const vars = \"it works!\""
                          }
                        ],
                        "props": {
                          "language": "javascript",
                          "theme": "github-dark"
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
                  "order": 3
                }
              }
            ]
          }
        ]
      }
    ],
    "meta": {
      "order": 15,
      "depth": 0
    }
  },
  "ip-code-steps": {
    "id": "ip-code-steps",
    "type": "Code",
    "value": [
      {
        "id": "ip-code-steps-el",
        "type": "code",
        "children": [
          {
            "text": "Steps.extend({\n  injectElementsFromPlugins: [Paragraph, Callout, Code.Code, Image],\n})"
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
      "order": 16,
      "depth": 0
    }
  },
  "ip-divider-4": {
    "id": "ip-divider-4",
    "type": "Divider",
    "value": [
      {
        "id": "ip-divider-4-el",
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
      "order": 17,
      "depth": 0
    }
  },
  "ip-h2-carousel": {
    "id": "ip-h2-carousel",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "ip-h2-carousel-el",
        "type": "heading-two",
        "children": [
          {
            "text": "Carousel with Injected Image"
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 18,
      "depth": 0
    }
  },
  "ip-p-carousel": {
    "id": "ip-p-carousel",
    "type": "Paragraph",
    "value": [
      {
        "id": "ip-p-carousel-el",
        "type": "paragraph",
        "children": [
          {
            "text": "The Carousel plugin with "
          },
          {
            "text": "Image",
            "bold": true
          },
          {
            "text": " injected lets you build image galleries. Use the slash command inside carousel items to insert images."
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 19,
      "depth": 0
    }
  },
  "ip-code-carousel": {
    "id": "ip-code-carousel",
    "type": "Code",
    "value": [
      {
        "id": "ip-code-carousel-el",
        "type": "code",
        "children": [
          {
            "text": "Carousel.extend({\n  injectElementsFromPlugins: [Image],\n})"
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
      "order": 20,
      "depth": 0
    }
  },
  "ip-divider-5": {
    "id": "ip-divider-5",
    "type": "Divider",
    "value": [
      {
        "id": "ip-divider-5-el",
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
      "order": 21,
      "depth": 0
    }
  },
  "ip-h2-summary": {
    "id": "ip-h2-summary",
    "type": "HeadingTwo",
    "value": [
      {
        "id": "ip-h2-summary-el",
        "type": "heading-two",
        "children": [
          {
            "text": "How It Works"
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
  "ip-callout-rules": {
    "id": "ip-callout-rules",
    "type": "Callout",
    "value": [
      {
        "id": "ip-callout-rules-el",
        "type": "callout",
        "children": [
          {
            "text": "Only leaf elements (elements with no children defined) can receive injected plugins. If you try to set injectElementsFromPlugins on a parent element that has children, Yoopta will throw an error."
          }
        ],
        "props": {
          "nodeType": "block",
          "theme": "warning"
        }
      }
    ],
    "meta": {
      "order": 23,
      "depth": 0
    }
  },
  "ip-bl-1": {
    "id": "ip-bl-1",
    "type": "BulletedList",
    "value": [
      {
        "id": "ip-bl-1-el",
        "type": "bulleted-list",
        "children": [
          {
            "text": "Plugin-level injection",
            "bold": true
          },
          {
            "text": " applies to all leaf elements in the container via .extend({ injectElementsFromPlugins: [...] })"
          }
        ],
        "props": {
          "nodeType": "block"
        }
      }
    ],
    "meta": {
      "order": 24,
      "depth": 0
    }
  },
  "ip-bl-2": {
    "id": "ip-bl-2",
    "type": "BulletedList",
    "value": [
      {
        "id": "ip-bl-2-el",
        "type": "bulleted-list",
        "children": [
          {
            "text": "Element-level injection",
            "bold": true
          },
          {
            "text": " targets specific leaf elements via .extend({ elements: { 'element-type': { injectElementsFromPlugins: [...] } } })"
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
  "ip-bl-3": {
    "id": "ip-bl-3",
    "type": "BulletedList",
    "value": [
      {
        "id": "ip-bl-3-el",
        "type": "bulleted-list",
        "children": [
          {
            "text": "The slash command menu ",
            "italic": true
          },
          {
            "text": "automatically filters to only show injected plugin types when the cursor is inside a container's leaf element"
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
  "ip-callout-tip": {
    "id": "ip-callout-tip",
    "type": "Callout",
    "value": [
      {
        "id": "ip-callout-tip-el",
        "type": "callout",
        "children": [
          {
            "text": "This is an interactive example. Expand the accordion items, switch between tabs, and try typing / in the content areas to see injection in action!"
          }
        ],
        "props": {
          "nodeType": "block",
          "theme": "success"
        }
      }
    ],
    "meta": {
      "order": 27,
      "depth": 0
    }
  },
  "b1c67d45-18fa-4e89-9e93-4a7a6fa10d4e": {
    "id": "b1c67d45-18fa-4e89-9e93-4a7a6fa10d4e",
    "type": "Paragraph",
    "value": [
      {
        "id": "cc21d35e-e0b6-4377-b93e-1ba0817fa664",
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
      "order": 28
    }
  }
}
