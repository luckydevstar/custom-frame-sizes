# FrameCraft → Headless Shopify Multi-Store Migration Plan

## Executive Summary

This document outlines the comprehensive strategy for migrating the FrameCraft custom picture frame configurator from its current Replit-hosted prototype into a production-ready, headless Shopify multi-store architecture. The system will support **10+ storefronts** sharing a common codebase while allowing per-domain branding and configuration overrides.

### Project Objectives

1. **Multi-Store Architecture** - Single codebase powering multiple branded storefronts
2. **Headless Shopify Integration** - Full Storefront API + Admin API implementation
3. **SEO-Safe Migration** - Preserve existing custompictureframes.com rankings
4. **Scalable Deployment** - Vercel-based infrastructure with isolated environments
5. **Shared Configurator** - Frame designer propagates changes across all stores

### Current State Analysis

**Technology Stack (Already Built)**:

- React 18 + TypeScript with Vite
- Express.js backend with PostgreSQL (Drizzle ORM)
- Tailwind CSS + Shadcn/ui components
- Zustand + TanStack Query for state management
- Wouter for routing
- Already has multi-site awareness via `SITE_ID` environment variable

**Core Features (Already Implemented)**:

- Interactive frame designer with real-time preview
- Specialty designers (Shadowbox, Jersey, Canvas Float, Puzzle, Comic Book, Playbill)
- Dynamic pricing engine with per-linear-inch calculations
- Basic Shopify Storefront API scaffold (currently in mock mode)
- Image upload system with AI upscaling capability
- AI-powered frame recommendations (OpenAI Vision)
- Production file generation (LightBurn for brass nameplates)
- Brand configuration system (client/src/brand/brand.config.ts + shared/brand.config.ts)
- Multi-tenant database schema with siteId support

**What Needs to Change**:

- Move from single-brand config to per-store configs
- Transition from Replit to Vercel deployment
- Convert to pnpm monorepo with Turborepo
- Implement production-ready Shopify integration (both Storefront and Admin APIs)
- Extract shared packages for reusability
- Implement server-side cart management with secure token handling
- Set up SEO migration strategy for existing domain(s)

---

## Table of Contents

1. [Phase 1: Foundation & Architecture](#phase-1-foundation--architecture)
2. [Phase 2: Store Launches & Iteration](#phase-2-store-launches--iteration)
3. [Phase 3: Ongoing Support & System Ownership](#phase-3-ongoing-support--system-ownership)
4. [Timeline & Milestones](#timeline--milestones)
5. [Risk Assessment & Mitigation](#risk-assessment--mitigation)
6. [Success Criteria](#success-criteria)
7. [Glossary](#glossary)

---

## Phase 1: Foundation & Architecture

**Duration**: 8-10 weeks  
**Goal**: Build the technical foundation for multi-store operation

### 1.1 Monorepo Setup & Infrastructure

**Objective**: Convert the existing single-app structure into a scalable monorepo

#### Tasks

**1.1.1 Initialize pnpm Workspace**

- Create new repository structure with pnpm workspaces
- Set up Turborepo for build orchestration
- Configure workspace dependencies and version management
- Set up TypeScript project references for cross-package type checking
- Create root package.json with shared scripts
- Document workspace structure and conventions

**1.1.2 Define Monorepo Structure**

- Design folder hierarchy (apps/, packages/, data/, content/)
- Plan package boundaries and responsibilities
- Define dependency graph between packages
- Create architectural decision records (ADRs) for major choices
- Document package naming conventions
- Set up package visibility rules (public vs internal)

**1.1.3 Configure Build System**

- Set up Turborepo pipeline configuration (build, dev, lint, type-check)
- Configure caching strategies for optimal build performance
- Set up incremental builds with dependency tracking
- Configure parallel execution and task dependencies
- Set up build artifact outputs
- Document build commands and pipeline behavior

**1.1.4 Set Up Development Environment**

- Configure ESLint and Prettier for monorepo
- Set up shared TypeScript configuration (tsconfig.base.json)
- Configure VS Code workspace settings
- Set up pre-commit hooks with Husky
- Create developer onboarding documentation
- Set up local environment variable templates

### 1.2 Package Extraction & Organization

**Objective**: Extract existing code into reusable shared packages

#### Tasks

**1.2.1 Extract UI Component Library (@framecraft/ui)**

- Audit existing components in client/src/components/
- Identify shared vs store-specific components
- Extract all Shadcn/ui components to shared package
- Extract layout components (Header, Footer, Navigation)
- Move specialty designers (FrameDesigner, ShadowboxDesigner, etc.)
- Set up component exports and documentation
- Create Storybook or similar documentation (optional)
- Write component usage guidelines

**1.2.2 Extract Core Business Logic (@framecraft/core)**

- Move services (products.ts, pricing.ts, shopify.ts, validation.ts)
- Extract utility functions from client/src/lib/
- Move hooks to shared package (use-mat-catalog.ts, etc.)
- Extract type definitions from client/src/types/
- Move pricing calculation logic
- Extract dimension validation utilities
- Create barrel exports for clean imports
- Write API documentation for core functions

**1.2.3 Extract Configuration Package (@framecraft/config)**

- Move navigation configurations
- Extract animation configurations
- Move feature flag system
- Create theme configuration system
- Extract base palette definitions
- Move header/footer configurations
- Document configuration options and overrides

**1.2.4 Create Data Package (@framecraft/data)**

- Move product catalogs (frames.json, mats.json, glass.json)
- Move pricing configuration
- Create data access layer
- Set up data validation schemas
- Document data structure and update procedures
- Create data migration utilities if needed

**1.2.5 Extract Shared Types Package (@framecraft/types)**

- Move all TypeScript type definitions
- Extract interface definitions
- Create shared schema definitions
- Set up type generation utilities
- Document type conventions
- Ensure proper type exports

### 1.3 Shopify Storefront API Integration

**Objective**: Build production-ready client-side Shopify integration

#### Tasks

**1.3.1 Design Data Access Layer**

- Create Storefront API client abstraction
- Design typed data access functions (getProductByHandle, getCollection, etc.)
- Implement store identifier mapping system
- Set up GraphQL query structure
- Create error handling patterns
- Design retry and fallback strategies

**1.3.2 Implement GraphQL Fragments**

- Create reusable ProductFields fragment
- Create VariantFields fragment
- Create CartFields fragment
- Create CheckoutFields fragment
- Create CollectionFields fragment
- Document fragment usage patterns
- Set up fragment composition strategy

**1.3.3 Build Product Query Functions**

- Implement getProductByHandle with store context
- Implement getCollection with pagination
- Implement searchProducts functionality
- Implement getProductRecommendations
- Add loading states and error handling
- Create query result caching strategy
- Write unit tests for query functions

**1.3.4 Implement Configuration Serialization**

- Design line item attribute structure
- Implement frame configuration serializer
- Create serialization for each specialty designer type
- Implement deserialization for order fulfillment
- Create validation for serialized data
- Document attribute naming conventions
- Write serialization unit tests

**1.3.5 Set Up Client-Side Cart State**

- Design cart state management with Zustand
- Implement optimistic updates
- Create cart persistence strategy
- Implement cart syncing with Storefront API
- Add error recovery mechanisms
- Create cart expiration handling
- Write cart state tests

### 1.4 Shopify Admin API Integration (Server-Side)

**Objective**: Build secure backend-for-frontend for privileged operations

#### Tasks

**1.4.1 Design Backend API Architecture**

- Define serverless function structure for Vercel
- Design API route organization
- Create request/response schemas
- Design authentication and authorization strategy
- Plan rate limiting implementation
- Document API endpoint specifications
- Create API versioning strategy

**1.4.2 Implement Secure Cart Management**

- Create POST /api/cart endpoint for cart creation
- Create PATCH /api/cart/lines endpoint for updates
- Implement HTTP-only cookie management
- Create cart ID validation and security checks
- Implement request validation and sanitization
- Add rate limiting per IP/session
- Create comprehensive error responses
- Write API endpoint tests

**1.4.3 Implement Checkout Session Management**

- Create POST /api/checkout endpoint
- Implement checkout URL generation
- Add discount code validation
- Create shipping option handling
- Implement customer data validation
- Add fraud prevention checks
- Create checkout abandonment tracking (optional)
- Write checkout flow tests

**1.4.4 Build Admin Token Security Layer**

- Design secure environment variable management
- Create Admin API client abstraction
- Implement token rotation strategy (if needed)
- Add token validation and error handling
- Create audit logging for Admin API usage
- Document security best practices
- Set up monitoring for unauthorized access attempts

**1.4.5 Implement Order File Management**

- Create POST /api/orders/files endpoint
- Implement file upload handling
- Create order metadata storage
- Implement file retrieval by order ID
- Add file expiration and cleanup logic
- Create production file generation trigger
- Write order file management tests

### 1.5 Multi-Store Configuration System

**Objective**: Enable per-store branding and feature customization

#### Tasks

**1.5.1 Design Store Configuration Schema**

- Define complete configuration interface
- Design theme override system
- Create feature flag structure
- Define navigation customization options
- Design component override mechanism
- Document all configuration options
- Create configuration validation schema

**1.5.2 Implement Theme System**

- Create base theme with CSS custom properties
- Implement theme merging function
- Create theme preview system
- Add runtime theme switching
- Create theme validation
- Document theming guidelines
- Create theme testing utilities

**1.5.3 Build Feature Flag System**

- Implement feature flag evaluation
- Create feature flag override mechanism
- Add feature flag documentation
- Create feature flag testing utilities
- Implement feature flag analytics (optional)
- Document feature flag best practices
- Create feature flag management UI (optional)

**1.5.4 Create Component Override System**

- Design lazy loading for override components
- Implement override resolution logic
- Create fallback to default components
- Add override validation
- Document override patterns
- Create override testing strategy
- Write override implementation examples

**1.5.5 Implement Store Context Provider**

- Create React context for store configuration
- Implement configuration loading from API
- Add error handling for missing configuration
- Create configuration caching
- Implement configuration refresh mechanism
- Add TypeScript support with proper types
- Write context provider tests

### 1.6 Database Schema Updates

**Objective**: Ensure database supports multi-tenant operations

#### Tasks

**1.6.1 Audit Existing Schema**

- Review all current tables in shared/schema.ts
- Identify tables missing siteId
- Document relationships between tables
- Plan migration strategy for existing data
- Identify potential data conflicts
- Create schema documentation

**1.6.2 Update Schema Definitions**

- Add siteId to all relevant tables
- Add proper foreign key constraints
- Create indexes on siteId columns for performance
- Update Drizzle schema definitions
- Create migration files
- Document schema changes

**1.6.3 Implement Data Access Layer Updates**

- Update storage.ts with siteId filtering
- Add automatic siteId injection in inserts
- Update all queries to filter by siteId
- Add data isolation validation
- Create data access utilities
- Write data access layer tests

**1.6.4 Create Database Migration Scripts**

- Write migration for adding siteId columns
- Create backfill scripts for existing data
- Write rollback procedures
- Test migrations on staging database
- Document migration process
- Create backup and restore procedures

---

## Phase 2: Store Launches & Iteration

**Duration**: 8-10 weeks  
**Goal**: Launch new storefronts and validate the multi-store architecture

### 2.1 First Store Setup (Proof of Concept)

**Objective**: Launch first new branded storefront to validate architecture

#### Tasks

**2.1.1 Create Store A Application**

- Set up new app in apps/store-a directory
- Install dependencies (@framecraft/\* packages)
- Configure Next.js or Vite setup
- Set up routing and navigation
- Create store-specific brand.config.ts
- Configure environment variables
- Document store setup process

**2.1.2 Configure Store A Branding**

- Define brand identity (colors, fonts, logos)
- Create theme configuration
- Set up navigation structure
- Configure feature flags based on brand focus
- Create store-specific assets
- Set up SEO metadata
- Document branding decisions

**2.1.3 Set Up Store A Shopify Store**

- Create new Shopify store account
- Configure products and collections
- Set up payment gateways
- Configure shipping options
- Create custom frame product variant
- Generate Storefront API access token
- Generate Admin API access token
- Document Shopify configuration

**2.1.4 Configure Store A Domain**

- Purchase domain name
- Set up DNS configuration
- Configure SSL certificates
- Set up domain in Vercel
- Configure environment-specific URLs
- Test domain resolution
- Document domain setup

**2.1.5 Integrate Store A with Shopify**

- Configure Shopify credentials in environment
- Test product fetching from Storefront API
- Test cart creation and management
- Test checkout flow end-to-end
- Verify order data in Shopify admin
- Test configuration serialization
- Document integration points

**2.1.6 Test Store A Functionality**

- Test all frame designer variations
- Test specialty designers (if enabled)
- Test image upload and AI features
- Test pricing calculations
- Test responsive design on mobile
- Test dark mode support
- Test accessibility features
- Perform cross-browser testing
- Document test results and issues

**2.1.7 Deploy Store A to Vercel**

- Create Vercel project for Store A
- Configure environment variables in Vercel
- Set up production, preview, and development environments
- Configure build settings
- Set up deployment hooks
- Deploy to production
- Verify deployment health
- Document deployment process

### 2.2 Second Store Setup (Architecture Validation)

**Objective**: Launch second store with different branding to validate flexibility

#### Tasks

**2.2.1 Create Store B Application**

- Set up new app in apps/store-b directory
- Follow Store A setup process
- Configure different brand identity
- Set up distinct navigation structure
- Configure different feature flags
- Create component overrides (if needed)
- Document differences from Store A

**2.2.2 Configure Store B with Different Focus**

- Choose different product focus (e.g., sports memorabilia vs art)
- Configure appropriate feature flags
- Disable irrelevant specialty designers
- Create focus-specific navigation
- Set up distinct color scheme
- Create focus-specific content
- Document focus area strategy

**2.2.3 Test Shared Code Reusability**

- Verify shared components work correctly
- Test pricing engine with different configurations
- Verify frame designer works identically
- Test that changes to shared packages affect both stores
- Identify any store-specific edge cases
- Document reusability findings
- Create guidelines for future stores

**2.2.4 Deploy Store B to Vercel**

- Create separate Vercel project for Store B
- Configure isolated environment variables
- Set up separate domains
- Deploy to production
- Verify both stores operate independently
- Test cross-store data isolation
- Document multi-project deployment pattern

### 2.3 Pricing Integration Refinement

**Objective**: Ensure pricing system works correctly across all stores

#### Tasks

**2.3.1 Validate Pricing Calculations**

- Test pricing with Store A configuration
- Test pricing with Store B configuration
- Verify per-linear-inch calculations
- Test oversize fees
- Test specialty pricing (jerseys, shadowboxes, etc.)
- Verify mat pricing (single vs double)
- Test glass upgrade pricing
- Document pricing test results

**2.3.2 Implement Store-Specific Pricing Overrides**

- Design pricing override system
- Implement markup configuration per store
- Add promotional pricing support
- Create pricing rule validation
- Test pricing overrides
- Document pricing override patterns
- Create pricing admin interface (optional)

**2.3.3 Integrate Pricing with Shopify**

- Verify calculated prices match Shopify checkout
- Implement dynamic pricing in line items
- Test discount code handling
- Verify tax calculation
- Test shipping cost calculation
- Document pricing integration points
- Create pricing reconciliation checks

### 2.4 Performance Optimization

**Objective**: Ensure system performs well at scale

#### Tasks

**2.4.1 Implement Caching Strategy**

- Set up Redis or similar caching layer (optional)
- Implement product catalog caching
- Cache Shopify API responses
- Implement frame image caching
- Add cache invalidation strategy
- Test cache performance
- Document caching architecture

**2.4.2 Optimize Bundle Sizes**

- Analyze bundle sizes with Webpack Bundle Analyzer
- Implement code splitting where beneficial
- Optimize image loading and formats
- Lazy load specialty designers
- Remove unused dependencies
- Implement tree shaking
- Document optimization strategies

**2.4.3 Implement Performance Monitoring**

- Set up performance metrics collection
- Implement error tracking (Sentry or similar)
- Create performance dashboards
- Set up alerting for critical issues
- Monitor API response times
- Track Shopify API rate limits
- Document monitoring setup

**2.4.4 Conduct Load Testing**

- Create load testing scenarios
- Test concurrent user scenarios
- Test cart creation under load
- Test checkout flow under load
- Identify bottlenecks
- Implement performance improvements
- Document load testing results

### 2.5 SEO Migration Planning (custompictureframes.com)

**Objective**: Prepare for SEO-safe migration of existing site

#### Tasks

**2.5.1 Conduct Pre-Migration Audit**

- Export current URL structure from existing site
- Identify all indexed pages (Google Search Console)
- Analyze current traffic sources and patterns
- Identify high-value pages (by traffic and conversions)
- Audit current meta tags and structured data
- Document current backlink profile
- Create baseline metrics for comparison

**2.5.2 Create URL Mapping Strategy**

- Map old URLs to new URL structure
- Identify URL pattern changes
- Prioritize redirects by traffic volume
- Create redirect map spreadsheet/JSON
- Plan canonical URL strategy
- Design URL structure for new platform
- Document URL mapping decisions

**2.5.3 Implement Redirect Infrastructure**

- Design redirect handling system
- Implement 301 redirects in Next.js/Vercel
- Create edge-based redirects for performance
- Implement wildcard redirect patterns
- Add redirect testing utilities
- Create redirect validation scripts
- Document redirect implementation

**2.5.4 Prepare Content Migration**

- Audit existing content pages
- Map content to new CMS/markdown system
- Preserve meta titles and descriptions
- Migrate structured data schemas
- Update internal linking structure
- Create content migration checklist
- Document content migration process

**2.5.5 Set Up Monitoring for Migration**

- Configure Google Search Console for new domain
- Set up 404 monitoring
- Create traffic comparison dashboards
- Set up ranking position tracking
- Configure crawl error alerts
- Create post-migration checklist
- Document monitoring procedures

### 2.6 Additional Store Rollouts

**Objective**: Launch stores 3-4 using refined process

#### Tasks

**2.6.1 Create Store C & D Applications**

- Replicate successful Store A/B setup process
- Apply learnings from first two stores
- Configure distinct brand identities
- Set up Shopify stores
- Deploy to Vercel
- Test functionality
- Document any new challenges

**2.6.2 Refine Deployment Process**

- Create deployment checklist
- Automate repetitive setup tasks
- Create store scaffolding CLI tool
- Document common pitfalls
- Create troubleshooting guide
- Streamline testing procedures
- Update developer documentation

**2.6.3 Implement Store Management Tools**

- Create store configuration dashboard (optional)
- Build store health monitoring
- Create deployment status tracking
- Implement cross-store analytics
- Create store comparison tools
- Document management tools
- Train team on tools usage

---

## Phase 3: Ongoing Support & System Ownership

**Duration**: Ongoing (long-term engagement)  
**Goal**: Maintain, optimize, and expand the multi-store platform

### 3.1 System Stabilization

**Objective**: Ensure platform reliability and resolve edge cases

#### Tasks

**3.1.1 Monitor Production Performance**

- Review performance metrics daily
- Identify and resolve bottlenecks
- Monitor error rates and patterns
- Track Shopify API usage and rate limits
- Analyze user behavior patterns
- Create performance improvement backlog
- Document performance baselines

**3.1.2 Address Production Issues**

- Triage and prioritize bug reports
- Fix critical issues immediately
- Create bug fix testing procedures
- Deploy fixes across affected stores
- Communicate fixes to stakeholders
- Document issue resolution patterns
- Create bug prevention strategies

**3.1.3 Optimize Database Performance**

- Analyze slow queries
- Add missing indexes
- Optimize data access patterns
- Implement query result caching
- Monitor database resource usage
- Plan for database scaling
- Document optimization work

**3.1.4 Refine Error Handling**

- Improve error messages for users
- Add comprehensive error logging
- Implement error recovery mechanisms
- Create graceful degradation strategies
- Improve offline handling
- Add error reporting from users
- Document error handling patterns

### 3.2 Feature Enhancement

**Objective**: Add new capabilities and improve existing features

#### Tasks

**3.2.1 Implement New Store Features**

- Gather feature requests from stakeholders
- Design new feature architecture
- Implement features in shared packages
- Test features across all stores
- Deploy features with feature flags
- Gather user feedback
- Document new features

**3.2.2 Enhance Frame Designer**

- Add new frame style options
- Improve mat customization
- Enhance glass selection
- Add new specialty designers
- Improve preview rendering
- Optimize designer performance
- Document designer enhancements

**3.2.3 Improve User Experience**

- Analyze user feedback and behavior
- Identify UX pain points
- Design UX improvements
- Implement improvements
- A/B test changes where appropriate
- Measure impact of improvements
- Document UX decisions

**3.2.4 Add New Integrations**

- Integrate additional payment methods
- Add shipping carrier integrations
- Integrate analytics platforms
- Add marketing automation tools
- Integrate customer support systems
- Document integration architecture
- Create integration testing procedures

### 3.3 Store Expansion Support

**Objective**: Enable continued store launches

#### Tasks

**3.3.1 Launch Stores 5-10**

- Apply streamlined deployment process
- Configure each store's unique branding
- Set up Shopify integration
- Deploy to Vercel
- Test thoroughly
- Monitor post-launch
- Document launch process improvements

**3.3.2 Create Store Templates**

- Develop store templates by category
- Create quick-start configurations
- Build template documentation
- Create template selection guide
- Test templates with new stores
- Gather template feedback
- Iterate on template offerings

**3.3.3 Improve Store Provisioning**

- Automate store creation process
- Create store setup wizard
- Automate Shopify store configuration
- Automate DNS and domain setup
- Create automated testing suite for new stores
- Document automated provisioning
- Train team on provisioning tools

### 3.4 Architecture Evolution

**Objective**: Continuously improve system architecture

#### Tasks

**3.4.1 Conduct Architecture Reviews**

- Review system architecture quarterly
- Identify architectural technical debt
- Plan architectural improvements
- Evaluate new technologies and patterns
- Update architectural documentation
- Present findings to stakeholders
- Plan migration paths for improvements

**3.4.2 Implement Architectural Improvements**

- Refactor problematic code areas
- Migrate to better patterns where needed
- Update dependencies regularly
- Improve type safety
- Enhance testing coverage
- Optimize build and deploy pipelines
- Document architectural changes

**3.4.3 Scale Infrastructure**

- Monitor resource usage across stores
- Plan for traffic growth
- Optimize database scaling
- Implement caching improvements
- Optimize API performance
- Plan for geographic distribution (CDN, etc.)
- Document scaling strategies

### 3.5 Documentation & Knowledge Transfer

**Objective**: Maintain comprehensive documentation and enable team growth

#### Tasks

**3.5.1 Maintain Technical Documentation**

- Update architecture diagrams
- Document new features and changes
- Maintain API documentation
- Update deployment guides
- Document troubleshooting procedures
- Create video walkthroughs (optional)
- Review and update docs quarterly

**3.5.2 Create Developer Guides**

- Write onboarding documentation
- Create code contribution guidelines
- Document common development tasks
- Create debugging guides
- Write testing guidelines
- Document code review process
- Maintain developer FAQ

**3.5.3 Document Business Processes**

- Document store launch process
- Create pricing configuration guide
- Document brand configuration process
- Create content management guide
- Document SEO best practices
- Create troubleshooting decision trees
- Maintain operations runbooks

**3.5.4 Knowledge Transfer Sessions**

- Conduct code walkthroughs with team
- Present architectural decisions
- Share lessons learned
- Train team on new features
- Document tribal knowledge
- Create pair programming opportunities
- Mentor junior developers

### 3.6 Strategic Planning

**Objective**: Guide long-term technical strategy

#### Tasks

**3.6.1 Quarterly Planning Sessions**

- Review current system state
- Identify improvement opportunities
- Plan next quarter's priorities
- Align with business objectives
- Estimate effort for initiatives
- Create quarterly roadmap
- Present plans to stakeholders

**3.6.2 Technology Evaluation**

- Research emerging technologies
- Evaluate tools and frameworks
- Plan technology upgrades
- Assess security vulnerabilities
- Plan dependency updates
- Evaluate performance tools
- Document technology decisions

**3.6.3 Competitive Analysis**

- Monitor competitor features
- Identify differentiation opportunities
- Evaluate industry best practices
- Research user expectations
- Plan competitive features
- Document competitive landscape
- Share insights with stakeholders

---

## Timeline & Milestones

### Phase 1: Foundation & Architecture (Weeks 1-10)

| Week | Milestone                          | Deliverables                                               |
| ---- | ---------------------------------- | ---------------------------------------------------------- |
| 1-2  | Monorepo initialized               | Working monorepo with Turborepo, shared packages extracted |
| 3-4  | Shopify Storefront API complete    | Product queries, cart management working                   |
| 5-6  | Shopify Admin API complete         | Secure backend APIs for cart/checkout                      |
| 7-8  | Multi-store config system complete | Theme system, feature flags, component overrides           |
| 9-10 | Database updates complete          | Multi-tenant schema, data migration                        |

**Phase 1 Completion Criteria**:

- [ ] All shared packages building successfully
- [ ] First test app running locally with shared packages
- [ ] Shopify integration fully functional in test mode
- [ ] CI/CD pipeline operational
- [ ] Documentation complete for Phase 1

### Phase 2: Store Launches & Iteration (Weeks 11-20)

| Week  | Milestone                    | Deliverables                                                   |
| ----- | ---------------------------- | -------------------------------------------------------------- |
| 11-13 | Store A launched             | First production store live on custom domain                   |
| 14-16 | Store B launched             | Second store validates architecture flexibility                |
| 16-17 | Pricing integration complete | Pricing working across all stores                              |
| 17-18 | Performance optimization     | Caching, bundle optimization, monitoring                       |
| 19-20 | SEO migration prep complete  | Redirects, content migration ready for custompictureframes.com |

**Phase 2 Completion Criteria**:

- [ ] Two stores live and accepting orders
- [ ] Shared configurator working identically across stores
- [ ] Performance metrics meet targets
- [ ] Store deployment process documented
- [ ] SEO migration plan approved and ready

### Phase 3: Ongoing Support (Week 21+)

**Ongoing Milestones**:

- Launch stores 3-10 at regular intervals (1-2 per month)
- Implement 2-3 new features per quarter
- Address bug reports within SLA (critical: 24hrs, high: 1 week, medium: 2 weeks)
- Conduct quarterly architecture reviews
- Maintain 99.9% uptime for all stores
- Keep documentation up to date continuously

---

## Risk Assessment & Mitigation

### Technical Risks

| Risk                          | Probability | Impact   | Mitigation Strategy                                                                 |
| ----------------------------- | ----------- | -------- | ----------------------------------------------------------------------------------- |
| Shopify API rate limits       | Medium      | High     | Implement aggressive caching, request queuing, backoff strategies                   |
| Monorepo build times increase | Medium      | Medium   | Leverage Turborepo caching, implement selective rebuilds, optimize build pipeline   |
| Package version conflicts     | Low         | Medium   | Use strict version pinning, automated dependency updates with Renovate              |
| Database migration data loss  | Low         | Critical | Comprehensive backups, test migrations in staging, implement rollback procedures    |
| Vercel cold start performance | Medium      | Medium   | Implement edge caching, optimize bundle sizes, use serverless warm-up strategies    |
| Cross-store data leakage      | Low         | Critical | Extensive testing of siteId filtering, automated data isolation tests, code reviews |

### Business Risks

| Risk                              | Probability | Impact   | Mitigation Strategy                                                                  |
| --------------------------------- | ----------- | -------- | ------------------------------------------------------------------------------------ |
| SEO traffic loss during migration | Medium      | Critical | Comprehensive redirect testing, phased rollout, continuous monitoring, rollback plan |
| Checkout failures on launch       | Low         | Critical | Extensive QA, beta testing period, fallback to direct Shopify checkout option        |
| Store-specific bugs not caught    | Medium      | Medium   | Feature flags for gradual rollout, store-specific testing checklist, monitoring      |
| Timeline delays                   | Medium      | Medium   | Built-in buffer time, parallel workstreams, prioritization framework                 |
| Scope creep                       | Medium      | Medium   | Clear phase boundaries, change request process, stakeholder alignment                |

### Mitigation Procedures

**Rollback Procedures**:

1. **Feature Rollback**: Disable feature flag (immediate, no deployment)
2. **Store Rollback**: Revert to previous Vercel deployment (1-click, 30 seconds)
3. **Infrastructure Rollback**: DNS change to old infrastructure (5-10 minutes)

**Communication Protocol**:

- Daily progress updates via project management tool
- Weekly sync meetings with stakeholders
- Immediate notification for critical issues
- Monthly reports on progress and metrics
- Quarterly planning sessions

---

## Success Criteria

### Phase 1 Success Metrics

- [ ] Monorepo with 5+ shared packages successfully building
- [ ] All existing features working in new architecture
- [ ] Shopify integration passing all test scenarios
- [ ] Multi-store configuration validated with 2+ test configurations
- [ ] Build times acceptable (< 2 minutes for incremental, < 10 minutes for full)
- [ ] Developer documentation complete and reviewed

### Phase 2 Success Metrics

- [ ] 2+ stores live and generating orders
- [ ] Zero shared configurator bugs between stores
- [ ] Page load time < 2 seconds (75th percentile)
- [ ] Zero cart or checkout failures (99.9% success rate)
- [ ] All redirects working with < 1% 404 rate
- [ ] Store deployment time < 1 day per store

### Phase 3 Success Metrics

- [ ] 10+ stores operating successfully
- [ ] Uptime > 99.9% across all stores
- [ ] Critical bugs resolved within 24 hours
- [ ] Feature requests implemented within 1-2 sprints
- [ ] Documentation kept current (updated within 1 week of changes)
- [ ] Developer onboarding time < 1 week

### Overall Project Success

**The project is successful when**:

1. All stores are generating revenue with zero blocking issues
2. New stores can be launched in < 1 day
3. Shared features propagate across all stores automatically
4. SEO rankings maintained or improved post-migration
5. System is fully documented and maintainable
6. Performance and reliability meet SLAs
7. Stakeholders are satisfied with progress and communication

---

## Glossary

### Technical Terms

| Term                           | Definition                                                                               |
| ------------------------------ | ---------------------------------------------------------------------------------------- |
| **Monorepo**                   | Single repository containing multiple related projects/packages with shared dependencies |
| **Headless**                   | Frontend and backend are decoupled and communicate via APIs                              |
| **Storefront API**             | Shopify's customer-facing API for products, cart, and checkout (browser-safe)            |
| **Admin API**                  | Shopify's privileged API for store management (server-only)                              |
| **Serverless Function**        | Code that runs on-demand without managing servers (e.g., Vercel Edge Functions)          |
| **Backend-for-Frontend (BFF)** | Server layer between frontend and external APIs for security and logic                   |
| **pnpm**                       | Fast, disk-efficient package manager                                                     |
| **Turborepo**                  | Build system for monorepos with caching and task orchestration                           |
| **HTTP-only Cookie**           | Cookie not accessible via JavaScript (secure for authentication)                         |
| **Line Item Attributes**       | Custom data attached to Shopify cart items (e.g., frame config)                          |

### Shopify Terms

| Term                 | Definition                                                      |
| -------------------- | --------------------------------------------------------------- |
| **Variant**          | Specific version of a product (e.g., "Black Wood Frame - 8x10") |
| **Handle**           | URL-friendly identifier (e.g., "black-wood-frame")              |
| **Checkout**         | Shopify-hosted page where customers complete purchase           |
| **Cart**             | Collection of items customer intends to purchase                |
| **Storefront Token** | API key for Storefront API access                               |
| **Admin Token**      | API key for Admin API access (highly privileged)                |

### Deployment Terms

| Term                     | Definition                                                              |
| ------------------------ | ----------------------------------------------------------------------- |
| **Production**           | Live environment serving real customers                                 |
| **Preview**              | Temporary environment for reviewing changes before production           |
| **Environment Variable** | Configuration value that differs per environment (API keys, URLs, etc.) |
| **Edge Function**        | Serverless function running close to users for low latency              |
| **DNS**                  | Domain Name System - translates domain names to IP addresses            |
| **SSL Certificate**      | Security certificate enabling HTTPS                                     |

### SEO Terms

| Term                 | Definition                                                            |
| -------------------- | --------------------------------------------------------------------- |
| **301 Redirect**     | Permanent redirect that transfers SEO value to new URL                |
| **Canonical URL**    | The "official" version of a page when multiple URLs show same content |
| **Structured Data**  | Markup (JSON-LD) that helps search engines understand page content    |
| **Crawl**            | When search engine bots visit and index website pages                 |
| **Backlink**         | Link from another website to your site (SEO value)                    |
| **Meta Description** | Summary text shown in search results                                  |

---

## Appendix A: Quick Reference Commands

### Development

```bash
# Start all apps in dev mode
pnpm dev

# Start only specific store
pnpm dev --filter=store-a

# Start shared packages in watch mode
pnpm dev --filter=@framecraft/ui
```

### Building

```bash
# Build all apps and packages
pnpm build

# Build only specific store
pnpm build --filter=store-a

# Build package and dependents
pnpm build --filter=...@framecraft/ui
```

### Testing

```bash
# Run all tests
pnpm test

# Test specific package
pnpm test --filter=@framecraft/core

# Run linting
pnpm lint

# Type checking
pnpm type-check
```

### Deployment

```bash
# Deploy to Vercel production
vercel --prod

# Deploy preview
vercel

# Check deployment status
vercel ls
```

---

## Appendix B: Store Configuration Template

```typescript
// Template for new store configuration
// Copy to apps/[store-name]/src/brand.config.ts

import type { BrandConfig } from "@framecraft/config";

export const brandConfig: BrandConfig = {
  // Required: Identity
  siteName: "Your Store Name",
  legalName: "Your Legal Entity LLC",
  siteUrl: "https://yourdomain.com",
  defaultTitle: "Your Store | Custom Picture Frames",
  defaultDescription: "Your store description for SEO (120-160 chars)",

  // Required: Contact
  contactEmail: "support@yourdomain.com",
  contactPhone: "1-888-XXX-XXXX",

  // Optional: Theme overrides
  theme: {
    colors: {
      primary: "hsl(210, 85%, 45%)", // Your brand color
      accent: "hsl(45, 90%, 50%)", // Accent color
    },
    fonts: {
      heading: "Your Heading Font, serif",
      body: "Your Body Font, sans-serif",
    },
  },

  // Optional: Feature flags
  features: {
    enableAR: true,
    enableAIRecommendations: true,
    enableJerseyFrames: true,
    enablePuzzleFrames: true,
    enableComicBookFrames: true,
    enableBrassNameplates: true,
    enablePrintAndFrame: true,
    enableGalleryWall: true,
  },

  // Optional: Navigation customization
  navigation: {
    // Override navigation items if needed
  },

  // Optional: Component overrides
  overrides: {
    // Header: () => import('./components/CustomHeader'),
  },

  // Required: Shopify
  shopify: {
    domain: "your-store.myshopify.com",
    storefrontToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!,
  },
};
```

---

## Appendix C: Resource Estimates

### Time Allocation by Phase

**Phase 1: Foundation & Architecture (320-400 hours)**

- Monorepo setup & infrastructure: 40-50 hours
- Package extraction: 80-100 hours
- Shopify Storefront API: 60-80 hours
- Shopify Admin API: 60-80 hours
- Multi-store config system: 40-50 hours
- Database updates: 40-50 hours

**Phase 2: Store Launches & Iteration (320-400 hours)**

- Store A setup & launch: 60-80 hours
- Store B setup & launch: 40-60 hours
- Pricing integration: 40-50 hours
- Performance optimization: 60-80 hours
- SEO migration prep: 80-100 hours
- Additional store rollouts: 40-60 hours

**Phase 3: Ongoing (Continuous)**

- Estimated 160 hours/month for ongoing work
- System stabilization & maintenance: ~40 hours/month
- Feature enhancements: ~60 hours/month
- Store expansion support: ~30 hours/month
- Documentation & knowledge transfer: ~30 hours/month

---

**End of Migration Plan v1.0**

This plan will be updated as we progress through each phase and learn from implementation.
