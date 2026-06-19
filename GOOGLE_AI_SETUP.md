# 🤖 Google AI Studio API Integration Guide

## Overview
This guide will help you integrate **Google Generative AI (Gemini 2.0)** into your LifeStream Blood Bank AI Assistant.

## What's Included

### New Files Created:
1. **`/src/app/api/chat/route.ts`** - API endpoint for Google AI chat
2. **`/src/components/AIChatbot-GoogleAI.tsx`** - Updated chatbot component with Google AI integration
3. **`.env.local.example`** - Environment configuration template
4. **`GOOGLE_AI_SETUP.md`** - This setup guide

## Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- Google account

## Step-by-Step Setup

### 1. Get Your Google API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikeys)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the generated API key
5. Keep it safe (don't share publicly)

### 2. Configure Environment Variables

1. Copy the example file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local`:
   ```bash
   GOOGLE_API_KEY=your_actual_api_key_here
   ```

3. **Important**: Add `.env.local` to `.gitignore` to prevent exposing your API key:
   ```bash
   echo ".env.local" >> .gitignore
   ```

### 3. Install Dependencies

```bash
npm install
# or
yarn install
```

The `@google/generative-ai` package will be installed automatically.

### 4. Replace the Chatbot Component

You have two options:

**Option A: Use Google AI (Recommended)**
```bash
# Rename the new component to replace the old one
cp src/components/AIChatbot.tsx src/components/AIChatbot-Backup.tsx
cp src/components/AIChatbot-GoogleAI.tsx src/components/AIChatbot.tsx
```

**Option B: Keep Both (Testing)**
- Keep `AIChatbot.tsx` as is
- Create a separate page with `AIChatbot-GoogleAI.tsx` for testing

### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` and test the chatbot!

## How It Works

### Architecture

```
User Input
    ↓
AIChatbot Component
    ↓
Registration Check (Rule-based)
    ↓
Google AI API (/api/chat)
    ↓
Gemini 2.0 Model
    ↓
Response to User
```

### Key Features

✅ **Smart Conversations** - Uses Google Gemini 2.0 for natural responses
✅ **Donor Registration** - Step-by-step guided form (rule-based)
✅ **Conversation History** - Maintains context across messages
✅ **Error Handling** - Graceful fallbacks and error messages
✅ **Rate Limiting** - Built-in protection against quota limits
✅ **Fallback Logic** - Rule-based responses when AI is unavailable

### Response Flow

1. **Registration Flow** → Uses predefined steps (Rule-based)
2. **General Questions** → Uses Google AI (Gemini 2.0)
3. **API Errors** → Graceful fallback with helpful messages

## API Route: `/api/chat`

### Request Format
```json
{
  "message": "What is your eligibility criteria?",
  "conversationHistory": [
    {
      "role": "user",
      "content": "Hello"
    },
    {
      "role": "assistant",
      "content": "Hi! How can I help?"
    }
  ]
}
```

### Response Format
```json
{
  "message": "Donors typically need to be 18-65 years old...",
  "role": "assistant"
}
```

### Error Responses
- **400** - Missing or invalid message
- **401** - Invalid/missing API key
- **429** - Rate limit exceeded
- **500** - Server error

## Customization

### 1. Modify System Instructions

Edit `/src/app/api/chat/route.ts`, line ~22:

```typescript
systemInstruction: `You are LifeStream AI, a helpful blood donation assistant...`
```

### 2. Change Model

Edit `/src/app/api/chat/route.ts`, line ~47:

```typescript
model: genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash", // Change this
  // ...
})
```

Available models:
- `gemini-2.0-flash` (Recommended - Fast & Smart)
- `gemini-1.5-pro` (Powerful, slower)
- `gemini-1.5-flash` (Fast, capable)

### 3. Adjust Temperature

Edit `/src/app/api/chat/route.ts`, line ~52:

```typescript
temperature: 0.7, // 0 = deterministic, 1 = creative
```

### 4. Set Token Limits

Edit `/src/app/api/chat/route.ts`, line ~51:

```typescript
maxOutputTokens: 1024, // Adjust response length
```

## Testing

### 1. Test Basic Conversation
- Open chatbot
- Ask: "What is blood donation?"
- Should get AI-powered response

### 2. Test Registration
- Click "Register me" button
- Fill in donor information step by step
- Should complete registration

### 3. Test Error Handling
- Temporarily remove API key from `.env.local`
- Try sending message
- Should show graceful error

### 4. API Testing (curl)
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "conversationHistory": []}'
```

## Troubleshooting

### Issue: "Google API key is not configured"
**Solution**: 
- Check `.env.local` exists
- Verify `GOOGLE_API_KEY` is set correctly
- Restart dev server after setting env var

### Issue: "Invalid or missing Google API key"
**Solution**:
- Go to [Google AI Studio](https://aistudio.google.com/app/apikeys)
- Verify API key is active
- Try creating a new API key

### Issue: "Too many requests. Please wait"
**Solution**:
- You've hit Google's rate limit
- Wait a few minutes before retrying
- Consider adding request throttling

### Issue: Chatbot still using old responses
**Solution**:
- Make sure you replaced the correct file
- Clear browser cache
- Restart dev server: `npm run dev`

### Issue: Messages not sending
**Solution**:
- Check browser console for errors (F12)
- Verify API route exists: `/api/chat`
- Check `.env.local` in server logs

## Performance Tips

1. **Use Gemini 2.0 Flash** - Fastest model
2. **Reduce maxOutputTokens** - For shorter responses
3. **Enable caching** - Cache frequent questions
4. **Add debouncing** - Prevent rapid requests
5. **Implement typing indicator** - Already included ✓

## Security Best Practices

⚠️ **IMPORTANT**:
1. **Never commit `.env.local`** to git
2. **Use environment variables** in production
3. **Validate user input** on the backend
4. **Rate limit API calls** (implement on backend)
5. **Monitor API usage** in Google AI Studio dashboard
6. **Use API restrictions** (restrict to your domain)

## Production Deployment

### For Vercel:
1. Go to Project Settings → Environment Variables
2. Add `GOOGLE_API_KEY` variable
3. Set to your API key
4. Deploy!

### For Other Platforms:
1. Set `GOOGLE_API_KEY` in environment
2. Ensure Node.js 18+ is available
3. Run `npm install && npm run build`
4. Start with `npm run start`

## Monitoring & Debugging

### View API Logs:
- Google AI Studio: https://console.cloud.google.com
- Check quota and usage

### Dev Tools:
- Open browser DevTools (F12)
- Go to Network tab
- Look for requests to `/api/chat`

### Server Logs:
```bash
# Terminal will show errors during `npm run dev`
```

## Cost Estimation

Google Generative AI Free Tier:
- 60 requests per minute
- 1500 requests per day
- **Gemini 2.0 Flash**: ~$0.075/1M input tokens, ~$0.30/1M output tokens

Monitor usage: https://aistudio.google.com/app/usage

## Next Steps

1. ✅ Set up API key
2. ✅ Configure environment variables
3. ✅ Update chatbot component
4. ✅ Test locally
5. ✅ Deploy to production
6. ✅ Monitor usage

## Additional Resources

- [Google Generative AI Docs](https://ai.google.dev)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Rate Limits & Quotas](https://ai.google.dev/pricing)
- [Model Comparison](https://ai.google.dev/models)

## Support

For issues:
1. Check this guide's Troubleshooting section
2. Review Google AI Studio documentation
3. Check browser console for errors
4. Verify API key is active and valid

---

**Happy coding! Your LifeStream AI is now powered by Google Generative AI! 🚀**
