// src/lib/deepseek.js

let apiKey = 'YOUR_DEEPSEEK_API_KEY_HERE'; // Placeholder for the API key

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
    // It's better to throw an error or return a specific error object
    // for the caller to handle, rather than just a string.
    throw new Error('DeepSeek API Key is not configured.');
  }

  // Placeholder URL - this will need to be updated with the actual DeepSeek API endpoint
  const DUMMY_SUMMARY_API_URL = 'https://api.deepseek.com/v1/summarize';

  try {
    const response = await fetch(DUMMY_SUMMARY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentApiKey}`,
      },
      body: JSON.stringify({
        document_text: documentText, // Assuming the API expects a field named 'document_text'
        // Add other parameters if needed by the API, e.g., summary_length: 'medium'
      }),
    });

    if (!response.ok) {
      // Log more details for debugging if possible
      const errorData = await response.text(); // or response.json() if the API returns JSON errors
      console.error('DeepSeek API request failed:', response.status, errorData);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    // Adjust this based on the actual API response structure
    // For example, if the summary is in data.summary or data.choices[0].text
    if (data && data.summary) {
      return data.summary;
    } else {
      console.error('Unexpected API response structure:', data);
      throw new Error('Failed to parse summary from API response.');
    }

  } catch (error) {
    console.error('Error calling DeepSeek summary API:', error);
    // Re-throw the error so the caller can handle it, or return a specific error object/value
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
