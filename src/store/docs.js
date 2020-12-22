/**
 * In HARDOCS, a project is composed of docs and metadata about the project.
 * this module stores all the specific state of project's documents.
 * This includes document files, folder holding the documents, the html contents,
 * and other data related to documents.
 */

import DocsServices from '@/services/index';
import { habitatLocal } from '@hardocs-project/habitat-client';
import router from '@/router';
import store from '@/store/index';
import { ipcRenderer } from 'electron';

export const state = {
  appPath: '',
  cwd: '',
  docsFolder: '',
  entryFile: '',
  // FIXME: Set to docsList
  allDocs: [],
  currentDoc: { saved: false },
  // Register is the project is being created
  initProject: {
    type: undefined,
    on: false,
    path: ''
  },
  validTitle: true
};

const defaultNewDocName = 'Untitled';

export const mutations = {
  /**
   * defines if project is being initialized
   * and in which way is being initialized
   * @param {Object} options specifies the type of init
   */
  SET_INIT_PROJECT(state, options) {
    // state = {}
    state.initProject = options;
    console.log('SET_INIT_PROJECT options: ' + JSON.stringify(options));
  },

  SET_APP_PATH(state, appPath) {
    state.appPath = appPath;
  },

  SET_CWD(state, cwd) {
    state.cwd = cwd;
  },

  SET_ENTRY_FILE(state, entryFile) {
    state.entryFile = entryFile;
  },

  SET_DOCS_FOLDER(state, docsFolder) {
    state.docsFolder = docsFolder;
  },

  SET_VALID_TITLE(state, isValid){
    state.validTitle = isValid
  },

  LOAD_DOCS(state, allDocs) {
    state.allDocs = allDocs;
    if (allDocs) {
      state.currentDoc = allDocs[0];
    } else {
      state.currentDoc = undefined;
    }
  },

  ADD_DOC(state, doc) {
    state.allDocs.push(doc);
  },

  REMOVE_DOC(state, docId) {
    const index = state.allDocs.findIndex((el) => el.id === docId);
    state.allDocs.splice(index, 1);
  },

  SET_CURRENT_DOC(state, doc) {
    state.currentDoc = doc;
  },
  // FIXME: unify this mutation into SET_SAVED
  SET_TO_SAVED(state, docId) {
    const doc = state.allDocs.find((el) => el.id === docId);
    doc.saved = true;
  },

  SET_TO_UNSAVED(state) {
    state.currentDoc.saved = false;
  },

  UPDATE_DOC_CONTENT(state, editedDoc) {
    const newDoc = state.allDocs.find((doc) => doc.id == editedDoc.id);
    newDoc.content = editedDoc.content;
    newDoc.title = editedDoc.title;
  },

  SET_GUIDES(state, isActive) {
    state.guidesIsActive = isActive;
  }
};

export const actions = {
  openFolder({ commit }) {
    const cwd = habitatLocal
      .chooseFolderForUse()
      .then(commit('SET_CWD', cwd))
      .catch((err) => {
        console.log(err);
      });
  },

  /**
   * Opening a project requires several init conditions:
   * 1. We check If a project is being initialized
   * 2. We check type of initialization is taking place.
   * These types of inits are Opening an existing project, creating a new one,
   * or creating a project from an existing folder
   * @param {Object} init passes init options, on, type, path
   */
  async initProject({ commit, dispatch }, init) {
    habitatLocal
      .chooseFolderForUse()
      .then((cwd) => {
        if (init.on == true) {
          commit('SET_CWD', cwd);
          console.log('initializing on this path: ' + cwd);
          commit('SET_INIT_PROJECT', {
            on: true,
            type: init.type,
            path: cwd
          });
        } else {
          commit('SET_CWD', cwd);
          dispatch('loadProject');
        }
      })
      .catch((err) => {
        // *todo* you need to handle the cancel which would appear here, apropos the app
        console.log('initProject:err: ' + err);
      });
  },

  async createNewProject({ commit, dispatch }, projectMetadata) {
    const response = await DocsServices.createNewProject(projectMetadata);
    // console.log("Create new project response: " + JSON.stringify(response))
    console.log(
      'createNewProject:response: ' + JSON.stringify(response, null, 2)
    );
    // const result = formatDocs(response, 'createProject')
    // console.log("Result of formatDocs: " + JSON.stringify(result))
    await commit('SET_CWD', response.data.createProject.path);
    dispatch('loadProject');
  },

  async createProjectFromExisting({ commit, dispatch }, projectMetadata) {
    const response = await DocsServices.createProjectFromExisting(
      projectMetadata
    );
    // const result = formatDocs(response, 'createProjectFromExisting');
    // console.log("Result of formatDocs: " + JSON.stringify(result))
    await commit('SET_CWD', response.data.createProjectFromExisting.path);
    dispatch('loadProject');
  },

  async loadProject({ commit, state, dispatch }) {
    console.log('original state.cwd: ' + state.cwd)
    if (state.cwd) {
      let invalidProject = false;
      const response = await DocsServices.getProject(state.cwd).catch((e) => {
        console.log(e);
        invalidProject = true;
      });
      // console.log("Promise response: " + JSON.stringify(response))
      // console.log("Is invalid project?: " + JSON.stringify(invalidProject))
      if (!invalidProject) {
        const formattedDocs = formatDocs(
          response,
          'openProject',
          state.entryFile
        );
        commit('SET_CWD', state.cwd);
        await commit('LOAD_DOCS', formattedDocs);
        commit('SET_DOCS_FOLDER', response.data.openProject.docsDir);
        commit('SET_ENTRY_FILE', response.data.openProject.entryFile);
        // dispatch('loadsDataset');
        dispatch('setCurrentDoc');
      } else {
        console.log('Invalid hardocs project');
        commit('SET_CWD', undefined);
        return window.alert(
          'Cannot open invalid hardocs project. Select a hardocs project or create a new one'
        );
      }
    }
  },

  setCurrentDoc({ commit }, docId, index) {
    // console.log("Current Doc data: ", JSON.stringify({ docId, index: this.state.docs.allDocs }, null, 2));
    if (!index) {
      const doc = this.state.docs.allDocs.find((doc) => doc.id == docId);
      if (doc) {
        commit('SET_CURRENT_DOC', doc);
      }
    } else if (!docId && !index) {
      const doc = this.state.docs.allDocs[0];
      commit('SET_CURRENT_DOC', doc);
    } else {
      const doc = this.state.docs.allDocs[index];
      console.log("Changing to the proper route")
      commit('SET_CURRENT_DOC', doc);
    }
    router
      .push({
        path: '/doc/' + state.currentDoc.id
      })
      .catch((err) => {
        // Ignore the vuex err regarding  navigating to the page they are already on.
        if (
          err.name !== 'NavigationDuplicated' &&
          !err.message.includes(
            'Avoided redundant navigation to current location'
          )
        ) {
          // But print any other errors to the console
          console.log(err);
        }
      });
  },

  async addDoc({ state, commit, dispatch }) {
    const doc = makeDoc(state);
    console.log({ doc });
    // await dispatch('writeFileRequest', doc).catch((err) => {
    //   console.log(err);
    // });
    await commit('ADD_DOC', doc);
    await dispatch('setCurrentDoc', doc.id);
    // await dispatch('saveDocFile');
  },

  async writeFileRequest({ state, commit }, newDoc) {
    console.log(commit);
    function makeReq(newDoc) {
      return {
        title: newDoc.title,
        path: state.docsFolder,
        fileName: newDoc.fileName,
        content: newDoc.content
      };
    }
    const req = makeReq(newDoc);
    console.log(
      'Request to write a new file' +
      JSON.stringify({ req, currentDoc: state.currentDoc }, null, 2)
    );
    await DocsServices.writeFile(req);
  },

  async saveDocFile({ state, dispatch, commit }) {
    const alreadyExistingTitle = this.state.docs.allDocs.find((doc) => doc.title === state.currentDoc.title && doc.id !== state.currentDoc.id);
    if (alreadyExistingTitle) {
      window.alert(
        "Title already exist! Change doc's title"
      )
      commit('SET_VALID_TITLE', false)
    }
    else {
      commit('SET_VALID_TITLE', true)
      const newDoc = await state.currentDoc;
      newDoc.path = `${state.cwd}/${state.docsFolder}`;

      // await DocsServices.deleteFile(filePath); // You don't need to delete the file as it would be overwritten.
      if (newDoc.fileName !== state.entryFile) {
        // if (newDoc.fileName !== state.entryFile && newDoc.filename !== state.currentDoc.filename) {

        console.log('Not entry file: ' + newDoc.title.split(' ').join('-'))

        if (newDoc.fileName) {
          await DocsServices.deleteFile(`${newDoc.path}/${newDoc.fileName}`)
          console.log('deleted %s', newDoc.fileName);
        }
        let fileName = `${newDoc.title.split(' ').join('-')}.html`;
        newDoc.fileName = fileName;
      }
      commit('SET_VALID_TITLE', true)
      commit('SET_TO_SAVED', state.currentDoc.id)
      dispatch('writeFileRequest', newDoc);
    }
  },

  setSaved({ commit }, boolean) {
    if (!boolean) {
      commit('SET_TO_UNSAVED');
    }
  },

  async removeDoc({ state, commit, dispatch }, id) {
    const doc = state.allDocs.find((doc) => doc.id == id);
    console.log(`removing Doc: ${doc.path}`)
    // TODO: This handling of files is not proper yet
    /**
     * Now we have two different path values,
     * One when the document is created from the app
     * 2 when is loaded from an existing project
     */
    if (doc.fileName !== state.entryFile) {
      if (doc.isWritten) await DocsServices.deleteFile(doc.path)
      else await DocsServices.deleteFile(`${doc.path}/${doc.fileName}`)
      await dispatch('setCurrentDoc', state.allDocs[0].id)
      commit('REMOVE_DOC', id)
    }    
  }
};

export const getters = {
  docIsSaved: (state) => {
    // console.log("Getter for isSaved " + JSON.stringify(state.currentDoc))
    console.log('Getter for isSaved  ' + state.currentDoc.saved);
    return state.currentDoc.saved;
  },
  currentDocId: (state) => {
    return state.currentDoc.id;
  },

  hasUnsavedFiles: (state) => {
    return state.allDocs.filter((doc) => !doc.saved).length;
  },

  guidesIsActive: (state) => {
    if (state.appPath === state.cwd) return true;
    else return false;
  },

  getDocsAmount: (state) => {
    return state.allDocs.length;
  }
};

/**
 * TODO: This doesnt work, try it with the plugin approach bellow....
 */
ipcRenderer.on('checkUnsavedDocs', () => {
  console.log('Getting value from vuex getter to the main process');
  let response = store.getters.hasUnsavedFiles > 0;
  console.log('Response coming from vuex: ' + response);
  ipcRenderer.send('hasUnsavedFiles', response);
});

// Must declare event because on render you receive an event and the data.
// Here I should dispatch an action or maybe I should import the ipcRenderer in a component
ipcRenderer.on('passAppPath', async (event, path) => {
  console.log('Path coming from background process: ' + path);
  await store.commit('SET_APP_PATH', path);
  await store.commit('SET_CWD', path);
  await store.dispatch('loadProject');
  console.log(store.state.docs.cwd);
});

/**
 * HELPER FUNCTIONS FOR DOCS STATE STORE
 *
 *
 * Before committing the data object to the vuex it needs to be formatted
 * The formatting includes adding an id, processing the title and
 * adding properties such as saved.
 * @param {Object} response the API response data object
 * @param {Object} gqlAction this is the mutation object that wraps the data
 */
function formatDocs(response, gqlAction) {
  // console.log('formatDocs:response: ' + response.data[gqlAction])
  let idCount = 0;
  response.data[gqlAction].allDocsData.map((doc) => {
    // create id
    idCount += 1;
    doc.id = idCount;

    // Step 1: extract h1 only
    let regex = /<[^>].+?>(.*?)<\/.+?>/m;
    if (doc.content.match(regex)) {
      doc.title = doc.content.match(regex)[0];
    } else {
      doc.title = doc.content;
    }

    // Step 2: get first block only text inside h1 tags
    regex = /(<([^>]+)>)/gi;
    doc.title = doc.title.replace(regex, '').trim();
    doc.saved = true;
    if (doc.id == 1) {
      // Make a more unique identifier for the first document to avoid conflict with guides
      doc.id = parseInt('' + doc.id + Math.floor(Math.random() * 1000 + 1));
    }
    doc.isWritten = true;
  });
  return response.data[gqlAction].allDocsData;
}

/**
 * This function checks before a new doc object before being committed
 * If it exists, then it appends the copy string and also creates the files
 * accordingly with the same names.
 * @param {Object} state to check if the new doc exists already
 */
function makeDoc(state) {
  const newId = state.allDocs.length + 1;
  const doc = {
    id: newId,
    title: defaultNewDocName,
    content: '',
    saved: false
  };

  if (doc.fileName == state.entryFile) {
    doc.fileName = state.entryFile;
  } else {
    // Make sure that there are no duplicate titles
    for (var i = 0; i < state.allDocs.length; i++) {
      if (state.allDocs[i].title == doc.title) {
        doc.title = doc.title + ' copy';
        doc.content = doc.title;
      }
    }
    doc.content = `<h1>${doc.title}</h1>`;
    doc['fileName'] = `${doc.title.split(' ').join('-')}.html`; // FIXME: check for duplicates
  }
  doc.isWritten = false;
  return doc;
}
