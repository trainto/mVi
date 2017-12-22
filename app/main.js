const electron = require('electron')
const {app, globalShortcut, BrowserWindow, ipcMain, Tray} = require('electron')
const path = require('path')
const url = require('url')
const vimouse = require('./vimouse.js')

let tray = null
let win = null

// Do not show the app in the Dock
app.dock.hide()

function createTray () {
  let platform = require('os').platform()
  let imageFolder = path.join(__dirname, '../assets')
  let trayImage = null
  if (platform === 'darwin') {
    trayImage = path.join(imageFolder, 'icon.png')
  }
  tray = new Tray(trayImage)
  tray.on('click', () => {
    console.log('tray icon clicked!')
  })
  // tray.on('right-click', null)  // show menu
}

function createWindow () {
  win = new BrowserWindow({width: 300,
    height: 100,
    disableAutoHideCursor: true,
    transparent: true,
    frame: false,
    resizable: false
  })

  win.webContents.on('before-input-event', (event, input) => {
    if (input.type.trim() === 'keyDown') {
      switch (input.code) {
        case 'KeyH':
          vimouse.moveMouse('left')
          break
        case 'KeyJ':
          vimouse.moveMouse('down')
          break
        case 'KeyK':
          vimouse.moveMouse('up')
          break
        case 'KeyL':
          vimouse.moveMouse('right')
          break
        case 'KeyC':
          vimouse.click()
          break
        case 'KeyR':
          vimouse.rightClick()
          break
      }
    } else {
      switch (input.code) {
        case 'KeyH':
        case 'KeyJ':
        case 'KeyK':
        case 'KeyL':
          vimouse.stopMove()
          break
      }
    }
  })

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // win.webContents.openDevTools()

  win.on('closed', () => {
    win = null
  })

  globalShortcut.register('Command+Shift+K', () => {
    win.focus()
  })
}

app.on('ready', () => {
  vimouse.setMonitorsInfo(electron.screen.getAllDisplays())
  createTray()
  createWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})
