const { project } = require('hardocs-fs');

project
  .create({
    name: 'test-project',
    docsDir: 'docs',
    entryFile: 'index.html'
  })
  .then(console.log);
