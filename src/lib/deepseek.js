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

  // URL de l'API, d'après la doc, nous utilisons le endpoint chat/completions
  const SUMMARY_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

  try {
    const response = await fetch(SUMMARY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentApiKey}`,
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o', // ou le modèle souhaité
        messages: [
          {
            role: 'user',
            content: documentText, // le contenu de votre document est transmis ici
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('DeepSeek API request failed:', response.status, errorData);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    // Vérifiez que la réponse correspond à la structure attendue
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

  // Placeholder URL for quiz generation
  const DUMMY_QUIZ_API_URL = 'https://api.deepseek.com/v1/generate_quiz';

  try {
    const response = await fetch(DUMMY_QUIZ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentApiKey}`,
      },
      body: JSON.stringify({
        text_content: documentText, // or summary_text as per prompt
        num_questions: numQuestions,
        difficulty: difficulty, // e.g., "easy", "medium", "hard"
      }),
    });

    if (!response.ok) {
      const errorData = await response.text(); // or response.json() if API returns JSON errors
      console.error('DeepSeek Quiz API request failed:', response.status, errorData);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const apiResponse = await response.json();

    // Assumed API response structure (as per subtask description):
    // {
    //   "title": "Generated Quiz Title",
    //   "questions_data": [
    //     {
    //       "question_text": "Example question 1?",
    //       "answers": [
    //         {"text": "Option A", "is_correct": false},
    //         {"text": "Option B", "is_correct": true},
    //         {"text": "Option C", "is_correct": false}
    //       ]
    //     },
    //     // ... more questions
    //   ]
    // }

    if (!apiResponse || !apiResponse.title || !Array.isArray(apiResponse.questions_data)) {
      console.error('Unexpected API response structure for quiz:', apiResponse);
      throw new Error('Failed to parse quiz from API response due to unexpected structure.');
    }

    const transformedQuiz = {
      title: apiResponse.title,
      questions: apiResponse.questions_data.map(q_data => {
        if (!q_data.question_text || !Array.isArray(q_data.answers) || q_data.answers.length === 0) {
          console.error('Invalid question structure in API response:', q_data);
          // Potentially skip this question or handle more gracefully
          throw new Error('Invalid question data in API response.');
        }
        const options = q_data.answers.map(ans => ans.text);
        const correctAnswerIndex = q_data.answers.findIndex(ans => ans.is_correct);

        if (correctAnswerIndex === -1) {
          console.error('Correct answer not found in question data:', q_data);
          // Potentially skip this question or handle more gracefully
          throw new Error('Correct answer missing in question data from API.');
        }

        return {
          question: q_data.question_text,
          options: options,
          correctAnswer: correctAnswerIndex,
        };
      }),
    };

    return transformedQuiz;

  } catch (error) {
    console.error('Error calling DeepSeek quiz API:', error);
    // Re-throw the error, ensuring it's an Error object for consistent error handling
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error(String(error));
    }
  }
};
