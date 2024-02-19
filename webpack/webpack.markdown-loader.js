import { parse } from 'yaml';

import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import rehypeToc from 'rehype-toc';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { visit } from 'unist-util-visit';

import { unified } from 'unified';

/**
 * Extracts the table of contents from the rehype-toc tree.
 * @param {ListNode} list
 * @param {number} [depth=0]
 * @returns {TocItem[] | null}
 */
function tocValuesToJson(list, depth = 0) {
  // If there are no children, we can return null.
  if (!list.children?.length) {
    return null;
  }

  // If there is only one top level item, we can skip the top level and just use the children (if any).
  if (!depth && list.children.length === 1) {
    // If there are no children, we can return null.
    if (!list.children[0].children[1]) {
      return null;
    }

    return tocValuesToJson(list.children[0].children[1], depth + 1);
  }

  // Otherwise, we need to map the children to the TocItem[] structure.
  return list.children.map((li) => {
    const listItem = li.children[0]; // ListItemNode
    const subList = li.children[1] ?? null; // ListNode
    const text = listItem.children[0]; // TextNode

    return {
      name: text.value,
      fragment: listItem.properties['href']?.replace('#', '') ?? '',
      children: subList && tocValuesToJson(subList, depth + 1)
    };
  });
}

const rehypeCodeTitle = () => (tree, file) => {
  visit(tree, 'element', (node, index, parent) => {
    if (node.tagName !== 'code' || !node.data?.meta) {
      return;
    }

    const title = /title=(.*)/.exec(node.data.meta)?.[1] ?? null;

    if (title) {
      parent.children.unshift({
        type: 'element',
        tagName: 'figcaption',
        properties: { class: ['code-filename'] },
        children: [{ type: 'text', value: title }]
      });

      /* Skips this node (title) and the next node (code) */
      return index + 2;
    }
  });
};

const rehypeTerminal = () => (tree, file) => {
  visit(tree, 'element', (node, index, parent) => {
    if (node.tagName !== 'code' || !node.data?.meta) {
      return;
    }

    const classes = /class=(.*)/.exec(node.data.meta)?.[1] ?? null;

    if (classes && classes.includes('terminal')) {
      if (parent.properties.class) {
        parent.properties.class.push('terminal');
      } else {
        parent.properties.class = ['terminal'];
      }

      parent.children.unshift({
        type: 'element',
        tagName: 'div',
        properties: { class: ['terminal-header'] },
        children: [
          { type: 'element', tagName: 'div', properties: { class: ['terminal-button'] } },
          { type: 'element', tagName: 'div', properties: { class: ['terminal-button'] } },
          { type: 'element', tagName: 'div', properties: { class: ['terminal-button'] } }
        ]
      });

      /* Skips this node (title) and the next node (code) */
      return index + 2;
    }
  });
};

export default function (src) {
  const [header, result] = src.startsWith('---')
    ? src
        .split(/---/)
        .filter((e) => !!e)
        .map((e) => e.trim())
    : ['', src.trim()];

  const content = result || header;

  const metadata = result ? parse(header) : {};

  let toc = null;

  const parsed = btoa(
    unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkBreaks)
      .use(remarkRehype)
      .use(rehypeSlug)
      .use(rehypeToc, {
        nav: false,
        headings: ['h1', 'h2'],
        // Return false to prevent the default behavior of adding the TOC to the document.
        customizeTOC: (_toc) => ((toc = tocValuesToJson(_toc)), false)
      })
      .use(rehypeHighlight)
      .use(rehypeCodeTitle)
      .use(rehypeTerminal)
      .use(rehypeStringify)
      .processSync(content).value
  );

  return `
    export const parsed = ${JSON.stringify(parsed)};
    export const metadata = ${JSON.stringify(metadata)};
    export const toc = ${JSON.stringify(toc)};
  `;
}
