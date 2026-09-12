import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Scale,
  Leaf,
  Globe2,
  AlertTriangle,
  Search,
  CircleAlert,
  ArrowRight,
} from "lucide-react";

function CheckVerification({ result, onBack, onDashboard }) {
  // =========================================================
  // SAFELY READ CLASSIFICATION DATA
  // =========================================================

  const category = result?.category || null;

  const categoryTitle =
    typeof category === "object"
      ? category?.title || "Product category not confirmed"
      : category || "Product category not confirmed";

  const categoryDescription =
    typeof category === "object"
      ? category?.description || ""
      : "";

  const answers = result?.answers || {};

  const jurisdiction = result?.jurisdiction || "India";
  const productName = result?.productName || "Unnamed product";
  const ingredients = result?.ingredients || "Not specified";
  const purpose = result?.purpose || "Not specified";

  // =========================================================
  // NORMALIZE ANSWERS
  // =========================================================

  const classicalText =
    String(answers.classicalText || "").toLowerCase() === "yes";

  const biologicalResource =
    String(answers.plant || "").toLowerCase() === "yes";

  const commercialUse =
    String(answers.commercialUse || "").toLowerCase() === "yes";

  // =========================================================
  // CHECK CARDS
  // =========================================================

  const checks = [
    {
      title: "Product Classification",
      description:
        `VedaLex has identified "${productName}" as ${categoryTitle}. ` +
        `This is a preliminary classification and should be verified against the applicable official framework.`,
      icon: <CheckCircle2 size={21} />,
      status: "Completed",
      type: "completed",
    },
    {
      title: "Traditional Knowledge / Prior Art",
      description: classicalText
        ? "Traditional Knowledge or Ayurvedic classical literature may be relevant. Prior-art and TK checks should be completed before relying on patent protection."
        : "A Traditional Knowledge and prior-art review should still be considered, particularly if the product uses known Ayurvedic ingredients or formulations.",
      icon: <Leaf size={21} />,
      status: classicalText ? "Attention required" : "Review required",
      type: classicalText ? "warning" : "review",
    },
    {
      title: "Biodiversity & ABS",
      description: biologicalResource
        ? commercialUse
          ? "Biological resources and commercial use were indicated. Biodiversity, access and benefit-sharing requirements should be specifically verified."
          : "Biological resources were indicated. Their source, use and applicable biodiversity requirements should be verified."
        : "No biological resource was indicated in the initial questionnaire. This does not replace a factual biodiversity assessment.",
      icon: <ShieldCheck size={21} />,
      status: biologicalResource ? "Attention required" : "Initial check",
      type: biologicalResource ? "warning" : "review",
    },
    {
      title: "IP Protection",
      description:
        categoryTitle === "Classical Ayurvedic Medicine"
          ? "The traditional formulation itself may face patentability limitations. VedaLex should evaluate whether any new technical contribution or other protectable business asset exists."
          : "Potential routes include patents, trademarks, designs, copyright and trade secrets depending on the actual innovation, brand and business asset.",
      icon: <Scale size={21} />,
      status: "Review required",
      type: "review",
    },
    {
      title: "Regulatory Framework",
      description:
        "The applicable regulatory pathway depends on the product category, intended use, ingredients and claims. Official requirements should be checked before commercialisation.",
      icon: <Search size={21} />,
      status: "Review required",
      type: "review",
    },
    {
      title: "Jurisdiction",
      description:
        jurisdiction === "International"
          ? "International requirements must be assessed separately for the intended destination country. Indian and foreign regulatory requirements should not be mixed."
          : "The current assessment is focused on India. International requirements should be assessed separately if the product will be exported.",
      icon: <Globe2 size={21} />,
      status: jurisdiction,
      type: "completed",
    },
  ];

  const attentionCount = checks.filter(
    (check) => check.type === "warning"
  ).length;

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="check-verification-page">
      {/* =====================================================
          HARD TEXT VISIBILITY FIX
          This intentionally overrides inherited/global styles.
      ===================================================== */}

      <style>{`
        /* -----------------------------------------------------
           GLOBAL RESET FOR THIS PAGE
        ----------------------------------------------------- */

        .check-verification-page,
        .check-verification-page * {
          box-sizing: border-box !important;
        }

        /*
          FORCE NORMAL TEXT TO BE VISIBLE.
          This fixes cases where App.css/global CSS makes text
          transparent or gives it a white text-fill.
        */
        .check-verification-page,
        .check-verification-page h1,
        .check-verification-page h2,
        .check-verification-page h3,
        .check-verification-page h4,
        .check-verification-page p,
        .check-verification-page span,
        .check-verification-page strong,
        .check-verification-page div,
        .check-verification-page button {
          opacity: 1 !important;
          visibility: visible !important;
        }

        /* -----------------------------------------------------
           NORMAL LIGHT-BACKGROUND TEXT
        ----------------------------------------------------- */

        .check-verification-page .force-dark,
        .check-verification-page .force-dark * {
          color: #173B2A !important;
          -webkit-text-fill-color: #173B2A !important;
        }

        .check-verification-page .force-secondary,
        .check-verification-page .force-secondary * {
          color: #68736C !important;
          -webkit-text-fill-color: #68736C !important;
        }

        .check-verification-page .force-green,
        .check-verification-page .force-green * {
          color: #2C633D !important;
          -webkit-text-fill-color: #2C633D !important;
        }

        .check-verification-page .force-muted,
        .check-verification-page .force-muted * {
          color: #7A837D !important;
          -webkit-text-fill-color: #7A837D !important;
        }

        /* -----------------------------------------------------
           CAPTURED VERIFICATION BOX
        ----------------------------------------------------- */

        .check-verification-page .captured-box {
          background: #F9E7B5 !important;
          color: #173B2A !important;
          -webkit-text-fill-color: #173B2A !important;
          opacity: 1 !important;
          visibility: visible !important;
        }

        .check-verification-page .captured-box h4,
        .check-verification-page .captured-box span,
        .check-verification-page .captured-box div {
          color: #173B2A !important;
          -webkit-text-fill-color: #173B2A !important;
          opacity: 1 !important;
          visibility: visible !important;
        }

        .check-verification-page .captured-box .captured-value {
          color: #2C633D !important;
          -webkit-text-fill-color: #2C633D !important;
          font-weight: 800 !important;
        }

        /* -----------------------------------------------------
           SIGNAL TAGS
        ----------------------------------------------------- */

        .check-verification-page .signal-label {
          color: #173B2A !important;
          -webkit-text-fill-color: #173B2A !important;
        }

        .check-verification-page .signal-value {
          color: #2C633D !important;
          -webkit-text-fill-color: #2C633D !important;
        }

        /* -----------------------------------------------------
           NOTICE
        ----------------------------------------------------- */

        .check-verification-page .notice-box,
        .check-verification-page .notice-box p,
        .check-verification-page .notice-box div {
          color: #173B2A !important;
          -webkit-text-fill-color: #173B2A !important;
          opacity: 1 !important;
          visibility: visible !important;
        }

        /* -----------------------------------------------------
           DARK GREEN NEXT STEP CARD
           Explicitly restore white text here.
        ----------------------------------------------------- */

        .check-verification-page .dark-card {
          background: #173B2A !important;
        }

        .check-verification-page .dark-card h2,
        .check-verification-page .dark-card p,
        .check-verification-page .dark-card span,
        .check-verification-page .dark-card div {
          color: #FFFFFF !important;
          -webkit-text-fill-color: #FFFFFF !important;
          opacity: 1 !important;
          visibility: visible !important;
        }

        .check-verification-page .dark-card .dark-label {
          color: #FBC16D !important;
          -webkit-text-fill-color: #FBC16D !important;
        }

        .check-verification-page .dark-card .dark-description {
          color: #D6DED8 !important;
          -webkit-text-fill-color: #D6DED8 !important;
        }

        /* -----------------------------------------------------
           BUTTONS
        ----------------------------------------------------- */

        .check-verification-page .primary-btn,
        .check-verification-page .primary-btn span {
          color: #173B2A !important;
          -webkit-text-fill-color: #173B2A !important;
        }

        .check-verification-page .secondary-btn,
        .check-verification-page .secondary-btn span {
          color: #173B2A !important;
          -webkit-text-fill-color: #173B2A !important;
        }

        /* -----------------------------------------------------
           ICONS
        ----------------------------------------------------- */

        .check-verification-page svg {
          opacity: 1 !important;
        }
      `}</style>

      <div style={styles.page}>
        {/* =====================================================
            HEADER
        ===================================================== */}

        <header style={styles.header}>
          <button
            onClick={onBack}
            style={styles.backButton}
          >
            <ArrowLeft size={18} color="#173B2A" />

            <span
              className="force-dark"
              style={styles.headerDarkText}
            >
              Back to Classification
            </span>
          </button>

          <div style={styles.brand}>
            <img
              src="/vedalex-logo.png"
              alt="VedaLex"
              style={styles.logo}
            />

            <div>
              <strong
                className="force-dark"
                style={styles.brandName}
              >
                VedaLex
              </strong>

              <div
                className="force-muted"
                style={styles.brandSub}
              >
                Source-aware IPR & Regulatory Guidance
              </div>
            </div>
          </div>

          <div
            className="force-dark"
            style={styles.stepBadge}
          >
            STEP 2 · CHECK
          </div>
        </header>

        {/* =====================================================
            MAIN
        ===================================================== */}

        <main style={styles.main}>
          {/* HERO */}

          <div style={styles.hero}>
            <div
              className="force-green"
              style={styles.eyebrow}
            >
              <CheckCircle2 size={15} color="#2C633D" />
              CLASSIFICATION COMPLETE
            </div>

            <h1
              className="force-dark"
              style={styles.title}
            >
              Now let's check what matters.
            </h1>

            <p
              className="force-secondary"
              style={styles.subtitle}
            >
              VedaLex has analysed your initial product
              classification and identified the key areas that
              should be verified before protection, compliance
              or commercialisation.
            </p>
          </div>

          {/* ===================================================
              PRODUCT SUMMARY
          =================================================== */}

          <section style={styles.summaryCard}>
            <div style={styles.summaryLeft}>
              <span
                className="force-muted"
                style={styles.label}
              >
                PRODUCT UNDER REVIEW
              </span>

              <h2
                className="force-dark"
                style={styles.productName}
              >
                {productName}
              </h2>

              <div style={styles.summaryMeta}>
                <span
                  className="force-secondary"
                  style={styles.greyText}
                >
                  Category:{" "}
                  <strong
                    className="force-dark"
                    style={styles.metaStrong}
                  >
                    {categoryTitle}
                  </strong>
                </span>

                <span
                  className="force-secondary"
                  style={styles.greyText}
                >
                  Jurisdiction:{" "}
                  <strong
                    className="force-dark"
                    style={styles.metaStrong}
                  >
                    {jurisdiction}
                  </strong>
                </span>
              </div>

              <p
                className="force-secondary"
                style={styles.categoryDescription}
              >
                {categoryDescription}
              </p>
            </div>

            <div
              className="force-green"
              style={styles.initialBadge}
            >
              INITIAL ASSESSMENT
            </div>
          </section>

          {/* ===================================================
              WORKFLOW
          =================================================== */}

          <div style={styles.workflow}>
            {[
              "Classify",
              "Check",
              "Protect",
              "Comply",
              "Commercialise",
            ].map((item, index) => (
              <div
                key={item}
                style={styles.workflowItem}
              >
                <div
                  style={{
                    ...styles.workflowCircle,
                    ...(index <= 1
                      ? styles.workflowActive
                      : {}),
                  }}
                >
                  {index < 2 ? "✓" : index + 1}
                </div>

                <span
                  className={
                    index <= 1
                      ? "force-dark"
                      : "force-muted"
                  }
                  style={{
                    ...styles.workflowText,
                    ...(index <= 1
                      ? styles.workflowTextActive
                      : {}),
                  }}
                >
                  {item}
                </span>

                {index < 4 && (
                  <div style={styles.workflowLine} />
                )}
              </div>
            ))}
          </div>

          {/* ===================================================
              VERIFICATION SIGNALS
          =================================================== */}

          <section style={styles.signalCard}>
            <div style={styles.signalIcon}>
              <CircleAlert
                size={21}
                color="#173B2A"
              />
            </div>

            <div style={styles.signalContent}>
              <div style={styles.signalHeader}>
                <h3
                  className="force-dark"
                  style={styles.signalTitle}
                >
                  Initial verification signals
                </h3>

                <span
                  className="force-dark"
                  style={styles.signalCount}
                >
                  {attentionCount} area
                  {attentionCount !== 1 ? "s" : ""} flagged
                </span>
              </div>

              <p
                className="force-secondary"
                style={styles.signalText}
              >
                These signals are generated from the information
                you provided. They are not legal conclusions and
                do not confirm whether any registration,
                approval or obligation applies.
              </p>

              {/* SIGNAL TAGS */}

              <div style={styles.signalTags}>
                <div
                  style={
                    classicalText
                      ? styles.tagWarning
                      : styles.tagNeutral
                  }
                >
                  <span className="signal-label">
                    📜 Traditional Knowledge:
                  </span>{" "}
                  <span className="signal-value">
                    {classicalText
                      ? "Potentially relevant"
                      : "Not indicated"}
                  </span>
                </div>

                <div
                  style={
                    biologicalResource
                      ? styles.tagWarning
                      : styles.tagNeutral
                  }
                >
                  <span className="signal-label">
                    🌿 Biological resource:
                  </span>{" "}
                  <span className="signal-value">
                    {biologicalResource
                      ? "Potentially relevant"
                      : "Not indicated"}
                  </span>
                </div>

                <div
                  style={
                    commercialUse
                      ? styles.tagWarning
                      : styles.tagNeutral
                  }
                >
                  <span className="signal-label">
                    💼 Commercial use:
                  </span>{" "}
                  <span className="signal-value">
                    {commercialUse
                      ? "Yes"
                      : "Not indicated"}
                  </span>
                </div>
              </div>

              {/* =================================================
                  CAPTURED BOX
              ================================================= */}

              <div
                className="captured-box"
                style={styles.capturedBox}
              >
                <h4
                  style={{
                    margin: "0 0 12px",
                    fontSize: 14,
                    fontWeight: 800,
                    color: "#173B2A",
                    WebkitTextFillColor: "#173B2A",
                  }}
                >
                  Verification signals captured
                </h4>

                <div style={styles.capturedRow}>
                  <span
                    style={{
                      color: "#173B2A",
                      WebkitTextFillColor: "#173B2A",
                    }}
                  >
                    Traditional Knowledge:
                  </span>

                  <span className="captured-value">
                    {classicalText
                      ? "Potentially relevant"
                      : "Not indicated"}
                  </span>
                </div>

                <div style={styles.capturedRow}>
                  <span
                    style={{
                      color: "#173B2A",
                      WebkitTextFillColor: "#173B2A",
                    }}
                  >
                    Biological resource:
                  </span>

                  <span className="captured-value">
                    {biologicalResource
                      ? "Potentially relevant"
                      : "Not indicated"}
                  </span>
                </div>

                <div style={styles.capturedRowLast}>
                  <span
                    style={{
                      color: "#173B2A",
                      WebkitTextFillColor: "#173B2A",
                    }}
                  >
                    Commercial use:
                  </span>

                  <span className="captured-value">
                    {commercialUse
                      ? "Yes"
                      : "Not indicated"}
                  </span>
                </div>
              </div>

              {/* =================================================
                  INITIAL CLASSIFICATION NOTICE
              ================================================= */}

              <div
                className="notice-box"
                style={styles.inlineNotice}
              >
                <div style={styles.noticeIcon}>
                  ⓘ
                </div>

                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    lineHeight: 1.6,
                    fontWeight: 500,
                    color: "#173B2A",
                    WebkitTextFillColor: "#173B2A",
                  }}
                >
                  This is an initial classification for guidance.
                  VedaLex will verify applicable laws and official
                  regulatory sources before providing a final
                  compliance recommendation.
                </p>
              </div>
            </div>
          </section>

          {/* ===================================================
              CHECK GRID
          =================================================== */}

          <section style={styles.checkGrid}>
            {checks.map((check) => (
              <div
                key={check.title}
                style={{
                  ...styles.checkCard,
                  ...(check.type === "warning"
                    ? styles.warningCard
                    : {}),
                }}
              >
                <div style={styles.checkTop}>
                  <div
                    style={{
                      ...styles.iconBox,
                      ...(check.type === "warning"
                        ? styles.warningIconBox
                        : {}),
                    }}
                  >
                    {check.icon}
                  </div>

                  <span
                    className="force-dark"
                    style={{
                      ...styles.status,
                      ...(check.type === "warning"
                        ? styles.warningStatus
                        : {}),
                    }}
                  >
                    {check.status}
                  </span>
                </div>

                <h3
                  className="force-dark"
                  style={styles.checkTitle}
                >
                  {check.title}
                </h3>

                <p
                  className="force-secondary"
                  style={styles.checkDescription}
                >
                  {check.description}
                </p>

                <div
                  className="force-muted"
                  style={styles.checkFooter}
                >
                  {check.type === "warning" ? (
                    <>
                      <AlertTriangle size={14} />
                      Verify with trusted sources
                    </>
                  ) : (
                    <>
                      <Search size={14} />
                      Source verification required
                    </>
                  )}
                </div>
              </div>
            ))}
          </section>

          {/* ===================================================
              FACTS USED
          =================================================== */}

          <section style={styles.factsCard}>
            <div style={styles.factsHeader}>
              <div>
                <span
                  className="force-muted"
                  style={styles.label}
                >
                  INPUTS USED FOR THIS CHECK
                </span>

                <h3
                  className="force-dark"
                  style={styles.factsTitle}
                >
                  What VedaLex knows so far
                </h3>
              </div>

              <Search
                size={21}
                color="#2C633D"
              />
            </div>

            <div style={styles.factsGrid}>
              <div style={styles.factItem}>
                <span
                  className="force-secondary"
                  style={styles.factLabel}
                >
                  Product purpose
                </span>

                <strong
                  className="force-dark"
                  style={styles.factValue}
                >
                  {purpose}
                </strong>
              </div>

              <div style={styles.factItem}>
                <span
                  className="force-secondary"
                  style={styles.factLabel}
                >
                  Key ingredients / resources
                </span>

                <strong
                  className="force-dark"
                  style={styles.factValue}
                >
                  {ingredients}
                </strong>
              </div>

              <div style={styles.factItem}>
                <span
                  className="force-secondary"
                  style={styles.factLabel}
                >
                  Commercial use
                </span>

                <strong
                  className="force-dark"
                  style={styles.factValue}
                >
                  {commercialUse
                    ? "Yes"
                    : "Not indicated"}
                </strong>
              </div>

              <div style={styles.factItem}>
                <span
                  className="force-secondary"
                  style={styles.factLabel}
                >
                  Traditional Knowledge signal
                </span>

                <strong
                  className="force-dark"
                  style={styles.factValue}
                >
                  {classicalText
                    ? "Potentially relevant"
                    : "Not indicated"}
                </strong>
              </div>
            </div>
          </section>

          {/* ===================================================
              IMPORTANT NOTICE
          =================================================== */}

          <section style={styles.nextCard}>
            <div style={styles.nextIcon}>
              <AlertTriangle
                size={22}
                color="#173B2A"
              />
            </div>

            <div>
              <h3
                className="force-dark"
                style={styles.nextTitle}
              >
                Important: this is not a legal conclusion
              </h3>

              <p
                className="force-secondary"
                style={styles.nextText}
              >
                VedaLex's CHECK stage identifies areas that
                require verification. Final patentability,
                regulatory classification, registration,
                licensing and biodiversity / ABS obligations
                depend on the specific facts and current
                official requirements.
              </p>
            </div>
          </section>

          {/* ===================================================
              NEXT STEP
          =================================================== */}

          <div
            className="dark-card"
            style={styles.nextStepCard}
          >
            <div>
              <span
                className="dark-label"
                style={styles.nextStepLabel}
              >
                NEXT STAGE
              </span>

              <h2
                style={styles.nextStepTitle}
              >
                Verify with trusted sources
              </h2>

              <p
                className="dark-description"
                style={styles.nextStepText}
              >
                Continue to VedaLex Guidance to review the
                applicable IPR, Traditional Knowledge,
                biodiversity and regulatory information.
              </p>
            </div>

            <button
              className="primary-btn"
              onClick={onDashboard}
              style={styles.primaryButton}
            >
              Continue to Guidance
              <ArrowRight size={18} color="#173B2A" />
            </button>
          </div>

          {/* ACTIONS */}

          <div style={styles.actions}>
            <button
              className="secondary-btn"
              onClick={onBack}
              style={styles.secondaryButton}
            >
              ← Change answers
            </button>
          </div>

          {/* DISCLAIMER */}

          <p
            className="force-muted"
            style={styles.disclaimer}
          >
            VedaLex provides informational guidance, not legal
            advice. Important decisions should be verified
            against current official sources or with a qualified
            IP, regulatory or legal professional.
          </p>
        </main>
      </div>
    </div>
  );
}

// =============================================================
// STYLES
// =============================================================

const styles = {
  page: {
    minHeight: "100vh",
    background: "#F4F0E7",
    color: "#173B2A",
  },

  header: {
    minHeight: 76,
    background: "#FFFFFF",
    borderBottom: "1px solid #E4DED2",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 34px",
    gap: 20,
  },

  backButton: {
    border: "none",
    background: "transparent",
    color: "#173B2A",
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 14,
  },

  headerDarkText: {
    color: "#173B2A",
    WebkitTextFillColor: "#173B2A",
    fontWeight: 600,
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: 11,
  },

  logo: {
    width: 40,
    height: 40,
    objectFit: "contain",
  },

  brandName: {
    color: "#173B2A",
    WebkitTextFillColor: "#173B2A",
    fontSize: 18,
  },

  brandSub: {
    color: "#6A786F",
    WebkitTextFillColor: "#6A786F",
    fontSize: 12,
    marginTop: 2,
  },

  stepBadge: {
    background: "#F9E7B5",
    color: "#173B2A",
    WebkitTextFillColor: "#173B2A",
    borderRadius: 20,
    padding: "8px 13px",
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: 0.5,
  },

  main: {
    maxWidth: 1120,
    margin: "0 auto",
    padding: "46px 28px 60px",
  },

  hero: {
    maxWidth: 780,
    marginBottom: 28,
  },

  eyebrow: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    color: "#2C633D",
    WebkitTextFillColor: "#2C633D",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 1,
    marginBottom: 12,
  },

  title: {
    margin: 0,
    fontSize: 38,
    lineHeight: 1.15,
    color: "#173B2A",
    WebkitTextFillColor: "#173B2A",
  },

  subtitle: {
    color: "#66736B",
    WebkitTextFillColor: "#66736B",
    fontSize: 16,
    lineHeight: 1.7,
    marginTop: 13,
  },

  summaryCard: {
    background: "#FFFFFF",
    border: "1px solid #DED8CC",
    borderRadius: 18,
    padding: "24px 27px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
    boxShadow: "0 8px 24px rgba(23,59,42,0.05)",
  },

  summaryLeft: {
    minWidth: 0,
  },

  label: {
    color: "#7A837D",
    WebkitTextFillColor: "#7A837D",
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: 1,
  },

  productName: {
    margin: "7px 0 0",
    fontSize: 25,
    color: "#173B2A",
    WebkitTextFillColor: "#173B2A",
  },

  summaryMeta: {
    display: "flex",
    gap: 22,
    flexWrap: "wrap",
    marginTop: 9,
    fontSize: 13,
  },

  greyText: {
    color: "#68736C",
    WebkitTextFillColor: "#68736C",
  },

  metaStrong: {
    color: "#173B2A",
    WebkitTextFillColor: "#173B2A",
    fontWeight: 700,
  },

  categoryDescription: {
    margin: "9px 0 0",
    color: "#68736C",
    WebkitTextFillColor: "#68736C",
    fontSize: 13,
    lineHeight: 1.5,
    maxWidth: 720,
  },

  initialBadge: {
    background: "#E8F1EA",
    color: "#2C633D",
    WebkitTextFillColor: "#2C633D",
    padding: "9px 13px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 800,
    whiteSpace: "nowrap",
  },

  workflow: {
    display: "flex",
    alignItems: "center",
    margin: "32px 0",
    overflowX: "auto",
  },

  workflowItem: {
    display: "flex",
    alignItems: "center",
    flex: 1,
    minWidth: 120,
  },

  workflowCircle: {
    width: 34,
    height: 34,
    minWidth: 34,
    borderRadius: "50%",
    background: "#DEDCD4",
    color: "#69736D",
    WebkitTextFillColor: "#69736D",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: 13,
  },

  workflowActive: {
    background: "#2C633D",
    color: "#FFFFFF",
    WebkitTextFillColor: "#FFFFFF",
  },

  workflowText: {
    marginLeft: 8,
    fontSize: 12,
    color: "#7B837E",
    WebkitTextFillColor: "#7B837E",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },

  workflowTextActive: {
    color: "#173B2A",
    WebkitTextFillColor: "#173B2A",
    fontWeight: 800,
  },

  workflowLine: {
    height: 2,
    background: "#D8D4CA",
    flex: 1,
    margin: "0 12px",
  },

  signalCard: {
    background: "#FFFFFF",
    border: "1px solid #DED8CC",
    borderRadius: 17,
    padding: 21,
    display: "flex",
    gap: 15,
    marginBottom: 20,
    boxShadow: "0 6px 20px rgba(23,59,42,0.04)",
  },

  signalIcon: {
    width: 43,
    height: 43,
    minWidth: 43,
    borderRadius: 12,
    background: "#F9E7B5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  signalContent: {
    flex: 1,
    minWidth: 0,
  },

  signalHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 15,
  },

  signalTitle: {
    margin: 0,
    fontSize: 16,
    color: "#173B2A",
    WebkitTextFillColor: "#173B2A",
    fontWeight: 800,
  },

  signalCount: {
    background: "#F9E7B5",
    color: "#173B2A",
    WebkitTextFillColor: "#173B2A",
    borderRadius: 20,
    padding: "5px 9px",
    fontSize: 11,
    fontWeight: 800,
    whiteSpace: "nowrap",
  },

  signalText: {
    margin: "6px 0 12px",
    color: "#68736C",
    WebkitTextFillColor: "#68736C",
    fontSize: 13,
    lineHeight: 1.55,
  },

  signalTags: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },

  tagWarning: {
    background: "#F9E7B5",
    border: "1px solid #FBC16D",
    borderRadius: 20,
    padding: "7px 11px",
    fontSize: 11,
    fontWeight: 700,
  },

  tagNeutral: {
    background: "#F4F0E7",
    border: "1px solid #DED8CC",
    borderRadius: 20,
    padding: "7px 11px",
    fontSize: 11,
    fontWeight: 700,
  },

  capturedBox: {
    marginTop: 14,
    background: "#F9E7B5",
    borderRadius: 12,
    padding: "14px 15px",
    color: "#173B2A",
    WebkitTextFillColor: "#173B2A",
  },

  capturedRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 15,
    padding: "8px 0",
    borderBottom: "1px solid rgba(23,59,42,0.12)",
    fontSize: 13,
    color: "#173B2A",
    WebkitTextFillColor: "#173B2A",
  },

  capturedRowLast: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 15,
    padding: "8px 0",
    fontSize: 13,
    color: "#173B2A",
    WebkitTextFillColor: "#173B2A",
  },

  inlineNotice: {
    marginTop: 14,
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    background: "#F4F0E7",
    border: "1px solid #DED8CC",
    borderRadius: 12,
    padding: "13px 15px",
    color: "#173B2A",
    WebkitTextFillColor: "#173B2A",
  },

  noticeIcon: {
    color: "#2C633D",
    WebkitTextFillColor: "#2C633D",
    fontSize: 17,
    fontWeight: 800,
    lineHeight: 1.4,
    flexShrink: 0,
  },

  checkGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(300px, 1fr))",
    gap: 17,
  },

  checkCard: {
    background: "#FFFFFF",
    border: "1px solid #DED8CC",
    borderRadius: 17,
    padding: 22,
    minHeight: 190,
    boxShadow: "0 6px 20px rgba(23,59,42,0.04)",
    color: "#173B2A",
  },

  warningCard: {
    border: "1px solid #FBC16D",
  },

  checkTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 17,
  },

  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    background: "#E8F1EA",
    color: "#2C633D",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  warningIconBox: {
    background: "#F9E7B5",
    color: "#173B2A",
  },

  status: {
    fontSize: 11,
    fontWeight: 800,
    color: "#6B756E",
    WebkitTextFillColor: "#6B756E",
    background: "#F4F0E7",
    borderRadius: 15,
    padding: "6px 9px",
  },

  warningStatus: {
    background: "#F9E7B5",
    color: "#173B2A",
    WebkitTextFillColor: "#173B2A",
  },

  checkTitle: {
    margin: "0 0 8px",
    fontSize: 17,
    color: "#173B2A",
    WebkitTextFillColor: "#173B2A",
  },

  checkDescription: {
    margin: 0,
    color: "#68736C",
    WebkitTextFillColor: "#68736C",
    fontSize: 13,
    lineHeight: 1.6,
  },

  checkFooter: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginTop: 17,
    paddingTop: 12,
    borderTop: "1px solid #EEEAE2",
    color: "#6B756E",
    WebkitTextFillColor: "#6B756E",
    fontSize: 11,
    fontWeight: 700,
  },

  factsCard: {
    marginTop: 20,
    background: "#FFFFFF",
    border: "1px solid #DED8CC",
    borderRadius: 17,
    padding: 22,
    color: "#173B2A",
  },

  factsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
  },

  factsTitle: {
    margin: "6px 0 0",
    fontSize: 18,
    color: "#173B2A",
    WebkitTextFillColor: "#173B2A",
  },

  factsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
  },

  factItem: {
    background: "#F9F7F2",
    border: "1px solid #E8E2D8",
    borderRadius: 12,
    padding: 14,
    display: "flex",
    flexDirection: "column",
    gap: 6,
    color: "#173B2A",
  },

  factLabel: {
    color: "#68736C",
    WebkitTextFillColor: "#68736C",
    fontSize: 12,
    fontWeight: 600,
  },

  factValue: {
    color: "#173B2A",
    WebkitTextFillColor: "#173B2A",
    fontSize: 13,
    lineHeight: 1.5,
    fontWeight: 700,
  },

  nextCard: {
    marginTop: 20,
    background: "#F9E7B5",
    border: "1px solid #FBC16D",
    borderRadius: 17,
    padding: 20,
    display: "flex",
    gap: 15,
    color: "#173B2A",
  },

  nextIcon: {
    marginTop: 2,
    flexShrink: 0,
  },

  nextTitle: {
    margin: "0 0 6px",
    fontSize: 15,
    color: "#173B2A",
    WebkitTextFillColor: "#173B2A",
  },

  nextText: {
    margin: 0,
    color: "#59655D",
    WebkitTextFillColor: "#59655D",
    fontSize: 13,
    lineHeight: 1.6,
  },

  nextStepCard: {
    marginTop: 22,
    background: "#173B2A",
    color: "#FFFFFF",
    borderRadius: 18,
    padding: "24px 25px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
  },

  nextStepLabel: {
    color: "#FBC16D",
    WebkitTextFillColor: "#FBC16D",
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: 1,
  },

  nextStepTitle: {
    margin: "5px 0 5px",
    fontSize: 22,
    color: "#FFFFFF",
    WebkitTextFillColor: "#FFFFFF",
  },

  nextStepText: {
    margin: 0,
    color: "#D6DED8",
    WebkitTextFillColor: "#D6DED8",
    fontSize: 13,
    lineHeight: 1.55,
    maxWidth: 650,
  },

  actions: {
    display: "flex",
    justifyContent: "flex-start",
    marginTop: 18,
  },

  secondaryButton: {
    border: "1px solid #BFC8C1",
    background: "#FFFFFF",
    color: "#173B2A",
    WebkitTextFillColor: "#173B2A",
    borderRadius: 11,
    padding: "12px 17px",
    fontWeight: 700,
    cursor: "pointer",
  },

  primaryButton: {
    border: "none",
    background: "#FAA51E",
    color: "#173B2A",
    WebkitTextFillColor: "#173B2A",
    borderRadius: 11,
    padding: "13px 18px",
    fontWeight: 800,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 8,
    whiteSpace: "nowrap",
  },

  disclaimer: {
    textAlign: "center",
    color: "#7A837D",
    WebkitTextFillColor: "#7A837D",
    fontSize: 11,
    marginTop: 20,
  },
};

export default CheckVerification;