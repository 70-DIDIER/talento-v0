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

/**
 * Appelle l'API pour générer un quiz basé sur le résumé.
 * @param {string} summaryText - Le résumé utilisé pour générer le quiz
 * @param {number} numQuestions - Le nombre de questions souhaité
 * @param {string} difficulty - Le niveau de difficulté ("easy", "medium", "hard")
 * @returns {object} - L'objet renvoyé par l'API contenant le quiz
 */
export const generateQuizAPI = async (summaryText, numQuestions, difficulty) => {
  const currentApiKey = getDeepSeekApiKey();
  if (currentApiKey === 'YOUR_DEEPSEEK_API_KEY_HERE' || !currentApiKey) {
    console.error('DeepSeek API Key is not configured.');
    throw new Error('DeepSeek API Key is not configured.');
  }

  // Remplacez par l'URL de l'API selon votre configuration
  const QUIZ_API_URL = 'https://api.deepseek.com/v1/generate_quiz';

  try {
    const response = await fetch(QUIZ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentApiKey}`,
      },
      body: JSON.stringify({
        summary: summaryText,
        num_questions: numQuestions,
        difficulty: difficulty,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('DeepSeek quiz API request failed:', response.status, errorData);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling DeepSeek quiz API:', error);
    throw error;
  }
};

/**
 * Appelle l'API pour générer un résumé du document
 * @param {string} documentText - Le texte du document à résumer
 * @returns {string} - Le résumé généré par l'API
 */
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
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o',
        messages: [{
          role: 'user',
          content: documentText,
        }],
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('DeepSeek API request failed:', response.status, errorData);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    if (data && data.choices && data.choices[0]?.message?.content) {
      return data.choices[0].message.content;
    } else {
      throw new Error('Invalid API response structure.');
    }
  } catch (error) {
    console.error('Error calling DeepSeek summary API:', error);
    throw error;
  }
};

/**
 * Compresse un texte en supprimant les espaces superflus et en réduisant la longueur
 * @param {string} text - Le texte à compresser
 * @returns {string} - Le texte compressé
 */
const compressText = (text) => {
  return text
    .replace(/\s+/g, ' ') // Remplace les espaces multiples par un seul espace
    .replace(/\n+/g, ' ') // Remplace les retours à la ligne par un espace
    .trim();
};

/**
 * Divise un texte en morceaux plus petits pour respecter la limite de tokens
 * @param {string} text - Le texte à diviser
 * @param {number} maxTokens - Le nombre maximum de tokens par morceau
 * @returns {string[]} - Un tableau de morceaux de texte
 */
const splitTextIntoChunks = (text, maxTokens = 5000) => {
  // Une estimation très conservatrice : 1 token ≈ 2.5 caractères
  const charsPerChunk = maxTokens * 2.5;
  const chunks = [];
  
  // Compresser le texte avant de le diviser
  const compressedText = compressText(text);
  
  for (let i = 0; i < compressedText.length; i += charsPerChunk) {
    const chunk = compressedText.slice(i, i + charsPerChunk);
    // Vérification supplémentaire pour s'assurer que le chunk n'est pas trop grand
    if (chunk.length > 12500) { // 5000 tokens * 2.5 caractères
      console.warn('Chunk size exceeds safe limit, truncating...');
      chunks.push(chunk.slice(0, 12500));
    } else {
      chunks.push(chunk);
    }
  }
  
  return chunks;
};

/**
 * Vérifie si le texte contient des données binaires
 * @param {string} text - Le texte à vérifier
 * @returns {boolean} - True si le texte contient des données binaires
 */
const containsBinaryData = (text) => {
  // Vérifie la présence de caractères non imprimables ou de séquences binaires courantes
  const binaryPatterns = [
    /PK\x03\x04/, // Signature ZIP/DOCX
    /\x00/, // Caractères nuls
    /[\x00-\x08\x0B\x0C\x0E-\x1F]/, // Caractères de contrôle
    /%PDF/, // Signature PDF
  ];
  
  return binaryPatterns.some(pattern => pattern.test(text));
};

/**
 * Nettoie le texte en supprimant les données binaires et en gardant uniquement le texte lisible
 * @param {string} text - Le texte à nettoyer
 * @returns {string} - Le texte nettoyé
 */
const cleanText = (text) => {
  // Supprime les caractères non imprimables
  let cleaned = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
  
  // Supprime les séquences binaires courantes
  cleaned = cleaned.replace(/PK\x03\x04.*?(?=\w)/g, '');
  cleaned = cleaned.replace(/%PDF.*?(?=\w)/g, '');
  
  // Supprime les lignes qui ne contiennent que des caractères spéciaux
  cleaned = cleaned.split('\n')
    .filter(line => /[a-zA-ZÀ-ÿ]/.test(line)) // Garde uniquement les lignes avec des lettres
    .join('\n');
  
  return cleaned;
};

const removePdfMetaAndTech = (text) => {
  // Liste de mots-clés à filtrer
  const patterns = [
    /^\s*\/Author.*/i,
    /^\s*\/Creator.*/i,
    /^\s*\/CreationDate.*/i,
    /^\s*\/ModDate.*/i,
    /^\s*\/Producer.*/i,
    /^\s*\/Title.*/i,
    /^\s*\/Font.*/i,
    /^\s*\/Type.*/i,
    /^\s*\/Obj.*/i,
    /^\s*\/Root.*/i,
    /^\s*\/Pages.*/i,
    /^\s*\/Kids.*/i,
    /^\s*\/Count.*/i,
    /^\s*\/MediaBox.*/i,
    /^\s*\/Parent.*/i,
    /^\s*\/Resources.*/i,
    /^\s*\/Contents.*/i,
    /^\s*\/Filter.*/i,
    /^\s*\/Length.*/i,
    /^\s*\/Subtype.*/i,
    /^\s*\/BaseFont.*/i,
    /^\s*\/Encoding.*/i,
    /^\s*\/FontDescriptor.*/i,
    /^\s*\/FontFile.*/i,
    /^\s*\/Descent.*/i,
    /^\s*\/Ascent.*/i,
    /^\s*\/CapHeight.*/i,
    /^\s*\/Flags.*/i,
    /^\s*\/ItalicAngle.*/i,
    /^\s*\/StemV.*/i,
    /^\s*\/XHeight.*/i,
    /^\s*\/Widths.*/i,
    /^\s*\/ToUnicode.*/i,
    /^\s*\/FontBBox.*/i,
    /^\s*\/ExtGState.*/i,
    /^\s*\/ProcSet.*/i,
    /^\s*\/Annots.*/i,
    /^\s*\/StructTreeRoot.*/i,
    /^\s*\/MarkInfo.*/i,
    /^\s*\/Metadata.*/i,
    /^\s*\/PieceInfo.*/i,
    /^\s*\/LastModified.*/i,
    /^\s*\/Trapped.*/i,
    /^\s*\/ID.*/i,
    /^\s*\/Info.*/i,
    /^\s*\/Linearized.*/i,
    /^\s*\/Outlines.*/i,
    /^\s*\/PageLayout.*/i,
    /^\s*\/PageMode.*/i,
    /^\s*\/Perms.*/i,
    /^\s*\/ViewerPreferences.*/i,
    /^\s*\/Names.*/i,
    /^\s*\/Dests.*/i,
    /^\s*\/OpenAction.*/i,
    /^\s*\/AA.*/i,
    /^\s*\/AcroForm.*/i,
    /^\s*\/Threads.*/i,
    /^\s*\/FDF.*/i,
    /^\s*\/Type.*/i,
    /^\s*\/StructParents.*/i,
    /^\s*\/StructParent.*/i,
    /^\s*\/MarkInfo.*/i,
    /^\s*\/Lang.*/i,
    /^\s*\/SpiderInfo.*/i,
    /^\s*\/OutputIntents.*/i
  ];

  // Appliquer les patterns pour nettoyer le texte
  let cleanedText = text;
  patterns.forEach(pattern => {
    cleanedText = cleanedText.replace(pattern, '');
  });

  return cleanedText;
};