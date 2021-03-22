import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import * as docs from '../docs';
import { actions } from '../docs';
import { resetState } from './resetState';
import { cloneDeep } from 'lodash';

import fs from 'fs';

const localVue = createLocalVue();
localVue.use(Vuex);

const createStore = () => {
  return new Vuex.Store(
    cloneDeep({
      modules: {
        docs
      }
    })
  );
};

/** Clean up: Delete test project folder */
afterAll(async (done) => {
  const path = actions
    .cwd()
    .data.cwd.replace(/\\\\test-project\\\\test-project$/, ''); // Replacing this pattern `\\test-project\\test-project` for handling current windows build issues

  fs.existsSync(path) &&
    fs.statSync(path) &&
    fs.rmdir(path, { recursive: true }, (err) => {
      if (err) console.error(err);
      console.log('Done');
      done();
    });
});

let store, DEFAULT_STATE;

/** Before each test runs, We have to create a new store and reset the state. */
beforeEach(() => {
  // console.log = () => {};
  store = createStore();
  DEFAULT_STATE = resetState(store);
});

test('should format docs data', () => {
  const mockData = {
    data: {
      openProject: {
        allDocsData: [
          {
            id: 12,
            content: '<h1>Mock Example</h1>'
          }
        ]
      }
    }
  };

  const exampleResponse = {
    id: 12889, // random
    saved: true,
    isWritten: true,
    content: '<h1>Mock Example</h1>',
    title: 'Mock Example'
  };

  const response = docs.formatDocs(mockData, 'openProject')[0];

  expect(Object.keys(response).sort()).toEqual(
    Object.keys(exampleResponse).sort()
  );

  expect(response.content).toStrictEqual(exampleResponse.content);
  expect(response.title).toStrictEqual(exampleResponse.title);
  expect(response.saved).toStrictEqual(exampleResponse.saved);
  expect(response.isWritten).toStrictEqual(exampleResponse.isWritten);

  /** We cannot test for the ID because it is randomly generated */
});

test('should make a new document', async () => {
  /**  Disable console log */
  const name = 'test-project';

  await store.dispatch('createNewProject', {
    docsDir: 'docs',
    entryFile: 'index.html',
    name: name,
    path: process.cwd(),
    shortTitle: ''
  });

  await store.dispatch('loadProject');

  expect(store.state).not.toStrictEqual(DEFAULT_STATE);
  expect(store.state.docs.allDocs).not.toStrictEqual([]);

  const responseExample = sortObj({
    id: 2,
    title: 'Untitled',
    content: '<h1>Untitled</h1>',
    saved: false,
    fileName: 'Untitled.html',
    isWritten: false
  });

  const currentDoc = sortObj(docs.makeDoc(store.state.docs));

  expect(currentDoc).toStrictEqual(responseExample); // Ensures that `responseExample` is the same as `currentDoc`
});

function sortObj(obj) {
  return Object.keys(obj)
    .sort()
    .reduce(function(result, key) {
      result[key] = obj[key];
      return result;
    }, {});
}
