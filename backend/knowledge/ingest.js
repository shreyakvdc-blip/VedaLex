const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");

const documentsFolder = path.join(__dirname, "documents");
const outputFile = path.join(__dirname, "chunks.json");

const files = [
  "patent act.pdf",
  "biodiversity-act.pdf",
  "Approved-Ayush.pdf"
];

const CHUNK_SIZE = 1800;
const CHUNK_OVERLAP = 300;

async function ingestDocuments() {
  const allChunks = [];

  for (const fileName of files) {
    const filePath = path.join(documentsFolder, fileName);

    if (!fs.existsSync(filePath)) {
      console.log(`❌ File not found: ${fileName}`);
      continue;
    }

    console.log(`📖 Reading: ${fileName}`);

    const pdfBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(pdfBuffer);

    const text = data.text
      .replace(/\s+/g, " ")
      .trim();

    console.log(
      `   Extracted ${text.length.toLocaleString()} characters`
    );

    for (
      let start = 0;
      start < text.length;
      start += CHUNK_SIZE - CHUNK_OVERLAP
    ) {
      const chunkText = text.slice(
        start,
        start + CHUNK_SIZE
      );

      if (chunkText.trim().length < 100) {
        continue;
      }

      allChunks.push({
        id: allChunks.length + 1,
        source: fileName,
        text: chunkText.trim()
      });
    }
  }

  fs.writeFileSync(
    outputFile,
    JSON.stringify(allChunks, null, 2),
    "utf8"
  );

  console.log("");
  console.log("✅ RAG ingestion complete!");
  console.log(`📦 Total chunks: ${allChunks.length}`);
  console.log(`💾 Saved to: ${outputFile}`);
}

ingestDocuments().catch((error) => {
  console.error("❌ Ingestion failed:", error);
});