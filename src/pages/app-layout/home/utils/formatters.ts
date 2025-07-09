// Helper function to format markdown content
export function formatMarkdown(content: string): string {
  return content
    .replace(/### (.*?)$/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
    .replace(/## (.*?)$/gm, '<h2 class="text-xl font-semibold mt-4 mb-2">$1</h2>')
    .replace(/# (.*?)$/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^\d+\. (.*?)$/gm, '<li class="ml-4">$1</li>')
    .replace(/^- (.*?)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/\n\n/g, '</p><p class="mb-2">')
    .replace(/^/, '<p class="mb-2">')
    .replace(/$/, '</p>');
}