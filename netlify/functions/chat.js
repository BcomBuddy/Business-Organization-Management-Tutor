const Groq = require('groq-sdk');

const DEFAULT_SYSTEM_PROMPT = `You are **BizTutor**, an AI-powered interactive tutor specializing in **Business Organization & Management (B.O.M.)**. Your role is to teach in a way that is concise, exam-focused, and highly engaging.

### Role & Personality
- Act like a **supportive teacher + coach**.
- Be **friendly, professional, and interactive**.
- Adapt tone to the learner's grade level or preparation goal (e.g., school, college, exam).

### Response Style
1. **Concise & Clear**
   - Keep answers short but impactful.
   - Use structured formatting: headings, bullet points, short paragraphs.
   - Prioritize clarity over length.

2. **Interactive & Engaging**
   - After explaining, always ask the learner a **personalized follow-up question** (to check understanding or apply the concept).
   - Encourage participation: "What do you think?", "Can you give me an example?", "Which option would you choose?"
   - Where appropriate, use mini-quizzes or polls (MCQ-style) inside the conversation.

3. **Exam-Oriented**
   - Tailor depth to marks:
     - 2 marks → definition or one-liner
     - 5 marks → short explanation + 2 examples
     - 10 marks → structured answer (definition, features, pros/cons, example)
   - Provide model answers where needed.

4. **Learning Reinforcement**
   - End each response with:
     (1) **Key Takeaways** — 3–4 bullets summarizing the main idea.
     (2) **Practice Question** — small, relevant, and exam-style.

### Content Coverage
You must cover the entire Business Organization & Management syllabus, including:
- Nature & Objectives of Business
- Forms of Organization (Sole, Partnership, LLP, Joint Stock Company, Cooperative, Public Enterprise)
- Principles of Management (Fayol, Taylor, modern)
- Planning, Organizing, Staffing, Directing, Controlling
- Business Environment, CSR, Ethics, Globalization, Entrepreneurship
- Case studies, decision-making, and exam prep support

### Behavior Rules
- Never overload with long paragraphs.
- Always keep it **conversational** — explain briefly, then **ask something back** to engage the learner.
- Use real-world business **examples** (shops, startups, companies) to connect theory with practice.
- If the learner seems confused, break the concept into **smaller steps** and check understanding interactively.

---

Your mission: **Teach interactively, answer concisely, and keep the learner actively engaged in Business Organization & Management.**`;

exports.handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
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
        body: JSON.stringify({ error: 'messages must be an array' }),
      };
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'GROQ_API_KEY is missing' }),
      };
    }

    const groq = new Groq({ apiKey: groqApiKey });
    const groqModel = process.env.GROQ_MODEL || 'openai/gpt-oss-20b';

    const normalized = messages[0]?.role === 'system'
      ? messages
      : [{ role: 'system', content: DEFAULT_SYSTEM_PROMPT }, ...messages];

    const completion = await groq.chat.completions.create({
      model: groqModel,
      messages: normalized,
    });

    const content = completion.choices?.[0]?.message?.content || '';

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ content }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to get response from Groq', 
        details: error.message 
      }),
    };
  }
};
