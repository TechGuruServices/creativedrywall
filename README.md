# Creative Drywall AI Assistant

**Cloudflare Workers AI-powered chat assistant for Montana's premier family-owned drywall company since 1976.**

## 🏗️ Overview

This is a production-ready AI assistant that:

- Uses Cloudflare Workers AI with `@cf/meta/llama-3-8b-instruct`
- Enforces strict business rules (no pricing quotes, Montana-only service)
- Includes safety guards against prompt injection
- Rate limits to 10 requests/minute per IP
- Provides fallback to human contact on errors

## 📁 Project Structure

```text
workers-ai/
├── src/
│   └── index.ts          # Main worker with all logic
├── frontend/
│   └── chat-widget.html  # Copy-paste frontend integration
├── wrangler.toml         # Cloudflare configuration
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── DEPLOYMENT.md         # Step-by-step deployment
└── TESTING.md            # 10 test cases with curl commands
```

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Login to Cloudflare
wrangler login

# Start local development
wrangler dev

# Deploy to production
wrangler deploy
```

## 📞 Business Contact Info

- **Phone:** (406) 239-0850
- **Email:** <golfnbuzz57@icloud.com>
- **Address:** 6785 Prairie Schooner Lane, Missoula, MT 59808

## 📋 Business Rules Enforced

1. **Never quotes prices** - redirects to free consultation
2. **Montana only** - politely declines other locations
3. **Emergency priority** - urgent same-day assessment
4. **Family values** - 49+ years, 4 generations
5. **Satisfaction guarantee** - 100% mentioned in service discussions

## 🔒 Safety Features

- Input sanitization (blocks prompt injection)
- Response validation (filters price mentions)
- Rate limiting (Basic Cloudflare protection)
- Error fallback (human contact details)
- Content filtering (off-topic redirection)

## 📖 Documentation

- [Deployment Guide](DEPLOYMENT.md)
- [Testing Protocol](TESTING.md)

## 🧪 Quick Test

```bash
curl -X POST http://localhost:8787 \
  -H "Content-Type: application/json" \
  -d '{"message": "What services do you offer?"}'
```

---

*The Thompson family has been serving Montana since 1976.*
