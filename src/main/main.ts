import { WindowManager } from '../infrastructure/electron/WindowManager';
import { AppController } from '../infrastructure/electron/AppController';

const windowManager = new WindowManager();
const appController = new AppController(windowManager);

appController.initialize();
