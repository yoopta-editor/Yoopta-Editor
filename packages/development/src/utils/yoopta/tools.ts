import ActionMenuList, { DefaultActionMenuRender } from '@yoopta/action-menu-list';
import type { Tools } from '@yoopta/editor';
import LinkTool, { DefaultLinkToolRender } from '@yoopta/link-tool';
import Toolbar, { DefaultToolbarRender } from '@yoopta/toolbar';

export const TOOLS: Tools = {
  // ActionMenu: {
  //   render: DefaultActionMenuRender,
  //   tool: ActionMenuList,
  // },
  // Toolbar: {
  //   render: DefaultToolbarRender,
  //   tool: Toolbar,
  // },
  LinkTool: {
    render: DefaultLinkToolRender,
    tool: LinkTool,
  },
};
