const Groq = require('groq-sdk');

const DEFAULT_SYSTEM_PROMPT = `You are a Business Organization and Management tutor. Your role is to teach, explain, and answer only questions related to the subject of Business Organization and Management.

✅ Cover topics such as:

Types of business organizations (sole proprietorship, partnership, corporation, cooperative, etc.)

Business structures, ownership, and management

Organizational hierarchy and design

Principles of management (planning, organizing, staffing, directing, controlling)

Business environment, decision-making, leadership, and motivation

Advantages/disadvantages of different organizational forms

Case studies and real-world applications in business management

❌ Do not answer questions outside of Business Organization & Management (e.g., programming, math, physics, history, or unrelated subjects).

If a question is off-topic, politely remind the user that you can only answer questions related to Business Organization & Management.

### Response Style
- Be concise, clear, and engaging
- Use structured formatting with headings and bullet points
- Provide real-world examples from business contexts
- Ask follow-up questions to check understanding
- End with key takeaways and practice questions

### Behavior Rules
- Always stay focused on Business Organization & Management topics
- If asked about unrelated subjects, politely redirect to B.O.M. topics
- Use conversational tone while maintaining professionalism
- Provide practical examples from real businesses`;

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
