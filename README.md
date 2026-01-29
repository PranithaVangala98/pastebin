# Pastebin Clone

A lightweight Pastebin-like application for creating and sharing text pastes with optional expiration and view limits.

---

## Features

- **Create Pastes**: Add text content with optional expiry (TTL in seconds) and/or maximum number of views.
- **Shareable Links**: Each paste is accessible via a unique URL.
- **Automatic Expiration**: Pastes expire based on TTL or view count.
- **Safe Rendering**: No script execution (XSS protection).
- **Clear Error Messages**: User-friendly UI for expired or unavailable pastes.
- **Robust API**: Proper HTTP status codes and concurrency-safe view counting.

---

## 🛠 Tech Stack

- **Frontend**: Next.js (App Router)
- **Backend**: Next.js API Routes
- **Database**: Neon (PostgreSQL)
- **DB Client**: [postgres-js](https://github.com/porsager/postgres)
- **Deployment**: Vercel (recommended)

---

## 🚀 Getting Started (Local Development)

```bash
pnpm install
pnpm dev
```

The app will be available at `http://localhost:3000` by default.

---

## 🌐 Production URL

[Open Pastebin App](https://pastebin-ie8eyqlre-pranithas-projects-4418884c.vercel.app/p)
