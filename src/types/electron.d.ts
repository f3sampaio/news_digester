export interface ElectronAPI {
  // Add your API methods here
  // Example: getVersion: () => string;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
