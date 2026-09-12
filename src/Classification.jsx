import { useState } from "react";
import "./Classification.css";

function Classification({ onBack, onContinue }) {
  const [selected, setSelected] = useState("");
  const [productName, setProductName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [purpose, setPurpose] = useState("");
  const [showResult, setShowResult] = useState(false);

  // New verification answers
  const [answers, setAnswers] = useState({
    classicalText: "",
    plant: "",
    commercialUse: ""
  });

  const categories = [
    {
      id: "classical",
      title: "Classical Ayurvedic Medicine",
      description:
        "Formulation described in recognised classical Ayurvedic texts.",
      icon: "📜"
    },
    {
      id: "proprietary",
      title: "Proprietary / Patent Medicine",
      description:
        "An Ayurvedic medicine based on a proprietary or modified formulation.",
      icon: "⚗️"
    },
    {
      id: "new",
      title: "New / Non-Classical Drug",
      description:
        "A medicinal product that does not correspond to an established classical formulation.",
      icon: "🧪"
    },
    {
      id: "phytopharma",
      title: "Phytopharmaceutical",
      description:
        "A pharmaceutical product developed from plant-based biological material.",
      icon: "🌿"
    },
    {
      id: "food",
      title: "Ayurveda-Aahar / Food",
      description:
        "An Ayurveda-based food or consumable product intended for dietary use.",
      icon: "🥣"
    },
    {
      id: "cosmetic",
      title: "Cosmetic",
      description:
        "A product intended primarily for cleansing, appearance or personal care.",
      icon: "✨"
    }
  ];

  const handleClassification = () => {
    if (!selected || !productName.trim()) {
      alert("Please enter your product name and select a category.");
      return;
    }

    if (
      !answers.classicalText ||
      !answers.plant ||
      !answers.commercialUse
    ) {
      alert("Please answer all three verification questions.");
      return;
    }

    setShowResult(true);
  };

  const selectedCategory = categories.find(
    (category) => category.id === selected
  );

  const handleAnswer = (question, value) => {
    setAnswers((prev) => ({
      ...prev,
      [question]: value
    }));

    setShowResult(false);
  };

  return (
    <div className="classification-page">

      {/* HEADER */}
      <header className="classification-header">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>

        <div className="classification-brand">
          <img src="/vedalex-logo.png" alt="VedaLex" />

          <div>
            <strong>VedaLex</strong>
            <span>Product Intelligence</span>
          </div>
        </div>

        <div className="classification-step">
          STEP 01 / 05
        </div>
      </header>

      <main className="classification-content">

        {/* INTRO */}
        <div className="classification-intro">
          <span className="classification-eyebrow">
            VEDALEX • STEP 01
          </span>

          <h1>What is your Ayurveda product?</h1>

          <p>
            Begin by identifying your product category. VedaLex uses
            this classification as the foundation for IPR, Traditional
            Knowledge, biodiversity and regulatory guidance.
          </p>
        </div>

        {/* WORKFLOW */}
        <div className="classification-progress">

          <div className="progress-active">
            <span>01</span>
            <strong>Classify</strong>
          </div>

          <div className="progress-line"></div>

          <div>
            <span>02</span>
            <strong>Check</strong>
          </div>

          <div className="progress-line"></div>

          <div>
            <span>03</span>
            <strong>Protect</strong>
          </div>

          <div className="progress-line"></div>

          <div>
            <span>04</span>
            <strong>Comply</strong>
          </div>

          <div className="progress-line"></div>

          <div>
            <span>05</span>
            <strong>Commercialise</strong>
          </div>

        </div>

        {/* PRODUCT DETAILS */}
        <section className="product-details">

          <div className="section-heading">
            <span>01</span>

            <div>
              <h2>Tell us about your product</h2>

              <p>
                This information helps VedaLex understand your product.
              </p>
            </div>
          </div>

          <div className="input-grid">

            <div className="input-group">
              <label>Product name</label>

              <input
                type="text"
                placeholder="e.g. Ashwagandha Herbal Formula"
                value={productName}
                onChange={(e) => {
                  setProductName(e.target.value);
                  setShowResult(false);
                }}
              />
            </div>

            <div className="input-group">
              <label>Main purpose</label>

              <input
                type="text"
                placeholder="e.g. wellness, therapeutic use, skincare"
                value={purpose}
                onChange={(e) => {
                  setPurpose(e.target.value);
                  setShowResult(false);
                }}
              />
            </div>

          </div>

          <div className="input-group full">

            <label>
              Key ingredients / biological resources
            </label>

            <textarea
              placeholder="Example: Ashwagandha, Turmeric, Neem..."
              value={ingredients}
              onChange={(e) => {
                setIngredients(e.target.value);
                setShowResult(false);
              }}
            />

          </div>

        </section>

        {/* CATEGORY */}
        <section className="category-section">

          <div className="section-heading">

            <span>02</span>

            <div>
              <h2>Select the closest product category</h2>

              <p>
                VedaLex will later verify this classification using
                trusted regulatory sources.
              </p>
            </div>

          </div>

          <div className="category-grid">

            {categories.map((category) => (

              <button
                key={category.id}
                className={`category-card ${
                  selected === category.id ? "selected" : ""
                }`}
                onClick={() => {
                  setSelected(category.id);
                  setShowResult(false);
                }}
              >

                <div className="category-icon">
                  {category.icon}
                </div>

                <div className="category-info">

                  <h3>{category.title}</h3>

                  <p>{category.description}</p>

                </div>

                <div className="category-radio">
                  {selected === category.id ? "✓" : ""}
                </div>

              </button>

            ))}

          </div>

        </section>

        {/* NEW VERIFICATION SECTION */}
        <section
          style={{
            marginTop: "40px",
            padding: "28px",
            borderRadius: "18px",
            background: "#F4F0E7",
            border: "1px solid rgba(23, 59, 42, 0.12)"
          }}
        >

          <div className="section-heading">

            <span>03</span>

            <div>
              <h2>Quick legal-risk verification</h2>

              <p>
                These questions help VedaLex identify Traditional
                Knowledge, biodiversity and commercial-use considerations.
              </p>
            </div>

          </div>

          {/* QUESTION 1 */}
          <div
            style={{
              marginTop: "25px",
              padding: "20px",
              background: "#ffffff",
              borderRadius: "14px"
            }}
          >

            <label
              style={{
                display: "block",
                fontWeight: "600",
                color: "#173B2A",
                marginBottom: "14px"
              }}
            >
              Is the formulation based on an Ayurvedic classical text
              or documented traditional knowledge?
            </label>

            <div style={{ display: "flex", gap: "12px" }}>

              <button
                type="button"
                onClick={() =>
                  handleAnswer("classicalText", "yes")
                }
                style={{
                  padding: "10px 22px",
                  borderRadius: "10px",
                  border:
                    answers.classicalText === "yes"
                      ? "2px solid #173B2A"
                      : "1px solid #ccc",
                  background:
                    answers.classicalText === "yes"
                      ? "#2C633D"
                      : "#fff",
                  color:
                    answers.classicalText === "yes"
                      ? "#fff"
                      : "#173B2A",
                  cursor: "pointer",
                  fontWeight: "600"
                }}
              >
                Yes
              </button>

              <button
                type="button"
                onClick={() =>
                  handleAnswer("classicalText", "no")
                }
                style={{
                  padding: "10px 22px",
                  borderRadius: "10px",
                  border:
                    answers.classicalText === "no"
                      ? "2px solid #173B2A"
                      : "1px solid #ccc",
                  background:
                    answers.classicalText === "no"
                      ? "#2C633D"
                      : "#fff",
                  color:
                    answers.classicalText === "no"
                      ? "#fff"
                      : "#173B2A",
                  cursor: "pointer",
                  fontWeight: "600"
                }}
              >
                No
              </button>

            </div>

          </div>

          {/* QUESTION 2 */}
          <div
            style={{
              marginTop: "16px",
              padding: "20px",
              background: "#ffffff",
              borderRadius: "14px"
            }}
          >

            <label
              style={{
                display: "block",
                fontWeight: "600",
                color: "#173B2A",
                marginBottom: "14px"
              }}
            >
              Does the product use plants, herbs, fungi,
              microorganisms, or other biological resources?
            </label>

            <div style={{ display: "flex", gap: "12px" }}>

              <button
                type="button"
                onClick={() =>
                  handleAnswer("plant", "yes")
                }
                style={{
                  padding: "10px 22px",
                  borderRadius: "10px",
                  border:
                    answers.plant === "yes"
                      ? "2px solid #173B2A"
                      : "1px solid #ccc",
                  background:
                    answers.plant === "yes"
                      ? "#2C633D"
                      : "#fff",
                  color:
                    answers.plant === "yes"
                      ? "#fff"
                      : "#173B2A",
                  cursor: "pointer",
                  fontWeight: "600"
                }}
              >
                Yes
              </button>

              <button
                type="button"
                onClick={() =>
                  handleAnswer("plant", "no")
                }
                style={{
                  padding: "10px 22px",
                  borderRadius: "10px",
                  border:
                    answers.plant === "no"
                      ? "2px solid #173B2A"
                      : "1px solid #ccc",
                  background:
                    answers.plant === "no"
                      ? "#2C633D"
                      : "#fff",
                  color:
                    answers.plant === "no"
                      ? "#fff"
                      : "#173B2A",
                  cursor: "pointer",
                  fontWeight: "600"
                }}
              >
                No
              </button>

            </div>

          </div>

          {/* QUESTION 3 */}
          <div
            style={{
              marginTop: "16px",
              padding: "20px",
              background: "#ffffff",
              borderRadius: "14px"
            }}
          >

            <label
              style={{
                display: "block",
                fontWeight: "600",
                color: "#173B2A",
                marginBottom: "14px"
              }}
            >
              Is the product intended for commercial use or sale?
            </label>

            <div style={{ display: "flex", gap: "12px" }}>

              <button
                type="button"
                onClick={() =>
                  handleAnswer("commercialUse", "yes")
                }
                style={{
                  padding: "10px 22px",
                  borderRadius: "10px",
                  border:
                    answers.commercialUse === "yes"
                      ? "2px solid #173B2A"
                      : "1px solid #ccc",
                  background:
                    answers.commercialUse === "yes"
                      ? "#2C633D"
                      : "#fff",
                  color:
                    answers.commercialUse === "yes"
                      ? "#fff"
                      : "#173B2A",
                  cursor: "pointer",
                  fontWeight: "600"
                }}
              >
                Yes
              </button>

              <button
                type="button"
                onClick={() =>
                  handleAnswer("commercialUse", "no")
                }
                style={{
                  padding: "10px 22px",
                  borderRadius: "10px",
                  border:
                    answers.commercialUse === "no"
                      ? "2px solid #173B2A"
                      : "1px solid #ccc",
                  background:
                    answers.commercialUse === "no"
                      ? "#2C633D"
                      : "#fff",
                  color:
                    answers.commercialUse === "no"
                      ? "#fff"
                      : "#173B2A",
                  cursor: "pointer",
                  fontWeight: "600"
                }}
              >
                No
              </button>

            </div>

          </div>

        </section>

        {/* CLASSIFY BUTTON */}
        {!showResult && (

          <button
            className="classify-button"
            onClick={handleClassification}
            style={{ marginTop: "30px" }}
          >
            Classify My Product →
          </button>

        )}

        {/* RESULT */}
        {showResult && selectedCategory && (

          <section className="classification-result">

            <div className="result-badge">
              ✓ INITIAL CLASSIFICATION
            </div>

            <h2>{selectedCategory.title}</h2>

            <p>
              Based on the information you provided, this is the
              selected preliminary category for your product.
            </p>

            <div className="result-details">

              <div>
                <span>Product</span>
                <strong>{productName}</strong>
              </div>

              <div>
                <span>Category</span>
                <strong>{selectedCategory.title}</strong>
              </div>

              <div>
                <span>Jurisdiction</span>
                <strong>India</strong>
              </div>

            </div>

            {/* VERIFICATION SUMMARY */}
            <div
              style={{
                marginTop: "20px",
                padding: "18px",
                borderRadius: "12px",
                background: "#F4F0E7"
              }}
            >

              <strong style={{ color: "#173B2A" }}>
                Verification signals captured
              </strong>

              <p style={{ margin: "10px 0 0" }}>
                Traditional Knowledge:{" "}
                <strong>
                  {answers.classicalText === "yes"
                    ? "Potentially relevant"
                    : "Not indicated"}
                </strong>
                <br />

                Biological resource:{" "}
                <strong>
                  {answers.plant === "yes"
                    ? "Potentially relevant"
                    : "Not indicated"}
                </strong>
                <br />

                Commercial use:{" "}
                <strong>
                  {answers.commercialUse === "yes"
                    ? "Yes"
                    : "No"}
                </strong>
              </p>

            </div>

            {/* WARNING */}
            <div className="result-warning">

              <span>ⓘ</span>

              <p>
                This is an initial classification for guidance.
                VedaLex will verify applicable laws and official
                regulatory sources before providing a final
                compliance recommendation.
              </p>

            </div>

            {/* CONTINUE */}
            <button
              className="continue-button"
              onClick={() =>
                onContinue({
                  category: selectedCategory,
                  categoryId: selectedCategory.id,
                  productName: productName.trim(),
                  ingredients: ingredients.trim(),
                  purpose: purpose.trim(),
                  jurisdiction: "India",
                  classificationStatus: "initial",

                  // Important: send verification answers
                  answers: {
                    classicalText: answers.classicalText,
                    plant: answers.plant,
                    commercialUse: answers.commercialUse
                  }
                })
              }
            >
              Continue to Check →
            </button>

          </section>

        )}

      </main>

    </div>
  );
}

export default Classification;