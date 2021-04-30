export const state = {
    appPath: '',
    cwd: '',
    docsFolder: '',
    entryFile: 'index.html',
    // FIXME: Set to docsList
    schemas:[],
    allDocs: [],
    currentDoc: { saved: false },
    // Register is the project is being created
    initProject: {
      type: undefined,
      on: false,
      path: ''
    },
    validTitle: true,
    metadata: {},
    schema: {}
  };