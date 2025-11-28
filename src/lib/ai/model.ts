import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';

export function getModel() {
  const provider = process.env.AI_PROVIDER || 'openai';

  if (provider === 'google') {
    return google('gemini-2.5-flash');
  }

  // Default to OpenAI
  return openai('gpt-4o');
}
