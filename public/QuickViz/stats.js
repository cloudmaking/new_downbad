// Function to analyze text and extract statistics
function analyzeText(text) {
  // Split text into paragraphs
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
  const paragraphCount = paragraphs.length;

  // Remove punctuation and convert to lowercase
  const cleanedText = text
    .replace(/[^\w\s]|_/g, "")
    .replace(/\s+/g, " ")
    .toLowerCase();

  // Split into words
  const words = cleanedText.split(" ").filter((word) => word.length > 0);

  // Word count
  const wordCount = words.length;

  // Unique words
  const uniqueWordsSet = new Set(words);
  const uniqueWords = uniqueWordsSet.size;

  // Vocabulary Richness (Type-Token Ratio)
  const vocabularyRichness = uniqueWords / wordCount;

  // Average word length
  const totalWordLength = words.reduce((acc, word) => acc + word.length, 0);
  const averageWordLength = wordCount > 0 ? totalWordLength / wordCount : 0;

  // Letter count
  const letters = cleanedText.replace(/\s+/g, "").split("");
  const letterCount = letters.length;

  // Sentence count (approximation)
  const sentences = text
    .split(/[.!?]+/)
    .filter((sentence) => sentence.trim().length > 0);
  const sentenceCount = sentences.length;

  // Average sentence length
  const averageSentenceLength =
    sentenceCount > 0 ? wordCount / sentenceCount : 0;

  // Word frequency
  const wordFrequency = {};
  words.forEach((word) => {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  });

  // Letter frequency
  const letterFrequency = {};
  letters.forEach((letter) => {
    letterFrequency[letter] = (letterFrequency[letter] || 0) + 1;
  });

  // Bigram frequency
  const bigrams = [];
  for (let i = 0; i < words.length - 1; i++) {
    bigrams.push(`${words[i]} ${words[i + 1]}`);
  }
  const bigramFrequency = {};
  bigrams.forEach((bigram) => {
    bigramFrequency[bigram] = (bigramFrequency[bigram] || 0) + 1;
  });

  // Sort word frequency
  const sortedWordFrequency = Object.entries(wordFrequency).sort(
    (a, b) => b[1] - a[1]
  );

  // Sort bigram frequency
  const sortedBigramFrequency = Object.entries(bigramFrequency).sort(
    (a, b) => b[1] - a[1]
  );

  // Sort letter frequency
  const sortedLetterFrequency = Object.entries(letterFrequency).sort(
    (a, b) => b[1] - a[1]
  );

  // Most frequent words
  const mostFrequentWords = sortedWordFrequency.map((item) => item[0]);

  // Readability (Flesch-Kincaid)
  const readability = calculateFleschKincaid(text);

  // Sentiment Analysis (simple positive/negative words count)
  const sentimentScore = analyzeSentiment(words);

  // Determine sentiment category
  let sentiment = "Neutral";
  if (sentimentScore > 5) {
    sentiment = "Positive";
  } else if (sentimentScore < -5) {
    sentiment = "Negative";
  }

  // Top 10 Words
  const topWords = sortedWordFrequency.slice(0, 10);

  // Top 10 Bigrams
  const topBigrams = sortedBigramFrequency.slice(0, 10);

  // Top 10 Letters
  const topLetters = sortedLetterFrequency.slice(0, 10);

  // Vocabulary Diversity Metrics
  const hapaxLegomena = sortedWordFrequency.filter(
    (word) => word[1] === 1
  ).length;
  const disLegomena = sortedWordFrequency.filter(
    (word) => word[1] === 2
  ).length;

  // Keyword Density (percentage of top words)
  const keywordDensity =
    (topWords.reduce((acc, word) => acc + word[1], 0) / wordCount) * 100;

  // Parts of Speech (Simple Tagging)
  const posCounts = getPartsOfSpeech(words);

  // Named Entity Recognition (Basic Implementation)
  const namedEntities = getNamedEntities(text);

  return {
    wordCount,
    uniqueWords,
    vocabularyRichness,
    averageWordLength,
    letterCount,
    sentenceCount,
    averageSentenceLength,
    paragraphCount,
    wordFrequency: sortedWordFrequency,
    letterFrequency: sortedLetterFrequency,
    bigramFrequency: sortedBigramFrequency,
    mostFrequentWords,
    readability,
    sentimentScore,
    sentiment,
    topWords,
    topBigrams,
    topLetters,
    hapaxLegomena,
    disLegomena,
    keywordDensity,
    posCounts,
    namedEntities,
  };
}

// Function to calculate Flesch-Kincaid Readability Score
function calculateFleschKincaid(text) {
  const sentences = text
    .split(/[.!?]+/)
    .filter((sentence) => sentence.trim().length > 0);
  const words = text
    .replace(/[^\w\s]|_/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 0);
  const syllables = words.reduce((acc, word) => acc + countSyllables(word), 0);

  const sentenceCount = sentences.length || 1;
  const wordCount = words.length || 1;
  const syllableCount = syllables;

  const fkScore =
    206.835 -
    1.015 * (wordCount / sentenceCount) -
    84.6 * (syllableCount / wordCount);
  return fkScore;
}

// Simple syllable counter
function countSyllables(word) {
  word = word.toLowerCase();
  if (word.length <= 3) {
    return 1;
  }
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
  word = word.replace(/^y/, "");
  const syllables = word.match(/[aeiouy]{1,2}/g);
  return syllables ? syllables.length : 1;
}

// Simple sentiment analysis based on positive and negative word lists
function analyzeSentiment(words) {
  const positiveWords = [
    "good",
    "happy",
    "joy",
    "excellent",
    "fortunate",
    "correct",
    "superior",
    "positive",
    "fortunate",
    "delight",
    "success",
    "great",
    "amazing",
    "love",
    "wonderful",
    "fantastic",
    "pleasant",
    "beneficial",
    "fortunate",
    "marvelous",
    "brilliant",
    "amazing",
    "outstanding",
    "terrific",
  ];
  const negativeWords = [
    "bad",
    "sad",
    "pain",
    "terrible",
    "unfortunate",
    "wrong",
    "inferior",
    "negative",
    "awful",
    "failure",
    "poor",
    "horrible",
    "hate",
    "disappointing",
    "dreadful",
    "unpleasant",
    "harmful",
    "disastrous",
    "mediocre",
    "lousy",
    "weak",
    "awful",
    "worst",
  ];

  let score = 0;
  words.forEach((word) => {
    if (positiveWords.includes(word)) {
      score += 1;
    } else if (negativeWords.includes(word)) {
      score -= 1;
    }
  });
  return score;
}

// Function to get Parts of Speech counts (Simplistic Implementation)
function getPartsOfSpeech(words) {
  const posTags = {
    nouns: [
      "time",
      "year",
      "people",
      "way",
      "day",
      "man",
      "thing",
      "woman",
      "life",
      "child",
      "world",
      "school",
      "state",
      "family",
      "student",
      "group",
      "country",
      "problem",
      "hand",
      "part",
    ],
    verbs: [
      "be",
      "have",
      "do",
      "say",
      "get",
      "make",
      "go",
      "know",
      "take",
      "see",
      "come",
      "think",
      "look",
      "want",
      "give",
      "use",
      "find",
      "tell",
      "ask",
      "work",
    ],
    adjectives: [
      "good",
      "new",
      "first",
      "last",
      "long",
      "great",
      "little",
      "own",
      "other",
      "old",
      "right",
      "big",
      "high",
      "different",
      "small",
      "large",
      "next",
      "early",
      "young",
      "important",
    ],
    adverbs: [
      "very",
      "really",
      "just",
      "still",
      "even",
      "always",
      "never",
      "often",
      "probably",
      "perhaps",
      "quickly",
      "slowly",
      "silently",
      "loudly",
      "well",
      "badly",
      "happily",
      "sadly",
      "angrily",
      "easily",
    ],
  };

  const counts = {
    nouns: 0,
    verbs: 0,
    adjectives: 0,
    adverbs: 0,
    others: 0,
  };

  words.forEach((word) => {
    if (posTags.nouns.includes(word)) {
      counts.nouns += 1;
    } else if (posTags.verbs.includes(word)) {
      counts.verbs += 1;
    } else if (posTags.adjectives.includes(word)) {
      counts.adjectives += 1;
    } else if (posTags.adverbs.includes(word)) {
      counts.adverbs += 1;
    } else {
      counts.others += 1;
    }
  });

  return counts;
}

// Basic Named Entity Recognition (Simplistic Implementation)
function getNamedEntities(text) {
  // This is a rudimentary implementation and may not be accurate.
  // For more accurate NER, consider using a dedicated library or API.
  const entities = {
    persons: [],
    organizations: [],
    locations: [],
  };

  // Simple regex patterns (Not exhaustive)
  const personPattern = /\b([A-Z][a-z]+)\s([A-Z][a-z]+)\b/g;
  const orgPattern = /\b(?:Inc|Corp|LLC|Ltd|University|Institute|Company)\b/g;
  const locationPattern =
    /\b(?:New York|London|Paris|Germany|China|India|Tokyo|Sydney|Canada|Brazil)\b/g;

  let match;

  while ((match = personPattern.exec(text)) !== null) {
    entities.persons.push(match[0]);
  }

  while ((match = orgPattern.exec(text)) !== null) {
    entities.organizations.push(match[0]);
  }

  while ((match = locationPattern.exec(text)) !== null) {
    entities.locations.push(match[0]);
  }

  return entities;
}
