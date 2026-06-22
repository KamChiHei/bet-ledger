const { app, BrowserWindow, dialog, shell } = require("electron");
const fs = require("node:fs");
const net = require("node:net");
const path = require("node:path");
const Module = require("node:module");

const HOST = "127.0.0.1";
const PORT = 32145;
let mainWindow;

function writeLog(message) {
  try {
    const logPath = path.join(app.getPath("userData"), "startup.log");
    fs.mkdirSync(path.dirname(logPath), { recursive: true });
    fs.appendFileSync(logPath, `${new Date().toISOString()} ${message}\n`);
  } catch {}
}

function waitForServer(timeoutMs = 30000) {
  const startedAt = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      const socket = net.createConnection(PORT, HOST);
      socket.once("connect", () => { socket.destroy(); resolve(); });
      socket.once("error", () => {
        socket.destroy();
        if (Date.now() - startedAt >= timeoutMs) reject(new Error("本地服务启动超时"));
        else setTimeout(check, 250);
      });
    };
    check();
  });
}

function prepareDatabase() {
  const databasePath = path.join(app.getPath("userData"), "bet-ledger.db");
  if (!fs.existsSync(databasePath)) {
    fs.mkdirSync(path.dirname(databasePath), { recursive: true });
    fs.copyFileSync(path.join(process.resourcesPath, "template.db"), databasePath);
  }
  process.env.DATABASE_URL = `file:${databasePath.replaceAll("\\", "/")}`;
}

function startNextServer() {
  process.env.NODE_ENV = "production";
  process.env.HOSTNAME = HOST;
  process.env.PORT = String(PORT);
  const serverPath = path.join(process.resourcesPath, "next-app", "server.js");
  process.env.NODE_PATH = path.join(process.resourcesPath, "next-app", "runtime_modules");
  Module._initPaths();
  process.chdir(path.dirname(serverPath));
  require(serverPath);
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1100,
    minHeight: 700,
    backgroundColor: "#090d14",
    show: false,
    autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true }
  });
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https://")) shell.openExternal(url);
    return { action: "deny" };
  });
  await mainWindow.loadURL(`http://${HOST}:${PORT}`);
  mainWindow.once("ready-to-show", () => mainWindow.show());
}

app.whenReady().then(async () => {
  try {
    writeLog(`Starting ${app.getVersion()} from ${process.resourcesPath}`);
    prepareDatabase();
    writeLog(`Database ready: ${process.env.DATABASE_URL}`);
    startNextServer();
    writeLog("Next server module loaded");
    await waitForServer();
    writeLog("Next server is accepting connections");
    await createWindow();
    writeLog("Main window loaded");
  } catch (error) {
    const detail = error instanceof Error ? error.stack ?? error.message : String(error);
    writeLog(`Startup failed: ${detail}`);
    dialog.showErrorBox("应用启动失败", detail);
    app.quit();
  }
});

app.on("window-all-closed", () => app.quit());
app.on("activate", () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
