const Groq = require('groq-sdk');

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

exports.handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { messages } = JSON.parse(event.body);
    
    if (!Array.isArray(messages)) {
      return {
        statusCode: 400,
        headers,
        body: 'event: error\ndata: messages must be an array\n\n',
      };
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return {
        statusCode: 500,
        headers,
        body: 'event: error\ndata: GROQ_API_KEY is missing\n\n',
      };
    }

    const groq = new Groq({ apiKey: groqApiKey });
    const groqModel = process.env.GROQ_MODEL || 'openai/gpt-oss-20b';

    const normalized = messages[0]?.role === 'system'
      ? messages
      : [{ role: 'system', content: DEFAULT_SYSTEM_PROMPT }, ...messages];

    const stream = await groq.chat.completions.create({
      model: groqModel,
      messages: normalized,
      stream: true,
    });

    // For Netlify Functions, we need to return the stream differently
    // This is a simplified version - streaming in serverless is complex
    let fullResponse = '';
    for await (const chunk of stream) {
      const token = chunk?.choices?.[0]?.delta?.content || '';
      if (token) {
        fullResponse += token;
      }
    }

    // Return the full response as a single event
    return {
      statusCode: 200,
      headers,
      body: `data: ${JSON.stringify({ token: fullResponse })}\n\nevent: done\ndata: [DONE]\n\n`,
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: `event: error\ndata: ${JSON.stringify({ error: error.message })}\n\n`,
    };
  }
};
