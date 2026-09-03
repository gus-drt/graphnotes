import { renderMarkdownToHtml } from '@/components/notes/MarkdownPreview';

describe('renderMarkdownToHtml', () => {
  it('renders inline latex formulas with katex', () => {
    const html = renderMarkdownToHtml('Área do círculo: $\\pi r^2$');

    expect(html).toContain('katex');
    expect(html).toContain('\\pi');
  });

  it('renders multiline block latex formulas with katex-display', () => {
    const html = renderMarkdownToHtml('$$\n\\int_0^1 x^2\\,dx = \\frac{1}{3}\n$$');

    expect(html).toContain('katex-display');
    expect(html).not.toContain('<p>$$</p>');
  });

  it('keeps existing markdown formatting support', () => {
    const html = renderMarkdownToHtml('**negrito** e ++sublinhado++ e [[Nota]]');

    expect(html).toContain('<strong>negrito</strong>');
    expect(html).toContain('<u>sublinhado</u>');
    expect(html).toContain('data-link="Nota"');
  });
});
