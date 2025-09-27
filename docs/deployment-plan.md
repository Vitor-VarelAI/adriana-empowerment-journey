# Deployment Plan: Fixed Slots System

## Overview

This document outlines the deployment plan for restructuring the booking system from Google Calendar integration to fixed time slots with Supabase backend.

## Current State

- Google OAuth integration with refresh token issues
- Calendar API dependencies causing reliability problems
- Complex authentication flow
- External API dependencies

## Target State

- Fixed time slots (Mon-Fri, 10:00-17:00)
- Simple Supabase backend
- No external calendar dependencies
- Streamlined booking flow

## Phase 1: Backend Preparation

### 1.1 Database Schema Update
```sql
-- Add unique constraint to prevent double bookings
ALTER TABLE bookings ADD CONSTRAINT bookings_date_time_unique UNIQUE (date, time);

-- Ensure proper RLS policies
ALTER POLICY "Public can read bookings" ON bookings
  USING (true)
  WITH CHECK (false);

ALTER POLICY "Public can insert bookings" ON bookings
  USING (true)
  WITH CHECK (true);
```

### 1.2 Create New API Routes
- `app/api/bookings/route.ts` - GET/POST handler for bookings
- Remove Google OAuth routes:
  - `app/api/auth/login/route.ts`
  - `app/api/auth/callback/route.ts`
  - `app/api/availability/route.ts`
  - `app/api/events/create/route.ts`

### 1.3 Update Environment Variables
Remove Google-related variables:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REFRESH_TOKEN`
- `GOOGLE_CALENDAR_ID`
- `GOOGLE_REDIRECT_URI`

Keep Supabase variables:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_FORMSPREE_ID`

## Phase 2: Frontend Updates

### 2.1 Update BookingTable Component
- Remove Google Calendar API calls
- Generate fixed time slots locally
- Call new `/api/bookings` endpoint
- Update error handling for new API responses

### 2.2 Update Context and State Management
- Remove OAuth-related state
- Simplify booking flow state
- Update error messages for new system

### 2.3 Update UI Components
- Remove "Syncing with Google Calendar" messages
- Update confirmation page copy
- Remove OAuth-related UI elements

## Phase 3: Testing

### 3.1 Unit Tests
- Test new booking API endpoints
- Test booking table component with fixed slots
- Test form validation

### 3.2 Integration Tests
- Test complete booking flow
- Test database constraints
- Test email notifications

### 3.3 Manual Testing
1. Load booking page
2. Select available date
3. Choose time slot
4. Fill booking form
5. Submit and verify:
   - Booking saved in database
   - Time slot marked as unavailable
   - Email notification sent (if configured)

## Phase 4: Deployment

### 4.1 Staging Deployment
1. Create feature branch
2. Apply database migrations
3. Deploy to staging environment
4. Test complete flow
5. Verify no data loss

### 4.2 Production Deployment
1. Merge to main branch
2. Apply production database migrations
3. Update Vercel environment variables
4. Deploy to production
5. Monitor for issues

### 4.3 Post-Deployment
1. Remove Google Cloud OAuth credentials
2. Clean up unused API routes
3. Monitor system performance
4. Gather user feedback

## Risk Assessment

### High Risk
- **Data loss during migration**: Mitigation: Backup existing bookings before migration
- **Booking system downtime**: Mitigation: Deploy during low-traffic periods

### Medium Risk
- **User confusion with new flow**: Mitigation: Clear communication about changes
- **Email notification issues**: Mitigation: Test Formspree integration thoroughly

### Low Risk
- **Minor UI inconsistencies**: Mitigation: Browser testing
- **Performance issues**: Mitigation: Monitor after deployment

## Rollback Plan

If issues arise during deployment:
1. Revert to previous commit
2. Restore database backup
3. Re-enable Google environment variables
4. Communicate with users about temporary issues

## Success Criteria

- ✅ Booking system works without Google Calendar
- ✅ Fixed time slots are correctly displayed
- ✅ Database constraints prevent double bookings
- ✅ Email notifications work as expected
- ✅ User experience remains smooth
- ✅ No existing bookings are lost

## Timeline

- **Phase 1**: 2-3 days
- **Phase 2**: 3-4 days
- **Phase 3**: 2-3 days
- **Phase 4**: 1-2 days
- **Total**: 8-12 days

## Dependencies

- Database access for schema updates
- Vercel deployment permissions
- Formspree configuration (if using email notifications)
- Stakeholder approval for timeline
