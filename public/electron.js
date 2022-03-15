const { app, BrowserWindow } = require("electron")
const jsonServer = require('json-server')

const isDev = require("electron-is-dev")
const path = require("path")

// 1020 660
require('@electron/remote/main').initialize()

function createWindow() {
    const win = new BrowserWindow({
        width: 1020,
        height: 660,
        resizable: true,
        title: "Kanban TODO",
        webPreferences: {
            enableRemoteModule: true
        }
    })

    const server = jsonServer.create()
    const router = jsonServer.router('todos.json')
    const middlewares = jsonServer.defaults()

    server.use(middlewares)
    server.use(router)
    server.listen(5000, () => {
        console.log('JSON Server is running')
    })

    win.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, "../build/index.html")}`)

    // require("child_process").exec('json-server todos.json --port 5000'); // --no-cors
}

app.on('ready', createWindow)
