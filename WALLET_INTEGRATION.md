# Apixis Wallet Integration (Placeholder)

**Status**: Waiting on docs/INTEGRATION.md from @apixiswallet

## Required Flow

1. **Quote**: POST /api/v1/quotes with product SKU and quantity
2. **Reserve**: Create reservation to hold Ixis temporarily
3. **Capture/Release**: Capture on success, release on cancel
4. **Entitlement**: Verify user has active entitlement

## Deduxis Product

- **Receipt Intelligence seat**: 15,000 Ixis/month
  - Includes 200 receipts/month
  - Extra receipts metered (TBD pricing)

## UI State

Until integration is live:
- Show "Redeem · 15,000 Ixis" button (disabled or "Connecting to Wallet...")
- Never fake a successful redemption
- Clear error if Wallet API unavailable

## Implementation

Once @apixiswallet publishes docs/INTEGRATION.md:
1. Add Wallet API client to lib/wallet.ts
2. Implement quote → reserve → capture flow
3. Check entitlements on dashboard load
4. Meter receipt uploads beyond included 200/month
