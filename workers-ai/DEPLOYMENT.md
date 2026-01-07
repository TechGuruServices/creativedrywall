# Creative Drywall AI Assistant - Deployment Guide

## Prerequisites

- Node.js 18+ installed
- Cloudflare account with Workers AI enabled
- Wrangler CLI installed (`npm install -g wrangler`)

---

## Step 1: Initial Setup

```bash
# Navigate to the workers-ai directory
cd c:\creativedrywall\workers-ai

# Login to Cloudflare
wrangler login

# Install dependencies
npm install
```

---

## Step 2: Configure Your Account

Edit `wrangler.toml` and add your account ID:

```toml
account_id = "your-cloudflare-account-id"
```

Find your account ID at: <https://dash.cloudflare.com> → Overview → Account ID (right sidebar)

---

## Step 3: Local Development Testing

```bash
# Start local development server
wrangler dev

# The worker will be available at http://localhost:8787
```

### Test with curl

```bash
# Basic test
curl -X POST http://localhost:8787 \
  -H "Content-Type: application/json" \
  -d '{"message": "What services do you offer?"}'
```

---

## Step 4: Deploy to Production

```bash
# Deploy the worker
wrangler deploy

# Output will show your worker URL:
# https://creative-drywall-ai.lucas-a13.workers.dev
```

---

## Step 5: Configure Custom Domain (Optional)

1. Go to Cloudflare Dashboard → Workers & Pages → Your Worker
2. Click "Triggers" tab
3. Add Custom Domain: `api.creativedrywall.buzz`
4. Cloudflare will automatically configure DNS

---

## Step 6: Frontend Integration

1. Copy the contents of `frontend/chat-widget.html`
2. Update the `API_URL` constant in the script:

   ```javascript
   const API_URL = 'https://api.creativedrywall.buzz';
   ```

3. Paste the entire snippet into your website's HTML (before `</body>`)

---

## Environment Variables

No environment variables needed - the AI binding is configured in wrangler.toml.

To add secrets (if needed):

```bash
wrangler secret put SECRET_NAME
```

---

## Monitoring & Analytics

### Enable Analytics

1. Go to Cloudflare Dashboard → Workers & Pages → Your Worker
2. Click "Analytics" tab
3. View requests, errors, CPU time, and more

### View Logs

```bash
# Real-time logs from production
wrangler tail

# With filters
wrangler tail --search "error"
```

---

## Updating the Worker

```bash
# Make changes to src/index.ts
# Then redeploy
wrangler deploy
```

---

## Troubleshooting

### Worker not responding

```bash
# Check status
wrangler whoami

# View recent deployments
wrangler deployments list
```

### AI not working

Ensure Workers AI is enabled on your account:

1. Dashboard → Workers & Pages → AI
2. Verify you have sufficient quota

---

## Quick Reference Commands

| Command                    | Description              |
| -------------------------- | ------------------------ |
| `wrangler dev`             | Start local development  |
| `wrangler deploy`          | Deploy to production     |
| `wrangler tail`            | View live logs           |
| `wrangler secret put NAME` | Add secret               |
| `npm run test`             | Run tests                |

---

## Support

For deployment issues, contact Cloudflare support or visit:
<https://developers.cloudflare.com/workers/>
