// Presentation Controller - handles UI interactions and form logic
(function() {
  'use strict';

  interface ScrapingConfig {
    platform: string;
    [key: string]: any;
  }

  class AppController {
    private platformCheckboxes: NodeListOf<HTMLInputElement>;
    private configContainer: HTMLElement | null;
    private form: HTMLFormElement | null;
    private resultsDiv: HTMLElement | null;
    private resultsContent: HTMLElement | null;
    private loadedConfigs: Set<string> = new Set();

    constructor() {
      this.platformCheckboxes = document.querySelectorAll('input[name="platforms"]') as NodeListOf<HTMLInputElement>;
      this.configContainer = document.getElementById('platform-config');
      this.form = document.getElementById('scraper-form') as HTMLFormElement;
      this.resultsDiv = document.getElementById('results');
      this.resultsContent = document.getElementById('results-content');

      this.initialize();
    }

    private initialize(): void {
      // Add change listeners to all checkboxes
      this.platformCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => this.handlePlatformToggle(checkbox));
      });

      if (this.form) {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
      }
    }

    private async handlePlatformToggle(checkbox: HTMLInputElement): Promise<void> {
      const platform = checkbox.value;
      
      // Hide results when platform selection changes
      if (this.resultsDiv) {
        this.resultsDiv.style.display = 'none';
      }

      if (checkbox.checked) {
        await this.loadPlatformConfig(platform);
      } else {
        this.removePlatformConfig(platform);
      }
    }

    private async loadPlatformConfig(platform: string): Promise<void> {
      if (!this.configContainer || this.loadedConfigs.has(platform)) {
        return;
      }

      try {
        const response = await fetch(`./src/presentation/views/${platform}.html`);
        if (response.ok) {
          const html = await response.text();
          const configDiv = document.createElement('div');
          configDiv.id = `config-${platform}`;
          configDiv.className = 'mb-3';
          configDiv.innerHTML = html;
          this.configContainer.appendChild(configDiv);
          this.loadedConfigs.add(platform);
        } else {
          console.error(`Configuration not available for ${platform}`);
        }
      } catch (error) {
        console.error('Error loading platform config:', error);
      }
    }

    private removePlatformConfig(platform: string): void {
      const configDiv = document.getElementById(`config-${platform}`);
      if (configDiv) {
        configDiv.remove();
        this.loadedConfigs.delete(platform);
      }
    }

    private async handleSubmit(e: Event): Promise<void> {
      e.preventDefault();

      const selectedPlatforms = this.getSelectedPlatforms();
      if (selectedPlatforms.length === 0) {
        alert('Please select at least one platform');
        return;
      }

      const configs = this.getAllPlatformConfigs(selectedPlatforms);
      if (configs.length === 0) {
        alert('Please fill in all required fields for selected platforms');
        return;
      }

      await this.startScraping(configs);
    }

    private getSelectedPlatforms(): string[] {
      const selected: string[] = [];
      this.platformCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
          selected.push(checkbox.value);
        }
      });
      return selected;
    }

    private getAllPlatformConfigs(platforms: string[]): ScrapingConfig[] {
      const configs: ScrapingConfig[] = [];

      platforms.forEach(platform => {
        const config = this.getPlatformConfig(platform);
        if (config) {
          configs.push(config);
        }
      });

      return configs;
    }

    private getPlatformConfig(platform: string): ScrapingConfig | null {
      const config: ScrapingConfig = { platform };

      switch (platform) {
        case 'twitter':
          const query = (document.getElementById('twitter-query') as HTMLInputElement)?.value;
          const count = (document.getElementById('twitter-count') as HTMLInputElement)?.value;
          if (!query) return null;
          config.query = query;
          config.count = count || '10';
          break;

        case 'instagram':
          const username = (document.getElementById('instagram-username') as HTMLInputElement)?.value;
          const type = (document.getElementById('instagram-type') as HTMLSelectElement)?.value;
          if (!username) return null;
          config.username = username;
          config.type = type;
          break;

        case 'facebook':
          const page = (document.getElementById('facebook-page') as HTMLInputElement)?.value;
          const contentType = (document.getElementById('facebook-content') as HTMLSelectElement)?.value;
          if (!page) return null;
          config.page = page;
          config.contentType = contentType;
          break;

        case 'reddit':
          const subreddit = (document.getElementById('reddit-subreddit') as HTMLInputElement)?.value;
          const sort = (document.getElementById('reddit-sort') as HTMLSelectElement)?.value;
          const limit = (document.getElementById('reddit-limit') as HTMLInputElement)?.value;
          if (!subreddit) return null;
          config.subreddit = subreddit;
          config.sort = sort;
          config.limit = limit || '25';
          break;

        default:
          return null;
      }

      return config;
    }

    private async startScraping(configs: ScrapingConfig[]): Promise<void> {
      if (!this.resultsDiv || !this.resultsContent) return;

      // Show loading state
      this.resultsDiv.style.display = 'block';
      const platformsList = configs.map(c => c.platform).join(', ');
      this.resultsContent.innerHTML = `
        <div class="text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3">Scraping ${platformsList}...</p>
        </div>
      `;

      // Scroll to results
      this.resultsDiv.scrollIntoView({ behavior: 'smooth' });

      // TODO: Implement actual scraping logic here
      // For now, simulate scraping for each platform
      setTimeout(() => {
        if (this.resultsContent) {
          let resultsHTML = '<h5 class="card-title">Scraping Results</h5>';
          
          configs.forEach((config, index) => {
            resultsHTML += `
              <div class="mb-4 ${index > 0 ? 'border-top pt-3' : ''}">
                <h6 class="text-primary">${config.platform.charAt(0).toUpperCase() + config.platform.slice(1)}</h6>
                <p class="text-success"><strong>Scraping completed!</strong></p>
                <pre class="bg-light p-3 rounded small">${JSON.stringify(config, null, 2)}</pre>
              </div>
            `;
          });

          resultsHTML += '<p class="text-muted small mt-3">Scraping functionality to be implemented</p>';
          this.resultsContent.innerHTML = resultsHTML;
        }
      }, 2000);
    }
  }

  // Initialize controller when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new AppController());
  } else {
    new AppController();
  }
})();
