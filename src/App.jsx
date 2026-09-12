import { useState } from "react";
import "./App.css";

import CheckVerification from "./CheckVerification";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Classification from "./Classification";
import IPRGuidance from "./IPRGuidance";
import TraditionalKnowledge from "./TraditionalKnowledge";
import BiodiversityABS from "./BiodiversityABS";
import RegulatoryCompliance from "./RegulatoryCompliance";
import Commercialise from "./Commercialise";

function App() {
  const [screen, setScreen] = useState("splash");
  const [guidancePrompt, setGuidancePrompt] = useState("");
  const [classificationResult, setClassificationResult] = useState(null);

  if (screen === "dashboard") {
    return (
      <Dashboard
        onLogout={() => {
          setGuidancePrompt("");
          setClassificationResult(null);
          setScreen("splash");
        }}
        onClassification={() => setScreen("classification")}
        onCheck={() => setScreen("check")}
        onIPR={() => setScreen("ipr")}
        onTraditionalKnowledge={() => setScreen("traditional-knowledge")}
        onABS={() => setScreen("abs")}
        onCompliance={() => setScreen("regulatory")}
        onCommercialise={() => setScreen("commercialise")}
        initialPrompt={guidancePrompt}
      />
    );
  }

  if (screen === "classification") {
    return (
      <Classification
        onBack={() => setScreen("dashboard")}
        onContinue={(data) => {
          setClassificationResult(data);
          const prompt = `
I have completed the initial product classification in VedaLex.

PRODUCT DETAILS
----------------
Product name:
${data.productName}

Main purpose:
${data.purpose || "Not specified"}

Key ingredients / biological resources:
${data.ingredients || "Not specified"}

Initial product category:
${data.category?.title || "Not specified"}

Jurisdiction:
${data.jurisdiction || "India"}

INITIAL VERIFICATION SIGNALS
-----------------------------
Traditional Knowledge / Classical Text:
${data.answers?.classicalText === "yes" ? "Potentially relevant — the user indicated that the product is based on an Ayurvedic classical text or documented traditional knowledge." : "Not indicated by the user."}

Biological Resources:
${data.answers?.plant === "yes" ? "Potentially relevant — the product uses plants, herbs, fungi, microorganisms, or other biological resources." : "Not indicated by the user."}

Commercial Use:
${data.answers?.commercialUse === "yes" ? "Yes — the product is intended for commercial use or sale." : "No — commercial use was not indicated."}

Continue with the CHECK stage. Use trusted official sources. Clearly distinguish verified information from areas requiring expert review. Do not guarantee patentability or fabricate legal sources. Return a VedaLex CHECK report with: ✓ What is relevant, ⚠ What needs verification, 📚 Trusted sources, → Recommended next steps.
          `.trim();
          setGuidancePrompt(prompt);
          setScreen("check");
        }}
      />
    );
  }

  if (screen === "check") {
    return (
      <CheckVerification
        result={classificationResult}
        onBack={() => setScreen("classification")}
        onDashboard={() => setScreen("dashboard")}
      />
    );
  }

  if (screen === "ipr") {
    return <IPRGuidance onBack={() => setScreen("dashboard")} />;
  }

  if (screen === "traditional-knowledge") {
    return <TraditionalKnowledge result={classificationResult} onBack={() => setScreen("dashboard")} />;
  }

  if (screen === "abs") {
    return <BiodiversityABS result={classificationResult} onBack={() => setScreen("dashboard")} />;
  }

  if (screen === "regulatory") {
    return <RegulatoryCompliance result={classificationResult} onBack={() => setScreen("dashboard")} />;
  }

  if (screen === "commercialise") {
    return <Commercialise result={classificationResult} onBack={() => setScreen("dashboard")} />;
  }

  if (screen === "login") {
    return <Login onLogin={() => setScreen("dashboard")} />;
  }

  return (
    <div className="splash-screen">
      <div className="splash-content">
        <img src="/vedalex-logo.png" alt="VedaLex Logo" className="vedalex-logo" />
        <h1>VedaLex</h1>
        <p className="tagline">AI-Powered IPR & Regulatory Guidance for Ayurveda</p>
        <p className="subtitle">Trusted knowledge. Verified sources. Smarter decisions.</p>
        <div className="sanskrit-verse">
          <p className="sanskrit-text">हिताहितं सुखं दुःखमायुस्तस्य हिताहितम् ।</p>
          <p className="sanskrit-meaning">"What is beneficial and harmful, happiness and suffering, and the appropriate way of life — this is Ayurveda."</p>
          <span className="verse-source">— Charaka Samhita</span>
        </div>
        <button className="enter-button" onClick={() => setScreen("login")}>Enter VedaLex →</button>
      </div>
      <div className="verse">
        <p>Ancient wisdom. Trusted knowledge. Smarter decisions.</p>
        <span>VedaLex — Ayurveda × Law × Intelligence</span>
      </div>
    </div>
  );
}

export default App;
