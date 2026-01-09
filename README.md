# News Digester

A cross-platform Electron application built with TypeScript for scraping and aggregating content from social media platforms including X (Twitter), Instagram, Facebook, and Reddit. The project follows Clean Architecture principles and SOLID design patterns for maintainability and scalability.

## Features

- **Multi-Platform Support**: Scrape content from X (Twitter), Instagram, Facebook, and Reddit
- **Cross-Platform Desktop App**: Runs on Windows, macOS, and Linux
- **Clean Architecture**: Well-organized codebase following SOLID principles
- **TypeScript**: Full type safety and modern JavaScript features
- **Modern UI**: Bootstrap 5 for responsive and beautiful interfaces

## Supported Platforms

- **X (Twitter)**: Extract tweets, user profiles, and trending topics
- **Instagram**: Scrape posts, stories, and user information
- **Facebook**: Collect posts, comments, and page data
- **Reddit**: Gather posts, comments, and subreddit information

## Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher) or **yarn**
- **Git** (for cloning the repository)

## Running Locally

### 1. Clone the Repository

```bash
git clone <repository-url>
cd news_digester
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Development Mode

Run the application in development mode with hot-reload:

```bash
npm run dev
```

This command will:
- Compile TypeScript to JavaScript
- Launch the Electron application

### 4. Production Build

Build the application for production:

```bash
npm run build
npm start
```

## Building for Different Operating Systems

This project uses `electron-builder` to create distributable packages for Windows, macOS, and Linux.

### Build for Windows

```bash
npm run build:win
```

This creates a Windows installer (NSIS) in the `release/` directory.

### Build for macOS

```bash
npm run build:mac
```

This creates a macOS DMG file in the `release/` directory.

**Note**: Building for macOS on non-macOS systems requires additional setup. You may need to build on a macOS machine or use CI/CD services.

### Build for Linux

```bash
npm run build:linux
```

This creates a Linux AppImage in the `release/` directory.

### Build for All Platforms

To build for all platforms at once:

```bash
npm run build:all
```

**Note**: Building for all platforms typically requires running on each target OS, or using CI/CD pipelines.

### Build Configuration

The build configuration is defined in `package.json` under the `build` section. You can customize:

- Application ID
- Product name
- Icons for each platform
- Output directories
- Target formats (NSIS, DMG, AppImage, etc.)

## Project Structure

```
news_digester/
├── src/
│   ├── domain/           # Core business logic
│   ├── application/      # Application services
│   ├── infrastructure/   # External implementations
│   ├── presentation/     # UI layer
│   ├── main/             # Main process entry
│   └── renderer/         # Renderer process entry
├── dist/                 # Compiled JavaScript
├── release/              # Built applications
├── index.html            # Main HTML file
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md             # This file
```

For detailed architecture documentation, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Development

### Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Build and run in development mode
- `npm start` - Build and run in production mode
- `npm run build:win` - Build Windows installer
- `npm run build:mac` - Build macOS DMG
- `npm run build:linux` - Build Linux AppImage
- `npm run build:all` - Build for all platforms

### Code Style

The project follows TypeScript best practices and Clean Architecture principles. Key guidelines:

- Use interfaces for dependency inversion
- Keep domain logic independent of frameworks
- Separate concerns into distinct layers
- Follow SOLID principles

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Disclaimer

This tool is for educational and research purposes. Please ensure you comply with:

- Terms of Service of the platforms you're scraping
- Rate limiting and API usage policies
- Data privacy regulations (GDPR, CCPA, etc.)
- Copyright laws

Always respect robots.txt files and use ethical scraping practices.
