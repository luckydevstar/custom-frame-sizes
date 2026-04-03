## CustomFrame Project - Shopify Checkout Branding Implementation Plan

**Created**: March 31, 2026  
**Status**: Planning Phase  
**Duration**: 3-4 weeks (estimated 40-50 hours)  
**Feature Owner**: John (Architecture)  
**Priority**: High (post-cart-transform)

---

## 🎯 OBJECTIVE

Enable conditional checkout branding for multi-store support on Shopify Plus. Each storefront (CustomFrameSizes, CountryArtHouse, etc.) will display its own logo and branding throughout the Shopify checkout flow, providing a seamless brand experience despite using a single merchant account.

### Business Value
- **Brand Consistency**: Customers see their store's branding from cart → checkout → confirmation
- **Trust & Recognition**: Reduces cart abandonment by maintaining familiar branding
- **Multi-Tenant Ready**: Supports future stores without additional merchant accounts
- **Customer Psychology**: Logo visibility increases perceived legitimacy

---

## 📋 TECHNICAL APPROACH

### Architecture Overview

The solution uses three Shopify Plus features working together:

```
┌─────────────────────────────────────────────────────────────────┐
│                     Customer Journey                             │
│  Store Page → Cart → Checkout → Confirmation                     │
└─────────────────────────────────────────────────────────────────┘
         ↓              ↓              ↓
   [Set _brand    [Cart persists]  [Extension reads]
    attribute]    [_brand stored]    [_brand value]
         ↓              ↓              ↓
┌─────────────────────────────────────────────────────────────────┐
│              Shopify Checkout Infrastructure                     │
│                                                                  │
│  1. Branding API (checkoutBrandingUpsert mutation)              │
│     ├─ Hides default Shopify logo from header                   │
│     └─ Creates space for custom branding                        │
│                                                                  │
│  2. Checkout UI Extension (purchase.checkout.header.render-after)
│     ├─ Reads _brand cart attribute via useAttributeValues       │
│     ├─ Renders conditional store logo using Image component     │
│     └─ Falls back to default if attribute missing               │
│                                                                  │
│  3. Storefront API (Headless Next.js)                           │
│     ├─ Sets cart attribute _brand when creating cart            │
│     └─ Ensures checkout extension has store context             │
└─────────────────────────────────────────────────────────────────┘
```

### Key Components

#### 1. **Checkout Branding API**
- Suppress built-in Shopify logo
- Set base brand colors/fonts (optional)
- API: `checkoutBrandingUpsert` GraphQL mutation
- Target: Checkout header area

#### 2. **Checkout UI Extension**
- Small React app (targeting checkout header)
- Reads private cart attribute `_brand` using `useAttributeValues` hook
- Renders store-specific logo conditionally
- Falls back to neutral branding if attribute unavailable
- Bundle size limit: 64KB

#### 3. **Storefront Integration**
- Next.js frontend sets `_brand` attribute when creating cart
- Attribute values: `"CFS"` (CustomFrameSizes), `"CAH"` (CountryArtHouse), etc.
- Private attribute (`_` prefix) hidden from customer, visible in admin
- Passed via Shopify Storefront API cart mutation

---

## 📊 EXECUTION PLAN

### PHASE 1: DISCOVERY & SETUP (Week 1 - 8 hours)

#### Task P10.1.1: Evaluate Shopify Plus Features & Constraints

**Effort**: 2-3 hours  
**Owner**: Architect  
**Description**:
- Verify Shopify Plus account has:
  - Checkout Branding API access
  - Checkout UI Extensions capability
  - Appropriate scopes/permissions configured
- Review Shopify documentation:
  - Checkout Branding API (`checkoutBrandingUpsert`)
  - Checkout UI Extensions overview
  - `useAttributeValues` hook for attribute access
  - Image component (approved checkout component)
- Test Shopify GraphQL Admin API access for branding mutations

**Acceptance Criteria**:
- Shopify Plus features confirmed available
- API scopes documented
- Admin API credentials tested
- No permission blockers identified

**Constraints to Document**:
- SVG logos NOT supported (must use PNG)
- Extension bundle ≤ 64KB
- Apple Pay/Google Pay may skip custom header
- Merchant base branding inherited from Shopify Admin settings

#### Task P10.1.2: Gather Store Logo Assets & Branding Guidelines

**Effort**: 2-3 hours  
**Owner**: Design/Product  
**Description**:
- Collect logos for each store:
  - CustomFrameSizes (primary)
  - CountryArtHouse
  - Future stores (placeholder)
- Ensure formats:
  - PNG (not SVG)
  - Transparent background
  - Multiple sizes (recommended: 200px, 300px widths)
- Document brand color palette per store
- Define fallback/neutral branding for unknown stores

**Deliverable**:
- Logo asset repository created
- Brand guidelines document (colors, sizing, placement)
- CDN URLs for production logos

**Acceptance Criteria**:
- All logos available in PNG format
- Color specifications documented
- Sizing recommendations defined
- CDN paths determined

#### Task P10.1.3: Design Checkout Extension Architecture

**Effort**: 3-4 hours  
**Owner**: Architect  
**Description**:
- Design extension component structure:
  ```
  CheckoutHeader/
  ├── ConditionalLogo.tsx (main component)
  ├── LogoMap.ts (store → logo URL mapping)
  ├── Fallback.tsx (default branding)
  └── index.ts (extension entry)
  ```
- Plan state management for `_brand` attribute
- Design error handling:
  - Missing attribute → fallback logo
  - Invalid store → neutral branding
  - Network failures → cached branding
- Plan testing approach (local extension, Shopify sandbox)
- Define extension metadata (handle, capabilities, bundle config)

**Deliverable**:
- Architecture ADR document
- Component design diagrams
- Error handling flowchart
- Build/deployment strategy

**Acceptance Criteria**:
- Architecture reviewed and approved
- Error cases documented
- Build configuration planned
- Testing approach defined

---

### PHASE 2: IMPLEMENTATION - CHECKOUT UI EXTENSION (Week 2 - 20 hours)

#### Task P10.2.1: Set Up Checkout UI Extension Project

**Effort**: 3-4 hours  
**Owner**: Developer  
**Description**:
- Initialize Shopify checkout UI extension
- Generate scaffolding using:
  ```bash
  npm create @shopify/checkout-ui-extension@latest
  ```
- Configure TypeScript, React, Tailwind
- Set up build pipeline to stay under 64KB
- Add environment variables for:
  - Logo CDN URLs
  - Store brand colors
  - Fallback branding config
- Configure `shopify.app.toml` with:
  - Extension handle: `checkout-branding-extension`
  - Target: `purchase.checkout.header.render-after`
  - Capabilities: header rendering, attribute access

**Deliverable**:
- Project scaffolding created
- Build configuration validated
- Environment setup complete

**Acceptance Criteria**:
- Extension project builds successfully
- Bundle size < 64KB
- Local dev server runs
- TypeScript compilation clean

#### Task P10.2.2: Implement ConditionalLogo Component

**Effort**: 5-6 hours  
**Owner**: Developer  
**Description**:
- Create main component that:
  - Uses `useAttributeValues` to read `_brand` from cart
  - Maps store brand to logo asset:
    ```typescript
    const logoMap: Record<string, string> = {
      "CFS": "https://cdn.example.com/logos/customframesizes.png",
      "CAH": "https://cdn.example.com/logos/countryarthouse.png",
    };
    ```
  - Renders using Shopify `Image` component (sandbox-safe)
  - Implements loading state during attribute fetch
  - Handles error states gracefully
- Add accessibility:
  - Alt text per store
  - Semantic HTML
  - Color contrast compliance
- Implement responsive sizing:
  - Mobile: 120px width
  - Desktop: 180px width

**Code Structure**:
```typescript
// CheckoutHeader.tsx
import { View, Image, useAttributeValues } from '@shopify/checkout-ui-extensions-react';

const ConditionalLogo = () => {
  const { _brand } = useAttributeValues(['_brand']);
  
  const logoUrl = logoMap[_brand || 'default'];
  const storeName = storeNameMap[_brand || 'default'];
  
  return (
    <View>
      <Image
        source={logoUrl}
        alt={`${storeName} logo`}
        width={responsive ? 180 : 120}
      />
    </View>
  );
};
```

**Acceptance Criteria**:
- Component renders correctly in sandbox
- `_brand` attribute read successfully
- All store logos display correctly
- Error states handled gracefully
- Responsive design working
- Accessibility requirements met
- Bundle stays under 64KB

#### Task P10.2.3: Implement Error Handling & Fallback Logic

**Effort**: 3-4 hours  
**Owner**: Developer  
**Description**:
- Create fallback component for:
  - Missing `_brand` attribute
  - Unknown store brand
  - Failed image load
  - Network errors
- Implement error boundary wrapper
- Add logging/monitoring for errors:
  - Attribute read failures
  - Logo load failures
  - Unexpected states
- Create error recovery:
  - Retry failed image loads
  - Cache logos locally (browser cache)
  - Graceful degradation

**Deliverable**:
- Fallback component
- Error boundary component
- Error logging configured
- Recovery mechanisms tested

**Acceptance Criteria**:
- All error paths tested
- No console errors
- Fallback UI acceptable
- Error logging working
- Recovery mechanisms functional

#### Task P10.2.4: Test Extension Locally & in Sandbox

**Effort**: 4-5 hours  
**Owner**: Developer/QA  
**Description**:
- Local testing:
  - Run extension locally with `npm run dev`
  - Test with various `_brand` values
  - Verify attribute reading works
  - Test error conditions (network, missing attributes)
- Sandbox testing:
  - Deploy to Shopify test environment
  - Create test carts with different `_brand` values
  - Verify logos display in sandbox checkout
  - Test on mobile/desktop viewports
  - Verify no sandbox violations
- Test matrix:
  - ✓ _brand: "CFS" → shows CustomFrameSizes logo
  - ✓ _brand: "CAH" → shows CountryArtHouse logo
  - ✓ _brand: undefined → shows fallback logo
  - ✓ _brand: "UNKNOWN" → shows fallback logo
  - ✓ Image load failure → shows error state
  - ✓ Mobile responsive → logos size correctly
  - ✓ Bundle size → < 64KB

**Deliverable**:
- Test results documented
- Extension verified working

**Acceptance Criteria**:
- All test cases passing
- No console errors
- Bundle size verified < 64KB
- Mobile/desktop verified
- Ready for deployment

---

### PHASE 3: IMPLEMENTATION - SHOPIFY BRANDING API (Week 2 - 12 hours)

#### Task P10.3.1: Configure Checkout Branding API

**Effort**: 3-4 hours  
**Owner**: Architect  
**Description**:
- Call `checkoutBrandingUpsert` mutation to:
  - Hide default Shopify logo from checkout header
  - Set neutral base branding (fallback design system)
  - Configure header appearance
- Mutation parameters:
  ```graphql
  mutation checkoutBrandingUpsert($input: CheckoutBrandingInput!) {
    checkoutBrandingUpsert(input: $input) {
      checkoutBranding {
        customizations {
          header {
            backgroundColor
            logoUrl (SET TO NULL to hide default)
          }
        }
      }
    }
  }
  ```
- Document API response and stored configuration
- Verify changes visible in Shopify Admin checkout preview

**Deliverable**:
- Branding API mutation executed
- Configuration stored and verified
- Screenshots showing logo suppression

**Acceptance Criteria**:
- Default Shopify logo hidden
- Checkout header space ready for extension
- API mutation confirmed in admin
- Checkout preview updated

#### Task P10.3.2: Create Branding Management Script

**Effort**: 4-5 hours  
**Owner**: Developer  
**Description**:
- Create utility script for branding configuration:
  ```bash
  npm run branding:configure [environment]
  ```
- Script functionality:
  - Connects to Shopify Admin API
  - Runs `checkoutBrandingUpsert` mutation
  - Configures base colors/fonts (optional)
  - Validates branding applied successfully
  - Creates rollback script if needed
- Environment support:
  - Development (sandbox)
  - Staging
  - Production
- Error handling:
  - API auth failures
  - Mutation validation errors
  - Rollback on failure
- Documentation:
  - How to run branding configuration
  - How to rollback
  - What changed

**Deliverable**:
- Branding configuration script
- Runbook for configuration
- Rollback procedure documented

**Acceptance Criteria**:
- Script runs successfully
- Branding applied correctly
- Rollback process tested
- Documentation complete

#### Task P10.3.3: Document Branding API Setup & Deployment

**Effort**: 2-3 hours  
**Owner**: Architect  
**Description**:
- Create documentation:
  - Overview of Checkout Branding API
  - Configuration steps
  - Troubleshooting guide
  - Screenshots of before/after
- Document constraints:
  - SVG not supported
  - Apple Pay/Google Pay behavior
  - Merchant base settings inheritance
- Create decision log:
  - Why this approach chosen
  - Alternatives considered
  - Future considerations

**Deliverable**:
- Branding API documentation
- Configuration runbook
- Troubleshooting guide

**Acceptance Criteria**:
- Documentation clear and complete
- Steps reproducible
- Constraints documented
- Screenshots included

---

### PHASE 4: IMPLEMENTATION - STOREFRONT INTEGRATION (Week 3 - 15 hours)

#### Task P10.4.1: Modify Cart Creation to Set _brand Attribute

**Effort**: 4-5 hours  
**Owner**: Developer  
**Description**:
- Modify Storefront API cart creation in `framecraft-api`:
  - Detect storefront context (header, subdomain, or config)
  - Map to brand identifier (`"CFS"`, `"CAH"`, etc.)
  - Set `_brand` attribute when creating cart
- Implementation in `/api/cart` endpoint:
  ```typescript
  const cartAttributes = [
    { key: "_brand", value: getBrandFromContext(request) },
    { key: "config_json", value: configJson },
    { key: "price_cents", value: String(priceCents) },
  ];
  ```
- Brand mapping strategy:
  - Check `X-Store` header (if available)
  - Fall back to domain detection (customframesizes.com → "CFS")
  - Default to "CFS" if unknown
- Add validation:
  - Brand value must be known
  - Default handling for unknown brands

**Deliverable**:
- Cart API modified
- Brand detection implemented
- Validation added

**Acceptance Criteria**:
- Cart API includes _brand attribute
- Brand correctly identified from context
- Attribute passed to Shopify
- Tests passing

#### Task P10.4.2: Update Frontend to Support Multi-Brand Checkouts

**Effort**: 4-5 hours  
**Owner**: Developer  
**Description**:
- Update Next.js storefront integration:
  - Ensure brand context available to API calls
  - Pass brand info in headers/context as needed
  - Verify checkout URL shows correct branding
- Modify `CartPageClient.tsx`:
  - Verify `handleCheckout` receives correct brand context
  - Add brand header when calling API:
    ```typescript
    const response = await fetch('/api/cart/fresh-checkout', {
      headers: {
        'X-Store': getCurrentStore(),
      },
    });
    ```
- Update checkout navigation:
  - Pass brand context to checkout URL
  - Verify Shopify cart persists brand attribute
- Add brand awareness to cart operations:
  - Display correct store name in UI
  - Show store-specific messaging
  - Brand-aware error messages

**Deliverable**:
- Frontend integration complete
- Brand context passed through checkout flow
- Tests updated

**Acceptance Criteria**:
- Checkout includes correct brand
- Brand persists through cart creation
- Multiple stores can checkout independently
- No cross-brand contamination

#### Task P10.4.3: Implement Brand Store Detection Logic

**Effort**: 3-4 hours  
**Owner**: Developer  
**Description**:
- Create utility function for brand detection:
  ```typescript
  // lib/brand-detection.ts
  export function detectBrand(context: Context): Brand {
    // Priority order:
    // 1. Explicit X-Store header
    // 2. Domain detection
    // 3. Default fallback
    
    const header = context.headers.get('X-Store');
    if (header && isValidBrand(header)) return header;
    
    const domain = getDomainFromRequest(context);
    const detected = domainToBrandMap[domain];
    if (detected) return detected;
    
    return 'CFS'; // default
  }
  ```
- Create mapping config:
  ```typescript
  const domainToBrandMap: Record<string, Brand> = {
    'customframesizes.com': 'CFS',
    'countryarthouse.com': 'CAH',
    'localhost:3000': 'CFS',
  };
  ```
- Add brand type definition:
  ```typescript
  type Brand = 'CFS' | 'CAH' | 'DEFAULT';
  ```
- Add tests for detection logic
- Document how to add new brands

**Deliverable**:
- Brand detection utility
- Brand mapping config
- Type definitions
- Tests

**Acceptance Criteria**:
- Brand detection logic tested
- All known domains handled
- Fallback works
- Tests passing
- Easy to add new brands

#### Task P10.4.4: End-to-End Testing (Multi-Store Checkout)

**Effort**: 4-5 hours  
**Owner**: QA/Developer  
**Description**:
- Test matrix for multi-store checkout:
  - ✓ CustomFrameSizes storefront → checkout shows CFS branding
  - ✓ CountryArtHouse storefront → checkout shows CAH branding
  - ✓ Add item on CFS → checkout shows CFS logo
  - ✓ Add item on CAH → checkout shows CAH logo
  - ✓ Switch between stores → correct branding each time
  - ✓ Cart persistence → brand maintained after page reload
  - ✓ Multiple items from different stores (if supported) → correct brand
  - ✓ Mobile checkout → branding responsive and correct
  - ✓ Tablet checkout → branding responsive and correct
  - ✓ Browser back/forward → branding remains consistent
  - ✓ Abandoned cart (email link) → correct branding when resumed
- Test on staging environment
- Test with real Shopify sandbox
- Verify checkout completion end-to-end

**Test Scenarios**:
1. Customer journey on CustomFrameSizes
   - Browse → Configure frame → Add to cart
   - Verify checkoutUrl includes CFS branding
   - Complete checkout → order shows in admin

2. Customer journey on CountryArtHouse
   - Browse → Configure item → Add to cart
   - Verify checkoutUrl includes CAH branding
   - Complete checkout → order shows in admin

3. Brand consistency checks
   - Logo visible throughout checkout
   - No logo flickering
   - Fallback works if extension unavailable
   - Apple Pay/Google Pay behavior verified

**Deliverable**:
- Test results documented
- Screenshots of checkout with branding
- Video recording of end-to-end flow
- Issues/edge cases identified

**Acceptance Criteria**:
- All test cases passing
- No visual glitches
- Branding persists through checkout
- Mobile responsive
- Ready for production

---

### PHASE 5: DEPLOYMENT & MONITORING (Week 4 - 5 hours)

#### Task P10.5.1: Deploy Checkout UI Extension to Production

**Effort**: 2-3 hours  
**Owner**: Architect/DevOps  
**Description**:
- Deploy extension using:
  ```bash
  npm run deploy
  ```
- Verify deployment:
  - Extension visible in Shopify Admin
  - Status shows "Installed" or "Active"
  - No deployment errors
- Create rollback plan:
  - Disable extension command
  - Restore default checkout branding
  - Verify rollback works
- Update deployment documentation:
  - Extension deployment process
  - Rollback procedure
  - Monitoring approach

**Deliverable**:
- Extension deployed to production
- Rollback procedure tested
- Deployment documentation updated

**Acceptance Criteria**:
- Extension active in production
- Staging checkout shows branding
- Rollback tested
- No deployment errors

#### Task P10.5.2: Set Up Monitoring & Alerting

**Effort**: 2-3 hours  
**Owner**: DevOps  
**Description**:
- Set up monitoring for:
  - Extension errors (failed logo loads, etc.)
  - API failures (_brand attribute missing)
  - Checkout branding anomalies
  - Bundle size tracking
- Configure alerts for:
  - Extension deployment failures
  - Increased error rates (> 1% errors)
  - Bundle size exceeding 64KB
  - API failures
- Create monitoring dashboard:
  - Extension health status
  - Error rate trends
  - Deployment history
  - Rollback capability
- Document monitoring approach:
  - How to check extension health
  - How to debug issues
  - Escalation procedures

**Deliverable**:
- Monitoring configured
- Alerts set up
- Dashboard created
- Monitoring documentation

**Acceptance Criteria**:
- Monitoring active
- Alerts configured
- Dashboard accessible
- Documentation complete

---

## 📋 PHASED DELIVERY & ROLLOUT

### Stage 1: Sandbox/Staging (Week 2-3)
- Extension tested in Shopify sandbox
- Branding API configured in staging
- Full end-to-end testing
- Customer acceptance testing
- No production impact

### Stage 2: Soft Launch (Week 4)
- Deploy extension to production
- Monitor for 48 hours
- Collect analytics on logo rendering
- Verify no checkout failures
- Team on standby for rollback

### Stage 3: Full Launch
- If soft launch successful → full rollout
- Update checkout links to include brand
- Monitor metrics
- Gather customer feedback

### Rollback Plan (If Needed)
1. Disable extension from Shopify Admin
2. Restore default Shopify logo via Branding API
3. Verify checkout shows default state
4. Post-incident review

---

## 🧪 TESTING STRATEGY

### Unit Tests
- Brand detection logic
- Logo mapping function
- Error handling
- Attribute parsing

### Integration Tests
- Cart API sets _brand correctly
- Checkout includes brand attribute
- Extension reads attribute correctly
- Fallback works when attribute missing

### E2E Tests
- Full customer journey per store
- Checkout completion
- Order confirmation shows correct branding
- Mobile/tablet/desktop

### Performance Tests
- Extension bundle size < 64KB
- Logo load time < 2 seconds
- No checkout slowdown
- Memory usage acceptable

### Browser Compatibility
- Chrome/Chromium (desktop)
- Safari (desktop & mobile)
- Firefox (desktop)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🎯 SUCCESS CRITERIA

### Functional
- ✅ Extension deployed and active
- ✅ _brand attribute set on cart creation
- ✅ Checkout displays correct store logo
- ✅ Fallback works when attribute missing
- ✅ Bundle size < 64KB
- ✅ No checkout errors introduced
- ✅ All stores test cases passing

### Performance
- ✅ No checkout slowdown (< 100ms added latency)
- ✅ Logo load time < 2 seconds
- ✅ No memory leaks
- ✅ Mobile performance acceptable

### User Experience
- ✅ Logo visible throughout checkout
- ✅ No flickering or layout shifts
- ✅ Brand consistent from store → checkout
- ✅ Responsive across devices
- ✅ Accessible (WCAG 2.1 AA)

### Operational
- ✅ Monitoring configured
- ✅ Alerts functional
- ✅ Rollback tested and documented
- ✅ Team trained on deployment/rollback
- ✅ Documentation complete

---

## 📊 DEPENDENCIES & BLOCKERS

### External Dependencies
- Shopify Plus account with required features (verified available)
- Logo assets in PNG format (to be collected)
- Admin API access with appropriate scopes (to verify)

### Internal Dependencies
- Brand/design team input (logo collection, branding guidelines)
- Shopify admin access for deployment
- QA resources for testing
- DevOps resources for monitoring setup

### Known Constraints
- SVG logos not supported (PNG only) ✓ Documented
- Bundle size limit 64KB ✓ Monitored
- Apple Pay/Google Pay may skip header ✓ Acceptable
- Merchant base branding inherited ✓ Planned for

### Potential Blockers
- Missing Shopify Plus features → Request from Shopify Support
- API permission issues → Work with Shopify Support
- Extension bundle exceeds 64KB → Code refactoring
- Logo quality issues → Work with design team

---

## 📅 TIMELINE SUMMARY

| Week | Phase | Tasks | Deliverables |
|------|-------|-------|--------------|
| 1 | Discovery | Evaluate features, gather assets, design architecture | Architecture doc, brand assets, API access verified |
| 2 | Implementation | Build extension, set up branding API | Extension built & tested locally, branding config done |
| 3 | Integration | Update storefront, implement brand detection | Cart API updated, brand detection working, E2E tested |
| 4 | Deployment | Deploy to production, monitor | Extension live, monitoring configured, documentation complete |

---

## 👥 TEAM ASSIGNMENTS

| Role | Person | Tasks | Hours |
|------|--------|-------|-------|
| Architect | John | Feature design, API config, deployment oversight | 18-20 |
| Developer | Team | Extension building, integration, testing | 25-30 |
| DevOps | Team | Monitoring, deployment automation | 5-8 |
| QA | Team | Testing matrix, edge cases, performance | 8-10 |
| Design | Team | Logo preparation, brand guidelines | 3-5 |
| **Total** | | | **40-50 hours** |

---

## 🚀 IMPLEMENTATION READINESS CHECKLIST

- [ ] Shopify Plus features verified available
- [ ] Admin API credentials tested
- [ ] Logo assets collected (PNG format)
- [ ] Brand guidelines documented
- [ ] Architecture design approved
- [ ] Development environment set up
- [ ] Testing environment prepared
- [ ] Monitoring tools selected
- [ ] Deployment procedure documented
- [ ] Rollback plan tested
- [ ] Team trained on approach
- [ ] Stakeholders aligned

---

## 📞 ESCALATION & SUPPORT

### Technical Questions
- Shopify Documentation: https://shopify.dev/docs/api/admin-rest
- Checkout UI Extensions: https://shopify.dev/docs/api/checkout-ui-extensions
- Community Slack: #shopify-developers

### Issues During Deployment
1. Check Shopify Status page
2. Review extension logs in Admin
3. Consult Shopify Support (Premium)
4. Execute rollback if necessary
5. Post-incident review

---

**Plan Ready for Ticket Creation**  
**Next Step**: Create individual tickets from tasks P10.1.1 through P10.5.2
