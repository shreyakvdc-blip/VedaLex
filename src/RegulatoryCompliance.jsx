import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ShieldCheck,
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  CircleHelp,
  ArrowRight,
  Factory,
  Tag,
  FlaskConical,
  ClipboardCheck,
} from "lucide-react";

import "./GuidancePages.css";

function RegulatoryCompliance({ onBack, result }) {
  const productName = result?.productName || "Your product";
  const category =
    result?.category?.title || "Product category not specified";
  const ingredients = result?.ingredients || "Not specified";
  const purpose = result?.purpose || "Not specified";

  const [manufacturing, setManufacturing] = useState("");
  const [labelling, setLabelling] = useState("");
  const [claims, setClaims] = useState("");
  const [quality, setQuality] = useState("");
  const [commercial, setCommercial] = useState(
    result?.answers?.commercialUse === "yes" ? "Yes" : ""
  );
  const [checked, setChecked] = useState(false);

  const categoryType = useMemo(() => {
    const value = category.toLowerCase();

    if (value.includes("food") || value.includes("aahar")) {
      return "food";
    }

    if (value.includes("cosmetic")) {
      return "cosmetic";
    }

    if (value.includes("phytopharmaceutical")) {
      return "phytopharmaceutical";
    }

    return "medicine";
  }, [category]);

  const pathway = {
    medicine: {
      title: "Ayurvedic medicine compliance pathway",
      authority: "Ministry of AYUSH / applicable drug regulatory framework",
      checks: [
        "Confirm the applicable Ayurvedic drug category",
        "Verify manufacturing and licensing requirements",
        "Check ingredients and applicable quality standards",
        "Review labelling and permitted product claims",
        "Maintain required quality and safety documentation",
      ],
    },

    food: {
      title: "Ayurveda-Aahar / food compliance pathway",
      authority: "FSSAI / applicable food regulatory framework",
      checks: [
        "Confirm the applicable food category",
        "Verify ingredient and food-standard requirements",
        "Check packaging and mandatory labelling",
        "Review health, nutrition and other claims",
        "Maintain required food safety documentation",
      ],
    },

    cosmetic: {
      title: "Cosmetic compliance pathway",
      authority: "Applicable Indian cosmetic regulatory framework",
      checks: [
        "Confirm that the product qualifies as a cosmetic",
        "Verify ingredient and safety requirements",
        "Check manufacturing requirements",
        "Review packaging and labelling",
        "Ensure product claims remain appropriate for a cosmetic",
      ],
    },

    phytopharmaceutical: {
      title: "Phytopharmaceutical compliance pathway",
      authority: "CDSCO / applicable drug regulatory framework",
      checks: [
        "Confirm phytopharmaceutical classification",
        "Verify applicable evidence and quality requirements",
        "Review safety and efficacy documentation",
        "Check manufacturing and regulatory requirements",
        "Review permitted labelling and claims",
      ],
    },
  };

  const selectedPathway = pathway[categoryType];

  const resultStatus = useMemo(() => {
    if (!checked) return null;

    const answers = [
      manufacturing,
      labelling,
      claims,
      quality,
      commercial,
    ];

    const yesCount = answers.filter((x) => x === "Yes").length;
    const unsureCount = answers.filter((x) => x === "Unsure").length;
    const emptyCount = answers.filter((x) => !x).length;

    if (unsureCount > 0 || emptyCount > 0) {
      return {
        type: "medium",
        title: "Compliance verification required",
        text:
          "Some regulatory information is incomplete or uncertain. Complete the relevant checks and verify them against current official requirements before commercialisation.",
      };
    }

    if (yesCount === answers.length) {
      return {
        type: "high",
        title: "Preliminary compliance checks captured",
        text:
          "You have indicated that the key compliance areas have been addressed. VedaLex should still verify the applicable current regulations and supporting documents before commercialisation.",
      };
    }

    return {
      type: "medium",
      title: "Additional compliance review recommended",
      text:
        "Some compliance areas require further verification before the product should be treated as ready for commercialisation.",
    };
  }, [
    checked,
    manufacturing,
    labelling,
    claims,
    quality,
    commercial,
  ]);

  return (
    <div className="guidance-page">

      {/* HEADER */}
      <div className="guidance-header">

        <button className="guidance-back-btn" onClick={onBack}>
          <ArrowLeft size={18} />
          Back
        </button>

        <div>
          <div className="guidance-eyebrow">
            <ShieldCheck size={16} />
            COMPLY · REGULATORY GUIDANCE
          </div>

          <h1>Regulatory Compliance</h1>

          <p>
            Identify the regulatory checks your Ayurveda product may need
            before moving toward commercialisation.
          </p>
        </div>

      </div>

      {/* PRODUCT CONTEXT */}
      <section className="guidance-context-card">

        <div className="context-card-header">

          <div className="context-icon">
            <FlaskConical size={22} />
          </div>

          <div>
            <span className="context-label">
              CLASSIFICATION CONTEXT
            </span>

            <h2>{productName}</h2>
          </div>

        </div>

        <div className="context-grid">

          <div>
            <span>Product category</span>
            <strong>{category}</strong>
          </div>

          <div>
            <span>Purpose</span>
            <strong>{purpose}</strong>
          </div>

          <div className="context-wide">
            <span>Ingredients</span>
            <strong>{ingredients}</strong>
          </div>

        </div>

      </section>

      {/* PATHWAY */}
      <section className="guidance-info-card">

        <div className="info-icon">
          <ClipboardCheck size={22} />
        </div>

        <div>

          <h3>{selectedPathway.title}</h3>

          <p>
            <strong>Primary regulatory area:</strong>{" "}
            {selectedPathway.authority}
          </p>

          <p>
            VedaLex uses your product classification to focus the
            compliance checklist. This is a preliminary pathway and
            should be verified against current official regulations.
          </p>

        </div>

      </section>

      {/* CHECKLIST */}
      <section className="guidance-section">

        <div className="section-heading">

          <div>
            <div className="guidance-eyebrow">
              COMPLIANCE CHECKLIST
            </div>

            <h2>Complete the preliminary checks</h2>
          </div>

          <span className="step-badge">
            STEP 2
          </span>

        </div>

        <div className="guidance-form-card">

          <ComplianceQuestion
            icon={<Factory size={18} />}
            title="Manufacturing / licensing requirements checked?"
            value={manufacturing}
            setValue={setManufacturing}
          />

          <ComplianceQuestion
            icon={<Tag size={18} />}
            title="Labelling and packaging requirements checked?"
            value={labelling}
            setValue={setLabelling}
          />

          <ComplianceQuestion
            icon={<FileCheck2 size={18} />}
            title="Product claims and advertising reviewed?"
            value={claims}
            setValue={setClaims}
          />

          <ComplianceQuestion
            icon={<FlaskConical size={18} />}
            title="Quality, safety and supporting documentation checked?"
            value={quality}
            setValue={setQuality}
          />

          <ComplianceQuestion
            icon={<ArrowRight size={18} />}
            title="Is the product intended for commercialisation?"
            value={commercial}
            setValue={setCommercial}
          />

          <div className="regulatory-check-list">

            <h3>Category-specific checks</h3>

            {selectedPathway.checks.map((item, index) => (
              <div className="regulatory-check-item" key={index}>
                <CheckCircle2 size={17} />
                <span>{item}</span>
              </div>
            ))}

          </div>

          <button
            className="primary-guidance-btn"
            onClick={() => setChecked(true)}
          >
            <ShieldCheck size={18} />
            Generate compliance assessment
            <ArrowRight size={18} />
          </button>

        </div>

      </section>

      {/* RESULT */}
      {resultStatus && (
        <section className="guidance-result">

          <div className={`result-banner ${resultStatus.type}`}>

            {resultStatus.type === "high" ? (
              <CheckCircle2 size={25} />
            ) : (
              <CircleHelp size={25} />
            )}

            <div>

              <span>PRELIMINARY ASSESSMENT</span>

              <h2>{resultStatus.title}</h2>

              <p>{resultStatus.text}</p>

            </div>

          </div>

          {/* STATUS */}
          <div className="result-card">

            <div className="result-card-title">
              <ClipboardCheck size={20} />
              Compliance verification status
            </div>

            <div className="verification-list">

              <VerificationRow
                label="Manufacturing / licensing"
                value={manufacturing || "Not checked"}
              />

              <VerificationRow
                label="Labelling / packaging"
                value={labelling || "Not checked"}
              />

              <VerificationRow
                label="Claims / advertising"
                value={claims || "Not checked"}
              />

              <VerificationRow
                label="Quality / safety documentation"
                value={quality || "Not checked"}
              />

              <VerificationRow
                label="Commercialisation"
                value={commercial || "Not specified"}
              />

            </div>

          </div>

          {/* CATEGORY CHECKLIST */}
          <div className="result-card">

            <div className="result-card-title">
              <FileCheck2 size={20} />
              Recommended regulatory checklist
            </div>

            <div className="regulatory-result-list">

              {selectedPathway.checks.map((item, index) => (
                <div key={index} className="regulatory-result-item">
                  <div className="check-number">
                    {index + 1}
                  </div>

                  <span>{item}</span>
                </div>
              ))}

            </div>

          </div>

          {/* NEXT ACTION */}
          <div className="result-action-card">

            <div className="result-action-icon">
              <ArrowRight size={22} />
            </div>

            <div>

              <span>RECOMMENDED NEXT STEP</span>

              <h3>
                Verify the applicable current regulations,
                documentation and product-specific requirements
                before treating this product as ready for
                commercialisation.
              </h3>

            </div>

          </div>

          {/* SOURCES */}
          <div className="result-card">

            <div className="result-card-title">
              <FileCheck2 size={20} />
              Trusted source areas
            </div>

            <div className="source-grid">

              <SourceItem
                title="Ministry of AYUSH"
                text="Ayurveda-related regulatory and policy information."
              />

              <SourceItem
                title="CDSCO"
                text="Applicable drug and pharmaceutical regulatory information."
              />

              <SourceItem
                title="FSSAI"
                text="Food and Ayurveda-Aahar regulatory information where applicable."
              />

              <SourceItem
                title="Official Indian legislation"
                text="Current laws, rules, notifications and amendments should be verified."
              />

            </div>

          </div>

          {/* DISCLAIMER */}
          <div className="guidance-disclaimer">

            <AlertTriangle size={19} />

            <p>
              <strong>Important:</strong> This is a preliminary
              compliance screening. It does not establish legal
              compliance, approval, licensing or permission to
              manufacture or sell a product. VedaLex should retrieve
              and cite current official sources before presenting
              final regulatory guidance.
            </p>

          </div>

        </section>
      )}

    </div>
  );
}


/* QUESTION */

function ComplianceQuestion({
  icon,
  title,
  value,
  setValue,
}) {
  return (
    <div className="guidance-question">

      <div className="question-content">

        <div className="question-icon">
          {icon}
        </div>

        <div>
          <h3>{title}</h3>

          <p>
            Select the option that best describes the current
            status of your product.
          </p>
        </div>

      </div>

      <div className="question-options">

        {["Yes", "No", "Unsure"].map((option) => (

          <button
            key={option}
            type="button"
            className={`question-option ${
              value === option ? "selected" : ""
            }`}
            onClick={() => setValue(option)}
          >

            {value === option && (
              <CheckCircle2 size={16} />
            )}

            {option}

          </button>

        ))}

      </div>

    </div>
  );
}


/* VERIFICATION ROW */

function VerificationRow({ label, value }) {
  return (
    <div className="verification-row">

      <span>{label}</span>

      <strong
        className={
          value === "Yes"
            ? "signal-positive"
            : value === "Unsure"
            ? "signal-warning"
            : ""
        }
      >
        {value}
      </strong>

    </div>
  );
}


/* SOURCE */

function SourceItem({ title, text }) {
  return (
    <div className="source-item">

      <CheckCircle2 size={18} />

      <div>
        <h4>{title}</h4>
        <p>{text}</p>
      </div>

    </div>
  );
}


export default RegulatoryCompliance;