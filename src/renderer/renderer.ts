import { MainView } from '../presentation/views/MainView';

class App {
  private mainView: MainView;

  constructor() {
    this.mainView = new MainView('app');
    this.initialize();
  }

  private initialize(): void {
    this.render();
  }

  private render(): void {
    const content = `
      <div class="container mt-5">
        <h1 class="display-4">News Digester</h1>
        <p class="lead">Clean Architecture with SOLID principles</p>
        <div class="card mt-4">
          <div class="card-body">
            <h5 class="card-title">Architecture Layers</h5>
            <ul class="list-group list-group-flush">
              <li class="list-group-item"><strong>Domain:</strong> Entities, Interfaces, Use Cases</li>
              <li class="list-group-item"><strong>Application:</strong> DTOs, Application Services</li>
              <li class="list-group-item"><strong>Infrastructure:</strong> Electron, Repositories</li>
              <li class="list-group-item"><strong>Presentation:</strong> Views, Controllers</li>
            </ul>
          </div>
        </div>
      </div>
    `;
    this.mainView.render(content);
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new App());
} else {
  new App();
}
