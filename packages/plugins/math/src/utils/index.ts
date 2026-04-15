import katex from 'katex';

/**
 * Renders a LaTeX string to HTML using KaTeX.
 * Returns an error message HTML if the expression is invalid.
 */
export function renderLatexToHTML(latex: string, displayMode = false): string {
  try {
    return katex.renderToString(latex, {
      throwOnError: false,
      displayMode,
      output: 'htmlAndMathml',
    });
  } catch {
    return `<span style="color: red;">Invalid LaTeX</span>`;
  }
}
