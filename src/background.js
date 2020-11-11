/*eslint-disable*/
'use strict';

import { app, protocol, BrowserWindow, ipcMain, dialog } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, {
  VUEJS_DEVTOOLS,
  APOLLO_DEVELOPER_TOOLS
} from 'electron-devtools-installer';
import  path  from 'path'

global.vuexState = null
const isDevelopment = process.env.NODE_ENV !== 'production';

let win;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: {
      secure: true,
      standard: true
    }
  }
]);

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1500,
    height: 600,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
      // preload: path.join(__dirname, '../src/server.js')
    }
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    win.loadURL('app://./index.html');
  }

  function getUnsavedDocsStatus() {
    return new Promise((resolve, reject) => {
      ipcMain.on('hasUnsavedFiles', (e, res) => {
        // console.log("Response from rendererer: " + res)
        resolve(res)
      })
    });
  }

  win.on('close', async function (e) {
    let hasUnsavedDocs = undefined
    const prevent = e.preventDefault()
    let closed = false
    win.webContents.send('checkUnsavedDocs')
    // let hasUnsavedDocsDocs = await getUnsavedDocsStatus()
     await getUnsavedDocsStatus()
      .then(isUnsaved => {
        if (isUnsaved) {
          const choice = dialog.showMessageBoxSync(this,
            {
              type: 'question',
              buttons: ['Yes', 'No'],
              title: 'Confirm',
              message: 'You have unsaved documents. Are you sure you want to quit?'
            })
          if (choice === 1) {
            console.log('Closing before entering this body')
            hasUnsavedDocs = true
            console.log("Response from rendererer: " + hasUnsavedDocs)
          }
          else{
            closed = true
            console.log("Set close to  " + closed)
          }
        }
        else{
          app.exit()
        }
      })
      .then(hasUnsavedDocs && prevent)
      .catch(error => console.log(error))
      if(closed) app.exit()
  });

  win.on('closed', () => {
    // Send a message to get the state
    // If ready to close, close, else cancel..
    win = null;
  });

  return win
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  let guidesPath = ''
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    guidesPath = path.join(app.getAppPath(), '/win-unpacked/guides')
    try {
      await installExtension(VUEJS_DEVTOOLS);
      await installExtension(APOLLO_DEVELOPER_TOOLS);
    } catch (e) {
      console.error('Devtools failed to install:', e.toString());
    }
  }
  else {
    guidesPath = path.join(app.getAppPath(), '../../guides')
  }
  
  const win = createWindow()

  console.log(guidesPath)
  win.webContents.on('did-finish-load', () => {
    win.webContents.send('passAppPath', guidesPath)
  })
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}


