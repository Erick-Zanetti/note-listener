import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

export type AIProvider = 'openai' | 'anthropic' | 'gemini';

interface ProcessNoteParams {
  text: string;
  provider: AIProvider;
  apiKey: string;
  systemPrompt: string;
  outputLanguage?: string;
}

interface AIResponse {
  title: string;
  content: string;
  category: string;
  tags: string[];
}

const getStructuredPromptSuffix = (language: string = 'English') => `

IMPORTANT: You MUST return your response EXACTLY in the following JSON format:
{
  "title": "a concise title in ${language} (maximum 50 characters)",
  "content": "your detailed summary/analysis here (can be multi-line) in ${language}",
  "category": "ONE main category in ${language} (choose from: Work, Personal, Idea, Task, Meeting, Study, Project, Note, Reminder, Other)",
  "tags": ["tag1", "tag2", "tag3"]
}

RULES:
1. The "title" must be a concise and descriptive title summarizing the main topic, maximum 50 characters, in ${language}.
2. The "content" must be a structured and useful summary of the text, NOT just a repetition.
3. The "category" must be ONE WORD only, Capitalized.
4. The "tags" must be relevant keywords, lowercase, 2 to 5 tags.
5. Return ONLY valid JSON, no additional text before or after.
6. Use UTF-8 for special characters.
7. Use plenty of emojis to make the summary more visual and interesting.
8. The output content MUST be in ${language}.`;

export async function processNote({ text, provider, apiKey, systemPrompt, outputLanguage = 'English' }: ProcessNoteParams): Promise<AIResponse> {
  if (!apiKey) {
    throw new Error(`API Key for ${provider} is missing.`);
  }

  const fullPrompt = systemPrompt + getStructuredPromptSuffix(outputLanguage);
  
  console.log('🔵 Processing with AI');
  console.log('Provider:', provider);
  console.log('System Prompt:', fullPrompt);
  console.log('User Text:', text);

  try {
    let responseText: string;
    
    switch (provider) {
      case 'openai':
        responseText = await processWithOpenAI(text, apiKey, fullPrompt);
        break;
      case 'anthropic':
        responseText = await processWithAnthropic(text, apiKey, fullPrompt);
        break;
      case 'gemini':
        responseText = await processWithGemini(text, apiKey, fullPrompt);
        break;
      default:
        throw new Error('Invalid AI provider selected.');
    }

    console.log('🔵 AI Raw Response:', responseText);

    // Parse JSON response
    try {
      // Try to extract JSON from the response (in case there's extra text)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        console.log('✅ Found JSON in response');
        const parsed = JSON.parse(jsonMatch[0]);
        console.log('✅ Parsed JSON:', parsed);
        return {
          title: parsed.title || 'New Mental Note',
          content: parsed.content || responseText,
          category: parsed.category || 'General',
          tags: Array.isArray(parsed.tags) ? parsed.tags : [],
        };
      }
      
      console.warn('⚠️ No JSON found in AI response, using defaults');
      return {
        title: 'New Mental Note',
        content: responseText,
        category: 'General',
        tags: [],
      };
    } catch (parseError) {
      console.warn('❌ Failed to parse AI response as JSON, using raw text:', parseError);
      return {
        title: 'New Mental Note',
        content: responseText,
        category: 'General',
        tags: [],
      };
    }
  } catch (error) {
    console.error('AI Processing Error:', error);
    throw new Error(`Failed to process with ${provider}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function processWithOpenAI(text: string, apiKey: string, systemPrompt: string): Promise<string> {
  const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true }); // Client-side usage
  const response = await openai.chat.completions.create({
    model: 'gpt-4o', // Or gpt-3.5-turbo depending on preference/cost
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: text },
    ],
  });
  return response.choices[0]?.message?.content || '';
}

async function processWithAnthropic(text: string, apiKey: string, systemPrompt: string): Promise<string> {
  const anthropic = new Anthropic({ apiKey, dangerouslyAllowBrowser: true }); // Client-side usage
  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20240620',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: 'user', content: text }],
  });
  
  // Handle the content block correctly
  const contentBlock = response.content[0];
  if (contentBlock.type === 'text') {
    return contentBlock.text;
  }
  return '';
}

async function processWithGemini(text: string, apiKey: string, systemPrompt: string): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
  const result = await model.generateContent([systemPrompt, text]);
  const response = await result.response;
  return response.text();
}
