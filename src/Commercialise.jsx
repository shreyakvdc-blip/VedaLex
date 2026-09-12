import { useState } from "react";
import {
  ArrowLeft,
  Rocket,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Globe,
  ShieldCheck,
  Package,
  BadgeCheck,
  ChevronRight,
} from "lucide-react";

function Commercialise({ result, onBack }) {
  const [checked, setChecked] = useState({});

  const productName = result?.productName || "Your Ayurveda Product";
  const category = result?.category?.title || "Product category not confirmed";
  const jurisdiction = result?.jurisdiction || "India";

  const checklist = [
    {
      id: "classification",
      icon: BadgeCheck,
      title: "Product classification confirmed",
      description:
        "Confirm that the product category selected during the VedaLex classification stage is appropriate before commercial launch.",
    },
    {
      id: "brand",
      icon: ShieldCheck,
      title: "Brand & trademark protection",
      description:
        "Check the proposed brand name, logo and other identifiers for trademark availability and potential conflicts.",
    },
    {
      id: "regulatory",
      icon: FileText,
      title: "Regulatory documentation",
      description:
        "Ensure the required licences, registrations, product documentation and applicable regulatory records are identified.",
    },
    {
      id: "packaging",
      icon: Package,
      title: "Packaging & labelling",
      description:
        "Review product labels, ingredients, claims, declarations and packaging requirements applicable to the product category.",
    },
    {
      id: "claims",
      icon: AlertTriangle,
      title: "Advertising & product claims",
      description:
        "Verify that health, therapeutic, nutritional or other commercial claims are supported and comply with applicable rules.",
    },
    {
      id: "export",
      icon: Globe,
      title: "Export readiness",
      description:
        "If selling outside India, identify the destination-country regulatory, IP, labelling and market-entry requirements separately.",
    },
  ];

  const completedCount = Object.values(checked).filter(Boolean).length;
  const progress = Math.round(
    (completedCount / checklist.length) * 100
  );

  const toggleCheck = (id) => {
    setChecked((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="commercialise-page">
      {/* HEADER */}
      <header className="commercialise-header">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={19} />
          Back to Dashboard
        </button>

        <div className="commercialise-title">
          <div className="commercialise-icon">
            <Rocket size={24} />
          </div>

          <div>
            <h1>Commercialise</h1>
            <p>Prepare your Ayurveda product for market launch</p>
          </div>
        </div>

        <div className="jurisdiction-pill">
          <Globe size={16} />
          {jurisdiction}
        </div>
      </header>

      <main className="commercialise-content">
        {/* PRODUCT SUMMARY */}
        <section className="launch-hero">
          <div>
            <span className="eyebrow">COMMERCIALISATION READINESS</span>

            <h2>
              Take <span>{productName}</span> from compliance to market.
            </h2>

            <p>
              VedaLex helps you identify the key intellectual property,
              regulatory, branding and market-entry checks before
              commercialisation.
            </p>
          </div>

          <div className="product-summary">
            <div className="summary-label">PRODUCT</div>
            <strong>{productName}</strong>

            <div className="summary-category">
              <span>Category</span>
              <span>{category}</span>
            </div>

            <div className="summary-category">
              <span>Jurisdiction</span>
              <span>{jurisdiction}</span>
            </div>
          </div>
        </section>

        {/* PROGRESS */}
        <section className="readiness-card">
          <div className="readiness-top">
            <div>
              <span className="section-label">LAUNCH READINESS</span>
              <h3>{progress}% complete</h3>
            </div>

            <div className="readiness-count">
              {completedCount} / {checklist.length} checks
            </div>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p>
            Complete the checklist below to build a stronger
            commercialisation readiness assessment.
          </p>
        </section>

        {/* CHECKLIST */}
        <section className="checklist-section">
          <div className="section-heading">
            <div>
              <span className="section-label">PRE-LAUNCH CHECKLIST</span>
              <h3>What should you verify?</h3>
            </div>

            <span className="verified-note">
              <ShieldCheck size={16} />
              VedaLex guidance
            </span>
          </div>

          <div className="commercialise-grid">
            {checklist.map((item) => {
              const Icon = item.icon;
              const isChecked = checked[item.id];

              return (
                <button
                  key={item.id}
                  className={`commercialise-card ${
                    isChecked ? "completed" : ""
                  }`}
                  onClick={() => toggleCheck(item.id)}
                >
                  <div className="card-icon">
                    <Icon size={21} />
                  </div>

                  <div className="card-content">
                    <div className="card-title-row">
                      <h4>{item.title}</h4>

                      {isChecked ? (
                        <CheckCircle2
                          size={21}
                          className="completed-icon"
                        />
                      ) : (
                        <ChevronRight size={19} />
                      )}
                    </div>

                    <p>{item.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ACTION PLAN */}
        <section className="action-plan">
          <div className="action-plan-icon">
            <Rocket size={23} />
          </div>

          <div>
            <span className="section-label">RECOMMENDED NEXT STEP</span>

            <h3>
              {progress === 100
                ? "Your pre-launch checklist is complete."
                : "Complete the verification checklist before launch."}
            </h3>

            <p>
              {progress === 100
                ? "The checklist is only a readiness aid. Final legal, regulatory and market-entry decisions should be verified with the relevant official authorities or qualified professionals."
                : "VedaLex does not treat checklist completion as legal approval. Verify each applicable requirement using current official sources before commercialising the product."}
            </p>
          </div>
        </section>

        {/* FINAL WARNING */}
        <div className="commercialise-disclaimer">
          <AlertTriangle size={18} />

          <p>
            <strong>Important:</strong> Commercial readiness does not mean
            regulatory approval, trademark registration or patent
            grant. Requirements can vary by product category and
            destination country. Always verify current requirements
            with the relevant official authority.
          </p>
        </div>
      </main>
    </div>
  );
}

export default Commercialise;