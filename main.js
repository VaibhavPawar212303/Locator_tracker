const { app, BrowserWindow, BrowserView, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200, // Width of the window
    height: 800, // Height of the window
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile('index.html');

  // Create a BrowserView
  const view = new BrowserView({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  });

  // Set the BrowserView bounds to maximize it
  mainWindow.setBrowserView(view);
  
  // Define a function to resize BrowserView when window size changes
  const resizeBrowserView = () => {
    const { width, height } = mainWindow.getBounds();
    view.setBounds({
      x: Math.floor(width / 2), // Start BrowserView at half of the window width
      y: 0,
      width: Math.floor(width / 2), // BrowserView takes half of the window width
      height: height, // Full height of the window
    });
  };

  // Initially set the size of BrowserView
  resizeBrowserView();

  // Update BrowserView size on window resize
  mainWindow.on('resize', resizeBrowserView);

  // Load a URL in the BrowserView
  view.webContents.loadURL('https://walrus-app-aidtw.ondigitalocean.app/defect-tracking'); // Set the URL you want to display

  // Handle IPC communication to run Python scripts
  ipcMain.handle('run-python-script', async (event, scriptPath) => {
    return new Promise((resolve, reject) => {
      exec(`python ${scriptPath}`, (error, stdout, stderr) => {
        if (error) {
          reject(`Error: ${stderr}`);
        } else {
          resolve(stdout);
        }
      });
    });
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
