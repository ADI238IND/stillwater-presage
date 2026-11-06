const { app, BrowserWindow, session } = require('electron');
const path = require('node:path');
const { bindSmartSpectraIpc } = require('@smartspectra/node-sdk/main');
app.whenReady().then(() => {
  session.defaultSession.setPermissionRequestHandler((contents, permission, callback) => {
    callback(permission === 'media' && contents.getURL().startsWith('file://'));
  });
  const win = new BrowserWindow({ width:1440, height:960, minWidth:900, minHeight:700, backgroundColor:'#071b24', title:'Stillwater', webPreferences:{preload:require.resolve('@smartspectra/node-sdk/preload'),contextIsolation:true,sandbox:true,nodeIntegration:false} });
  bindSmartSpectraIpc(win);
  win.setMenuBarVisibility(false);
  win.webContents.setWindowOpenHandler(() => ({action:'deny'}));
  win.loadFile(path.join(__dirname,'../dist/index.html'));
});
app.on('window-all-closed',()=>{if(process.platform !== 'darwin') app.quit();});
app.on('activate',()=>{if(BrowserWindow.getAllWindows().length === 0) app.quit();});
