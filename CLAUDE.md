# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a professional coaching website for Adriana with real-time Google Calendar integration. Built with React, TypeScript, Vite, and shadcn-ui components. The project includes a Node.js backend for Google Calendar API integration.

## Essential Commands

### Development
- `pnpm install` - Install dependencies (uses pnpm v10.12.4)
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm build:dev` - Build in development mode
- `pnpm lint` - Run ESLint (fix critical errors before committing)
- `pnpm test` - Run tests with Vitest
- `pnpm preview` - Preview production build

### Backend (Google Calendar Server)
- Located in `gcal-server/` directory
- Requires separate Node.js server for Google Calendar OAuth2 integration
- Environment variables needed: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`, `ADMIN_EMAIL`

## Architecture

### Frontend Structure
- **Framework**: React 19.1.0 with TypeScript
- **Build Tool**: Vite 7.0.4
- **UI Components**: shadcn-ui with Radix UI primitives
- **State Management**: React Context + TanStack Query
- **Routing**: React Router DOM 7.6.3
- **Styling**: Tailwind CSS with animations
- **Forms**: React Hook Form with Zod validation

### Key Components
- `BookingTable.tsx` - Main booking interface with real-time availability
- `BookingContext.tsx` - Global booking state management
- Google Calendar integration with OAuth2 flow and automatic token refresh

### Backend Integration
- Real-time availability checking from Google Calendar
- Event creation with immediate calendar sync
- CORS-enabled frontend-backend communication
- Fallback mode for service reliability

## Development Notes

### TypeScript Standards
- No `any` types allowed - use proper interfaces
- React Hook best practices required
- Include all dependencies in useEffect arrays
- Use useCallback for performance optimization

### Google Calendar Integration
- Uses OAuth2 authentication with automatic token refresh
- Real-time availability checking with loading states
- Event creation with progress feedback
- Error handling with user-friendly messages

### Current Status
- Linter: 0 errors, 7 non-critical warnings
- Google Calendar integration: ✅ Complete
- TypeScript coverage: 100%
- Production ready

## Testing
```bash
# Test Google Calendar endpoints
curl -X POST http://localhost:3000/availability \
  -H "Content-Type: application/json" \
  -d '{"date": "2025-09-10", "timeZone": "Europe/Lisbon"}'

# Test event creation
curl -X POST http://localhost:3000/events/create \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "name": "Test Client", "summary": "Test Session", "description": "Test description", "start": "2025-09-10T10:00:00+01:00", "end": "2025-09-10T11:00:00+01:00", "location": "Online"}'
```

## Common Issues
- **Google Calendar API**: Check environment variables and re-authenticate if needed
- **CORS**: Ensure backend is running with proper CORS configuration
- **Linter**: Run `pnpm lint` before committing
- **Build**: Check TypeScript errors if build fails