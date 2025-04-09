import TurndownService from 'turndown'

export const getTurndownService = () => {
  const turndownService = new TurndownService({
    headingStyle: 'atx',
    hr: '---',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
    emDelimiter: '_'
  })

  // Preserve certain HTML elements
  turndownService.keep(['sup', 'sub', 'kbd'])

  // Custom rules for special cases
  turndownService.addRule('alignedParagraphs', {
    filter(node: HTMLElement) {
      return (
        node.nodeName === 'P' &&
        !!node.getAttribute('style')?.includes('text-align')
      )
    },
    replacement(content: string, node: HTMLElement) {
      const alignment = node.getAttribute('style')?.match(/text-align:\s*(\w+)/)?.[1]
      if (!alignment || alignment === 'left') return content
      return `<div style="text-align: ${alignment}">${content}</div>\n\n`
    }
  })

  // Handle code blocks with language specification
  turndownService.addRule('fencedCodeBlock', {
    filter(node: HTMLElement) {
      return (
        node.nodeName === 'PRE' &&
        node.firstChild?.nodeName === 'CODE'
      ) || false
    },
    replacement(content: string, node: HTMLElement) {
      const language = (node.firstChild as HTMLElement)?.getAttribute('class')?.replace('language-', '') || ''
      return `\n\`\`\`${language}\n${content}\n\`\`\`\n\n`
    }
  })

  return turndownService
} 