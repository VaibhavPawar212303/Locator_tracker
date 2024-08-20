const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  runPythonScript: (scriptPath) => ipcRenderer.invoke('run-python-script', scriptPath),
});
