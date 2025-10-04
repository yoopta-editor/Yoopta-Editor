import { basicDark, basicLight } from '@uiw/codemirror-theme-basic';
import { copilot } from '@uiw/codemirror-theme-copilot';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { githubDark, githubLight } from '@uiw/codemirror-theme-github';
import { materialDark, materialLight } from '@uiw/codemirror-theme-material';
import { monokaiDimmed } from '@uiw/codemirror-theme-monokai-dimmed';
import { okaidia } from '@uiw/codemirror-theme-okaidia';
import { sublime } from '@uiw/codemirror-theme-sublime';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';

export const THEMES_MAP = {
  BasicLight: basicLight,
  BasicDark: basicDark,
  VSCode: vscodeDark,
  Sublime: sublime,
  Okaidia: okaidia,
  Monokai: monokaiDimmed,
  MaterialDark: materialDark,
  MaterialLight: materialLight,
  GithubDark: githubDark,
  GithubLight: githubLight,
  Dracula: dracula,
  Copilot: copilot,
};
