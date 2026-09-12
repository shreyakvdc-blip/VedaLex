import { useState } from "react";
import {
  ArrowLeft,
  ShieldCheck,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Leaf
} from "lucide-react";

import "./GuidancePages.css";

function IPRGuidance({ onBack, result }) {
  const [ipType, setIpType] = useState("");
  const [innovation, setInnovation] = useState("");
  const [tkInvolved, setTkInvolved] = useState("");
  const [bioResource, setBioResource] = useState("");
  const [checked, setChecked] = useState(false);

  /* =========================
     CLASSIFICATION CONTEXT
  ========================== */

  const category = result?.category;
  const categoryTitle =
    typeof category === "object"
      ? category?.title || ""
      : category || "";

  const productName = result?.productName || "";
  const classifiedIngredients = result?.ingredients || "";

  const classificationTK =
    result?.answers?.classicalText === "yes";

  const classificationBio =
    result?.answers?.plant === "yes";

  /* =========================
     CHECK IPR PATHWAY
  ========================== */

  const handleCheck = () => {
    if (!ipType || !innovation || !tkInvolved) {
      alert("Please complete all fields before checking.");
      return;
    }

    setChecked(true);
  };

  /* =========================
     RECOMMENDATION ENGINE
  ========================== */

  const tkRelevant =
    tkInvolved === "Yes" ||
    tkInvolved === "Unsure" ||
    classificationTK;

  const bioRelevant =
    bioResource === "Yes" ||
    classificationBio;

  const getRecommendation = () => {
    if (ipType === "Patent") {
      if (tkRelevant) {
        return {
          title: "Patent route requires prior-art & TK verification",
          text:
            "A patent route may be explored, but Traditional Knowledge and prior-art concerns should be assessed before relying on patent protection. Novelty, inventive step, industrial applicability and applicable exclusions also require review.",
          level: "warning"
        };
      }

      return {
        title: "Patentability screening recommended",
        text:
          "A patent route may be relevant if the claimed invention satisfies applicable requirements such as novelty, inventive step and industrial applicability and is not excluded by law. VedaLex does not guarantee patentability.",
        level: "normal"
      };
    }

    if (ipType === "Trademark") {
      return {
        title: "Trademark protection may be relevant",
        text:
          "A distinctive product or business name, logo or other qualifying mark may be considered for trademark protection. A formal search and registrability assessment should be performed.",
        level: "normal"
      };
    }

    if (ipType === "GI") {
      return {
        title: "Check geographical linkage",
        text:
          "GI protection may be relevant where the product's qualities, reputation or characteristics are linked to a specific geographical origin. Eligibility must be assessed under the applicable GI framework.",
        level: "normal"
      };
    }

    if (ipType === "Design") {
      return {
        title: "Consider design protection",
        text:
          "Industrial design protection may be relevant to qualifying visual features or appearance of a product. The specific design should be assessed for eligibility before filing.",
        level: "normal"
      };
    }

    if (ipType === "Copyright") {
      return {
        title: "Copyright may protect original expression",
        text:
          "Copyright may be relevant to eligible original creative expression such as documentation, artwork, software or other protected works. It does not generally protect an underlying idea by itself.",
        level: "normal"
      };
    }

    return {
      title: "Confidentiality may be important",
      text:
        "Trade-secret protection depends heavily on maintaining confidentiality. Access controls, confidentiality agreements and appropriate internal safeguards may be relevant for confidential formulations, processes or business information.",
      level: "normal"
    };
  };

  const recommendation = getRecommendation();

  return (
    <div className="guidance-page">

      {/* =========================
          TOP BAR
      ========================== */}

      <div className="guidance-topbar">

        <button
          className="guidance-back"
          onClick={onBack}
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div className="guidance-brand">
          <img
            src="/vedalex-logo.png"
            alt="VedaLex"
          />
          <span>VedaLex</span>
        </div>

      </div>

      {/* =========================
          HERO
      ========================== */}

      <section className="guidance-hero">

        <span className="guidance-eyebrow">
          PROTECT
        </span>

        <h1>
          IPR & Patent Guidance
        </h1>

        <p>
          Explore suitable intellectual-property routes for your
          Ayurveda innovation. VedaLex helps connect your product,
          Traditional Knowledge and innovation characteristics to
          possible protection pathways.
        </p>

      </section>

      <main className="guidance-content">

        {/* =========================
            CLASSIFICATION CONTEXT
        ========================== */}

        {(productName || categoryTitle) && (

          <div
            className="guidance-form-card"
            style={{
              marginBottom: "24px",
              borderLeft: "4px solid #FAA51E"
            }}
          >

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "10px"
              }}
            >
              <Lightbulb
                size={20}
                style={{ color: "#FAA51E" }}
              />

              <strong>
                VedaLex Classification Context
              </strong>

            </div>

            {productName && (
              <p style={{ margin: "5px 0" }}>
                <strong>Product:</strong>{" "}
                {productName}
              </p>
            )}

            {categoryTitle && (
              <p style={{ margin: "5px 0" }}>
                <strong>Category:</strong>{" "}
                {categoryTitle}
              </p>
            )}

            {classifiedIngredients && (
              <p style={{ margin: "5px 0" }}>
                <strong>Ingredients:</strong>{" "}
                {classifiedIngredients}
              </p>
            )}

            {classificationTK && (
              <p style={{ margin: "8px 0 0", color: "#8A5A00" }}>
                ⚠ Traditional Knowledge was indicated during classification.
              </p>
            )}

            {classificationBio && (
              <p style={{ margin: "5px 0", color: "#2C633D" }}>
                ✓ Biological-resource involvement was indicated during classification.
              </p>
            )}

          </div>

        )}

        {/* =========================
            IPR ROUTES
        ========================== */}

        <div className="guidance-grid">

          <div className="guidance-card">

            <div className="guidance-card-icon">
              <FileText size={22} />
            </div>

            <h3>Patent</h3>

            <p>
              Assess novelty, inventive step, industrial
              applicability, exclusions, Traditional Knowledge,
              prior art and biological-resource relevance.
            </p>

          </div>

          <div className="guidance-card">

            <div className="guidance-card-icon">
              <ShieldCheck size={22} />
            </div>

            <h3>Trademark</h3>

            <p>
              Explore protection for a distinctive brand name,
              product identity, logo or other qualifying marks.
            </p>

          </div>

          <div className="guidance-card">

            <div className="guidance-card-icon">
              <CheckCircle2 size={22} />
            </div>

            <h3>Other IP Routes</h3>

            <p>
              Consider GI, copyright, industrial design,
              trade secret and plant-variety protection
              where applicable.
            </p>

          </div>

        </div>

        {/* =========================
            ASSESSMENT
        ========================== */}

        <section className="guidance-section">

          <h2>
            Preliminary IPR Assessment
          </h2>

          <p>
            Answer the questions below to generate a
            product-aware protection pathway.
          </p>

          {/* QUESTION 1 */}

          <div className="guidance-form-card">

            <label>
              1. What type of protection are you exploring?
            </label>

            <select
              value={ipType}
              onChange={(e) => {
                setIpType(e.target.value);
                setChecked(false);
              }}
            >

              <option value="">
                Select an IPR route
              </option>

              <option value="Patent">
                Patent
              </option>

              <option value="Trademark">
                Trademark
              </option>

              <option value="GI">
                Geographical Indication
              </option>

              <option value="Design">
                Industrial Design
              </option>

              <option value="Copyright">
                Copyright
              </option>

              <option value="Trade Secret">
                Trade Secret
              </option>

            </select>

          </div>

          {/* QUESTION 2 */}

          <div className="guidance-form-card">

            <label>
              2. Briefly describe your innovation
            </label>

            <textarea
              value={innovation}
              onChange={(e) => {
                setInnovation(e.target.value);
                setChecked(false);
              }}
              placeholder={
                productName
                  ? `Example: What is technically new about ${productName}?`
                  : "Example: A new herbal formulation using Ashwagandha..."
              }
              rows="4"
            />

          </div>

          {/* QUESTION 3 */}

          <div className="guidance-form-card">

            <label>
              3. Does the innovation involve Traditional Knowledge?
            </label>

            <div className="guidance-options">

              {["Yes", "No", "Unsure"].map((value) => (

                <button
                  key={value}
                  className={
                    tkInvolved === value
                      ? "selected"
                      : ""
                  }
                  onClick={() => {
                    setTkInvolved(value);
                    setChecked(false);
                  }}
                >
                  {value === "Unsure"
                    ? "Not Sure"
                    : value}
                </button>

              ))}

            </div>

            {classificationTK && (

              <p
                style={{
                  marginTop: "10px",
                  fontSize: "13px",
                  color: "#8A5A00"
                }}
              >
                ⚠ Your earlier classification indicated
                possible Traditional Knowledge involvement.
              </p>

            )}

          </div>

          {/* QUESTION 4 */}

          <div className="guidance-form-card">

            <label>
              4. Does the innovation use biological resources?
            </label>

            <div className="guidance-options">

              {["Yes", "No", "Unsure"].map((value) => (

                <button
                  key={value}
                  className={
                    bioResource === value
                      ? "selected"
                      : ""
                  }
                  onClick={() => {
                    setBioResource(value);
                    setChecked(false);
                  }}
                >
                  {value === "Unsure"
                    ? "Not Sure"
                    : value}
                </button>

              ))}

            </div>

            {classificationBio && (

              <p
                style={{
                  marginTop: "10px",
                  fontSize: "13px",
                  color: "#2C633D"
                }}
              >
                ✓ Your earlier classification indicated
                biological-resource involvement.
              </p>

            )}

          </div>

          {/* =========================
              CHECK BUTTON
          ========================== */}

          <button
            className="guidance-primary-button"
            onClick={handleCheck}
          >
            Check IPR Pathway →
          </button>

          {/* =========================
              RESULT
          ========================== */}

          {checked && (

            <div className="guidance-result">

              <div className="result-header">

                {recommendation.level === "warning" ? (
                  <AlertTriangle size={22} />
                ) : (
                  <CheckCircle2 size={22} />
                )}

                <div>

                  <strong>
                    Preliminary Protection Assessment
                  </strong>

                  <span>
                    VedaLex guidance — not a legal opinion
                  </span>

                </div>

              </div>

              <div className="result-body">

                <p>
                  <strong>Selected route:</strong>{" "}
                  {ipType}
                </p>

                <div
                  style={{
                    padding: "16px",
                    margin: "16px 0",
                    borderRadius: "12px",
                    background:
                      recommendation.level === "warning"
                        ? "#F9E7B5"
                        : "#EAF3EC"
                  }}
                >

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "flex-start"
                    }}
                  >

                    {recommendation.level === "warning" ? (
                      <AlertTriangle
                        size={20}
                        style={{
                          color: "#8A5A00",
                          flexShrink: 0
                        }}
                      />
                    ) : (
                      <CheckCircle2
                        size={20}
                        style={{
                          color: "#2C633D",
                          flexShrink: 0
                        }}
                      />
                    )}

                    <div>

                      <strong>
                        {recommendation.title}
                      </strong>

                      <p style={{ marginTop: "8px" }}>
                        {recommendation.text}
                      </p>

                    </div>

                  </div>

                </div>

                {/* PATENT CHECKS */}

                {ipType === "Patent" && (

                  <div>

                    <h4>
                      Patent screening areas
                    </h4>

                    <div
                      style={{
                        display: "grid",
                        gap: "9px"
                      }}
                    >

                      {[
                        "Novelty",
                        "Inventive step",
                        "Industrial applicability / utility",
                        "Applicable statutory exclusions",
                        "Traditional Knowledge / prior art",
                        "Biological-resource relevance"
                      ].map((item) => (

                        <div
                          key={item}
                          style={{
                            display: "flex",
                            gap: "8px",
                            alignItems: "center"
                          }}
                        >
                          <CheckCircle2
                            size={16}
                            style={{
                              color: "#2C633D"
                            }}
                          />

                          <span>
                            {item}
                          </span>

                        </div>

                      ))}

                    </div>

                  </div>

                )}

                {/* TK */}

                {tkRelevant && (

                  <div className="result-warning">

                    <Leaf size={20} />

                    <span>
                      Traditional Knowledge may affect the
                      protection analysis. Review relevant
                      Ayurvedic literature, prior-art sources
                      and appropriate Traditional Knowledge
                      resources before drawing conclusions.
                    </span>

                  </div>

                )}

                {/* BIO */}

                {bioRelevant && (

                  <div className="result-warning">

                    <ShieldCheck size={20} />

                    <span>
                      Biological-resource involvement was
                      indicated. Verify the source, use,
                      applicable biodiversity requirements
                      and any relevant access and
                      benefit-sharing obligations separately.
                    </span>

                  </div>

                )}

                {/* NEXT STEP */}

                <div
                  style={{
                    marginTop: "20px",
                    padding: "18px",
                    borderRadius: "12px",
                    background: "#173B2A",
                    color: "#FFFFFF"
                  }}
                >

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                      marginBottom: "8px"
                    }}
                  >

                    <ArrowRight size={19} />

                    <strong>
                      Recommended next step
                    </strong>

                  </div>

                  <p
                    style={{
                      margin: 0,
                      color: "#D6DED8"
                    }}
                  >
                    {ipType === "Patent"
                      ? "Complete a structured prior-art and patentability review using current official sources before considering filing."
                      : ipType === "Trademark"
                      ? "Conduct a formal trademark availability and registrability search."
                      : ipType === "GI"
                      ? "Verify whether the product satisfies the geographical-origin requirements and identify the appropriate GI pathway."
                      : ipType === "Design"
                      ? "Review the product's visual features against the applicable design-protection requirements."
                      : ipType === "Copyright"
                      ? "Identify the original creative work you want to protect and verify the applicable copyright requirements."
                      : "Identify the confidential information, establish confidentiality controls and verify the applicable protection strategy."}
                  </p>

                </div>

                {/* SOURCES */}

                <div
                  style={{
                    marginTop: "20px",
                    paddingTop: "16px",
                    borderTop: "1px solid rgba(23,59,42,0.15)"
                  }}
                >

                  <strong>
                    Trusted source areas to verify
                  </strong>

                  <ul>
                    <li>
                      Indian Patent Office / IP India
                    </li>
                    <li>
                      Ministry of AYUSH
                    </li>
                    <li>
                      TKDL / CSIR where relevant
                    </li>
                    <li>
                      National Biodiversity Authority where relevant
                    </li>
                    <li>
                      WIPO for international IP information
                    </li>
                  </ul>

                </div>

              </div>

            </div>

          )}

        </section>

        {/* =========================
            DISCLAIMER
        ========================== */}

        <div className="guidance-warning">

          <AlertTriangle size={21} />

          <div>

            <strong>
              Important
            </strong>

            <p>
              VedaLex provides preliminary guidance and does
              not guarantee patentability, registration,
              approval or legal outcomes. Legal and regulatory
              conclusions should be verified against current
              official sources and, where necessary, with a
              qualified professional.
            </p>

          </div>

        </div>

      </main>

    </div>
  );
}

export default IPRGuidance;