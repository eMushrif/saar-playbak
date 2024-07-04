import { app, BrowserWindow, globalShortcut } from "electron";
import * as path from "path";
import * as url from "url";
import installExtension, { REDUX_DEVTOOLS } from "electron-devtools-installer";

const isDevelopment = process.env.NODE_ENV === "development";

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    title: "Saar Tracking Tester v0.1",
  });

  // if (isDevelopment) {
  // mainWindow.loadURL("http://localhost:9999");
  // mainWindow.webContents.openDevTools();
  // } else {
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file:",
      slashes: true,
    })
  );
  // }

  return mainWindow;
}

app.whenReady().then(() => {
  installExtension(REDUX_DEVTOOLS)
    .then((name: any) => console.log(`Added Extension: ${name}`))
    .catch((err: any) => console.log("An error occurred: ", err));

  let mainWindow = createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      let mainWindow = createWindow();
      // mainWindow.webContents.openDevTools({ mode: "detach" });
    }
  });

  globalShortcut.register("CommandOrControl+Shift+I", () => {
    console.log("CommandOrControl+Shift+I is pressed");
    // mainWindow.webContents.openDevTools();
    mainWindow.webContents.openDevTools({ mode: "detach" });
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
