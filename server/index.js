import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file from project root
const envPath = path.join(__dirname, '..', '.env');
console.log(`🔍 Looking for .env file at: ${envPath}`);

const result = dotenv.config({ path: envPath });
if (result.error) {
  console.error('❌ Error loading .env file:', result.error);
} else if (result.parsed && Object.keys(result.parsed).length > 0) {
  console.log(`✅ Environment variables loaded from: ${envPath}`);
  console.log('📋 Loaded variables:', Object.keys(result.parsed));
} else {
  console.warn('⚠️  No environment variables found in .env file');
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const groqApiKey = process.env.GROQ_API_KEY;
const groqModel = process.env.GROQ_MODEL || 'openai/gpt-oss-20b';

// Debug: Show loaded environment variables
console.log('🔍 Environment variables check:');
console.log('GROQ_API_KEY:', groqApiKey ? `${groqApiKey.substring(0, 10)}...` : 'NOT SET');
console.log('GROQ_MODEL:', groqModel);
console.log('VITE_API_BASE_URL:', process.env.VITE_API_BASE_URL);

const DEFAULT_SYSTEM_PROMPT = `You are a Business Organization & Management tutor. 
You must ONLY answer questions directly related to the subject of Business Organization & Management. 

Allowed topics include:
- Types of business organizations (sole proprietorship, partnership, corporation, cooperative, etc.)
- Business structures, ownership, and management
- Organizational hierarchy and design
- Principles of management (planning, organizing, staffing, directing, controlling)
- Business environment, leadership, motivation, decision-making
- Advantages and disadvantages of organizational forms
- Case studies and applications in business management

If the user asks a question that is NOT related to Business Organization & Management:
- Do NOT answer it.
- Instead, respond with: 
  "I can only answer questions related to Business Organization & Management. Please ask me something in that area."`;
if (!groqApiKey) {
  console.warn('❌ Warning: GROQ_API_KEY is not set. Create a .env with GROQ_API_KEY=...');
}
const groq = new Groq({ apiKey: groqApiKey });

app.get('/api/health', async (req, res) => {
  try {
    if (!groqApiKey) {
      return res.status(500).json({ ok: false, error: 'GROQ_API_KEY missing' });
    }
    const models = await groq.models.list();
    return res.json({ ok: true, models: models.data?.map(m => m.id) || [] });
  } catch (err) {
    console.error('Health error', err?.response?.data || err?.message || err);
    return res.status(500).json({ ok: false, error: err?.message || 'Unknown error' });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages must be an array' });
    }

    if (!groqApiKey) {
      return res.status(500).json({ error: 'GROQ_API_KEY is missing on server' });
    }

    const normalized = messages[0]?.role === 'system'
      ? messages
      : [{ role: 'system', content: DEFAULT_SYSTEM_PROMPT }, ...messages];

    const completion = await groq.chat.completions.create({
      model: groqModel, // per your sample: "openai/gpt-oss-20b"
      messages: normalized,
    });

    const content = completion.choices?.[0]?.message?.content || '';
    return res.json({ content });
  } catch (err) {
    const details = err?.response?.data || err?.message || err;
    console.error('Groq error', details);
    return res.status(500).json({ error: 'Failed to get response from Groq', details });
  }
});

// Simple test endpoint that mirrors the sample you provided
app.get('/api/test', async (req, res) => {
  try {
    if (!groqApiKey) {
      return res.status(500).json({ error: 'GROQ_API_KEY is missing on server' });
    }
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: 'Explain the importance of fast language models',
        },
      ],
      model: 'openai/gpt-oss-20b',
    });
    const content = completion.choices?.[0]?.message?.content || '';
    return res.json({ content });
  } catch (err) {
    const details = err?.response?.data || err?.message || err;
    console.error('Groq test error', details);
    return res.status(500).json({ error: 'Groq test failed', details });
  }
});

// Streaming endpoint (Server-Sent Events)
app.post('/api/chat/stream', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!Array.isArray(messages)) {
      res.writeHead(400, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      });
      res.write(`event: error\n`);
      res.write(`data: messages must be an array\n\n`);
      return res.end();
    }
    if (!groqApiKey) {
      res.writeHead(500, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      });
      res.write(`event: error\n`);
      res.write(`data: GROQ_API_KEY is missing on server\n\n`);
      return res.end();
    }

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    });

    const normalized = messages[0]?.role === 'system'
      ? messages
      : [{ role: 'system', content: DEFAULT_SYSTEM_PROMPT }, ...messages];

    const stream = await groq.chat.completions.create({
      model: groqModel,
      messages: normalized,
      stream: true,
    });

    // Groq JS SDK returns an async iterable when stream: true
    for await (const chunk of stream) {
      const token = chunk?.choices?.[0]?.delta?.content || '';
      if (token) {
        res.write(`data: ${JSON.stringify({ token })}\n\n`);
      }
    }

    res.write(`event: done\n`);
    res.write(`data: [DONE]\n\n`);
    res.end();
  } catch (err) {
    const details = err?.response?.data || err?.message || 'Unknown error';
    console.error('Groq stream error', details);
    try {
      res.write(`event: error\n`);
      res.write(`data: ${JSON.stringify(details)}\n\n`);
      res.end();
    } catch {}
  }
});

const PORT = process.env.PORT || 8787;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});




