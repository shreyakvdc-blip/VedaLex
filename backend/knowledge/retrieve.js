const fs = require("fs");
const path = require("path");

const sources = require("./sources");

const chunksFile = path.join(__dirname, "chunks.json");

let chunks = [];

if (fs.existsSync(chunksFile)) {
  try {
    chunks = JSON.parse(
      fs.readFileSync(chunksFile, "utf8")
    );
  } catch (error) {
    console.error("❌ Could not read chunks.json:", error.message);
    chunks = [];
  }
}

console.log(`Loaded ${chunks.length} knowledge chunks.`);


// ==================================================
// HELPERS
// ==================================================

function normalizeText(text = "") {
  return String(text)
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}


function tokenize(text = "") {
  const stopWords = new Set([
    "the",
    "and",
    "for",
    "what",
    "which",
    "when",
    "where",
    "how",
    "can",
    "could",
    "would",
    "should",
    "does",
    "do",
    "did",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "this",
    "that",
    "these",
    "those",
    "with",
    "from",
    "into",
    "about",
    "have",
    "has",
    "had",
    "you",
    "your",
    "our",
    "their",
    "my",
    "me",
    "we",
    "they",
    "tell",
    "please",
    "give",
    "explain",
    "under",
    "over",
    "than",
    "then",
    "also",
    "any",
    "all",
    "not"
  ]);

  return normalizeText(text)
    .split(/\s+/)
    .map((word) =>
      word.replace(/[^\w-]/g, "")
    )
    .filter(
      (word) =>
        word.length >= 3 &&
        !stopWords.has(word)
    );
}


function getPhrases(words) {
  const phrases = [];

  for (let i = 0; i < words.length - 1; i++) {
    phrases.push(
      `${words[i]} ${words[i + 1]}`
    );
  }

  return phrases;
}


// ==================================================
// SOURCE METADATA
// ==================================================

function getSourceMetadata(sourceName) {
  if (!sourceName || !Array.isArray(sources)) {
    return null;
  }

  const normalizedName = normalizeText(
    sourceName
  );

  // First try title
  let match = sources.find(
    (source) =>
      normalizeText(source.title) ===
      normalizedName
  );

  if (match) {
    return match;
  }

  // Then try document filenames
  match = sources.find((source) => {
    if (!Array.isArray(source.documentFiles)) {
      return false;
    }

    return source.documentFiles.some(
      (file) =>
        normalizeText(file) === normalizedName ||
        normalizeText(path.basename(file)) ===
          normalizedName
    );
  });

  if (match) {
    return match;
  }

  // Partial filename/title match
  match = sources.find((source) => {
    const title = normalizeText(
      source.title
    );

    return (
      normalizedName.includes(title) ||
      title.includes(normalizedName)
    );
  });

  return match || null;
}


// ==================================================
// SOURCE RETRIEVAL
// ==================================================

function retrieveSources(
  query,
  jurisdiction = "India"
) {
  const normalizedQuery = normalizeText(query);

  const queryWords = tokenize(
    normalizedQuery
  );

  if (!Array.isArray(sources)) {
    return [];
  }

  const results = sources
    .filter((source) => {
      if (!jurisdiction) {
        return true;
      }

      return (
        !source.jurisdiction ||
        source.jurisdiction === jurisdiction
      );
    })
    .map((source) => {
      let score = 0;

      const searchableText = normalizeText(
        [
          source.title || "",
          source.description || "",
          ...(source.topics || []),
          source.jurisdiction || "",
          source.type || ""
        ].join(" ")
      );

      const matchedTerms = [];

      for (const word of queryWords) {
        if (
          searchableText.includes(word)
        ) {
          score += 1;
          matchedTerms.push(word);
        }
      }

      // Give extra weight to important legal terms
      const importantTerms = [
        "patent",
        "trademark",
        "copyright",
        "design",
        "geographical",
        "indication",
        "biodiversity",
        "biological",
        "traditional",
        "knowledge",
        "ayurveda",
        "drug",
        "food",
        "fssai",
        "tkdl",
        "biodiversity",
        "commercial",
        "regulatory",
        "cosmetic"
      ];

      for (const term of importantTerms) {
        if (
          normalizedQuery.includes(term) &&
          searchableText.includes(term)
        ) {
          score += 2;
        }
      }

      return {
        ...source,
        score,
        matchedTerms
      };
    })
    .filter(
      (source) => source.score > 0
    )
    .sort(
      (a, b) => b.score - a.score
    )
    .slice(0, 5);

  return results;
}


// ==================================================
// DOCUMENT CHUNK RETRIEVAL
// ==================================================

function retrieveChunks(
  query,
  limit = 5
) {
  if (!chunks.length) {
    console.log(
      "No knowledge chunks loaded."
    );

    return [];
  }

  const normalizedQuery =
    normalizeText(query);

  const queryWords =
    tokenize(normalizedQuery);

  const queryPhrases =
    getPhrases(queryWords);

  console.log(
    "Retrieval query:",
    queryWords
  );

  const scoredChunks = chunks.map(
    (chunk) => {
      const text = normalizeText(
        chunk.text || ""
      );

      let score = 0;

      const matchedTerms = [];
      const matchedPhrases = [];

      // ------------------------------------------
      // Individual word matching
      // ------------------------------------------

      for (const word of queryWords) {
        if (text.includes(word)) {
          score += 1;
          matchedTerms.push(word);

          // Longer legal terms are more useful
          if (word.length >= 7) {
            score += 1;
          }
        }
      }

      // ------------------------------------------
      // Phrase matching
      // ------------------------------------------

      for (const phrase of queryPhrases) {
        if (text.includes(phrase)) {
          score += 3;
          matchedPhrases.push(phrase);
        }
      }

      // ------------------------------------------
      // Important legal concepts
      // ------------------------------------------

      const importantTerms = [
        "patent",
        "novelty",
        "inventive step",
        "industrial applicability",
        "traditional knowledge",
        "traditional knowledge digital library",
        "tkdl",
        "prior art",
        "biological resource",
        "biodiversity",
        "access and benefit sharing",
        "benefit sharing",
        "ayurveda",
        "ayurvedic medicine",
        "proprietary medicine",
        "patent medicine",
        "new drug",
        "phytopharmaceutical",
        "cosmetic",
        "fssai",
        "food",
        "trademark",
        "copyright",
        "design",
        "geographical indication",
        "plant variety"
      ];

      for (const term of importantTerms) {
        if (
          normalizedQuery.includes(term) &&
          text.includes(term)
        ) {
          score += 4;
        }
      }

      // ------------------------------------------
      // Source metadata
      // ------------------------------------------

      const sourceName =
        chunk.source ||
        chunk.document ||
        chunk.fileName ||
        "";

      const sourceMetadata =
        getSourceMetadata(sourceName);

      // If query terms also occur in source title
      if (sourceMetadata) {
        const sourceText =
          normalizeText(
            [
              sourceMetadata.title || "",
              sourceMetadata.description || "",
              ...(sourceMetadata.topics || [])
            ].join(" ")
          );

        for (const word of queryWords) {
          if (
            sourceText.includes(word)
          ) {
            score += 0.5;
          }
        }
      }

      return {
        ...chunk,
        score,
        matchedTerms: [
          ...new Set(matchedTerms)
        ],
        matchedPhrases: [
          ...new Set(matchedPhrases)
        ],
        sourceMetadata
      };
    }
  );

  const results = scoredChunks
    .filter(
      (chunk) => chunk.score > 0
    )
    .sort((a, b) => {
      // Higher score first
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      // Prefer chunks with more matched terms
      return (
        (b.matchedTerms?.length || 0) -
        (a.matchedTerms?.length || 0)
      );
    })
    .slice(0, limit);

  console.log(
    `Retrieved ${results.length} relevant chunks.`
  );

  if (results.length > 0) {
    console.log(
      "Top chunk:",
      results[0].source ||
        results[0].document ||
        "Unknown source",
      "Score:",
      results[0].score
    );
  }

  return results;
}


// ==================================================
// RETRIEVAL QUALITY
// ==================================================

function getRetrievalQuality(
  query,
  retrievedChunks = [],
  retrievedSources = []
) {
  const queryWords = [
    ...new Set(tokenize(query))
  ];

  if (!queryWords.length) {
    return {
      level: "low",
      score: 0,
      coverage: 0
    };
  }

  const matchedWords = new Set();

  for (const chunk of retrievedChunks) {
    for (const word of chunk.matchedTerms || []) {
      matchedWords.add(word);
    }
  }

  const coverage =
    matchedWords.size /
    queryWords.length;

  let score = Math.round(
    coverage * 100
  );

  // Source support improves retrieval confidence
  if (
    retrievedSources.length > 0
  ) {
    score += 10;
  }

  // Chunk evidence improves retrieval confidence
  if (
    retrievedChunks.length >= 3
  ) {
    score += 10;
  }

  score = Math.min(
    100,
    Math.round(score)
  );

  let level = "low";

  if (score >= 70) {
    level = "high";
  } else if (score >= 40) {
    level = "medium";
  }

  return {
    level,
    score,
    coverage: Math.round(
      coverage * 100
    )
  };
}


// ==================================================
// EXPORTS
// ==================================================

module.exports = {
  retrieveSources,
  retrieveChunks,
  getRetrievalQuality,
  getSourceMetadata
};