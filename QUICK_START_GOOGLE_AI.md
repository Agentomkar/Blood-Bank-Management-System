# 🚀 Quick Start: Google AI Integration (5 Minutes)

## TL;DR - Fast Setup

### 1. Get API Key (2 min)
```
Visit: https://aistudio.google.com/app/apikeys
Sign in → Click "Create API Key" → Copy it
```

### 2. Configure (1 min)
```bash
cp .env.local.example .env.local
# Edit .env.local and paste your API key
GOOGLE_API_KEY=your_key_here
```

### 3. Install & Run (2 min)
```bash
npm install
npm run dev
```

### 4. Update Component (Instant)
Choose one:

**Option A - Direct Replacement (Recommended)**
```bash
cp src/components/AIChatbot.tsx src/components/AIChatbot-Backup.tsx
cp src/components/AIChatbot-GoogleAI.tsx src/components/AIChatbot.tsx
npm run dev  # Restart
```

**Option B - Side-by-side Testing**
- Keep both components
- Test `AIChatbot-GoogleAI.tsx` in a separate route

## What Changed?

### New Files:
- `src/app/api/chat/route.ts` - Google AI endpoint
- `src/components/AIChatbot-GoogleAI.tsx` - Updated chatbot
- `.env.local.example` - Config template
- `GOOGLE_AI_SETUP.md` - Full guide

### Updated Files:
- `package.json` - Added `@google/generative-ai`

## Test It Now

1. Open http://localhost:3000
2. Click chatbot button (bottom right)
3. Ask: "What is blood donation?"
4. See AI-powered response! 🎉

## Key Features

✅ **Google Gemini 2.0** integration
✅ **Conversation history** tracking
✅ **Smart error handling**
✅ **Rate limit protection**
✅ **Fallback logic**
✅ **Donor registration** (still works!)

## Common Issues

| Issue | Solution |
|-------|----------|
| "API key not configured" | Check `.env.local` exists and is correct |
| "Still showing old responses" | Clear cache, restart server |
| "Message won't send" | Check network tab in DevTools (F12) |

## For Production

Add to your hosting platform (Vercel, Railway, etc.):
```
GOOGLE_API_KEY = your_api_key
```

## Need More Help?

Read: `GOOGLE_AI_SETUP.md` (detailed guide)

---

**That's it! You're done! 🎊**
