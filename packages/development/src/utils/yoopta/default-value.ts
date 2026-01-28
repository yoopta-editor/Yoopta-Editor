import { YooptaContentValue } from '@yoopta/editor';

export const DEFAULT_VALUE = {
  // "92d120f1-754d-4607-bae6-c8c52f22d36c": {
  //   "id": "92d120f1-754d-4607-bae6-c8c52f22d36c",
  //   "type": "HeadingOne",
  //   "value": [
  //     {
  //       "id": "1a62156f-be1b-4bcf-8d0f-ef40e85650cf",
  //       "type": "heading-one",
  //       "children": [
  //         {
  //           "text": "About Railway"
  //         }
  //       ],
  //       "props": {
  //         "nodeType": "block"
  //       }
  //     }
  //   ],
  //   "meta": {
  //     "align": "left",
  //     "depth": 0,
  //     "order": 0
  //   }
  // },
  // "980b9946-9a2e-4707-9046-e10175c82e7d": {
  //   "id": "980b9946-9a2e-4707-9046-e10175c82e7d",
  //   "type": "Paragraph",
  //   "value": [
  //     {
  //       "id": "10d328cb-31be-4aff-803f-cc8a72a896a2",
  //       "type": "paragraph",
  //       "children": [
  //         {
  //           "text": "Railway is a deployment platform designed to streamline the software development life-cycle, starting with instant deployments and effortless scale, extending to CI/CD integrations and built-in observability."
  //         }
  //       ],
  //       "props": {
  //         "nodeType": "block"
  //       }
  //     }
  //   ],
  //   "meta": {
  //     "align": "left",
  //     "depth": 0,
  //     "order": 1
  //   }
  // },
  // "b1fd5415-6c13-4e57-8fbb-aa69581793b7": {
  //   "id": "b1fd5415-6c13-4e57-8fbb-aa69581793b7",
  //   "type": "HeadingTwo",
  //   "value": [
  //     {
  //       "id": "2b4db09c-3075-4e12-a0f4-0f40584219e7",
  //       "type": "heading-two",
  //       "children": [
  //         {
  //           "id": "45038445-205a-41e5-b97f-eae09afcd0ee",
  //           "type": "link",
  //           "props": {
  //             "url": "",
  //             "target": "_self",
  //             "rel": "noopener noreferrer",
  //             "title": "Deploying on Railway",
  //             "nodeType": "inline"
  //           },
  //           "children": [
  //             {
  //               "text": "Deploying on Railway"
  //             }
  //           ]
  //         }
  //       ],
  //       "props": {
  //         "nodeType": "block",
  //         "withAnchor": false
  //       }
  //     }
  //   ],
  //   "meta": {
  //     "align": "left",
  //     "depth": 0,
  //     "order": 2
  //   }
  // },
  // "d7bd9ade-f81e-4f1d-880c-0a0a590cf8a9": {
  //   "id": "d7bd9ade-f81e-4f1d-880c-0a0a590cf8a9",
  //   "type": "Paragraph",
  //   "value": [
  //     {
  //       "id": "7f5315e6-3351-446c-b24b-257ca687c580",
  //       "type": "paragraph",
  //       "children": [
  //         {
  //           "text": "Point Railway to your deployment source and let the platform handle the rest."
  //         }
  //       ],
  //       "props": {
  //         "nodeType": "block"
  //       }
  //     }
  //   ],
  //   "meta": {
  //     "align": "left",
  //     "depth": 0,
  //     "order": 3
  //   }
  // },
  // "0e444a92-dfc4-4530-b5fc-3fab1d913fa9": {
  //   "id": "0e444a92-dfc4-4530-b5fc-3fab1d913fa9",
  //   "type": "Paragraph",
  //   "value": [
  //     {
  //       "id": "0b2e58e6-87cf-441c-b3da-e209d28f9819",
  //       "type": "paragraph",
  //       "children": [
  //         {
  //           "text": "Flexible Deployment Sources",
  //           "bold": true
  //         }
  //       ],
  //       "props": {
  //         "nodeType": "block"
  //       }
  //     }
  //   ],
  //   "meta": {
  //     "align": "left",
  //     "depth": 0,
  //     "order": 4
  //   }
  // },
  // "901107ad-755d-4842-b087-1b97a599e0f4": {
  //   "id": "901107ad-755d-4842-b087-1b97a599e0f4",
  //   "type": "BulletedList",
  //   "value": [
  //     {
  //       "id": "f9328195-0ae4-44ad-907d-65d4679c782c",
  //       "type": "bulleted-list",
  //       "children": [
  //         {
  //           "text": "Code Repositories"
  //         },
  //         {
  //           "text": ": With or without Dockerfiles. Railway will build an"
  //         },
  //         {
  //           "text": " "
  //         },
  //         {
  //           "text": "OCI compliant image"
  //         },
  //         {
  //           "text": " "
  //         },
  //         {
  //           "text": "based on what you provide."
  //         }
  //       ],
  //       "props": {
  //         "nodeType": "block"
  //       }
  //     }
  //   ],
  //   "meta": {
  //     "align": "left",
  //     "depth": 0,
  //     "order": 5
  //   }
  // },
  // "2651a4dc-7ba4-4c59-9071-d219f1069e92": {
  //   "id": "2651a4dc-7ba4-4c59-9071-d219f1069e92",
  //   "type": "BulletedList",
  //   "value": [
  //     {
  //       "id": "e9fba251-eed4-475f-b4f8-ac09ca29c790",
  //       "type": "bulleted-list",
  //       "children": [
  //         {
  //           "text": "Docker Images"
  //         },
  //         {
  //           "text": ": Directly from Docker Hub, GitHub Container Registry, GitLab Container Registry, Microsoft Container Registry, or Quay.io. We support public and private image registries."
  //         }
  //       ],
  //       "props": {
  //         "nodeType": "block"
  //       }
  //     }
  //   ],
  //   "meta": {
  //     "align": "left",
  //     "depth": 0,
  //     "order": 6
  //   }
  // },
  // "2f338128-4fe8-4c70-8725-7f575f8bec83": {
  //   "id": "2f338128-4fe8-4c70-8725-7f575f8bec83",
  //   "type": "Paragraph",
  //   "value": [
  //     {
  //       "id": "2313a956-9aaf-4db4-aec0-2c01f697bc68",
  //       "type": "paragraph",
  //       "children": [
  //         {
  //           "text": "Hassle-Free Setup",
  //           "bold": true
  //         }
  //       ],
  //       "props": {
  //         "nodeType": "block"
  //       }
  //     }
  //   ],
  //   "meta": {
  //     "align": "left",
  //     "depth": 0,
  //     "order": 7
  //   }
  // },
  // "5246bfc8-d8fc-4321-b9f7-cf094b9dc92a": {
  //   "id": "5246bfc8-d8fc-4321-b9f7-cf094b9dc92a",
  //   "type": "BulletedList",
  //   "value": [
  //     {
  //       "id": "321e97bc-7776-464f-93da-943c611b7331",
  //       "type": "bulleted-list",
  //       "children": [
  //         {
  //           "text": "Sane Defaults"
  //         },
  //         {
  //           "text": ": Out of the box, your project is deployed with sane defaults to get you up and running as fast as possible."
  //         }
  //       ],
  //       "props": {
  //         "nodeType": "block"
  //       }
  //     }
  //   ],
  //   "meta": {
  //     "align": "left",
  //     "depth": 0,
  //     "order": 8
  //   }
  // },
  // "3bf2c5fc-e5c0-4b0e-bfa4-aa0ed17a80ce": {
  //   "id": "3bf2c5fc-e5c0-4b0e-bfa4-aa0ed17a80ce",
  //   "type": "BulletedList",
  //   "value": [
  //     {
  //       "id": "1ede57b5-f950-4f63-b58c-e28c4f94cf9b",
  //       "type": "bulleted-list",
  //       "children": [
  //         {
  //           "text": "Configuration Tuning"
  //         },
  //         {
  //           "text": ": When you're ready, there are plenty of knobs and switches to optimize as needed."
  //         }
  //       ],
  //       "props": {
  //         "nodeType": "block"
  //       }
  //     }
  //   ],
  //   "meta": {
  //     "align": "left",
  //     "depth": 0,
  //     "order": 9
  //   }
  // },
  // "af1ee20c-4bf6-4d6c-a108-46f20e256c3f": {
  //   "id": "af1ee20c-4bf6-4d6c-a108-46f20e256c3f",
  //   "type": "HeadingTwo",
  //   "value": [
  //     {
  //       "id": "a28a0f9c-8b64-484c-bd1a-03ab73a4d1eb",
  //       "type": "heading-two",
  //       "children": [
  //         {
  //           "id": "803ae941-6c2d-490d-8d86-98339f9a4b96",
  //           "type": "link",
  //           "props": {
  //             "url": "",
  //             "target": "_self",
  //             "rel": "noopener noreferrer",
  //             "title": "Development Lifecycle",
  //             "nodeType": "inline"
  //           },
  //           "children": [
  //             {
  //               "text": "Development Lifecycle"
  //             }
  //           ]
  //         }
  //       ],
  //       "props": {
  //         "nodeType": "block",
  //         "withAnchor": false
  //       }
  //     }
  //   ],
  //   "meta": {
  //     "align": "left",
  //     "depth": 0,
  //     "order": 10
  //   }
  // },
  // "8ab9c980-7c6f-4a6c-a5a6-b6a33109f9e2": {
  //   "id": "8ab9c980-7c6f-4a6c-a5a6-b6a33109f9e2",
  //   "type": "Paragraph",
  //   "value": [
  //     {
  //       "id": "9be2cc44-1875-4a0b-b53a-e506560aa4be",
  //       "type": "paragraph",
  //       "children": [
  //         {
  //           "text": "Software development extends far beyond code deployment. Railway's feature set is tailor-made, and continuously evolving, to provide the best developer experience we can imagine."
  //         }
  //       ],
  //       "props": {
  //         "nodeType": "block"
  //       }
  //     }
  //   ],
  //   "meta": {
  //     "align": "left",
  //     "depth": 0,
  //     "order": 11
  //   }
  // },
  // "b7a64f3c-297a-4e9c-b1f0-76d8298a339c": {
  //   "id": "b7a64f3c-297a-4e9c-b1f0-76d8298a339c",
  //   "type": "Paragraph",
  //   "value": [
  //     {
  //       "id": "0b8b837d-1795-418f-96f3-c54cb43863f9",
  //       "type": "paragraph",
  //       "children": [
  //         {
  //           "text": "Configuration Management",
  //           "bold": true
  //         }
  //       ],
  //       "props": {
  //         "nodeType": "block"
  //       }
  //     }
  //   ],
  //   "meta": {
  //     "align": "left",
  //     "depth": 0,
  //     "order": 12
  //   }
  // },
  // "9d30880c-cdb5-462e-9588-5b747bf35620": {
  //   "id": "9d30880c-cdb5-462e-9588-5b747bf35620",
  //   "type": "BulletedList",
  //   "value": [
  //     {
  //       "id": "e2cc0b73-f1d0-41a2-8b40-191b86ea0f74",
  //       "type": "bulleted-list",
  //       "children": [
  //         {
  //           "text": "Variables & Secrets"
  //         },
  //         {
  //           "text": ": Easily manage configuration values and sensitive data with variable management tools."
  //         }
  //       ],
  //       "props": {
  //         "nodeType": "block"
  //       }
  //     }
  //   ],
  //   "meta": {
  //     "align": "left",
  //     "depth": 0,
  //     "order": 13
  //   }
  // },
  // "c188b572-c80b-4dc3-a13b-06279532173b": {
  //   "id": "c188b572-c80b-4dc3-a13b-06279532173b",
  //   "type": "Paragraph",
  //   "value": [
  //     {
  //       "id": "22df3325-1274-4ce1-8507-2eb85b1be1bf",
  //       "type": "paragraph",
  //       "children": [
  //         {
  //           "text": "Environment and Workflow",
  //           "bold": true
  //         }
  //       ],
  //       "props": {
  //         "nodeType": "block"
  //       }
  //     }
  //   ],
  //   "meta": {
  //     "align": "left",
  //     "depth": 0,
  //     "order": 14
  //   }
  // },
  // "05b13ae5-3114-492d-85e1-b26294f44653": {
  //   "id": "05b13ae5-3114-492d-85e1-b26294f44653",
  //   "type": "BulletedList",
  //   "value": [
  //     {
  //       "id": "b81d90de-7f82-440d-bd3b-9289de7439d7",
  //       "type": "bulleted-list",
  //       "children": [
  //         {
  //           "text": "Environment Management"
  //         },
  //         {
  //           "text": ": Create both static and ephemeral environments to create workflows that complement your processes."
  //         }
  //       ],
  //       "props": {
  //         "nodeType": "block"
  //       }
  //     }
  //   ],
  //   "meta": {
  //     "align": "left",
  //     "depth": 0,
  //     "order": 15
  //   }
  // },
  // "e5c80052-08c6-4beb-a889-e59962c7de46": {
  //   "id": "e5c80052-08c6-4beb-a889-e59962c7de46",
  //   "type": "BulletedList",
  //   "value": [
  //     {
  //       "id": "c10f2d4b-a911-4d35-b9da-b9f47c388d17",
  //       "type": "bulleted-list",
  //       "children": [
  //         {
  //           "text": "Orchestration & Tooling"
  //         },
  //         {
  //           "text": ": Build Railway into any workflow using our CLI or API."
  //         }
  //       ],
  //       "props": {
  //         "nodeType": "block"
  //       }
  //     }
  //   ],
  //   "meta": {
  //     "align": "left",
  //     "depth": 0,
  //     "order": 16
  //   }
  // },
  // "ef27da01-52b0-44dc-b59d-7298e90e6687": {
  //   "id": "ef27da01-52b0-44dc-b59d-7298e90e6687",
  //   "type": "Paragraph",
  //   "value": [
  //     {
  //       "id": "f4900a8f-aa63-4f95-8324-5cd48fb7c7ff",
  //       "type": "paragraph",
  //       "children": [
  //         {
  //           "text": "Deployment Monitoring",
  //           "bold": true
  //         }
  //       ],
  //       "props": {
  //         "nodeType": "block"
  //       }
  //     }
  //   ],
  //   "meta": {
  //     "align": "left",
  //     "depth": 0,
  //     "order": 17
  //   }
  // },
  // "7112f40f-9689-429c-98c1-c81c7ff27cbc": {
  //   "id": "7112f40f-9689-429c-98c1-c81c7ff27cbc",
  //   "type": "BulletedList",
  //   "value": [
  //     {
  //       "id": "64d2002e-8297-4e0b-a1f0-479f6a620b58",
  //       "type": "bulleted-list",
  //       "children": [
  //         {
  //           "text": "Observability"
  //         },
  //         {
  //           "text": ": Keep a pulse on your deployments with Railway's built-in observability tools."
  //         }
  //       ],
  //       "props": {
  //         "nodeType": "block"
  //       }
  //     }
  //   ],
  //   "meta": {
  //     "align": "left",
  //     "depth": 0,
  //     "order": 18
  //   }
  // },
  // "b73885c4-2ac1-4b6b-9737-98fdbc1f7bfe": {
  //   "id": "b73885c4-2ac1-4b6b-9737-98fdbc1f7bfe",
  //   "type": "HeadingTwo",
  //   "value": [
  //     {
  //       "id": "aee53243-82c0-4309-900f-588d73f1a143",
  //       "type": "heading-two",
  //       "children": [
  //         {
  //           "id": "5ad8ccb7-c9fd-4a8f-ac93-d04cac6c7f05",
  //           "type": "link",
  //           "props": {
  //             "url": "",
  //             "target": "_self",
  //             "rel": "noopener noreferrer",
  //             "title": "Operational Model",
  //             "nodeType": "inline"
  //           },
  //           "children": [
  //             {
  //               "text": "Operational Model"
  //             }
  //           ]
  //         }
  //       ],
  //       "props": {
  //         "nodeType": "block",
  //         "withAnchor": false
  //       }
  //     }
  //   ],
  //   "meta": {
  //     "align": "left",
  //     "depth": 0,
  //     "order": 19
  //   }
  // },
  // "91380355-f69d-44c1-8823-91ead441db5f": {
  //   "id": "91380355-f69d-44c1-8823-91ead441db5f",
  //   "type": "Paragraph",
  //   "value": [
  //     {
  //       "id": "f03b7359-bb70-4492-a60d-517a9cbc1cec",
  //       "type": "paragraph",
  //       "children": [
  //         {
  //           "text": "Railway operates with an emphasis on reliability and transparency. We utilize a combination of alerting tools, internal systems, and operational procedures to maintain high uptime. Read more about product philosophy and maturity"
  //         },
  //         {
  //           "text": " "
  //         },
  //         {
  //           "id": "814e4158-e0ab-46d2-a107-37580199a3e0",
  //           "type": "link",
  //           "props": {
  //             "url": "https://docs.railway.com/maturity/philosophy",
  //             "target": "_self",
  //             "rel": "noopener noreferrer",
  //             "title": "here",
  //             "nodeType": "inline"
  //           },
  //           "children": [
  //             {
  //               "text": "here"
  //             }
  //           ]
  //         },
  //         {
  //           "text": "."
  //         }
  //       ],
  //       "props": {
  //         "nodeType": "block"
  //       }
  //     }
  //   ],
  //   "meta": {
  //     "align": "left",
  //     "depth": 0,
  //     "order": 20
  //   }
  // },
  // "c9293226-f870-4f53-850e-57bc603d63d5": {
  //   "id": "c9293226-f870-4f53-850e-57bc603d63d5",
  //   "type": "HeadingTwo",
  //   "value": [
  //     {
  //       "id": "0fd95401-63d4-47a4-8ae6-44a2f279b54f",
  //       "type": "heading-two",
  //       "children": [
  //         {
  //           "id": "8654dc02-8a68-4b10-9d89-279a3ea7d2cf",
  //           "type": "link",
  //           "props": {
  //             "url": "",
  //             "target": "_self",
  //             "rel": "noopener noreferrer",
  //             "title": "Book a Demo",
  //             "nodeType": "inline"
  //           },
  //           "children": [
  //             {
  //               "text": "Book a Demo"
  //             }
  //           ]
  //         }
  //       ],
  //       "props": {
  //         "nodeType": "block",
  //         "withAnchor": false
  //       }
  //     }
  //   ],
  //   "meta": {
  //     "align": "left",
  //     "depth": 0,
  //     "order": 21
  //   }
  // },
  // "6b67294f-9cf2-4457-96d2-e1f75030b74e": {
  //   "id": "6b67294f-9cf2-4457-96d2-e1f75030b74e",
  //   "type": "Paragraph",
  //   "value": [
  //     {
  //       "id": "47a9a3f8-2ddf-452a-99a3-670098717121",
  //       "type": "paragraph",
  //       "children": [
  //         {
  //           "text": "Looking to adopt Railway for your business? We'd love to chat!"
  //         },
  //         {
  //           "text": " "
  //         },
  //         {
  //           "id": "985e83c5-cb35-477b-8d52-2469d288deee",
  //           "type": "link",
  //           "props": {
  //             "url": "https://cal.com/team/railway/work-with-railway?duration=30",
  //             "target": "_self",
  //             "rel": "noopener noreferrer",
  //             "title": "Click here to book some time with us",
  //             "nodeType": "inline"
  //           },
  //           "children": [
  //             {
  //               "text": "Click here to book some time with us"
  //             }
  //           ]
  //         },
  //         {
  //           "text": "."
  //         }
  //       ],
  //       "props": {
  //         "nodeType": "block"
  //       }
  //     }
  //   ],
  //   "meta": {
  //     "align": "left",
  //     "depth": 0,
  //     "order": 22
  //   }
  // }
} as unknown as YooptaContentValue;
