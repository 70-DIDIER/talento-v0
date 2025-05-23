// src/lib/deepseek.js

let apiKey = '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'; // Placeholder for the API key

/**
 * Sets the DeepSeek API key.
 * @param {string} key - The API key.
 */
export const setDeepSeekApiKey = (key) => {
  apiKey = key;
  console.log('DeepSeek API Key has been set.');
};

/**
 * Returns the current API key.
 * Used internally for API requests.
 * @returns {string} The API key.
 */
export const getDeepSeekApiKey = () => {
  if (apiKey === 'YOUR_DEEPSEEK_API_KEY_HERE' || !apiKey) {
    console.warn('DeepSeek API Key is not set. Please set it using setDeepSeekApiKey().');
  }
  return apiKey;
};

// Functions for API interactions (generateSummaryAPI, generateQuizAPI) will be added here later.

export const generateSummaryAPI = async (documentText) => {
  const currentApiKey = getDeepSeekApiKey();
  if (currentApiKey === 'YOUR_DEEPSEEK_API_KEY_HERE' || !currentApiKey) {
    console.error('DeepSeek API Key is not configured.');
    throw new Error('DeepSeek API Key is not configured.');
  }

  const SUMMARY_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

  try {
    const response = await fetch(SUMMARY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentApiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Talento App'
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Tu es un assistant qui résume des textes de manière concise et claire.'
          },
          {
            role: 'user',
            content: `Résume le texte suivant de manière concise : ${documentText}`
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('DeepSeek API request failed:', response.status, errorData);
      throw new Error(`API request failed with status ${response.status}: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();

    if (
      data &&
      data.choices &&
      data.choices.length > 0 &&
      data.choices[0].message &&
      data.choices[0].message.content
    ) {
      return data.choices[0].message.content;
    } else {
      console.error('Unexpected API response structure:', data);
      throw new Error('Failed to parse summary from API response.');
    }
  } catch (error) {
    console.error('Error calling DeepSeek summary API:', error);
    throw error;
  }
};

export const generateQuizAPI = async (documentText, numQuestions, difficulty) => {
  const currentApiKey = getDeepSeekApiKey();
  if (currentApiKey === 'YOUR_DEEPSEEK_API_KEY_HERE' || !currentApiKey) {
    console.error('DeepSeek API Key is not configured.');
    throw new Error('DeepSeek API Key is not configured.');
  }

  const QUIZ_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

  try {
    const response = await fetch(QUIZ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentApiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Talento App'
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Tu es un assistant qui crée des quiz éducatifs.'
          },
          {
            role: 'user',
            content: `Crée un quiz de ${numQuestions} questions de niveau ${difficulty} basé sur ce texte : ${documentText}. Format de réponse attendu : JSON avec title et questions_data (array d'objets avec question_text et answers array d'objets avec text et is_correct)`
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('DeepSeek Quiz API request failed:', response.status, errorData);
      throw new Error(`API request failed with status ${response.status}: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const quizData = JSON.parse(data.choices[0].message.content);

    return {
      title: quizData.title,
      questions: quizData.questions_data.map(q => ({
        question: q.question_text,
        options: q.answers.map(a => a.text),
        correctAnswer: q.answers.findIndex(a => a.is_correct)
      }))
    };
  } catch (error) {
    console.error('Error calling DeepSeek quiz API:', error);
    throw error;
  }
};
