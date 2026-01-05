# Backend Coding Rules

This comprehensive guide outlines best practices, conventions, and standards for backend development with Express.js, Vercel Serverless Functions, PostgreSQL, Drizzle ORM, and Shopify integration.

## Development Philosophy

- Write clean, maintainable, and scalable code
- Follow SOLID principles
- Prefer functional and declarative programming patterns over imperative
- Emphasize type safety and static analysis
- Design for serverless architecture constraints

## Code Implementation Guidelines

### Planning Phase

- Begin with step-by-step planning
- Write detailed pseudocode before implementation
- Document API architecture and data flow
- Consider edge cases and error scenarios
- Plan for serverless function cold starts and timeouts

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
  - Classes
  - Type definitions
  - Interfaces
  - DTOs

- Use kebab-case for:
  - Directory names (e.g., routes/order-management)
  - File names (e.g., order-service.ts)
  - API route files (e.g., api/orders.ts)

- Use camelCase for:
  - Variables
  - Functions
  - Methods
  - Properties
  - Request/response objects

- Use UPPERCASE for:
  - Environment variables
  - Constants
  - Global configurations

### Specific Naming Patterns

- Prefix service methods with verbs: createOrder, updateUser, deleteProduct
- Prefix boolean variables with verbs: isValid, hasPermission, canAccess
- Use complete words instead of abbreviations except for:
  - err (error)
  - req (request)
  - res (response)
  - ctx (context)
  - db (database)

## Express.js Best Practices

### Application Structure

- Use modular architecture with route handlers
- Separate concerns: routes, controllers, services, and data access layers
- Use middleware for cross-cutting concerns
- Implement proper error handling middleware
- Use environment variables for configuration

### Route Organization

- Organize routes by feature/domain
- One route file per main domain/resource
- Use route parameters and query strings appropriately
- Implement proper HTTP method usage (GET, POST, PUT, DELETE, PATCH)
- Use proper status codes

### Middleware

- Use middleware for authentication and authorization
- Implement request validation middleware
- Use logging middleware for request tracking
- Implement rate limiting for API protection
- Use CORS middleware appropriately

## Vercel Serverless Functions

### Function Design

- Design functions to be stateless
- Keep functions small and focused on a single responsibility
- Optimize for cold start performance
- Use proper environment variables (Vercel's environment variable system)
- Implement proper timeout handling (max 10s for Hobby, 60s for Pro)

### API Routes

- Use Vercel's file-based routing system
- Place API routes in `/api` directory
- Use proper HTTP methods in route handlers
- Return proper status codes and JSON responses
- Handle errors gracefully with proper error responses

### Performance Optimization

- Minimize dependencies to reduce bundle size
- Use connection pooling for database connections
- Implement proper caching strategies
- Optimize database queries
- Use edge functions for simple, fast operations when appropriate

## Database with PostgreSQL and Drizzle ORM

### Schema Design

- Use Drizzle ORM for type-safe database operations
- Define schemas using Drizzle's schema definition
- Use proper migrations for schema changes
- Normalize data appropriately
- Use indexes for frequently queried columns
- Implement proper foreign key relationships

### Query Patterns

- Use Drizzle's query builder for type-safe queries
- Prefer prepared statements for security
- Implement proper pagination for list endpoints
- Use transactions for multi-step operations
- Avoid N+1 query problems
- Use proper joins instead of multiple queries

### Data Access Layer

- Create repository/service pattern for data access
- Encapsulate database logic in service classes
- Use Drizzle's type inference for return types
- Implement proper error handling for database operations
- Use connection pooling appropriately

## TypeScript Implementation

- Enable strict mode
- Define clear interfaces for API requests, responses, and database entities
- Use type guards to handle potential undefined or null values safely
- Apply generics to functions and services where type flexibility is needed
- Utilize TypeScript utility types (Partial, Pick, Omit) for cleaner and reusable code
- Prefer interface over type for defining object structures, especially when extending
- Use Drizzle's inferred types for database operations

## Error Handling

### Error Management

- Use proper HTTP status codes
- Create custom error classes for different error types
- Implement global error handler middleware
- Log errors appropriately (without exposing sensitive data)
- Return consistent error response format
- Handle validation errors separately from system errors

### Validation

- Use Zod for request validation
- Validate all input data
- Return clear validation error messages
- Validate data types, formats, and business rules
- Sanitize input to prevent injection attacks

## Shopify Integration

### Storefront API

- Use Shopify Storefront API for customer-facing operations
- Implement proper GraphQL queries and mutations
- Handle Shopify API rate limits (2 requests per second per store)
- Cache product data appropriately
- Implement proper error handling for API failures

### Admin API

- Use Shopify Admin API for backend operations
- Implement proper OAuth authentication
- Handle webhooks for order and product updates
- Use proper error handling and retry logic
- Implement webhook signature verification
- Store credentials securely using environment variables

### Webhook Handling

- Verify webhook signatures
- Implement idempotent webhook handlers
- Handle webhook retries appropriately
- Log webhook events for debugging
- Process webhooks asynchronously when possible

## Security

### Authentication and Authorization

- Use proper authentication methods (JWT, OAuth, etc.)
- Implement role-based access control (RBAC) when needed
- Validate and verify tokens on every request
- Use secure session management
- Implement proper password hashing (bcrypt, argon2)

### Input Security

- Implement input sanitization to prevent XSS attacks
- Use parameterized queries (Drizzle handles this)
- Validate and sanitize all user inputs
- Implement rate limiting
- Use HTTPS for all communications
- Implement CORS properly

### Data Protection

- Never expose sensitive data in API responses
- Use environment variables for secrets
- Implement proper logging (without sensitive data)
- Follow OWASP security guidelines
- Regularly update dependencies

## API Design

### RESTful Principles

- Use proper HTTP methods
- Use proper status codes
- Design consistent API endpoints
- Use proper resource naming (plural nouns)
- Implement proper versioning if needed

### Response Format

- Return consistent JSON response format
- Include proper error messages
- Use proper pagination for list endpoints
- Include metadata when appropriate
- Document API endpoints

## Testing

### Unit Testing

- Write thorough unit tests for services and utilities
- Use Jest for testing framework
- Mock external dependencies (database, APIs)
- Follow Arrange-Act-Assert pattern
- Test error cases and edge cases

### Integration Testing

- Test API endpoints end-to-end
- Use test database for integration tests
- Set up and tear down test data properly
- Test with realistic data scenarios
- Test error handling and edge cases

### Testing Serverless Functions

- Test functions locally using Vercel CLI
- Mock external services appropriately
- Test cold start scenarios
- Test timeout scenarios
- Test with various payload sizes

## Documentation

- Use JSDoc for documentation
- Document all public functions, classes, methods, and interfaces
- Document API endpoints with request/response examples
- Add examples when appropriate
- Use complete sentences with proper punctuation
- Keep descriptions clear and concise
- Document environment variables
- Document database schema changes

## TypeScript General Guidelines

### Basic Principles

- Use English for all code and documentation
- Always declare the type of each variable and function (parameters and return value)
  - Avoid using any
  - Create necessary types
- Use JSDoc to document public classes and methods
- Don't leave blank lines within a function
- One export per file (default export preferred for main exports)

### Nomenclature

- Use PascalCase for classes, DTOs, and types
- Use camelCase for variables, functions, and methods
- Use kebab-case for file and directory names
- Use UPPERCASE for environment variables
  - Avoid magic numbers and define constants
- Start each function with a verb
- Use verbs for boolean variables. Example: isValid, hasError, canDelete, etc.
- Use complete words instead of abbreviations and correct spelling
  - Except for standard abbreviations like API, URL, etc.
  - Except for well-known abbreviations:
    - err for errors
    - req, res, next for Express middleware parameters
    - ctx for contexts
    - db for database

### Functions

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
- Use DTOs for API request/response validation
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
- Write integration tests for each API module
  - Follow the Given-When-Then convention

## Monorepo Best Practices

### Workspace Organization

- Use npm workspaces for dependency management
- Use Turborepo for build orchestration and caching
- Organize backend code by feature/domain
- Share common types and utilities through shared packages
- Configure proper build dependencies in turbo.json

### Code Sharing

- Create shared packages for common utilities, types, and DTOs
- Use proper TypeScript project references
- Avoid circular dependencies between packages
- Document shared package APIs clearly

## Performance Considerations

### Database Optimization

- Use proper indexes
- Avoid N+1 queries
- Use connection pooling
- Implement proper caching strategies
- Use database transactions appropriately

### Serverless Optimization

- Minimize function bundle size
- Optimize cold start times
- Use edge functions when appropriate
- Implement proper caching
- Monitor function execution times
