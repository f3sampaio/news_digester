export class MainView {
  private container: HTMLElement | null = null;

  constructor(containerId: string) {
    this.container = document.getElementById(containerId);
  }

  render(content: string): void {
    if (this.container) {
      this.container.innerHTML = content;
    }
  }

  updateTitle(title: string): void {
    document.title = title;
  }
}
