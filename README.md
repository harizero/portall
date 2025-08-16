# Insurance Agent Portal

A comprehensive web-based portal for insurance agents to access multiple insurer websites from a single dashboard.

## Features

- **Secure Authentication**: Firebase-powered login with single-session management
- **Proxy-Based Portal Access**: Bypasses iframe restrictions using Puppeteer-based proxy server
- **10 Insurance Partners**: Pre-configured access to major Indian insurance companies
- **Professional Interface**: Clean, responsive design optimized for insurance professionals
- **Demo Account**: Test with demo@agent.com / demo123

## Quick Start

### Option 1: Full Development (with proxy server)
```bash
npm run dev:full
```

### Option 2: Frontend only
```bash
npm run dev
```

### Option 3: Proxy server only
```bash
npm run proxy
```

## Architecture

### Frontend (React + TypeScript + Tailwind)
- **Authentication**: Firebase Auth with single-session enforcement
- **State Management**: React hooks for auth and portal state
- **UI Components**: Modular component architecture
- **Responsive Design**: Mobile-first approach with desktop optimization

### Proxy Server (Node.js + Express + Puppeteer)
- **Portal Fetching**: Headless browser rendering for iframe-blocked sites
- **Content Processing**: HTML sanitization and URL rewriting
- **Form Handling**: Support for login form submissions
- **CORS Handling**: Proper cross-origin request management

## Insurance Partners

1. **Reliance General** - Motor and health insurance
2. **Digit Insurance** - Digital-first insurance solutions
3. **Tata AIG** - Global expertise in insurance
4. **SDFC ERGO** - Customer-centric solutions
5. **ICICI Lombard** - Leading private sector insurer
6. **FG General** - Future-ready insurance
7. **iLaunch** - Insurance technology platform
8. **Royal Sundaram** - Asset protection specialists
9. **Liberty Insurance** - Flexible insurance options
10. **Kotak Zurich** - Global standard solutions

## Security Features

- **Single Session Management**: Automatic logout on concurrent logins
- **Secure Portal Embedding**: Sandboxed iframes with proxy fallback
- **Session Persistence**: Secure session storage and validation
- **CORS Protection**: Proper cross-origin request handling

## Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
npm install
cd proxy-server && npm install
```

### Environment Setup
Configure Firebase credentials in `src/config/firebase.ts` for production use.

### Running the Application
The portal requires both the frontend and proxy server to be running for full functionality.

## Production Deployment

1. Deploy the React frontend to your preferred hosting service
2. Deploy the proxy server to a Node.js hosting environment
3. Update the proxy service base URL in `src/services/proxyService.ts`
4. Configure Firebase authentication for production

## Troubleshooting

### Portal Loading Issues
- Ensure proxy server is running on port 3001
- Check browser console for CORS or network errors
- Try switching between proxy and iframe modes
- Some insurance portals may require VPN access

### Authentication Issues
- Verify Firebase configuration
- Check browser local storage for session data
- Ensure single-session enforcement is working

## Future Enhancements

- API integration for direct policy data access
- Dashboard analytics and reporting
- Automated policy management workflows
- Multi-language support
- Advanced security features