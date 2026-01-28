# Quick Start Checklist

Use this checklist to track your progress through the migration.

## Phase 1: Foundation (Weeks 1-4)

### Week 1: Understanding & Setup

- [ ] **Day 1-2: Review Current Codebase**
  - [ ] Read `FrameDesigner.tsx` and understand structure
  - [ ] Review `pricing.ts` calculation logic
  - [ ] Examine `data/` folder structure
  - [ ] Review `shopify.ts` to see what exists
  - [ ] Understand `brand.config.ts` structure
  - [ ] List all dependencies in `package.json`

- [ ] **Day 3-4: Set Up Monorepo**
  - [ ] Create `framecraft-monorepo` directory
  - [ ] Initialize npm workspaces
  - [ ] Install and configure Turborepo
  - [ ] Create directory structure (apps/, packages/, etc.)
  - [ ] Set up base TypeScript config
  - [ ] Configure ESLint and Prettier
  - [ ] Test workspace setup

- [ ] **Day 5: Shopify Setup**
  - [ ] Create "Custom Picture Frame" product in Shopify
  - [ ] Generate Storefront API access token
  - [ ] Generate Admin API access token
  - [ ] Test basic API calls (fetch products)
  - [ ] Document variant IDs

### Week 2: Package Extraction

- [ ] **Day 1-2: Create Data Package**
  - [ ] Create `packages/data` structure
  - [ ] Copy `frames.json`, `mats.json`, `glass.json`
  - [ ] Copy `pricing-config.json`
  - [ ] Create TypeScript exports
  - [ ] Test package import

- [ ] **Day 3: Create Types Package**
  - [ ] Create `packages/types` structure
  - [ ] Extract types from `client/src/types/`
  - [ ] Create barrel exports
  - [ ] Test type imports

- [ ] **Day 4-5: Create Core Package**
  - [ ] Create `packages/core` structure
  - [ ] Move `pricing.ts` service
  - [ ] Move `products.ts` service
  - [ ] Move `validation.ts` service
  - [ ] Move dimension utilities
  - [ ] Set up dependencies
  - [ ] Test package functionality

### Week 3: UI & Shopify Integration

- [ ] **Day 1-3: Create UI Package**
  - [ ] Create `packages/ui` structure
  - [ ] Move `FrameDesigner.tsx`
  - [ ] Move specialty designers
  - [ ] Move Shadcn/ui components
  - [ ] Set up dependencies
  - [ ] Test component imports

- [ ] **Day 4-5: Build Shopify Storefront API**
  - [ ] Create `packages/shopify` structure
  - [ ] Implement Storefront API client
  - [ ] Create GraphQL fragments
  - [ ] Build product query functions
  - [ ] Implement cart mutations
  - [ ] Test API calls

### Week 4: Config System & First App

- [ ] **Day 1-2: Create Config Package**
  - [ ] Design brand config schema
  - [ ] Create theme merge utilities
  - [ ] Build StoreProvider component
  - [ ] Create useStoreConfig hook
  - [ ] Document configuration options

- [ ] **Day 3-5: Create First Store App**
  - [ ] Create Next.js app in `apps/customframesizes`
  - [ ] Install shared packages
  - [ ] Create `brand.config.ts`
  - [ ] Set up StoreProvider
  - [ ] Import FrameDesigner
  - [ ] Test locally
  - [ ] Fix any import issues

## Phase 2: Shopify Integration (Weeks 5-6)

### Week 5: Admin API & Server Functions

- [ ] **Day 1-2: Build Admin API Client**
  - [ ] Implement Admin API client in `packages/shopify`
  - [ ] Create secure token handling
  - [ ] Test Admin API calls

- [ ] **Day 3-5: Create API Endpoints**
  - [ ] Create `apps/api` structure
  - [ ] Implement `POST /api/cart` endpoint
  - [ ] Implement `PATCH /api/cart/lines` endpoint
  - [ ] Implement `POST /api/checkout` endpoint
  - [ ] Add request validation
  - [ ] Add error handling
  - [ ] Test endpoints locally

### Week 6: Integration Testing

- [ ] **Day 1-3: Connect Frontend to Backend**
  - [ ] Update FrameDesigner to use new Shopify client
  - [ ] Connect cart creation to API
  - [ ] Test full checkout flow
  - [ ] Verify custom attributes in Shopify

- [ ] **Day 4-5: Fix Issues**
  - [ ] Debug any integration problems
  - [ ] Optimize API calls
  - [ ] Add error handling
  - [ ] Test edge cases

## Phase 3: Deployment (Week 7-8)

### Week 7: Vercel Setup

- [ ] **Day 1-2: Configure Vercel Projects**
  - [ ] Create Vercel project for first store
  - [ ] Configure build settings
  - [ ] Set environment variables
  - [ ] Create Vercel project for API
  - [ ] Configure API environment variables

- [ ] **Day 3-5: Deploy & Test**
  - [ ] Deploy first store to Vercel
  - [ ] Deploy API to Vercel
  - [ ] Test production deployment
  - [ ] Set up custom domain
  - [ ] Test checkout in production
  - [ ] Verify orders in Shopify admin

### Week 8: Polish & Documentation

- [ ] **Day 1-3: Fix Production Issues**
  - [ ] Address any production bugs
  - [ ] Optimize performance
  - [ ] Add monitoring/logging
  - [ ] Test all features in production

- [ ] **Day 4-5: Documentation**
  - [ ] Document deployment process
  - [ ] Create store setup guide
  - [ ] Document configuration options
  - [ ] Create troubleshooting guide

## Phase 4: Scale (Weeks 9+)

- [ ] **Create Second Store**
  - [ ] Create `apps/store-b` app
  - [ ] Configure different branding
  - [ ] Set up separate Shopify store
  - [ ] Deploy to Vercel
  - [ ] Test independently

- [ ] **Refine Process**
  - [ ] Document store creation process
  - [ ] Create store template
  - [ ] Automate repetitive tasks
  - [ ] Create deployment checklist

- [ ] **Launch Additional Stores**
  - [ ] Launch stores 3-10
  - [ ] Monitor performance
  - [ ] Gather feedback
  - [ ] Iterate and improve

---

## Daily Standup Questions

Ask yourself each day:

1. **What did I complete yesterday?**
2. **What am I working on today?**
3. **What's blocking me?**
4. **What did I learn?**

---

## Key Milestones

- [ ] **Milestone 1**: Monorepo structure created and working
- [ ] **Milestone 2**: All packages extracted and tested
- [ ] **Milestone 3**: Shopify integration complete
- [ ] **Milestone 4**: First store deployed to production
- [ ] **Milestone 5**: Second store launched
- [ ] **Milestone 6**: 5+ stores operational
- [ ] **Milestone 7**: 10+ stores operational

---

## Emergency Contacts

- **Shopify Support**: https://help.shopify.com
- **Vercel Support**: https://vercel.com/support
- **Turborepo Docs**: https://turbo.build/repo/docs

---

## Notes Section

Use this space to track issues, learnings, and decisions:

### Week 1 Notes:

-

### Week 2 Notes:

-

### Week 3 Notes:

-

### Week 4 Notes:

- ***

  **Remember**: This is a marathon, not a sprint. Take breaks, test incrementally, and celebrate small wins!
