const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const {
  retrieveSources,
  retrieveChunks,
  getRetrievalQuality,
  getSourceMetadata,
} = require("./knowledge/retrieve");

const sources = require("./knowledge/sources");

const app = express();

const PORT = process.env.PORT || 5000;

// ============================================================
// MIDDLEWARE
// ============================================================

app.use(cors());
app.use(express.json());

// ============================================================
// BASIC SERVER TEST
// ============================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "VedaLex backend is running 🚀",
  });
});

// ============================================================
// GEMINI SETUP
// ============================================================

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("⚠️ GEMINI_API_KEY is missing from .env");
}

const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
    })
  : null;

// ============================================================
// RAG TEST ROUTE
// ============================================================

app.get("/api/test-rag", (req, res) => {
  try {
    const query =
      req.query.q ||
      "Can an Ayurvedic invention be patented?";

    console.log("");
    console.log("==========================================");
    console.log("🧪 RAG TEST");
    console.log("==========================================");
    console.log("Query:", query);

    // --------------------------------------------------------
    // RETRIEVE DOCUMENT CHUNKS
    // --------------------------------------------------------

    const retrievedChunks = retrieveChunks(query, 5);

    // --------------------------------------------------------
    // RETRIEVE SOURCE REGISTRY
    // --------------------------------------------------------

    const retrievedSources = retrieveSources(
      query,
      "India"
    );

    // --------------------------------------------------------
    // CALCULATE RETRIEVAL QUALITY
    // IMPORTANT: PASS QUERY + CHUNKS + SOURCES
    // --------------------------------------------------------

    const quality = getRetrievalQuality(
      query,
      retrievedChunks,
      retrievedSources
    );

    console.log(
      "📚 Retrieved chunks:",
      retrievedChunks.length
    );

    console.log(
      "📑 Retrieved sources:",
      retrievedSources.length
    );

    console.log(
      "🎯 Retrieval quality:",
      quality.level
    );

    console.log(
      "📊 Retrieval score:",
      quality.score
    );

    console.log(
      "📈 Coverage:",
      quality.coverage
    );

    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

    res.json({
      success: true,

      query,

      retrievalQuality: quality,

      chunks: retrievedChunks.map(
        (chunk) => ({
          id: chunk.id,

          source: chunk.source,

          score: chunk.score,

          coverage: chunk.coverage,

          matchedTerms:
            chunk.matchedTerms || [],

          matchedPhrases:
            chunk.matchedPhrases || [],

          sourceMetadata:
            chunk.sourceMetadata || null,

          text: chunk.text,
        })
      ),

      sources: retrievedSources,

      sourceRegistryCount:
        sources.length,
    });

  } catch (error) {
    console.error(
      "❌ RAG test failed:",
      error
    );

    res.status(500).json({
      success: false,

      error:
        error.message,
    });
  }
});

// ============================================================
// BUILD DOCUMENT CONTEXT
// ============================================================

function buildDocumentContext(
  retrievedChunks
) {
  if (!retrievedChunks.length) {
    return "NO PRIMARY DOCUMENT EVIDENCE WAS RETRIEVED.";
  }

  return retrievedChunks
    .map((chunk, index) => {
      const metadata =
        chunk.sourceMetadata;

      return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRIMARY EVIDENCE ${index + 1}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Document:
${chunk.source}

Document ID:
${chunk.id}

Retrieval score:
${chunk.score}

Query coverage:
${Math.round(
  (chunk.coverage || 0) * 100
)}%

Matched terms:
${(
  chunk.matchedTerms || []
).join(", ")}

Matched phrases:
${(
  chunk.matchedPhrases || []
).join(", ")}

Source authority:
${
  metadata?.authority ||
  "Not specified"
}

Source title:
${
  metadata?.title ||
  chunk.source
}

Official source:
${
  metadata?.officialSource ||
  "Not specified"
}

Evidence:
${chunk.text}
`;
    })
    .join("\n");
}

// ============================================================
// BUILD SOURCE REGISTRY CONTEXT
// ============================================================

function buildSourceContext(
  retrievedSources
) {
  if (!retrievedSources.length) {
    return "NO ADDITIONAL SOURCE REGISTRY MATCHES.";
  }

  return retrievedSources
    .map((source, index) => {
      return `
SOURCE REGISTRY ${index + 1}

ID:
${source.id}

Title:
${source.title}

Authority:
${source.authority}

Jurisdiction:
${source.jurisdiction}

Description:
${source.description}

Official source:
${source.officialSource}

Topics:
${(
  source.topics || []
).join(", ")}

Document files:
${(
  source.documentFiles || []
).join(", ")}

Matched terms:
${(
  source.matchedTerms || []
).join(", ")}
`;
    })
    .join("\n");
}

// ============================================================
// CHAT ROUTE
// ============================================================

app.post("/api/chat", async (req, res) => {
  try {
    const {
      message,
      jurisdiction = "India",
      language = "English",
      history = [],
    } = req.body;

    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (
      !message ||
      !String(message).trim()
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Please provide a message.",
      });
    }

    if (!ai) {
      return res.status(500).json({
        success: false,
        error:
          "Gemini API key is missing. Add GEMINI_API_KEY to the backend .env file.",
      });
    }

    const userMessage =
      String(message).trim();

    console.log("");
    console.log("==========================================");
    console.log("💬 VEDALEX CHAT");
    console.log("==========================================");
    console.log(
      "Question:",
      userMessage
    );
    console.log(
      "Jurisdiction:",
      jurisdiction
    );
    console.log(
      "Language:",
      language
    );

    // ========================================================
    // RAG RETRIEVAL
    // ========================================================

    const retrievedChunks =
      retrieveChunks(
        userMessage,
        5
      );

    const retrievedSources =
      retrieveSources(
        userMessage,
        jurisdiction
      );

    // --------------------------------------------------------
    // IMPORTANT FIX
    // PASS ALL REQUIRED ARGUMENTS
    // --------------------------------------------------------

    const retrievalQuality =
      getRetrievalQuality(
        userMessage,
        retrievedChunks,
        retrievedSources
      );

    console.log(
      "📚 Retrieved chunks:",
      retrievedChunks.length
    );

    console.log(
      "📑 Retrieved sources:",
      retrievedSources.length
    );

    console.log(
      "🎯 Retrieval quality:",
      retrievalQuality.level
    );

    console.log(
      "📊 Retrieval score:",
      retrievalQuality.score
    );

    console.log(
      "📈 Query coverage:",
      retrievalQuality.coverage
    );

    // ========================================================
    // CONTEXT
    // ========================================================

    const documentContext =
      buildDocumentContext(
        retrievedChunks
      );

    const sourceContext =
      buildSourceContext(
        retrievedSources
      );

    // ========================================================
    // CONVERSATION HISTORY
    // ========================================================

    let historyText = "";

    if (
      Array.isArray(history) &&
      history.length > 0
    ) {
      historyText =
        history
          .slice(-8)
          .map((item) => {
            const role =
              item.role ||
              "user";

            const content =
              item.content ||
              item.text ||
              "";

            return `${role.toUpperCase()}: ${content}`;
          })
          .join("\n");
    }

    // ========================================================
    // SYSTEM PROMPT
    // ========================================================

    const systemPrompt = `
You are VedaLex, a trusted AI assistant for Ayurveda
Intellectual Property, Traditional Knowledge,
Biodiversity / Access and Benefit Sharing (ABS),
product classification and regulatory guidance.

Your purpose is to help Ayurveda practitioners,
researchers, startups, MSMEs and innovators understand
possible legal, intellectual-property and regulatory
considerations.

IMPORTANT:

VedaLex provides informational guidance.

It is NOT a substitute for a qualified lawyer,
patent attorney, regulatory professional or government
authority.

Never guarantee:

- patent grant
- trademark registration
- regulatory approval
- legal compliance
- commercial permission
- ABS clearance
- registration approval


============================================================
VEDALEX WORKFLOW
============================================================

Follow this conceptual workflow:

CLASSIFY
→ CHECK
→ PROTECT
→ COMPLY
→ COMMERCIALISE


============================================================
JURISDICTION
============================================================

Current jurisdiction:

${jurisdiction}

Do NOT mix Indian law with another country's law.

If the user asks about another country,
clearly identify the destination country and explain
that its requirements must be checked separately.

If the destination country is not specified,
ask for it when it materially affects the answer.


============================================================
LANGUAGE
============================================================

Respond in:

${language}

Keep important legal and technical terms in English
when translation could make them ambiguous.


============================================================
PRIMARY EVIDENCE RULE
============================================================

The PRIMARY EVIDENCE section contains passages retrieved
from VedaLex's local trusted document collection.

Use these passages as the primary evidence for
legal and regulatory claims.

DO NOT invent information that is not supported by
the retrieved evidence.

If the retrieved evidence is insufficient, say clearly:

"VedaLex could not verify this point from the currently
retrieved source material."

Then explain what should be checked using an official
source or qualified professional.


============================================================
SOURCE REGISTRY RULE
============================================================

The SOURCE REGISTRY contains metadata about trusted
sources such as:

- Government of India
- IP India
- Ministry of Ayush
- National Biodiversity Authority
- FSSAI
- TKDL
- WIPO

Registry metadata can help identify where the user
should verify information.

However, registry metadata is NOT a substitute for
the actual legal text.

Do not treat a registry description as proof of a
specific legal requirement.


============================================================
TRADITIONAL KNOWLEDGE
============================================================

When Ayurveda classical texts or Traditional Knowledge
are relevant:

- identify the potential TK/prior-art issue
- mention TKDL where appropriate
- explain that documented traditional knowledge may
  affect novelty/prior-art analysis
- do not claim that a specific TKDL record was found
  unless the supplied evidence actually shows it


============================================================
PATENTS
============================================================

When discussing patents, consider where relevant:

- novelty
- inventive step
- industrial applicability / utility
- statutory exclusions
- Traditional Knowledge
- prior art
- biological resources

NEVER say:

"This invention will definitely get a patent."

Instead use language such as:

"This may require a patentability assessment."

or:

"The available evidence indicates that these factors
should be reviewed."


============================================================
IPR OPTIONS
============================================================

Where relevant, discuss:

- Patent
- Trademark
- Geographical Indication
- Copyright
- Industrial Design
- Trade Secret
- Plant Variety Protection

Do not recommend every category automatically.

Explain which route appears relevant and why.


============================================================
BIODIVERSITY / ABS
============================================================

When biological resources may be involved,
consider:

- whether a biological resource is involved
- source/location
- whether it is an Indian biological resource
- Traditional Knowledge involvement
- intended use
- commercial use
- applicable permissions
- Access and Benefit Sharing considerations
- relevant Indian authority/framework

Do not declare that a user definitely needs or does not
need a particular permission unless the retrieved evidence
supports that conclusion.


============================================================
PRODUCT REGULATION
============================================================

Product classification is important.

Possible categories include:

1. Classical Ayurvedic Medicine
2. Proprietary / Patent Medicine
3. New / Non-Classical Drug
4. Phytopharmaceutical
5. Ayurveda-Aahar / Food
6. Cosmetic

Regulatory requirements depend on the category.

Do not assume that every Ayurveda product is regulated
under exactly the same framework.


============================================================
CITATIONS
============================================================

When making claims based on retrieved evidence,
identify the relevant source naturally.

For example:

"According to the retrieved Patents Act material..."

or:

"VedaLex retrieved evidence from the Biological Diversity
document indicating..."

At the end of the answer, provide:

📚 Trusted Sources

List only sources actually relevant to the answer.


============================================================
ABSTENTION
============================================================

If evidence is weak or missing:

DO NOT hallucinate.

Say:

"⚠ VedaLex does not have sufficient retrieved evidence
to verify this point."

Then tell the user what official source or professional
they should consult.


============================================================
ANSWER FORMAT
============================================================

Prefer this structure when appropriate:

### VedaLex Guidance

Direct answer.

### ✓ What is relevant

Important verified points.

### ⚠ What needs verification

Uncertain or case-specific issues.

### 📚 Trusted sources

Relevant official sources.

### → Recommended next steps

Practical actions.

Keep the answer understandable to a practitioner,
researcher or startup founder.

Avoid unnecessary legal jargon.


============================================================
PRIMARY DOCUMENT EVIDENCE
============================================================

${documentContext}


============================================================
SOURCE REGISTRY
============================================================

${sourceContext}


============================================================
CONVERSATION HISTORY
============================================================

${historyText || "No previous conversation context."}


============================================================
USER QUESTION
============================================================

${userMessage}
`;

    // ========================================================
    // ABSTAIN EARLY WHEN THERE IS NO EVIDENCE
    // ========================================================

    if (
      retrievedChunks.length === 0 &&
      retrievedSources.length === 0
    ) {
      console.log(
        "⚠️ No relevant RAG evidence found."
      );

      return res.json({
        success: true,

        answer:
          `### VedaLex Guidance

⚠ VedaLex could not find sufficiently relevant evidence in its current trusted knowledge collection to answer this question reliably.

Please verify the matter using the relevant official government or regulatory source before relying on the answer.`,

        jurisdiction,

        language,

        sources: [],

        evidence: [],

        confidence: {
          level: "Low",

          score: 0,

          coverage: 0,

          reason:
            "No relevant primary document evidence or source registry match was retrieved.",
        },

        disclaimer:
          "VedaLex provides informational guidance and is not a substitute for qualified legal or regulatory advice.",
      });
    }

    // ========================================================
    // GEMINI REQUEST
    // ========================================================

    let response;

    try {
      response =
        await ai.models.generateContent({
          model:
            "gemini-3.5-flash-lite",

          contents:
            systemPrompt,
        });

    } catch (error) {
      console.error(
        "❌ Gemini request failed:",
        error.message
      );

      return res.status(500).json({
        success: false,

        error:
          "AI response generation failed.",

        details:
          error.message,
      });
    }

    // ========================================================
    // EXTRACT ANSWER
    // ========================================================

    const answer =
      response?.text ||
      "VedaLex could not generate a response.";

    // ========================================================
    // CONFIDENCE
    // ========================================================

    let confidenceLevel =
      retrievalQuality.level;

    if (
      retrievedChunks.length === 0 &&
      retrievedSources.length > 0
    ) {
      confidenceLevel = "Low";
    }

    let confidenceReason =
      "Based on retrieved evidence quality.";

    if (
      confidenceLevel === "High"
    ) {
      confidenceReason =
        "Strong primary document evidence was retrieved with good query coverage.";
    } else if (
      confidenceLevel === "Medium"
    ) {
      confidenceReason =
        "Relevant primary evidence was retrieved, but coverage is incomplete.";
    } else {
      confidenceReason =
        "Evidence is limited or requires further verification.";
    }

    // ========================================================
    // SOURCE RESPONSE OBJECTS
    // ========================================================

    const responseSources =
      retrievedSources.map(
        (source) => ({
          id:
            source.id,

          title:
            source.title,

          authority:
            source.authority,

          jurisdiction:
            source.jurisdiction,

          description:
            source.description,

          officialSource:
            source.officialSource,

          matchedTerms:
            source.matchedTerms || [],
        })
      );

    // ========================================================
    // EVIDENCE RESPONSE OBJECTS
    // ========================================================

    const responseEvidence =
      retrievedChunks.map(
        (chunk) => {
          const metadata =
            getSourceMetadata(
              chunk.source
            );

          return {
            id:
              chunk.id,

            source:
              chunk.source,

            title:
              metadata?.title ||
              chunk.source,

            authority:
              metadata?.authority ||
              null,

            officialSource:
              metadata?.officialSource ||
              null,

            score:
              chunk.score,

            coverage:
              chunk.coverage,

            matchedTerms:
              chunk.matchedTerms || [],

            matchedPhrases:
              chunk.matchedPhrases || [],

            text:
              chunk.text,
          };
        }
      );

    // ========================================================
    // FINAL RESPONSE
    // ========================================================

    console.log(
      "✅ Gemini response generated."
    );

    console.log(
      "🎯 Confidence:",
      confidenceLevel
    );

    res.json({
      success: true,

      answer,

      jurisdiction,

      language,

      sources:
        responseSources,

      evidence:
        responseEvidence,

      confidence: {
        level:
          confidenceLevel,

        score:
          retrievalQuality.score || 0,

        coverage:
          retrievalQuality.coverage || 0,

        reason:
          confidenceReason,
      },

      disclaimer:
        "VedaLex provides informational guidance and is not a substitute for qualified legal, regulatory or intellectual-property advice.",
    });

  } catch (error) {
    console.error(
      "❌ Chat route error:",
      error
    );

    res.status(500).json({
      success: false,

      error:
        "Something went wrong while processing the VedaLex request.",

      details:
        error.message,
    });
  }
});

// ============================================================
// SERVER START
// ============================================================

app.listen(
  PORT,
  () => {
    console.log("");
    console.log("==========================================");
    console.log("🌿 VedaLex Backend");
    console.log("==========================================");

    console.log(
      `🚀 Server running at http://localhost:${PORT}`
    );

    console.log(
      `🧠 RAG endpoint: http://localhost:${PORT}/api/test-rag?q=Can%20an%20Ayurvedic%20invention%20be%20patented`
    );

    console.log(
      `💬 Chat endpoint: http://localhost:${PORT}/api/chat`
    );

    console.log("==========================================");
    console.log("");
  }
);