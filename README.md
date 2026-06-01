# Unit Parcel

A monorepo project with a React frontend and Fastify backend, configured to run together in a single Azure Web App.

## Project Structure

```
unit-parcel/
├── apps/
│   ├── web/          # React SPA (Vite)
│   └── api/          # Fastify backend
├── scripts/
│   └── copy-web-dist.js   # Build script to copy web files to API
├── DEPLOYMENT.md     # Azure deployment guide
├── .deployment       # Azure custom build configuration
├── startup.sh        # App Service startup script
└── web.config        # IIS configuration (Windows App Service)
```

## Development

### Prerequisites
- [Bun](https://bun.sh) runtime installed

### Development Mode (Separate Servers)

```bash
# Install dependencies
bun install

# Terminal 1: Start React dev server (port 5173)
bun run web:dev

# Terminal 2: Start API dev server (port 3000)
bun run api:dev
```

### Production Mode (Combined)

```bash
# Build both web and API for production
bun run build:prod

# Start the combined server (serves both web and API on port 3000)
cd apps/api
bun src/index.ts

# Visit http://localhost:3000
```

## Deployment

### Azure Web App (Single Instance)

This project is configured to run both the React web app and Fastify API in a single Azure Web App instance. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed setup instructions.

**Quick Start:**
1. Create Azure Web App with Node.js runtime
2. Connect GitHub repository
3. Azure will automatically run `bun run build:prod` and `bun src/index.ts`

**Key Features:**
- ✅ Static React build served by Fastify
- ✅ API and web share the same port (3000)
- ✅ SPA routing handled automatically
- ✅ CORS enabled for flexibility
- ✅ Azure-ready with environment variable support
- ✅ GitHub Actions CI/CD workflow included

## Build Scripts

| Script | Purpose |
|--------|---------|
| `bun run dev` | Start both web and API in dev mode |
| `bun run web:dev` | Start React dev server only |
| `bun run api:dev` | Start API dev server only |
| `bun run build:prod` | Build for production (combines web + API) |
| `bun run start` | Start the API (serves both web and API) |

## Architecture

```
┌─────────────────┐
│  Azure Web App  │
│   (Single)      │
├─────────────────┤
│   Fastify API   │
│   (port 3000)   │
├─────────────────┤
│  Static Web     │
│  (React build)  │
└─────────────────┘
```

- **Web**: React SPA built to static files, served by Fastify
- **API**: Fastify server with API routes (prefix: `/api/`)
- **Combined**: Single deployment unit for simplified cloud hosting

## Troubleshooting

### Build fails with "public directory not found"
This is expected during development. The public directory is created during `bun run build:prod`.

### Can't start the app locally
Make sure you:
1. Run `bun install` at the root level
2. Run `bun run build:prod` before starting the API
3. Use `cd apps/api && bun src/index.ts` to start

### Azure deployment issues
Check [DEPLOYMENT.md](./DEPLOYMENT.md) troubleshooting section or Azure App Service logs:
```bash
az webapp log tail --resource-group <group> --name <app-name>
```

## Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `PORT` | 3000 | Server port (set by Azure) |
| `NODE_ENV` | development | Node environment |

## Next Steps

1. Review [DEPLOYMENT.md](./DEPLOYMENT.md) for Azure setup
2. Configure GitHub secrets for automated deployment
3. Deploy to Azure Web App
4. Monitor via Application Insights