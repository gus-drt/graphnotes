const TASK_CHECKBOX_LINE_REGEX = /^(\s*(?:[-*]|\d+\.)\s+\[)( |x|X)(\]\s.*)$/gm;

export const toggleTaskCheckboxInMarkdown = (
  content: string,
  taskIndex: number,
  checked: boolean
): string => {
  if (taskIndex < 0) return content;

  let currentIndex = -1;
  return content.replace(TASK_CHECKBOX_LINE_REGEX, (match, prefix, _marker, suffix) => {
    currentIndex += 1;
    if (currentIndex !== taskIndex) return match;
    return `${prefix}${checked ? 'x' : ' '}${suffix}`;
  });
};
