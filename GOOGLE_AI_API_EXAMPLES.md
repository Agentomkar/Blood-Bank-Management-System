# 💻 Google AI Chat API - Usage Examples

## API Endpoint
```
POST /api/chat
```

## Basic Request

### cURL
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is blood donation?",
    "conversationHistory": []
  }'
```

### JavaScript/Fetch
```javascript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'What is blood donation?',
    conversationHistory: []
  })
});

const data = await response.json();
console.log(data.message);
```

### TypeScript
```typescript
interface ChatRequest {
  message: string;
  conversationHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

interface ChatResponse {
  message: string;
  role: 'assistant';
}

async function chat(request: ChatRequest): Promise<ChatResponse> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    throw new Error(`Chat error: ${response.status}`);
  }

  return response.json();
}

// Usage
const result = await chat({
  message: 'Hello!',
  conversationHistory: []
});
console.log(result.message);
```

## With Conversation History

### Single Message in History
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Can you tell me more?",
    "conversationHistory": [
      {
        "role": "assistant",
        "content": "Blood donation is a medical procedure..."
      },
      {
        "role": "user",
        "content": "What is blood donation?"
      }
    ]
  }'
```

### Multiple Messages
```javascript
const conversationHistory = [
  {
    role: 'user',
    content: 'What is blood donation?'
  },
  {
    role: 'assistant',
    content: 'Blood donation is a medical procedure where a person voluntarily gives their blood...'
  },
  {
    role: 'user',
    content: 'How often can I donate?'
  },
  {
    role: 'assistant',
    content: 'Most people can donate every 56 days...'
  },
  {
    role: 'user',
    content: 'What are the eligibility requirements?'
  }
];

const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Can I donate if I\'m on medication?',
    conversationHistory
  })
});

const data = await response.json();
console.log(data.message);
```

## Error Handling

### 400 - Bad Request (Missing Message)
```javascript
try {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: '', // Invalid: empty
      conversationHistory: []
    })
  });

  if (response.status === 400) {
    const error = await response.json();
    console.error('Validation error:', error.error);
    // Output: "Message is required and must be a string"
  }
} catch (error) {
  console.error('Network error:', error);
}
```

### 401 - Unauthorized (Invalid API Key)
```javascript
try {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Hello',
      conversationHistory: []
    })
  });

  if (response.status === 401) {
    const error = await response.json();
    console.error('Auth error:', error.error);
    // Output: "Invalid or missing Google API key"
  }
} catch (error) {
  console.error('Network error:', error);
}
```

### 429 - Rate Limited
```javascript
try {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Hello',
      conversationHistory: []
    })
  });

  if (response.status === 429) {
    const error = await response.json();
    console.error('Rate limit:', error.error);
    // Output: "Too many requests. Please wait a moment."
  }
} catch (error) {
  console.error('Network error:', error);
}
```

### 500 - Server Error
```javascript
try {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Hello',
      conversationHistory: []
    })
  });

  if (response.status === 500) {
    const error = await response.json();
    console.error('Server error:', error.error);
    // Output: "Failed to generate response. Please try again."
  }
} catch (error) {
  console.error('Network error:', error);
}
```

## Complete Chat Implementation

```typescript
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

class ChatBot {
  private messages: Message[] = [];

  async sendMessage(userMessage: string): Promise<string> {
    // Add user message to history
    this.messages.push({
      role: 'user',
      content: userMessage
    });

    try {
      // Call API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: this.messages
        })
      });

      // Handle errors
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Unknown error');
      }

      // Get response
      const data = await response.json();
      const assistantMessage = data.message;

      // Add assistant message to history
      this.messages.push({
        role: 'assistant',
        content: assistantMessage
      });

      return assistantMessage;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to get response';
      
      console.error('Chat error:', errorMessage);
      throw error;
    }
  }

  getHistory(): Message[] {
    return [...this.messages];
  }

  clearHistory(): void {
    this.messages = [];
  }
}

// Usage
const bot = new ChatBot();

(async () => {
  try {
    const response1 = await bot.sendMessage('What is blood donation?');
    console.log('AI:', response1);

    const response2 = await bot.sendMessage('How often can I donate?');
    console.log('AI:', response2);

    const response3 = await bot.sendMessage('What are the requirements?');
    console.log('AI:', response3);

    console.log('Full history:', bot.getHistory());
  } catch (error) {
    console.error('Error:', error);
  }
})();
```

## Request/Response Types

### Request Body
```typescript
{
  "message": "string (required)",
  "conversationHistory": [
    {
      "role": "user | assistant",
      "content": "string"
    }
  ]
}
```

### Success Response (200)
```typescript
{
  "message": "string (AI response)",
  "role": "assistant"
}
```

### Error Response
```typescript
{
  "error": "string (error message)"
}
```

## Response Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | `{"message": "...", "role": "assistant"}` |
| 400 | Bad Request | Missing or invalid message |
| 401 | Unauthorized | Invalid API key |
| 429 | Rate Limited | Too many requests |
| 500 | Server Error | Internal server error |

## Testing with Postman

1. **Create Request**
   - Method: POST
   - URL: `http://localhost:3000/api/chat`

2. **Headers**
   - `Content-Type: application/json`

3. **Body** (raw JSON)
   ```json
   {
     "message": "What is blood donation?",
     "conversationHistory": []
   }
   ```

4. **Send** and check response

## Best Practices

### 1. Always Handle Errors
```javascript
const response = await fetch('/api/chat', {...});
if (!response.ok) {
  const error = await response.json();
  // Show user-friendly message
}
```

### 2. Maintain Conversation History
```javascript
// Keep all messages in order
this.conversationHistory.push({
  role: 'user',
  content: userMessage
});
// Always send full history to API
```

### 3. Add Loading States
```javascript
setLoading(true);
try {
  const response = await fetch('/api/chat', {...});
  // ...
} finally {
  setLoading(false);
}
```

### 4. Implement Timeouts
```javascript
const timeout = new Promise((_, reject) =>
  setTimeout(() => reject(new Error('Request timeout')), 30000)
);

const response = await Promise.race([
  fetch('/api/chat', {...}),
  timeout
]);
```

### 5. Validate Input
```javascript
const message = userInput.trim();
if (!message) {
  console.error('Empty message');
  return;
}
```

## Common Issues & Solutions

### Issue: CORS Error
**Solution**: API route is same-origin, should work without CORS headers

### Issue: Slow Response
**Solution**: 
- Check internet connection
- Verify API key is valid
- Consider reducing conversation history size

### Issue: Lost Conversation Context
**Solution**: Always maintain and send full conversation history

### Issue: Memory Growing
**Solution**: Implement conversation limits or archive old messages

---

**For more help, see `GOOGLE_AI_SETUP.md`**
