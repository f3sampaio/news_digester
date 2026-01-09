import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import * as path from 'path';

export class WindowManager {
  private windows: Map<string, BrowserWindow> = new Map();

  createWindow(name: string, options: BrowserWindowConstructorOptions): BrowserWindow {
    const defaultOptions: BrowserWindowConstructorOptions = {
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true
      },
      ...options
    };

    const window = new BrowserWindow(defaultOptions);
    this.windows.set(name, window);

    window.on('closed', () => {
      this.windows.delete(name);
    });

    return window;
  }

  getWindow(name: string): BrowserWindow | undefined {
    return this.windows.get(name);
  }

  getAllWindows(): BrowserWindow[] {
    return Array.from(this.windows.values());
  }

  closeWindow(name: string): void {
    const window = this.windows.get(name);
    if (window) {
      window.close();
    }
  }
}
