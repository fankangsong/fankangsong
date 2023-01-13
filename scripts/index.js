const path = require('path');
const dirTree = require('directory-tree');
const fs = require('fs/promises');

const DIR = path.join(__dirname, '../contents/');
const README_FILE = path.join(__dirname, '../README.md');

const dirTreeOptions = {
  normalizePath: true,
  depth: 1,
  extensions: /\.md/,
  exclude: [/images/]
}

const build = async () => {
  console.log('🚀 开始读取...')
  const { children: list } = dirTree(DIR, dirTreeOptions);

  const markdownContent = list.map(item => {
    return `* [${item.name}](./contents/${item.name}.md)`
  });

  let content = `# 目录 \n\r`;
  markdownContent.forEach(item => {
    content += `${item}\n`;
  })

  await fs.writeFile(README_FILE, content);
  console.log('✅ 生成目录完成');
}

build();