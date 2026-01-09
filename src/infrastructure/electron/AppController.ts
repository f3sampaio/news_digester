import { app } from 'electron';
import { WindowManager } from './WindowManager';

export class AppController {
  private windowManager: WindowManager;

  constructor(windowManager: WindowManager) {
    this.windowManager = windowManager;
  }

  initialize(): void {
    app.whenReady().then(() => {
      this.onReady();
    });

    app.on('window-all-closed', () => {
      this.onWindowAllClosed();
    });

    app.on('activate', () => {
      this.onActivate();
    });
  }

  private onReady(): void {
    this.createMainWindow();
  }

  private onWindowAllClosed(): void {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  }

  private onActivate(): void {
    if (this.windowManager.getAllWindows().length === 0) {
      this.createMainWindow();
    }
  }

  private createMainWindow(): void {
    const mainWindow = this.windowManager.createWindow('main', {
      width: 1200,
      height: 800
    });

    mainWindow.loadFile('index.html');
  }
}
