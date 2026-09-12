import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Leaf,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  CircleHelp,
  FileSearch,
  Building2,
  ArrowRight,
} from "lucide-react";

import "./GuidancePages.css";

function BiodiversityABS({ onBack, result }) {
  const productName = result?.productName || "Your product";
  const categoryTitle =
    result?.category?.title || "Product classification not available";
  const ingredients = result?.ingredients || "Not specified";
  const purpose = result?.purpose || "Not specified";

  const prefilledBio =
    result?.answers?.plant === "yes" ? "Yes" : "";

  const prefilledTK =
    result?.answers?.classicalText === "yes" ? "Yes" : "";

  const [biologicalResource, setBiologicalResource] =
    useState(prefilledBio);

  const [source, setSource] = useState("");
  const [indianResource, setIndianResource] = useState("");
  const [traditionalKnowledge, setTraditionalKnowledge] =
    useState(prefilledTK);
  const [commercialUse, setCommercialUse] = useState(
    result?.answers?.commercialUse === "yes" ? "Yes" : ""
  );
  const [permission, setPermission] = useState("");
  const [intendedUse, setIntendedUse] = useState("");
  const [checked, setChecked] = useState(false);

  const assessment = useMemo(() => {
    if (!checked) return null;

    const resource = biologicalResource === "Yes";
    const indian = indianResource === "Yes";
    const tk = traditionalKnowledge === "Yes";
    const commercial = commercialUse === "Yes";
    const permissionStatus = permission === "Yes";

    if (resource && indian && commercial) {
      return {
        type: "high",
        title: "Potential ABS relevance identified",
        text:
          "Your answers indicate that an Indian biological resource may be used for commercial purposes. Access and benefit-sharing requirements should be verified before proceeding.",
      };
    }

    if (resource && (indian || indianResource === "Unsure")) {
      return {
        type: "medium",
        title: "Biodiversity review recommended",
        text:
          "A biological resource is involved and its Indian origin or regulatory status may be relevant. Further source, access and use verification is recommended.",
      };
    }

    if (resource && indianResource === "No") {
      return {
        type: "low",
        title: "Indian ABS relevance not indicated",
        text:
          "You indicated that the biological resource is not from India. Destination-country and other applicable biodiversity requirements may still need review.",
      };
    }

    if (tk) {
      return {
        type: "medium",
        title: "Traditional Knowledge may affect the assessment",
        text:
          "Traditional Knowledge involvement has been indicated. Check the relationship between the knowledge, biological resource, source and intended commercial use.",
      };
    }

    if (permissionStatus) {
      return {
        type: "medium",
        title: "Permission indicated — verify evidence",
        text:
          "You indicated that permission/access approval exists. VedaLex should verify the authority, document, scope, date and applicable conditions before treating this as evidence of compliance.",
      };
    }

    return {
      type: "low",
      title: "No immediate ABS trigger indicated",
      text:
        "Based on the answers provided, no clear ABS trigger was identified. This is only a preliminary screening and does not establish that biodiversity obligations do not apply.",
    };
  }, [
    checked,
    biologicalResource,
    indianResource,
    traditionalKnowledge,
    commercialUse,
    permission,
  ]);

  const getNextStep = () => {
    if (!assessment) return null;

    if (
      biologicalResource === "Yes" &&
      (indianResource === "Yes" || indianResource === "Unsure")
    ) {
      return "Verify the biological-resource source, applicable access requirements and benefit-sharing pathway with the appropriate authority before commercial use.";
    }

    if (traditionalKnowledge === "Yes") {
      return "Document the Traditional Knowledge source and assess whether biodiversity/ABS and prior-art considerations are connected to the proposed use.";
    }

    return "Record the resource origin and supporting evidence, then verify the applicable biodiversity and product-regulatory requirements.";
  };

  return (
    <div className="guidance-page">
      <div className="guidance-header">
        <button className="guidance-back-btn" onClick={onBack}>
          <ArrowLeft size={18} />
          Back
        </button>

        <div>
          <div className="guidance-eyebrow">
            <Leaf size={16} />
            COMPLY · BIODIVERSITY & ABS
          </div>

          <h1>Biodiversity & Access and Benefit Sharing</h1>

          <p>
            Screen whether biological resources, Traditional Knowledge and
            intended commercial use may require additional biodiversity or
            ABS review.
          </p>
        </div>
      </div>

      {/* PRODUCT CONTEXT */}
      <section className="guidance-context-card">
        <div className="context-card-header">
          <div className="context-icon">
            <Leaf size={22} />
          </div>

          <div>
            <span className="context-label">CLASSIFICATION CONTEXT</span>
            <h2>{productName}</h2>
          </div>
        </div>

        <div className="context-grid">
          <div>
            <span>Product category</span>
            <strong>{categoryTitle}</strong>
          </div>

          <div>
            <span>Purpose</span>
            <strong>{purpose}</strong>
          </div>

          <div className="context-wide">
            <span>Ingredients / biological resources</span>
            <strong>{ingredients}</strong>
          </div>
        </div>
      </section>

      {/* WHY ABS */}
      <section className="guidance-info-card">
        <div className="info-icon">
          <ShieldCheck size={22} />
        </div>

        <div>
          <h3>Why does VedaLex check biodiversity?</h3>

          <p>
            Ayurveda products may involve plants, herbs, fungi,
            microorganisms or other biological resources. Their origin,
            Traditional Knowledge connection, intended use and commercial
            purpose can affect the compliance pathway.
          </p>

          <p>
            VedaLex performs a preliminary screening first and identifies
            what needs to be verified. It does not automatically determine
            legal applicability or grant permission.
          </p>
        </div>
      </section>

      {/* QUESTIONNAIRE */}
      <section className="guidance-section">
        <div className="section-heading">
          <div>
            <span className="guidance-eyebrow">ABS SCREENING</span>
            <h2>Tell us about the biological resource</h2>
          </div>

          <span className="step-badge">STEP 1</span>
        </div>

        <div className="guidance-form-card">

          <Question
            icon={<Leaf size={18} />}
            title="Does the product use a biological resource?"
            description="Examples may include plants, herbs, fungi, microorganisms or other biological material."
            value={biologicalResource}
            setValue={setBiologicalResource}
          />

          <Question
            icon={<MapPin size={18} />}
            title="Is the biological resource from India?"
            description="Consider where the resource was obtained or sourced. If you are unsure, select Unsure."
            value={indianResource}
            setValue={setIndianResource}
          />

          <div className="guidance-field">
            <label>
              <MapPin size={17} />
              Source / location of the resource
            </label>

            <input
              type="text"
              placeholder="Example: Uttarakhand, India / supplier location / cultivation source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            />
          </div>

          <Question
            icon={<FileSearch size={18} />}
            title="Is Traditional Knowledge involved?"
            description="For example, the formulation, use or preparation is based on community knowledge or Ayurvedic traditional knowledge."
            value={traditionalKnowledge}
            setValue={setTraditionalKnowledge}
          />

          <Question
            icon={<Building2 size={18} />}
            title="Is the resource or knowledge intended for commercial use?"
            description="Commercialisation can include product development, sale or other commercial activity."
            value={commercialUse}
            setValue={setCommercialUse}
          />

          <Question
            icon={<ShieldCheck size={18} />}
            title="Do you already have permission or access documentation?"
            description="This could include an approval, agreement, permit or other official documentation. Select Unsure if you have not verified it."
            value={permission}
            setValue={setPermission}
          />

          <div className="guidance-field">
            <label>
              <FileSearch size={17} />
              Intended use of the resource
            </label>

            <textarea
              placeholder="Example: research, formulation development, commercial Ayurvedic product, cosmetic, food product..."
              value={intendedUse}
              onChange={(e) => setIntendedUse(e.target.value)}
              rows={4}
            />
          </div>

          <button
            className="primary-guidance-btn"
            onClick={() => setChecked(true)}
          >
            <ShieldCheck size={18} />
            Run ABS screening
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* RESULT */}
      {assessment && (
        <section className="guidance-result">
          <div className={`result-banner ${assessment.type}`}>
            {assessment.type === "high" ? (
              <AlertTriangle size={25} />
            ) : assessment.type === "medium" ? (
              <CircleHelp size={25} />
            ) : (
              <CheckCircle2 size={25} />
            )}

            <div>
              <span>PRELIMINARY SCREENING RESULT</span>
              <h2>{assessment.title}</h2>
              <p>{assessment.text}</p>
            </div>
          </div>

          {/* SIGNALS */}
          <div className="result-card">
            <div className="result-card-title">
              <ShieldCheck size={20} />
              Verification signals captured
            </div>

            <div className="verification-list">
              <VerificationRow
                label="Biological resource"
                value={biologicalResource || "Not specified"}
              />

              <VerificationRow
                label="Indian biological resource"
                value={indianResource || "Not specified"}
              />

              <VerificationRow
                label="Traditional Knowledge"
                value={traditionalKnowledge || "Not specified"}
              />

              <VerificationRow
                label="Commercial use"
                value={commercialUse || "Not specified"}
              />

              <VerificationRow
                label="Permission / access documentation"
                value={permission || "Not specified"}
              />

              <VerificationRow
                label="Source / location"
                value={source || "Not specified"}
              />
            </div>
          </div>

          {/* PATHWAY */}
          <div className="result-card">
            <div className="result-card-title">
              <ArrowRight size={20} />
              Preliminary ABS pathway
            </div>

            <div className="pathway-grid">

              <PathwayStep
                number="01"
                title="Identify resource"
                text="Document the biological resource, scientific identity where available, source and origin."
                active={biologicalResource === "Yes"}
              />

              <PathwayStep
                number="02"
                title="Verify origin"
                text="Determine whether the resource is Indian and retain evidence of its source."
                active={
                  indianResource === "Yes" ||
                  indianResource === "Unsure"
                }
              />

              <PathwayStep
                number="03"
                title="Check TK connection"
                text="Assess whether Traditional Knowledge contributes to the resource, formulation or use."
                active={traditionalKnowledge === "Yes"}
              />

              <PathwayStep
                number="04"
                title="Assess access & benefit sharing"
                text="Verify whether the intended access or use requires an applicable ABS process or permission."
                active={
                  biologicalResource === "Yes" &&
                  indianResource !== "No"
                }
              />

              <PathwayStep
                number="05"
                title="Retain evidence"
                text="Store permissions, agreements, source information and relevant official records."
                active
              />

              <PathwayStep
                number="06"
                title="Commercialise responsibly"
                text="Proceed only after the relevant legal, regulatory and biodiversity requirements have been verified."
                active={commercialUse === "Yes"}
              />

            </div>
          </div>

          {/* NEXT ACTION */}
          <div className="result-action-card">
            <div className="result-action-icon">
              <ArrowRight size={22} />
            </div>

            <div>
              <span>RECOMMENDED NEXT STEP</span>
              <h3>{getNextStep()}</h3>
            </div>
          </div>

          {/* TRUSTED SOURCES */}
          <div className="result-card">
            <div className="result-card-title">
              <FileSearch size={20} />
              Trusted source areas to verify
            </div>

            <div className="source-grid">

              <SourceItem
                title="National Biodiversity Authority"
                text="Verify applicable Indian biodiversity and access-and-benefit-sharing requirements."
              />

              <SourceItem
                title="Ministry of AYUSH"
                text="Check Ayurveda-related policy and regulatory requirements relevant to the product."
              />

              <SourceItem
                title="Official Indian legislation & rules"
                text="Verify the current legal framework, amendments, notifications and effective dates."
              />

              <SourceItem
                title="WIPO / International resources"
                text="Use international biodiversity, Traditional Knowledge and intellectual-property resources where relevant."
              />

            </div>
          </div>

          {/* SOURCE VERIFICATION */}
          <div className="guidance-source-layer">
            <div className="source-layer-icon">
              <FileSearch size={21} />
            </div>

            <div>
              <h3>VedaLex source verification layer</h3>

              <p>
                In the production system, this workflow retrieves relevant
                official biodiversity and ABS sources before presenting a
                legal or regulatory conclusion.
              </p>

              <p>
                Each retrieved source should display its jurisdiction,
                publication or amendment date, version/status and official
                source reference so the user can verify the basis of the
                guidance.
              </p>
            </div>
          </div>

          {/* DISCLAIMER */}
          <div className="guidance-disclaimer">
            <AlertTriangle size={19} />

            <p>
              <strong>Important:</strong> This screening is preliminary.
              It does not establish legal applicability, permission,
              ownership, benefit-sharing obligations or compliance.
              VedaLex should retrieve and cite verified official sources
              and escalate complex cases to a qualified legal or
              biodiversity/ABS professional.
            </p>
          </div>
        </section>
      )}

      {/* BOTTOM */}
      {!assessment && (
        <div className="guidance-bottom-note">
          <CircleHelp size={18} />
          <span>
            Complete the screening above to generate your preliminary
            biodiversity and ABS pathway.
          </span>
        </div>
      )}
    </div>
  );
}


/* ---------------- COMPONENTS ---------------- */

function Question({
  icon,
  title,
  description,
  value,
  setValue,
}) {
  return (
    <div className="guidance-question">
      <div className="question-content">
        <div className="question-icon">{icon}</div>

        <div>
          <h3>{title}</h3>
          <p>{description}</p>
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
            {value === option && <CheckCircle2 size={16} />}
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}


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


function PathwayStep({
  number,
  title,
  text,
  active,
}) {
  return (
    <div className={`pathway-step ${active ? "active" : ""}`}>
      <div className="pathway-number">{number}</div>

      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </div>
  );
}


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


export default BiodiversityABS;