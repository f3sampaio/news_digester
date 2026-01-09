# Architecture Documentation

This document explains the architecture behind News Digester, which follows **Clean Architecture** principles and **SOLID** design patterns.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Layer Structure](#layer-structure)
3. [Dependency Rule](#dependency-rule)
4. [SOLID Principles](#solid-principles)
5. [Layer Details](#layer-details)
6. [Data Flow](#data-flow)
7. [Design Patterns](#design-patterns)

## Architecture Overview

News Digester uses **Clean Architecture** (also known as Hexagonal Architecture or Ports and Adapters), which separates the application into distinct layers with clear boundaries and dependencies.

### Key Benefits

- **Framework Independence**: Business logic is independent of Electron, UI frameworks, and databases
- **Testability**: Each layer can be tested in isolation
- **Maintainability**: Changes in one layer don't affect others
- **Scalability**: Easy to add new features and platforms
- **Flexibility**: Can swap implementations without changing core logic

## Layer Structure

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                    │
│              (Views, Controllers, UI Logic)               │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│                  Application Layer                      │
│           (Services, DTOs, Use Case Orchestration)      │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│                    Domain Layer                          │
│        (Entities, Interfaces, Business Logic)            │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│                Infrastructure Layer                      │
│    (Electron, Repositories, External Services)           │
└──────────────────────────────────────────────────────────┘
```

## Dependency Rule

The **fundamental rule** of Clean Architecture is:

> **Dependencies point inward**: Outer layers depend on inner layers, but inner layers never depend on outer layers.

- **Domain Layer** (innermost): No dependencies on other layers
- **Application Layer**: Depends only on Domain
- **Infrastructure Layer**: Depends on Domain and Application
- **Presentation Layer**: Depends on Domain and Application

This ensures that:
- Business logic remains pure and testable
- Frameworks can be swapped without affecting core logic
- The system is resilient to external changes

## SOLID Principles

### 1. Single Responsibility Principle (SRP)

Each class has one reason to change:

- `WindowManager`: Only manages Electron windows
- `AppController`: Only controls application lifecycle
- `MainView`: Only handles view rendering
- `IRepository<T>`: Only defines data access contract

### 2. Open/Closed Principle (OCP)

Open for extension, closed for modification:

- Interfaces allow adding new implementations without changing existing code
- Base classes provide extension points
- New scrapers can be added by implementing `IService<T>`

### 3. Liskov Substitution Principle (LSP)

Derived classes must be substitutable for their base classes:

- Any class implementing `IRepository<T>` can replace another
- Any class implementing `IService<T>` can be used interchangeably
- View controllers can be extended without breaking existing functionality

### 4. Interface Segregation Principle (ISP)

Clients shouldn't depend on interfaces they don't use:

- `IRepository<T>` is focused on data operations
- `IService<T>` is focused on business operations
- Separate interfaces for different concerns

### 5. Dependency Inversion Principle (DIP)

Depend on abstractions, not concretions:

- High-level modules depend on interfaces (`IRepository`, `IService`)
- Low-level modules implement these interfaces
- Dependency injection allows swapping implementations

## Layer Details

### Domain Layer (`src/domain/`)

**Purpose**: Contains the core business logic and rules. This is the heart of the application.

**Components**:

#### Entities (`entities/`)
- **BaseEntity**: Abstract base class for all domain entities
  - Provides common properties: `id`, `createdAt`, `updatedAt`
  - All domain models extend this class

#### Interfaces (`interfaces/`)
- **IRepository<T>**: Contract for data persistence
  ```typescript
  interface IRepository<T extends BaseEntity> {
    findAll(): Promise<T[]>;
    findById(id: string): Promise<T | null>;
    create(entity: T): Promise<T>;
    update(id: string, entity: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
  }
  ```

- **IService<T>**: Contract for business operations
  ```typescript
  interface IService<T> {
    execute(...args: any[]): Promise<T>;
  }
  ```

#### Use Cases (`usecases/`)
- **ExampleUseCase**: Demonstrates business logic implementation
- Each use case represents a single business operation
- Implements `IService<T>` interface

**Key Characteristics**:
- ✅ No dependencies on external frameworks
- ✅ Pure TypeScript/JavaScript
- ✅ Highly testable
- ✅ Framework-agnostic

### Application Layer (`src/application/`)

**Purpose**: Orchestrates use cases and coordinates between domain and infrastructure.

**Components**:

#### DTOs (`dto/`)
- **BaseDTO**: Base class for Data Transfer Objects
- DTOs are used for data transfer between layers
- Separate from domain entities to maintain layer boundaries

#### Services (`services/`)
- **ExampleService**: Application service that orchestrates use cases
- Coordinates multiple use cases if needed
- Handles application-level logic (not business logic)

**Key Characteristics**:
- ✅ Depends only on Domain layer
- ✅ Orchestrates use cases
- ✅ Handles DTOs and data transformation
- ✅ Application-specific logic

### Infrastructure Layer (`src/infrastructure/`)

**Purpose**: Implements interfaces defined in the domain layer using external frameworks and tools.

**Components**:

#### Electron (`electron/`)
- **WindowManager**: Manages Electron BrowserWindow instances
  - Creates, stores, and manages windows
  - Handles window lifecycle

- **AppController**: Controls Electron application lifecycle
  - Handles app ready, window-all-closed, activate events
  - Initializes the application

#### Preload (`preload/`)
- **preload.ts**: Secure IPC bridge between main and renderer processes
- Exposes safe APIs to renderer process
- Maintains security with context isolation

#### Repositories (to be implemented)
- Concrete implementations of `IRepository<T>`
- Handles data persistence (database, file system, etc.)
- Platform-specific implementations

**Key Characteristics**:
- ✅ Implements domain interfaces
- ✅ Framework-specific code (Electron, databases, etc.)
- ✅ Can be swapped without affecting other layers
- ✅ Handles external concerns

### Presentation Layer (`src/presentation/`)

**Purpose**: Handles user interface and user interactions.

**Components**:

#### Views (`views/`)
- **MainView**: Renders UI components
  - Manages DOM manipulation
  - Handles view updates
  - Separated from business logic

#### Controllers (`controllers/`)
- **ViewController**: Base class for view controllers
  - Handles user interactions
  - Coordinates between views and application services
  - Manages view state

**Key Characteristics**:
- ✅ UI-specific code
- ✅ Handles user input and display
- ✅ Depends on Application layer for business operations
- ✅ Can be replaced with different UI frameworks

### Entry Points

#### Main Process (`src/main/`)
- **main.ts**: Electron main process entry point
- Initializes infrastructure components
- Sets up dependency injection
- Starts the application

#### Renderer Process (`src/renderer/`)
- **renderer.ts**: Electron renderer process entry point
- Initializes UI components
- Sets up view controllers
- Handles DOM ready events

## Data Flow

### Request Flow (User Action → Data)

```
User Action
    ↓
Presentation Layer (View/Controller)
    ↓
Application Layer (Service)
    ↓
Domain Layer (Use Case)
    ↓
Infrastructure Layer (Repository)
    ↓
External Data Source
```

### Response Flow (Data → User Display)

```
External Data Source
    ↓
Infrastructure Layer (Repository)
    ↓
Domain Layer (Entity)
    ↓
Application Layer (DTO)
    ↓
Presentation Layer (View)
    ↓
User Display
```

## Design Patterns

### Repository Pattern

- **Purpose**: Abstracts data access logic
- **Implementation**: `IRepository<T>` interface with concrete implementations
- **Benefit**: Easy to swap data sources (database, API, file system)

### Service Pattern

- **Purpose**: Encapsulates business operations
- **Implementation**: `IService<T>` interface with use case implementations
- **Benefit**: Single responsibility, testable business logic

### Dependency Injection

- **Purpose**: Invert dependencies and improve testability
- **Implementation**: Constructor injection in classes
- **Benefit**: Easy to mock dependencies for testing

### MVC Pattern (in Presentation Layer)

- **Purpose**: Separate view, controller, and model concerns
- **Implementation**: Views handle rendering, Controllers handle logic
- **Benefit**: Clear separation of UI concerns

## Adding New Features

### Adding a New Scraper

1. **Domain Layer**: Create entity and use case
   ```typescript
   // src/domain/entities/Post.ts
   export class Post extends BaseEntity {
     title: string;
     content: string;
     platform: string;
   }
   
   // src/domain/usecases/ScrapeTwitterUseCase.ts
   export class ScrapeTwitterUseCase implements IService<Post[]> {
     async execute(query: string): Promise<Post[]> {
       // Business logic
     }
   }
   ```

2. **Application Layer**: Create service
   ```typescript
   // src/application/services/TwitterService.ts
   export class TwitterService {
     private useCase: ScrapeTwitterUseCase;
     // Orchestrate use case
   }
   ```

3. **Infrastructure Layer**: Implement scraping logic
   ```typescript
   // src/infrastructure/scrapers/TwitterScraper.ts
   export class TwitterScraper {
     // Platform-specific scraping implementation
   }
   ```

4. **Presentation Layer**: Create UI
   ```typescript
   // src/presentation/views/TwitterView.ts
   export class TwitterView {
     // UI for Twitter scraping
   }
   ```

## Testing Strategy

Each layer can be tested independently:

- **Domain**: Unit tests for entities and use cases (no mocks needed)
- **Application**: Unit tests with mocked use cases
- **Infrastructure**: Integration tests with real or mocked external services
- **Presentation**: Component tests with mocked services

## Benefits of This Architecture

1. **Maintainability**: Clear separation of concerns
2. **Testability**: Each layer can be tested in isolation
3. **Flexibility**: Easy to swap implementations
4. **Scalability**: Easy to add new features
5. **Framework Independence**: Core logic doesn't depend on Electron
6. **Team Collaboration**: Different teams can work on different layers

## Future Enhancements

- Add dependency injection container
- Implement repository pattern for data persistence
- Add event-driven architecture for decoupled communication
- Implement CQRS pattern for read/write separation
- Add validation layer
- Implement caching layer
