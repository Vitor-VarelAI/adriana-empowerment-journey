# Vercel Deployment Plan for Adriana Empowerment Journey

## Project Overview
This document outlines the deployment strategy for the Adriana Empowerment Journey project, which consists of:
- **Frontend**: React/TypeScript application with Vite, Tailwind CSS, and shadcn/ui
- **Backend**: Node.js/Express server for Google Calendar API integration
- **Target Platform**: Vercel (serverless functions + static hosting)

## Deployment Strategy: Vercel Full Stack

### Why Vercel?
- **Single Platform**: Both frontend and backend on Vercel
- **Free Tier**: Generous free tier for both functions and frontend
- **No Server Management**: Fully managed by Vercel
- **Automatic SSL**: Included with Vercel
- **Automatic Scaling**: Handles traffic spikes from campaigns
- **Simple Deployment**: Git-based deployment

## Current Architecture Analysis

### Frontend (React/Vite App)
- **Tech Stack**: React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Build Tool**: Vite
- **Routing**: React Router
- **Forms**: React Hook Form + Zod validation
- **Current Config**: Already has `vercel.json` for SPA routing

### Backend (Node.js/Express Server)
- **Location**: `gcal-server/server.js`
- **Functionality**: 
  - Google Calendar API integration
  - OAuth2 authentication flow
  - Event creation and availability checking
  - CORS configuration
  - Security with Helmet

### Current Deployment Configuration
- **vercel.json**: Basic SPA routing configuration
- **Environment**: Development setup with local backend

## Required Changes for Vercel Deployment

### Phase 1: Backend Conversion to Serverless Functions

#### Current Backend Structure
```
gcal-server/
├── server.js (Express server with multiple endpoints)
├── package.json
├── .env.example
└── README.md
```

#### Target Serverless Structure
```
api/
├── auth/
│   ├── login.js (OAuth login function)
│   └── callback.js (OAuth callback function)
├── events/
│   └── create.js (Event creation function)
├── availability.js (Availability check function)
└── health.js (Health check function)
```

#### Required Backend Changes

1. **Convert Express Routes to Serverless Functions**
   - Split `server.js` into individual function files
   - Each endpoint becomes a separate serverless function
   - Remove Express-specific middleware (handled by Vercel)

2. **Update Authentication and Token Management**
   - Modify token storage for serverless environment
   - Update OAuth2 client configuration
   - Handle environment variables properly

3. **CORS Configuration**
   - Update CORS for Vercel environment
   - Handle preflight requests automatically

### Phase 2: Frontend Updates

#### Required Frontend Changes

1. **API Endpoint Updates**
   - Change from `http://localhost:3000` to `/api` paths
   - Update all API calls in React components
   - Configure environment variables for different environments

2. **Environment Variables**
   - Set up production environment variables
   - Configure API base URL dynamically

3. **Build Configuration**
   - Update `vercel.json` for serverless functions
   - Configure build settings if needed

### Phase 3: Environment Variables Setup

#### Required Environment Variables
```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_OAUTH_REDIRECT_URI=https://your-domain.vercel.app/api/auth/callback

# Application Configuration
ADMIN_EMAIL=your_admin_email@example.com
CLIENT_ORIGIN=https://your-domain.vercel.app

# Development (Local)
# CLIENT_ORIGIN=http://localhost:5173
```

#### Vercel Environment Variables Setup
1. **Production Environment**: Set via Vercel dashboard
2. **Development Environment**: Set in `.env.local`
3. **Preview Deployments**: Inherit from production

## Implementation Steps

### Step 1: Create Serverless Function Structure

#### Files to Create:
```
api/auth/login.js
api/auth/callback.js
api/events/create.js
api/availability.js
api/health.js
```

#### Key Changes:
- Remove Express app initialization
- Use Vercel's `handler` function format
- Update CORS configuration
- Modify token storage for serverless environment

### Step 2: Update Frontend API Calls

#### Components to Update:
- `src/components/BookingTable.tsx`
- `src/contexts/BookingContext.tsx`
- Any other components making API calls

#### Changes Required:
- Update API base URL configuration
- Handle environment-specific endpoints
- Update error handling for serverless responses

### Step 3: Configure Vercel Settings

#### vercel.json Updates:
```json
{
  "version": 2,
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "functions": {
    "api/**/*.js": {
      "runtime": "nodejs18.x"
    }
  }
}
```

### Step 4: Deployment Process

#### Pre-Deployment Checklist:
- [ ] All serverless functions created and tested locally
- [ ] Frontend API calls updated
- [ ] Environment variables documented
- [ ] Local testing completed
- [ ] Git repository updated with all changes

#### Deployment Steps:
1. **Push Changes to GitHub**
   ```bash
   git add .
   git commit -m "feat: Add Vercel serverless deployment setup"
   git push origin main
   ```

2. **Set Up Vercel Project**
   - Import GitHub repository
   - Configure environment variables
   - Set up custom domain

3. **Deploy and Test**
   - Monitor deployment logs
   - Test all functionality
   - Verify Google Calendar integration

## Testing Strategy

### Local Testing
- Use `vercel dev` for local development
- Test all API endpoints
- Verify OAuth flow
- Test booking functionality

### Staging Testing
- Deploy to preview environment
- Test with production environment variables
- Verify Google Calendar integration
- Test booking flow end-to-end

### Production Testing
- Monitor deployment success
- Test all user flows
- Verify SSL certificate
- Test error handling

## Security Considerations

### Environment Variables
- Store sensitive data in Vercel environment variables
- Never commit secrets to Git
- Use different values for development/production

### CORS Configuration
- Restrict to allowed origins
- Handle preflight requests properly
- Use environment-specific configurations

### Google OAuth
- Secure redirect URIs
- Use proper OAuth scopes
- Handle token refresh properly

## Monitoring and Maintenance

### Vercel Analytics
- Monitor function performance
- Track error rates
- Monitor usage patterns

### Error Handling
- Implement proper error logging
- Set up alerts for failures
- Monitor Google Calendar API quotas

### Scaling Considerations
- Monitor function execution times
- Track concurrent requests
- Plan for traffic spikes

## Rollback Plan

### If Issues Occur:
1. **Immediate Rollback**: Revert to previous Git commit
2. **Environment Variables**: Restore previous configuration
3. **Domain Configuration**: Revert DNS if needed

### Backup Strategy:
- Keep Git history clean
- Document all configuration changes
- Maintain environment variable backups

## Timeline Estimate

- **Backend Conversion**: 2-3 hours
- **Frontend Updates**: 1 hour
- **Configuration Setup**: 30 minutes
- **Testing**: 1-2 hours
- **Deployment**: 30 minutes
- **Total**: 5-7 hours

## Success Criteria

### Technical Success:
- [ ] All serverless functions deploy successfully
- [ ] Frontend builds and deploys without errors
- [ ] Google Calendar integration works
- [ ] OAuth flow completes successfully
- [ ] Booking functionality works end-to-end

### User Experience:
- [ ] Site loads quickly (< 3 seconds)
- [ ] All forms work properly
- [ ] Booking confirmation works
- [ ] Mobile responsiveness maintained
- [ ] SSL certificate valid

### Performance:
- [ ] Functions execute within timeout limits
- [ ] No cold start issues for critical paths
- [ ] Error rates < 1%
- [ ] Uptime > 99.9%

## Post-Deployment Tasks

### Monitoring Setup:
- Set up Vercel analytics
- Configure error alerts
- Monitor Google Calendar API usage

### Documentation:
- Update project README
- Document deployment process
- Create troubleshooting guide

### Maintenance:
- Regular dependency updates
- Monitor Vercel platform changes
- Plan for scaling needs

---

**Next Steps**: Once this plan is reviewed and approved, proceed with implementation in the following order:
1. Create serverless function structure
2. Update frontend API calls
3. Configure Vercel settings
4. Test locally
5. Deploy to staging
6. Deploy to production
