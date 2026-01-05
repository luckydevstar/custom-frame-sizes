# Frontend Coding Rules

This comprehensive guide outlines best practices, conventions, and standards for frontend development with React 18, TypeScript, Vite, Wouter, Tailwind CSS, Shadcn/ui, Zustand, and TanStack Query.

## Development Philosophy

- Write clean, maintainable, and scalable code
- Follow SOLID principles
- Prefer functional and declarative programming patterns over imperative
- Emphasize type safety and static analysis
- Practice component-driven development

## Code Implementation Guidelines

### Planning Phase

- Begin with step-by-step planning
- Write detailed pseudocode before implementation
- Document component architecture and data flow
- Consider edge cases and error scenarios

### Code Style

- Use tabs for indentation
- Use single quotes for strings (except to avoid escaping)
- Omit semicolons (unless required for disambiguation)
- Eliminate unused variables
- Add space after keywords
- Add space before function declaration parentheses
- Always use strict equality (===) instead of loose equality (==)
- Space infix operators
- Add space after commas
- Keep else statements on the same line as closing curly braces
- Use curly braces for multi-line if statements
- Always handle error parameters in callbacks
- Limit line length to 80 characters
- Use trailing commas in multiline object/array literals

## Naming Conventions

### General Rules

- Use PascalCase for:
  - Components
  - Type definitions
  - Interfaces

- Use kebab-case for:
  - Directory names (e.g., components/auth-wizard)
  - File names (e.g., user-profile.tsx)

- Use camelCase for:
  - Variables
  - Functions
  - Methods
  - Hooks
  - Properties
  - Props

- Use UPPERCASE for:
  - Environment variables
  - Constants
  - Global configurations

### Specific Naming Patterns

- Prefix event handlers with 'handle': handleClick, handleSubmit
- Prefix boolean variables with verbs: isLoading, hasError, canSubmit
- Prefix custom hooks with 'use': useAuth, useForm
- Use complete words over abbreviations except for:
  - err (error)
  - req (request)
  - res (response)
  - props (properties)
  - ref (reference)

## React Best Practices

### Component Architecture

- Use functional components with TypeScript interfaces
- Define components using the function keyword
- Extract reusable logic into custom hooks
- Implement proper component composition
- Use React.memo() strategically for performance
- Implement proper cleanup in useEffect hooks

### React Performance Optimization

- Use useCallback for memoizing callback functions
- Implement useMemo for expensive computations
- Avoid inline function definitions in JSX
- Implement code splitting using dynamic imports
- Implement proper key props in lists (avoid using index as key)

## Vite Best Practices

### Build Configuration

- Use environment variables with VITE\_ prefix for client-side variables
- Leverage Vite's fast HMR for development
- Use proper path aliases configured in vite.config.ts
- Implement proper asset handling and optimization

### Code Splitting

- Use dynamic imports for route-based code splitting
- Lazy load heavy components and libraries
- Use Vite's built-in code splitting capabilities

## Wouter Routing

### Routing Patterns

- Use Wouter for client-side routing
- Implement route-based code splitting with lazy loading
- Use proper route parameters and query strings
- Implement nested routes when appropriate
- Use the `useLocation` and `useRoute` hooks for navigation

### Route Organization

- Organize routes by feature/domain
- Use route constants for maintainability
- Implement proper route guards and redirects
- Handle 404 and error routes gracefully

## TypeScript Implementation

- Enable strict mode
- Define clear interfaces for component props, state, and store structure
- Use type guards to handle potential undefined or null values safely
- Apply generics to functions, actions, and stores where type flexibility is needed
- Utilize TypeScript utility types (Partial, Pick, Omit) for cleaner and reusable code
- Prefer interface over type for defining object structures, especially when extending
- Use mapped types for creating variations of existing types dynamically

## UI and Styling

### Component Libraries

- Use Shadcn/ui for consistent, accessible component design
- Integrate Radix UI primitives for customizable, accessible UI elements
- Apply composition patterns to create modular, reusable components

### Styling Guidelines

- Use Tailwind CSS for utility-first, maintainable styling
- Design with mobile-first, responsive principles for flexibility across devices
- Implement dark mode using CSS variables or Tailwind's dark mode features
- Ensure color contrast ratios meet accessibility standards for readability
- Maintain consistent spacing values to establish visual harmony
- Define CSS variables for theme colors and spacing to support easy theming and maintainability

## State Management

### Local State

- Use useState for component-level state
- Implement useReducer for complex state
- Use useContext for shared state within component trees
- Implement proper state initialization

### Global State with Zustand

- Use Zustand for global state management
- Create focused stores by feature/domain
- Use immer middleware for complex state updates
- Implement proper store selectors to prevent unnecessary re-renders
- Keep stores small and focused on a single concern
- Use TypeScript for store type safety

### Server State with TanStack Query

- Use TanStack Query (React Query) for server state management
- Implement proper query keys for cache management
- Use mutations for data modifications
- Implement optimistic updates where appropriate
- Configure proper cache invalidation strategies
- Use query prefetching for better UX
- Handle loading, error, and success states properly

## Error Handling and Validation

### Form Validation

- Use Zod for schema validation
- Implement proper error messages
- Use proper form libraries (e.g., React Hook Form)
- Validate on both client and server side

### Error Boundaries

- Use error boundaries to catch and handle errors in React component trees gracefully
- Log caught errors to an external service (e.g., Sentry) for tracking and debugging
- Design user-friendly fallback UIs to display when errors occur, keeping users informed without breaking the app

## Shopify Integration

### Storefront API

- Use Shopify Storefront API for product data and cart operations
- Implement proper GraphQL queries and mutations
- Handle Shopify API rate limits and errors gracefully
- Cache product data appropriately using TanStack Query

### Admin API

- Use Shopify Admin API for backend operations
- Implement proper authentication and authorization
- Handle webhooks for order and product updates
- Use proper error handling for API failures

## Testing

### Unit Testing

- Write thorough unit tests to validate individual functions and components
- Use Vitest (Vite's test framework) and React Testing Library for reliable and efficient testing
- Follow patterns like Arrange-Act-Assert to ensure clarity and consistency in tests
- Mock external dependencies and API calls to isolate unit tests

### Integration Testing

- Focus on user workflows to ensure app functionality
- Set up and tear down test environments properly to maintain test independence
- Use snapshot testing selectively to catch unintended UI changes without over-relying on it
- Leverage testing utilities (e.g., screen in RTL) for cleaner and more readable tests

## Accessibility (a11y)

### Core Requirements

- Use semantic HTML for meaningful structure
- Apply accurate ARIA attributes where needed
- Ensure full keyboard navigation support
- Manage focus order and visibility effectively
- Maintain accessible color contrast ratios
- Follow a logical heading hierarchy
- Make all interactive elements accessible
- Provide clear and accessible error feedback

## Security

- Implement input sanitization to prevent XSS attacks
- Use DOMPurify for sanitizing HTML content
- Use proper authentication methods
- Validate and sanitize all user inputs
- Use HTTPS for all API communications

## Internationalization (i18n)

- Use a proper i18n library (e.g., react-i18next) for translations
- Implement proper locale detection
- Use proper number and date formatting
- Implement proper RTL support
- Use proper currency formatting

## Documentation

- Use JSDoc for documentation
- Document all public functions, classes, methods, and interfaces
- Add examples when appropriate
- Use complete sentences with proper punctuation
- Keep descriptions clear and concise
- Use proper markdown formatting
- Use proper code blocks
- Use proper links
- Use proper headings
- Use proper lists

## TypeScript General Guidelines

### Basic Principles

- Use English for all code and documentation
- Always declare the type of each variable and function (parameters and return value)
  - Avoid using any
  - Create necessary types
- Use JSDoc to document public classes and methods
- Don't leave blank lines within a function
- One export per file (default export preferred for components)

### Nomenclature

- Use PascalCase for classes and components
- Use camelCase for variables, functions, and methods
- Use kebab-case for file and directory names
- Use UPPERCASE for environment variables
  - Avoid magic numbers and define constants
- Start each function with a verb
- Use verbs for boolean variables. Example: isLoading, hasError, canDelete, etc.
- Use complete words instead of abbreviations and correct spelling
  - Except for standard abbreviations like API, URL, etc.
  - Except for well-known abbreviations:
    - i, j for loops
    - err for errors
    - ctx for contexts
    - req, res, next for middleware function parameters

### Functions

- In this context, what is understood as a function will also apply to a method
- Write short functions with a single purpose. Less than 20 instructions
- Name functions with a verb and something else
  - If it returns a boolean, use isX or hasX, canX, etc.
  - If it doesn't return anything, use executeX or saveX, etc.
- Avoid nesting blocks by:
  - Early checks and returns
  - Extraction to utility functions
- Use higher-order functions (map, filter, reduce, etc.) to avoid function nesting
  - Use arrow functions for simple functions (less than 3 instructions)
  - Use named functions for non-simple functions
- Use default parameter values instead of checking for null or undefined
- Reduce function parameters using RO-RO
  - Use an object to pass multiple parameters
  - Use an object to return results
  - Declare necessary types for input arguments and output
- Use a single level of abstraction

### Data

- Don't abuse primitive types and encapsulate data in composite types
- Avoid data validations in functions and use classes with internal validation
- Prefer immutability for data
  - Use readonly for data that doesn't change
  - Use as const for literals that don't change

### Classes

- Follow SOLID principles
- Prefer composition over inheritance
- Declare interfaces to define contracts
- Write small classes with a single purpose
  - Less than 200 instructions
  - Less than 10 public methods
  - Less than 10 properties

### Exceptions

- Use exceptions to handle errors you don't expect
- If you catch an exception, it should be to:
  - Fix an expected problem
  - Add context
  - Otherwise, use a global handler

### Testing

- Follow the Arrange-Act-Assert convention for tests
- Name test variables clearly
  - Follow the convention: inputX, mockX, actualX, expectedX, etc.
- Write unit tests for each public function
  - Use test doubles to simulate dependencies
    - Except for third-party dependencies that are not expensive to execute
- Write acceptance tests for each module
  - Follow the Given-When-Then convention

## Monorepo Best Practices

### Workspace Organization

- Use npm workspaces for dependency management
- Use Turborepo for build orchestration and caching
- Organize code by feature/domain across workspaces
- Share common types and utilities through shared packages
- Configure proper build dependencies in turbo.json

### Code Sharing

- Create shared packages for common utilities, types, and components
- Use proper TypeScript project references
- Avoid circular dependencies between packages
- Document shared package APIs clearly
