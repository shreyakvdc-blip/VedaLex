import { useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Search,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Leaf,
  FileSearch
} from "lucide-react";

import "./GuidancePages.css";

function TraditionalKnowledge({ onBack, result }) {
  const classificationTK =
    result?.answers?.classicalText === "yes";

  const productName = result?.productName || "";
  const category =
    typeof result?.category === "object"
      ? result?.category?.title || ""
      : result?.category || "";
  const ingredients = result?.ingredients || "";
  const purpose = result?.purpose || "";

  const [classical, setClassical] = useState(
    classificationTK ? "Yes" : ""
  );
  const [source, setSource] = useState("");
  const [documented, setDocumented] = useState("");
  const [checked, setChecked] = useState(false);

  const handleCheck = () => {
    if (!classical || !source || !documented) {
      alert("Please complete all fields before checking.");
      return;
    }

    setChecked(true);
  };

  const getAssessment = () => {
    if (classical === "Yes" && documented === "Yes") {
      return {
        title: "High-priority Traditional Knowledge verification",
        text:
          "Your answers indicate that the innovation is based on Traditional Knowledge and that the knowledge has already been documented or publicly disclosed. Prior-art verification should be performed before relying on novelty or other IPR claims.",
        warning: true
      };
    }

    if (classical === "Yes" && documented === "Unsure") {
      return {
        title: "Traditional Knowledge verification required",
        text:
          "Traditional Knowledge appears relevant, but its documentation status is uncertain. Relevant Ayurvedic literature and appropriate Traditional Knowledge or prior-art resources should be checked.",
        warning: true
      };
    }

    if (classical === "Yes") {
      return {
        title: "Traditional Knowledge may be relevant",
        text:
          "The innovation appears to involve Traditional Knowledge. The source and historical/public documentation should be verified before making an IPR conclusion.",
        warning: true
      };
    }

    if (classical === "Unsure") {
      return {
        title: "Traditional Knowledge status is uncertain",
        text:
          "Further verification is required to determine whether the formulation, process or use is already present in traditional Ayurvedic knowledge or other prior-art sources.",
        warning: true
      };
    }

    return {
      title: "No Traditional Knowledge involvement indicated",
      text:
        "You have indicated that the innovation is not based on Traditional Knowledge. Independent prior-art verification may still be appropriate before making an IPR decision.",
      warning: false
    };
  };

  const assessment = getAssessment();

  return (
    <div className="guidance-page">

      {/* TOP BAR */}
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

      {/* HERO */}
      <section className="guidance-hero">

        <span className="guidance-eyebrow">
          CHECK
        </span>

        <h1>
          Traditional Knowledge
        </h1>

        <p>
          Identify possible Traditional Knowledge involvement,
          assess prior-art relevance and understand what should
          be verified before making an IPR decision.
        </p>

      </section>

      <main className="guidance-content">

        {/* CLASSIFICATION CONTEXT */}

        {(productName || category) && (

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

              <Leaf
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

            {category && (
              <p style={{ margin: "5px 0" }}>
                <strong>Category:</strong>{" "}
                {category}
              </p>
            )}

            {purpose && (
              <p style={{ margin: "5px 0" }}>
                <strong>Purpose:</strong>{" "}
                {purpose}
              </p>
            )}

            {ingredients && (
              <p style={{ margin: "5px 0" }}>
                <strong>Ingredients:</strong>{" "}
                {ingredients}
              </p>
            )}

            {classificationTK && (
              <p
                style={{
                  margin: "10px 0 0",
                  color: "#8A5A00"
                }}
              >
                ⚠ Classification stage indicated possible
                Traditional Knowledge involvement.
              </p>
            )}

          </div>

        )}

        {/* INFO CARDS */}

        <div className="guidance-grid">

          <div className="guidance-card">

            <div className="guidance-card-icon">
              <BookOpen size={22} />
            </div>

            <h3>
              Classical Sources
            </h3>

            <p>
              Check whether the formulation, preparation,
              process or use is described in recognised
              traditional Ayurvedic literature.
            </p>

          </div>

          <div className="guidance-card">

            <div className="guidance-card-icon">
              <Search size={22} />
            </div>

            <h3>
              Prior-Art Verification
            </h3>

            <p>
              Existing Traditional Knowledge may be relevant
              when assessing whether an innovation is genuinely
              new.
            </p>

          </div>

          <div className="guidance-card">

            <div className="guidance-card-icon">
              <ShieldCheck size={22} />
            </div>

            <h3>
              TK Documentation
            </h3>

            <p>
              Record the source, community or literature
              connection and supporting evidence before
              proceeding further.
            </p>

          </div>

        </div>

        {/* ASSESSMENT */}

        <section className="guidance-section">

          <h2>
            Traditional Knowledge Assessment
          </h2>

          <p>
            Answer these questions to generate a preliminary
            TK verification pathway.
          </p>

          {/* QUESTION 1 */}

          <div className="guidance-form-card">

            <label>
              1. Is the formulation, process or use based on
              traditional Ayurvedic knowledge?
            </label>

            <div className="guidance-options">

              {["Yes", "No", "Unsure"].map((value) => (

                <button
                  key={value}
                  className={
                    classical === value
                      ? "selected"
                      : ""
                  }
                  onClick={() => {
                    setClassical(value);
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
                ⚠ This answer is pre-informed by your
                earlier classification stage.
              </p>
            )}

          </div>

          {/* QUESTION 2 */}

          <div className="guidance-form-card">

            <label>
              2. What is the source of the knowledge or formulation?
            </label>

            <textarea
              value={source}
              onChange={(e) => {
                setSource(e.target.value);
                setChecked(false);
              }}
              placeholder="Example: Charaka Samhita, Sushruta Samhita, classical Ayurvedic text, documented traditional practice, research publication..."
              rows="4"
            />

          </div>

          {/* QUESTION 3 */}

          <div className="guidance-form-card">

            <label>
              3. Has this knowledge already been documented
              or publicly disclosed?
            </label>

            <div className="guidance-options">

              {["Yes", "No", "Unsure"].map((value) => (

                <button
                  key={value}
                  className={
                    documented === value
                      ? "selected"
                      : ""
                  }
                  onClick={() => {
                    setDocumented(value);
                    setChecked(false);
                  }}
                >
                  {value === "Unsure"
                    ? "Not Sure"
                    : value}
                </button>

              ))}

            </div>

          </div>

          {/* CHECK BUTTON */}

          <button
            className="guidance-primary-button"
            onClick={handleCheck}
          >
            Check Traditional Knowledge Pathway →
          </button>

          {/* RESULT */}

          {checked && (

            <div className="guidance-result">

              <div className="result-header">

                {assessment.warning ? (
                  <AlertTriangle size={22} />
                ) : (
                  <CheckCircle2 size={22} />
                )}

                <div>

                  <strong>
                    Preliminary TK Assessment
                  </strong>

                  <span>
                    Verification required before relying
                    on this result
                  </span>

                </div>

              </div>

              <div className="result-body">

                {/* MAIN ASSESSMENT */}

                <div
                  style={{
                    padding: "16px",
                    marginBottom: "18px",
                    borderRadius: "12px",
                    background: assessment.warning
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

                    {assessment.warning ? (
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
                        {assessment.title}
                      </strong>

                      <p style={{ marginTop: "8px" }}>
                        {assessment.text}
                      </p>

                    </div>

                  </div>

                </div>

                {/* SOURCE */}

                <p>
                  <strong>
                    Source provided:
                  </strong>{" "}
                  {source}
                </p>

                {/* DOCUMENTATION */}

                {documented === "Yes" && (

                  <p>
                    <strong>
                      Documentation status:
                    </strong>{" "}
                    The knowledge has been identified as
                    documented or publicly disclosed.
                    Prior-art verification is therefore
                    particularly important.
                  </p>

                )}

                {documented === "No" && (

                  <p>
                    <strong>
                      Documentation status:
                    </strong>{" "}
                    No public documentation has been
                    identified by the user. This does not
                    establish that no earlier documentation
                    exists.
                  </p>

                )}

                {documented === "Unsure" && (

                  <p>
                    <strong>
                      Documentation status:
                    </strong>{" "}
                    Uncertain. An appropriate source search
                    should be performed before making an
                    IPR decision.
                  </p>

                )}

                {/* VERIFICATION CHECKLIST */}

                <div
                  style={{
                    marginTop: "20px"
                  }}
                >

                  <h4>
                    VedaLex verification checklist
                  </h4>

                  <div
                    style={{
                      display: "grid",
                      gap: "10px"
                    }}
                  >

                    {[
                      "Identify the exact traditional formulation, process or use",
                      "Verify the cited classical or traditional source",
                      "Check relevant prior-art records",
                      "Assess whether the knowledge was publicly available earlier",
                      "Record source, jurisdiction and evidence",
                      "Do not conclude patentability without verified evidence"
                    ].map((item) => (

                      <div
                        key={item}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "8px"
                        }}
                      >

                        <CheckCircle2
                          size={16}
                          style={{
                            color: "#2C633D",
                            marginTop: "2px",
                            flexShrink: 0
                          }}
                        />

                        <span>
                          {item}
                        </span>

                      </div>

                    ))}

                  </div>

                </div>

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
                      alignItems: "center",
                      gap: "9px",
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
                    {classical === "Yes"
                      ? "Verify the traditional source and perform a prior-art / Traditional Knowledge search before relying on an IPR claim."
                      : classical === "Unsure"
                      ? "Determine whether the formulation or use appears in recognised traditional sources before making an IPR decision."
                      : "Perform an independent prior-art search and retain evidence supporting the origin and development of the innovation."}
                  </p>

                </div>

                {/* TRUSTED SOURCES */}

                <div
                  style={{
                    marginTop: "20px",
                    paddingTop: "16px",
                    borderTop:
                      "1px solid rgba(23,59,42,0.15)"
                  }}
                >

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "8px"
                    }}
                  >

                    <FileSearch size={18} />

                    <strong>
                      Trusted source areas to verify
                    </strong>

                  </div>

                  <ul>

                    <li>
                      TKDL / CSIR where relevant
                    </li>

                    <li>
                      Ministry of AYUSH
                    </li>

                    <li>
                      Indian Patent Office / IP India
                    </li>

                    <li>
                      WIPO Traditional Knowledge resources
                    </li>

                    <li>
                      Relevant official Ayurvedic literature
                    </li>

                  </ul>

                </div>

                {/* WARNING */}

                <div className="result-warning">

                  <AlertTriangle size={20} />

                  <span>
                    This assessment does not establish the
                    legal status, ownership or novelty of the
                    knowledge. VedaLex should retrieve and
                    cite verified sources before presenting a
                    final conclusion.
                  </span>

                </div>

              </div>

            </div>

          )}

        </section>

        {/* FUTURE RAG BOX */}

        <div className="guidance-info">

          <Search size={20} />

          <div>

            <strong>
              VedaLex source verification layer
            </strong>

            <p>
              In the production system, this workflow connects
              to trusted Traditional Knowledge and prior-art
              sources. Retrieved evidence can be shown with
              its source, jurisdiction, date and version so the
              user can verify the basis of the answer.
            </p>

          </div>

        </div>

        {/* DISCLAIMER */}

        <div className="guidance-warning">

          <AlertTriangle size={21} />

          <div>

            <strong>
              Important
            </strong>

            <p>
              Traditional Knowledge assessment can involve
              legal, cultural and biodiversity considerations.
              This screen provides preliminary guidance only
              and does not establish ownership, patentability
              or legal rights.
            </p>

          </div>

        </div>

      </main>

    </div>
  );
}

export default TraditionalKnowledge;