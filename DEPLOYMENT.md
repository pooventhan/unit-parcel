# Azure Web App Deployment Guide

This project is now configured to run both the React web app and the Fastify API in a single Azure Web App instance.

## Architecture

- **Web**: React SPA (built to static files)
- **API**: Fastify backend (Node.js)
- **Deployment**: Single Azure App Service instance serving both

The Fastify server:
1. Serves API routes (e.g., `/api/*`)
2. Serves the React build files as static content
3. Falls back to `index.html` for SPA routing (React Router)

## Build Process

The production build is a two-step process:

```bash
bun run build:prod
```

This command:
1. Builds the React web app (`bun run build:web`)
2. Checks TypeScript in the API (`bun run build:api`)
3. Copies the web build to `apps/api/public/` (`bun run copy:web-to-api`)

## Local Testing

### Development mode (separate servers)
```bash
# Terminal 1: Start the web app
bun run web:dev

# Terminal 2: Start the API
bun run api:dev
```

The web app runs on http://localhost:5173, API on http://localhost:3000.

### Production mode (combined)
```bash
# Build for production
bun run build:prod

# Run the API server (which now serves both web and API)
cd apps/api
bun src/index.ts
```

Visit http://localhost:3000 to see the web app being served from the API.

## Azure Web App Deployment

### Prerequisites

- Azure subscription
- Azure CLI installed (`az` command)
- Git repository (this project)

### Option 1: Deploy from GitHub (Recommended)

1. **Create Azure Web App**
   ```bash
   az appservice plan create \
     --name unit-parcel-plan \
     --resource-group your-resource-group \
     --sku B1 \
     --is-linux

   az webapp create \
     --resource-group your-resource-group \
     --plan unit-parcel-plan \
     --name unit-parcel-app \
     --runtime "NODE|20"
   ```

2. **Configure for Bun runtime**
   ```bash
   az webapp config appsettings set \
     --resource-group your-resource-group \
     --name unit-parcel-app \
     --settings WEBSITE_RUN_FROM_PACKAGE=1
   ```

3. **Connect GitHub repository**
   - In Azure Portal, go to your Web App
   - Select "Deployment Center" → "GitHub"
   - Authorize and select this repository
   - Select `develop` branch (or your deployment branch)

4. **Configure deployment command**
   - In Azure Portal, Deployment Center settings
   - Build provider: App Service Build Service
   - The `.deployment` file will be used automatically

### Option 2: Deploy via ZIP

1. **Create deployment package**
   ```bash
   bun run build:prod
   cd apps/api
   bun install --production
   cd ../..
   zip -r deploy.zip . \
     -x "node_modules/*" \
     "apps/web/node_modules/*" \
     ".git/*" \
     ".github/*" \
     "apps/web/src/*" \
     "apps/web/dist/*"
   ```

2. **Deploy ZIP**
   ```bash
   az webapp deployment source config-zip \
     --resource-group your-resource-group \
     --name unit-parcel-app \
     --src deploy.zip
   ```

### Option 3: Deploy via Docker

Create a `Dockerfile`:

```dockerfile
FROM oven/bun:latest

WORKDIR /app

COPY . .

RUN bun install
RUN bun run build:prod

EXPOSE 3000

CMD ["bun", "src/index.ts"]
```

Deploy:
```bash
az webapp up \
  --name unit-parcel-app \
  --runtime-version latest \
  --docker-registry-server-url yourregistry.azurecr.io
```

## Environment Variables

In Azure Web App, set these configuration variables:

| Variable | Value | Notes |
|----------|-------|-------|
| `PORT` | 3000 | Set by Azure automatically |
| `NODE_ENV` | production | Recommended for performance |
| `LOG_LEVEL` | info | Adjust as needed |

Set them via Azure Portal or CLI:
```bash
az webapp config appsettings set \
  --resource-group your-resource-group \
  --name unit-parcel-app \
  --settings NODE_ENV=production LOG_LEVEL=info
```

## Troubleshooting

### Web files not serving
- Ensure `bun run build:prod` completes without errors
- Check that `apps/api/public/` contains the built web files
- Verify `index.html` exists in the public directory

### API routes returning 404
- Check that API routes are prefixed with `/api/` in the code
- Verify CORS is configured correctly (it is by default)
- Check the server logs in Azure

### Port issues
- Azure automatically assigns port 3000 via the `PORT` environment variable
- The app listens on `0.0.0.0` to accept external traffic
- Don't override the PORT environment variable

### Check logs
```bash
az webapp log tail \
  --resource-group your-resource-group \
  --name unit-parcel-app
```

## Performance Considerations

- **Cold start**: Bun is faster than Node.js, but first deployment may take time
- **Static caching**: Consider enabling Azure CDN for assets
- **Scaling**: Use App Service Plan scaling (adjust the SKU)
- **Monitoring**: Enable Application Insights for performance monitoring

## Next Steps

1. Create Azure resources as shown above
2. Configure GitHub Actions for CI/CD (optional)
3. Set up monitoring and alerts
4. Configure custom domain and SSL certificate
5. Set up backup/disaster recovery if needed

For more info: https://learn.microsoft.com/en-us/azure/app-service/
