import { app, BrowserWindow, Menu, shell } from 'electron'
import { existsSync, mkdirSync, copyFileSync, closeSync, openSync, readFileSync, writeFileSync } from 'fs'

const levelDbDir = 'config/icloud-for-linux/Local Storage/leveldb'
const levelDbFile = '/000003.log'
if (typeof process.env.SNAP != 'undefined') {
  if (!existsSync(process.env.SNAP_USER_DATA + '/.' + levelDbDir)) {
    mkdirSync(process.env.SNAP_USER_DATA + '/.' + levelDbDir, { recursive: true })
    copyFileSync(process.env.SNAP + '/' + levelDbDir + levelDbFile, process.env.SNAP_USER_DATA + '/.' + levelDbDir + levelDbFile)
  }
} else {
  if (!existsSync(process.env.HOME + '/.' + levelDbDir)) {
    mkdirSync(process.env.HOME + '/.' + levelDbDir, { recursive: true })
    copyFileSync('/usr/lib/icloud-for-linux/resources/dump/' + levelDbDir + levelDbFile, process.env.HOME + '/.' + levelDbDir + levelDbFile)
  }
}

let tld = '.com'
if (typeof process.env.SNAP != 'undefined') {
  try {
    tld = readFileSync(process.env.SNAP_USER_COMMON + '/tld', 'utf8').trim()
  }
  catch {
    tld = '.com'
    writeFileSync(process.env.SNAP_USER_COMMON + '/tld', tld)
  }
}

const appName = 'iCloud' 
const appUrl = 'https://www.icloud' + tld + '/'

function createWindow() {
  Menu.setApplicationMenu(null)

  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    title: appName
  })

  mainWindow.loadURL(appUrl + process.argv[2])

  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith(appUrl)) {
      event.preventDefault()
      shell.openExternal(url)
    }
  })

  mainWindow.on('close', () => {
    app.exit(0)
 })
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', function () {
  app.quit()
})
