import { useEffect, useRef, useState } from "react";

import {
  Menu,
  Plus,
  Search,
  BookOpen,
  Settings,
  User,
  Send,
  Globe,
  ShieldCheck,
  Scale,
  Leaf,
  FileText,
  ChevronDown,
  X,
  ClipboardCheck,
  Rocket
} from "lucide-react";

import "./Dashboard.css";

/* =========================================================
   MARKDOWN RENDERER
========================================================= */

function renderInlineMarkdown(text) {
  const parts = text.split(
    /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/
  );

  return parts.map((part, index) => {
    if (
      part.startsWith("**") &&
      part.endsWith("**")
    ) {
      return (
        <strong key={index}>
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (
      part.startsWith("*") &&
      part.endsWith("*")
    ) {
      return (
        <em key={index}>
          {part.slice(1, -1)}
        </em>
      );
    }

    if (
      part.startsWith("`") &&
      part.endsWith("`")
    ) {
      return (
        <code
          key={index}
          style={{
            background: "#E8EDE9",
            padding: "2px 6px",
            borderRadius: "5px",
            fontSize: "0.9em",
            color: "#173B2A"
          }}
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    return part;
  });
}

function renderMarkdown(text) {
  if (!text) return null;

  const lines = text
    .replace(/\r/g, "")
    .split("\n");

  const elements = [];

  let paragraphLines = [];
  let bulletItems = [];
  let numberedItems = [];

  const flushParagraph = () => {
    if (paragraphLines.length === 0) return;

    const paragraph = paragraphLines.join(" ");

    elements.push(
      <p
        key={`p-${elements.length}`}
        style={{
          margin: "0 0 15px",
          lineHeight: 1.75,
          color: "#20372B",
          fontSize: "15px"
        }}
      >
        {renderInlineMarkdown(paragraph)}
      </p>
    );

    paragraphLines = [];
  };

  const flushBullets = () => {
    if (bulletItems.length === 0) return;

    elements.push(
      <ul
        key={`ul-${elements.length}`}
        style={{
          margin: "4px 0 18px",
          paddingLeft: "24px",
          color: "#20372B"
        }}
      >
        {bulletItems.map((item, index) => (
          <li
            key={index}
            style={{
              marginBottom: "8px",
              lineHeight: 1.65,
              paddingLeft: "3px"
            }}
          >
            {renderInlineMarkdown(item)}
          </li>
        ))}
      </ul>
    );

    bulletItems = [];
  };

  const flushNumbered = () => {
    if (numberedItems.length === 0) return;

    elements.push(
      <ol
        key={`ol-${elements.length}`}
        style={{
          margin: "4px 0 18px",
          paddingLeft: "25px",
          color: "#20372B"
        }}
      >
        {numberedItems.map((item, index) => (
          <li
            key={index}
            style={{
              marginBottom: "9px",
              lineHeight: 1.65,
              paddingLeft: "3px"
            }}
          >
            {renderInlineMarkdown(item)}
          </li>
        ))}
      </ol>
    );

    numberedItems = [];
  };

  const flushAll = () => {
    flushParagraph();
    flushBullets();
    flushNumbered();
  };

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushAll();
      return;
    }

    if (
      trimmed === "---" ||
      trimmed === "***"
    ) {
      flushAll();

      elements.push(
        <hr
          key={`hr-${elements.length}`}
          style={{
            border: "none",
            borderTop: "1px solid #D8E1DB",
            margin: "20px 0"
          }}
        />
      );

      return;
    }

    if (/^#\s+/.test(trimmed)) {
      flushAll();

      elements.push(
        <h2
          key={`h1-${elements.length}`}
          style={{
            margin: "8px 0 12px",
            color: "#173B2A",
            fontSize: "21px",
            fontWeight: 800,
            lineHeight: 1.35
          }}
        >
          {renderInlineMarkdown(
            trimmed.replace(/^#\s+/, "")
          )}
        </h2>
      );

      return;
    }

    if (/^##\s+/.test(trimmed)) {
      flushAll();

      elements.push(
        <h3
          key={`h2-${elements.length}`}
          style={{
            margin: "8px 0 11px",
            color: "#173B2A",
            fontSize: "18px",
            fontWeight: 800,
            lineHeight: 1.4
          }}
        >
          {renderInlineMarkdown(
            trimmed.replace(/^##\s+/, "")
          )}
        </h3>
      );

      return;
    }

    if (/^###\s+/.test(trimmed)) {
      flushAll();

      elements.push(
        <h4
          key={`h3-${elements.length}`}
          style={{
            margin: "12px 0 9px",
            color: "#2C633D",
            fontSize: "16px",
            fontWeight: 800,
            lineHeight: 1.45
          }}
        >
          {renderInlineMarkdown(
            trimmed.replace(/^###\s+/, "")
          )}
        </h4>
      );

      return;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      flushParagraph();
      flushNumbered();

      bulletItems.push(
        trimmed.replace(/^[-*]\s+/, "")
      );

      return;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      flushParagraph();
      flushBullets();

      numberedItems.push(
        trimmed.replace(/^\d+\.\s+/, "")
      );

      return;
    }

    flushBullets();
    flushNumbered();

    paragraphLines.push(trimmed);
  });

  flushAll();

  return elements;
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard({
  onLogout,
  onClassification,
  onCheck,
  onIPR,
  onTraditionalKnowledge,
  onABS,
  onCompliance,
  onCommercialise,
  initialPrompt
}) {
  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const [jurisdiction, setJurisdiction] =
    useState("India");

  const [message, setMessage] =
    useState("");

  const [messages, setMessages] =
    useState([]);

  const [activeTool, setActiveTool] =
    useState(null);

  const [activePanel, setActivePanel] =
    useState(null);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [language, setLanguage] =
    useState("English");

  const [librarySearch, setLibrarySearch] =
    useState("");

  const [showCitations, setShowCitations] =
    useState(true);

  const [showConfidence, setShowConfidence] =
    useState(true);

  const [privacyMode, setPrivacyMode] =
    useState(false);

  const [isTyping, setIsTyping] =
    useState(false);

  /* =========================================================
     IMPORTANT CHAT INPUT REFS
  ========================================================= */

  const messageInputRef = useRef(null);

  const guidanceSentRef = useRef("");

  /* =========================================================
     LANGUAGES
  ========================================================= */

  const languages = [
    "Assamese",
    "Bengali",
    "Bodo",
    "Dogri",
    "English",
    "Gujarati",
    "Hindi",
    "Kannada",
    "Kashmiri",
    "Konkani",
    "Maithili",
    "Malayalam",
    "Manipuri",
    "Marathi",
    "Nepali",
    "Odia",
    "Punjabi",
    "Sanskrit",
    "Santali",
    "Sindhi",
    "Tamil",
    "Telugu",
    "Urdu"
  ];

  /* =========================================================
     TOOLS
  ========================================================= */

  const tools = [
    {
      title: "Product Classification",
      description:
        "Identify the regulatory category of your Ayurveda product.",
      icon: <FileText size={22} />
    },
    {
      title: "IPR & Patent Guidance",
      description:
        "Explore patents, trademarks, GI, designs and other IP routes.",
      icon: <Scale size={22} />
    },
    {
      title: "Traditional Knowledge",
      description:
        "Check traditional knowledge and prior-art considerations.",
      icon: <Leaf size={22} />
    },
    {
      title: "Biodiversity & ABS",
      description:
        "Understand biological-resource and ABS requirements.",
      icon: <ShieldCheck size={22} />
    },
    {
      title: "Regulatory Compliance",
      description:
        "Check product-specific regulatory, labelling and compliance requirements.",
      icon: <ClipboardCheck size={22} />
    },
    {
      title: "Commercialise",
      description:
        "Build a practical roadmap for taking your Ayurveda product to market.",
      icon: <Rocket size={22} />
    }
  ];

  /* =========================================================
     PANELS
  ========================================================= */

  const openPanel = (panel) => {
    setActivePanel(panel);
    setSearchTerm("");
  };

  /* =========================================================
     SEARCH
  ========================================================= */

  const filteredMessages =
    messages.filter((msg) => {
      const searchableText =
        msg.text ||
        msg.answer ||
        "";

      return searchableText
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        );
    });

  /* =========================================================
     NEW CHAT
  ========================================================= */

  const handleNewChat = () => {
    setMessage("");
    setMessages([]);
    setIsTyping(false);
    setActiveTool(null);
    setActivePanel(null);

    guidanceSentRef.current = "";

    if (messageInputRef.current) {
      messageInputRef.current.value = "";
    }
  };

  /* =========================================================
     TOOL CLICK
  ========================================================= */

  const handleToolClick = (
    index,
    tool
  ) => {
    setActiveTool(index);

    if (
      tool.title ===
      "Product Classification"
    ) {
      onClassification();
      return;
    }

    if (
      tool.title ===
      "IPR & Patent Guidance"
    ) {
      onIPR();
      return;
    }

    if (
      tool.title ===
      "Traditional Knowledge"
    ) {
      onTraditionalKnowledge();
      return;
    }

    if (
      tool.title ===
      "Biodiversity & ABS"
    ) {
      onABS();
      return;
    }

    if (
      tool.title ===
      "Regulatory Compliance"
    ) {
      onCompliance();
      return;
    }

    if (
      tool.title ===
      "Commercialise"
    ) {
      onCommercialise();
      return;
    }
  };

  /* =========================================================
     SEND CHAT MESSAGE
  ========================================================= */

  const handleSend = async (
    promptOverride = ""
  ) => {
    /*
      IMPORTANT:
      Read directly from the textarea ref first.

      This prevents the chatbot from failing if React state
      becomes stale or is reset before the button click.
    */

    const typedText =
      messageInputRef.current?.value || "";

    const userText =
      typeof promptOverride === "string" &&
      promptOverride.trim()
        ? promptOverride.trim()
        : typedText.trim() ||
          message.trim();

    if (!userText) {
      return;
    }

    if (isTyping) {
      return;
    }

    /* -----------------------------------------
       ADD USER MESSAGE
    ----------------------------------------- */

    const userMessage = {
      id: Date.now(),
      role: "user",
      text: userText
    };

    setMessages((prev) => [
      ...prev,
      userMessage
    ]);

    /* -----------------------------------------
       CLEAR INPUT
    ----------------------------------------- */

    setMessage("");

    if (messageInputRef.current) {
      messageInputRef.current.value = "";
      messageInputRef.current.style.height = "";
    }

    setIsTyping(true);

    try {
      /* -----------------------------------------
         CONVERSATION HISTORY
      ----------------------------------------- */

      const conversationHistory =
        messages
          .slice(-10)
          .map((msg) => ({
            role: msg.role,
            text: msg.text || "",
            answer: msg.answer || ""
          }));

      /* -----------------------------------------
         BACKEND REQUEST
      ----------------------------------------- */

      const response = await fetch(
        "http://localhost:5000/api/chat",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            message: userText,
            jurisdiction: jurisdiction,
            language: language,
            history: conversationHistory
          })
        }
      );

      /* -----------------------------------------
         READ RESPONSE
      ----------------------------------------- */

      const rawResponse =
        await response.text();

      let data;

      try {
        data = JSON.parse(
          rawResponse
        );
      } catch (parseError) {
        console.error(
          "Backend returned invalid JSON:",
          parseError
        );

        throw new Error(
          `Backend returned invalid response (HTTP ${response.status}).`
        );
      }

      /* -----------------------------------------
         CHECK HTTP ERROR
      ----------------------------------------- */

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            `Backend error: HTTP ${response.status}`
        );
      }

      /* -----------------------------------------
         CHECK AI ANSWER
      ----------------------------------------- */

      if (!data.answer) {
        throw new Error(
          "Backend responded, but no AI answer was returned."
        );
      }

      /* -----------------------------------------
         ASSISTANT MESSAGE
      ----------------------------------------- */

      const assistantMessage = {
        id: Date.now() + 1,

        role: "assistant",

        answer:
          data.answer,

        why:
          "VedaLex uses your current question, selected jurisdiction, language and recent conversation context.",

        routes: [
          "Confirm product classification",
          "Check applicable IPR and regulatory requirements",
          "Review Traditional Knowledge and prior-art concerns",
          "Check biodiversity and ABS requirements where relevant"
        ],

        sources:
          Array.isArray(data.sources)
            ? data.sources
            : [],

        confidence:
          data.confidence ||
          "AI-generated — verify against current official sources",

        disclaimer:
          data.disclaimer ||
          "This is informational guidance, not legal advice. Verify important decisions against current official sources or with a qualified professional."
      };

      /* -----------------------------------------
         ADD AI RESPONSE
      ----------------------------------------- */

      setMessages((prev) => [
        ...prev,
        assistantMessage
      ]);

    } catch (error) {
      console.error(
        "VedaLex chat error:",
        error
      );

      /* -----------------------------------------
         SHOW ERROR IN CHAT
      ----------------------------------------- */

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,

          role: "assistant",

          answer:
            "I couldn't connect to the VedaLex AI service right now.",

          why:
            error.message ||
            "Unknown error occurred.",

          routes: [
            "Make sure the VedaLex backend is running.",
            "Check that the backend is running on port 5000.",
            "Check your Gemini API configuration.",
            "Try sending the question again."
          ],

          sources: [],

          confidence:
            "Unavailable",

          disclaimer:
            "This is informational guidance, not legal advice."
        }
      ]);

    } finally {
      setIsTyping(false);

      /*
        Restore focus to input after response.
      */

      setTimeout(() => {
        messageInputRef.current?.focus();
      }, 0);
    }
  };

  /* =========================================================
     HANDLE TEXT INPUT
  ========================================================= */

  const handleInputChange = (e) => {
    const value = e.target.value;

    setMessage(value);

    /*
      Keep textarea height comfortable.
    */

    e.target.style.height = "auto";
    e.target.style.height =
      `${Math.min(e.target.scrollHeight, 150)}px`;
  };

  /* =========================================================
     QUICK PROMPT
  ========================================================= */

  const handleQuickPrompt = (prompt) => {
    setMessage(prompt);

    if (messageInputRef.current) {
      messageInputRef.current.value = prompt;
      messageInputRef.current.focus();

      messageInputRef.current.style.height =
        "auto";

      messageInputRef.current.style.height =
        `${Math.min(
          messageInputRef.current.scrollHeight,
          150
        )}px`;
    }
  };

  /* =========================================================
     CLASSIFICATION → CHECK → CHATBOT
  ========================================================= */

  useEffect(() => {
    if (!initialPrompt) return;

    if (
      guidanceSentRef.current ===
      initialPrompt
    ) {
      return;
    }

    const timer = setTimeout(() => {
      if (
        guidanceSentRef.current ===
        initialPrompt
      ) {
        return;
      }

      guidanceSentRef.current =
        initialPrompt;

      /*
        Auto-generated guidance does not depend
        on the textarea state.
      */

      handleSend(initialPrompt);
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [initialPrompt]);

  /* =========================================================
     RESEARCH LIBRARY
  ========================================================= */

  const researchSources = [
    [
      "Ayurvedic Formulary of India",
      "Ministry of AYUSH",
      "Reference"
    ],
    [
      "Patents Act & Rules",
      "Indian Patent Framework",
      "IPR"
    ],
    [
      "Biological Diversity Framework",
      "Biodiversity & ABS",
      "ABS"
    ],
    [
      "Traditional Knowledge Digital Library",
      "TK / Prior Art",
      "Traditional Knowledge"
    ],
    [
      "FSSAI Ayurveda-Aahar Regulations",
      "Food & Nutraceutical Compliance",
      "Food"
    ],
    [
      "Trade Marks Act",
      "Intellectual Property",
      "Trademark"
    ],
    [
      "Geographical Indications",
      "Intellectual Property",
      "GI"
    ],
    [
      "Designs Act",
      "Intellectual Property",
      "Design"
    ],
    [
      "Copyright Act",
      "Intellectual Property",
      "Copyright"
    ]
  ];

  const filteredSources =
    researchSources.filter(
      ([title, desc, type]) =>
        `${title} ${desc} ${type}`
          .toLowerCase()
          .includes(
            librarySearch.toLowerCase()
          )
    );

  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <div className="dashboard">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`sidebar ${
          sidebarOpen
            ? "open"
            : "closed"
        }`}
      >

        <div className="sidebar-header">

          {sidebarOpen && (
            <img
              src="/vedalex-logo.png"
              alt="VedaLex"
              className="sidebar-logo"
            />
          )}

          <button
            className="close-sidebar"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <X size={20} />
          </button>

        </div>

        <button
          className="new-chat-button"
          onClick={handleNewChat}
        >
          <Plus size={20} />

          {sidebarOpen && (
            <span>
              New Chat
            </span>
          )}
        </button>

        <nav className="sidebar-nav">

          <button
            onClick={() =>
              openPanel("search")
            }
          >
            <Search size={19} />

            {sidebarOpen && (
              <span>
                Search Chats
              </span>
            )}
          </button>

          <button
            onClick={() =>
              openPanel("library")
            }
          >
            <BookOpen size={19} />

            {sidebarOpen && (
              <span>
                Research Library
              </span>
            )}
          </button>

          <button
            onClick={() =>
              openPanel("settings")
            }
          >
            <Settings size={19} />

            {sidebarOpen && (
              <span>
                Settings
              </span>
            )}
          </button>

          <button
            onClick={() =>
              openPanel("account")
            }
          >
            <User size={19} />

            {sidebarOpen && (
              <span>
                Account
              </span>
            )}
          </button>

        </nav>

        {sidebarOpen && (
          <div className="sidebar-bottom">

            <div className="privacy-badge">

              <ShieldCheck
                size={18}
              />

              <div>

                <strong>
                  Privacy First
                </strong>

                <span>
                  Your information stays protected.
                </span>

              </div>

            </div>

          </div>
        )}

      </aside>

      {/* =====================================================
          PANELS
      ===================================================== */}

      {activePanel && (
        <div
          onClick={() =>
            setActivePanel(null)
          }
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(23,59,42,0.35)",
            zIndex: 1000,
            display: "flex",
            justifyContent:
              "center",
            alignItems:
              "center",
            padding: "24px"
          }}
        >

          <div
            onClick={(e) =>
              e.stopPropagation()
            }
            style={{
              width:
                "min(720px, 100%)",
              maxHeight:
                "85vh",
              overflowY:
                "auto",
              background:
                "#F4F0E7",
              borderRadius:
                "20px",
              padding:
                "28px",
              boxShadow:
                "0 24px 70px rgba(0,0,0,0.22)",
              color:
                "#173B2A"
            }}
          >

            <div
              style={{
                display:
                  "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
                marginBottom:
                  "22px"
              }}
            >

              <h2
                style={{
                  margin: 0,
                  fontWeight: 700,
                  fontSize: "26px",
                  color:
                    "#173B2A"
                }}
              >

                {activePanel ===
                  "search" &&
                  "Search Chats"}

                {activePanel ===
                  "library" &&
                  "Research Library"}

                {activePanel ===
                  "settings" &&
                  "Settings"}

                {activePanel ===
                  "account" &&
                  "Account"}

              </h2>

              <button
                onClick={() =>
                  setActivePanel(null)
                }
                style={{
                  border: "none",
                  background:
                    "white",
                  color:
                    "#173B2A",
                  borderRadius:
                    "10px",
                  padding:
                    "8px",
                  cursor:
                    "pointer"
                }}
              >
                <X size={19} />
              </button>

            </div>

            {/* SEARCH */}

            {activePanel ===
              "search" && (
              <div>

                <input
                  value={
                    searchTerm
                  }
                  onChange={(e) =>
                    setSearchTerm(
                      e.target.value
                    )
                  }
                  placeholder="Search your current chat..."
                  style={{
                    width: "100%",
                    boxSizing:
                      "border-box",
                    padding:
                      "13px 15px",
                    border:
                      "1px solid #c9d5ce",
                    borderRadius:
                      "12px",
                    marginBottom:
                      "16px",
                    fontSize:
                      "15px"
                  }}
                />

                {filteredMessages.length ===
                0 ? (
                  <p
                    style={{
                      color:
                        "#52645b"
                    }}
                  >
                    No matching
                    messages yet.
                  </p>
                ) : (
                  filteredMessages.map(
                    (msg) => (
                      <div
                        key={msg.id}
                        style={{
                          background:
                            "white",
                          padding:
                            "14px",
                          borderRadius:
                            "12px",
                          marginBottom:
                            "10px"
                        }}
                      >

                        <strong>
                          {msg.role ===
                          "user"
                            ? "You"
                            : "VedaLex"}
                        </strong>

                        <div
                          style={{
                            marginTop:
                              "6px"
                          }}
                        >
                          {msg.role ===
                          "user"
                            ? msg.text
                            : renderMarkdown(
                                msg.answer
                              )}
                        </div>

                      </div>
                    )
                  )
                )}

              </div>
            )}

            {/* LIBRARY */}

            {activePanel ===
              "library" && (
              <div>

                <input
                  value={
                    librarySearch
                  }
                  onChange={(e) =>
                    setLibrarySearch(
                      e.target.value
                    )
                  }
                  placeholder="Search Ayurveda texts, laws, rules..."
                  style={{
                    width: "100%",
                    boxSizing:
                      "border-box",
                    padding:
                      "13px 15px",
                    border:
                      "1px solid #c9d5ce",
                    borderRadius:
                      "12px",
                    marginBottom:
                      "18px",
                    fontSize:
                      "15px"
                  }}
                />

                {filteredSources.map(
                  ([title, desc, type]) => (
                    <div
                      key={title}
                      style={{
                        background:
                          "white",
                        padding:
                          "17px",
                        borderRadius:
                          "14px",
                        marginBottom:
                          "11px",
                        borderLeft:
                          "4px solid #FAA51E"
                      }}
                    >

                      <div
                        style={{
                          display:
                            "flex",
                          justifyContent:
                            "space-between",
                          alignItems:
                            "center",
                          gap:
                            "12px"
                        }}
                      >

                        <strong>
                          {title}
                        </strong>

                        <span
                          style={{
                            background:
                              "#F9E7B5",
                            padding:
                              "5px 9px",
                            borderRadius:
                              "20px",
                            fontSize:
                              "12px",
                            fontWeight:
                              700
                          }}
                        >
                          {type}
                        </span>

                      </div>

                      <p
                        style={{
                          margin:
                            "6px 0 0",
                          color:
                            "#52645b"
                        }}
                      >
                        {desc}
                      </p>

                    </div>
                  )
                )}

              </div>
            )}

            {/* SETTINGS */}

            {activePanel ===
              "settings" && (
              <div>

                <div
                  style={{
                    background:
                      "white",
                    padding:
                      "18px",
                    borderRadius:
                      "14px",
                    marginBottom:
                      "16px"
                  }}
                >

                  <div
                    style={{
                      fontWeight:
                        800,
                      fontSize:
                        "16px"
                    }}
                  >
                    Language &
                    Jurisdiction
                  </div>

                  <label
                    style={{
                      display:
                        "block",
                      fontWeight:
                        700,
                      margin:
                        "16px 0 8px"
                    }}
                  >
                    Language
                  </label>

                  <select
                    value={
                      language
                    }
                    onChange={(e) =>
                      setLanguage(
                        e.target.value
                      )
                    }
                    style={{
                      width:
                        "100%",
                      padding:
                        "12px",
                      border:
                        "1px solid #c9d5ce",
                      borderRadius:
                        "11px",
                      background:
                        "#F4F0E7"
                    }}
                  >

                    {languages.map(
                      (lang) => (
                        <option
                          key={lang}
                          value={lang}
                        >
                          {lang}
                        </option>
                      )
                    )}

                  </select>

                  <label
                    style={{
                      display:
                        "block",
                      fontWeight:
                        700,
                      margin:
                        "16px 0 8px"
                    }}
                  >
                    Legal
                    Jurisdiction
                  </label>

                  <select
                    value={
                      jurisdiction
                    }
                    onChange={(e) =>
                      setJurisdiction(
                        e.target.value
                      )
                    }
                    style={{
                      width:
                        "100%",
                      padding:
                        "12px",
                      border:
                        "1px solid #c9d5ce",
                      borderRadius:
                        "11px",
                      background:
                        "#F4F0E7"
                    }}
                  >

                    <option value="India">
                      India
                    </option>

                    <option value="International">
                      International
                    </option>

                  </select>

                </div>

                <div
                  style={{
                    background:
                      "white",
                    padding:
                      "18px",
                    borderRadius:
                      "14px"
                  }}
                >

                  <h3
                    style={{
                      marginTop: 0
                    }}
                  >
                    Answer
                    Preferences
                  </h3>

                  {[
                    [
                      "Show source citations",
                      showCitations,
                      setShowCitations
                    ],
                    [
                      "Show confidence score",
                      showConfidence,
                      setShowConfidence
                    ],
                    [
                      "Privacy mode",
                      privacyMode,
                      setPrivacyMode
                    ]
                  ].map(
                    ([
                      label,
                      value,
                      setter
                    ]) => (
                      <div
                        key={label}
                        style={{
                          display:
                            "flex",
                          justifyContent:
                            "space-between",
                          alignItems:
                            "center",
                          padding:
                            "13px 0",
                          borderTop:
                            "1px solid #edf1ee"
                        }}
                      >

                        <strong>
                          {label}
                        </strong>

                        <button
                          onClick={() =>
                            setter(
                              !value
                            )
                          }
                          style={{
                            width:
                              "52px",
                            height:
                              "30px",
                            border:
                              "none",
                            borderRadius:
                              "20px",
                            background:
                              value
                                ? "#2C633D"
                                : "#b8c5bd",
                            padding:
                              "3px",
                            cursor:
                              "pointer"
                          }}
                        >

                          <span
                            style={{
                              display:
                                "block",
                              width:
                                "24px",
                              height:
                                "24px",
                              borderRadius:
                                "50%",
                              background:
                                "white",
                              transform:
                                value
                                  ? "translateX(22px)"
                                  : "translateX(0)",
                              transition:
                                "0.2s"
                            }}
                          />

                        </button>

                      </div>
                    )
                  )}

                </div>

                <button
                  onClick={() => {
                    setMessages([]);
                    setMessage("");

                    if (
                      messageInputRef.current
                    ) {
                      messageInputRef.current.value =
                        "";
                      messageInputRef.current.style.height =
                        "";
                    }
                  }}
                  style={{
                    marginTop:
                      "18px",
                    padding:
                      "12px 16px",
                    border:
                      "none",
                    borderRadius:
                      "10px",
                    background:
                      "#FAA51E",
                    color:
                      "#173B2A",
                    fontWeight:
                      800,
                    cursor:
                      "pointer"
                  }}
                >
                  Clear Chat
                </button>

              </div>
            )}

            {/* ACCOUNT */}

            {activePanel ===
              "account" && (
              <div>

                <div
                  style={{
                    background:
                      "white",
                    padding:
                      "20px",
                    borderRadius:
                      "14px",
                    marginBottom:
                      "18px"
                  }}
                >

                  <strong>
                    VedaLex Account
                  </strong>

                  <p
                    style={{
                      color:
                        "#52645b"
                    }}
                  >
                    Your workspace for
                    Ayurveda IPR and
                    regulatory guidance.
                  </p>

                </div>

                <button
                  onClick={onLogout}
                  style={{
                    padding:
                      "12px 18px",
                    border:
                      "none",
                    borderRadius:
                      "11px",
                    background:
                      "#173B2A",
                    color:
                      "white",
                    fontWeight:
                      700,
                    cursor:
                      "pointer"
                  }}
                >
                  Log Out
                </button>

              </div>
            )}

          </div>
        </div>
      )}

      {/* =====================================================
          MAIN AREA
      ===================================================== */}

      <main className="main-area">

        {/* TOPBAR */}

        <header className="topbar">

          <button
            className="menu-button"
            onClick={() =>
              setSidebarOpen(
                !sidebarOpen
              )
            }
          >
            <Menu size={23} />
          </button>

          <div className="topbar-title">

            <span>
              VedaLex
            </span>

            <small>
              Ayurveda × Law × Intelligence
            </small>

          </div>

          <div className="topbar-right">

            <div className="jurisdiction">

              <span>🌐</span>

              <select
                value={language}
                onChange={(e) =>
                  setLanguage(
                    e.target.value
                  )
                }
              >

                {languages.map(
                  (lang) => (
                    <option
                      key={lang}
                      value={lang}
                    >
                      {lang}
                    </option>
                  )
                )}

              </select>

              <ChevronDown
                size={15}
              />

            </div>

            <div className="jurisdiction">

              <Globe size={17} />

              <select
                value={
                  jurisdiction
                }
                onChange={(e) =>
                  setJurisdiction(
                    e.target.value
                  )
                }
              >

                <option value="India">
                  India
                </option>

                <option value="International">
                  International
                </option>

              </select>

              <ChevronDown
                size={15}
              />

            </div>

            <button
              className="profile-button"
              onClick={() =>
                openPanel("account")
              }
            >
              <User size={19} />
            </button>

          </div>

        </header>

        {/* ===================================================
            CHAT AREA
        =================================================== */}

        <section className="chat-area">

          {/* WELCOME */}

          {messages.length ===
            0 && (
            <div className="welcome-section">

              <img
                src="/vedalex-logo.png"
                alt="VedaLex"
                className="chat-logo"
              />

              <h1
                style={{
                  color:
                    "#173B2A"
                }}
              >
                How can VedaLex
                help you?
              </h1>

              <p
                style={{
                  color:
                    "#3F7F9D"
                }}
              >
                Ask about Ayurveda
                IPR, Traditional
                Knowledge, biodiversity,
                product classification
                or regulatory
                requirements.
              </p>

              <div
                style={{
                  display:
                    "flex",
                  flexWrap:
                    "wrap",
                  justifyContent:
                    "center",
                  gap: "9px",
                  marginTop:
                    "22px",
                  maxWidth:
                    "760px"
                }}
              >

                {[
                  "Can my Ayurvedic formulation be patented?",
                  "How do I check Traditional Knowledge?",
                  "Do I need ABS approval for an Indian plant?",
                  "Which category does my Ayurveda product fall under?"
                ].map(
                  (prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() =>
                        handleQuickPrompt(
                          prompt
                        )
                      }
                      style={{
                        border:
                          "1px solid #c9d5ce",
                        background:
                          "#F4F0E7",
                        color:
                          "#173B2A",
                        borderRadius:
                          "999px",
                        padding:
                          "10px 14px",
                        cursor:
                          "pointer",
                        fontSize:
                          "13px"
                      }}
                    >
                      {prompt}
                    </button>
                  )
                )}

              </div>

              <div
                className="welcome-sanskrit"
              >
                ज्ञानं परं बलम्
              </div>

              <span
                className="welcome-sanskrit-meaning"
              >
                Knowledge is the
                greatest strength.
              </span>

            </div>
          )}

          {/* ===================================================
              MESSAGES
          =================================================== */}

          {messages.length >
            0 && (
            <div
              className="messages-container"
              style={{
                width:
                  "min(900px, 100%)",
                margin:
                  "0 auto",
                padding:
                  "25px 20px 130px",
                boxSizing:
                  "border-box"
              }}
            >

              {messages.map(
                (msg) => (
                  <div
                    key={msg.id}
                    className={`message-row ${msg.role}`}
                    style={{
                      display:
                        "flex",
                      alignItems:
                        "flex-start",
                      gap:
                        "12px",
                      width:
                        "100%",
                      marginBottom:
                        "28px",
                      textAlign:
                        "left"
                    }}
                  >

                    <div
                      className="message-avatar"
                      style={{
                        flexShrink:
                          0
                      }}
                    >
                      {msg.role ===
                      "user"
                        ? "You"
                        : "V"}
                    </div>

                    <div
                      className="message-content"
                      style={{
                        flex: 1,
                        minWidth: 0,
                        textAlign:
                          "left"
                      }}
                    >

                      <span
                        className="message-name"
                        style={{
                          display:
                            "block",
                          marginBottom:
                            "8px",
                          color:
                            "#173B2A",
                          fontWeight:
                            700
                        }}
                      >
                        {msg.role ===
                        "user"
                          ? "You"
                          : "VedaLex"}
                      </span>

                      {msg.role ===
                      "user" ? (

                        <div
                          style={{
                            display:
                              "inline-block",
                            background:
                              "#E7EFE9",
                            color:
                              "#173B2A",
                            padding:
                              "12px 16px",
                            borderRadius:
                              "14px",
                            maxWidth:
                              "80%",
                            fontSize:
                              "15px",
                            lineHeight:
                              1.55
                          }}
                        >
                          {msg.text}
                        </div>

                      ) : (

                        <div
                          className="assistant-response"
                          style={{
                            background:
                              "#FFFFFF",
                            border:
                              "1px solid #DCE5DF",
                            borderRadius:
                              "16px",
                            padding:
                              "20px 22px",
                            boxShadow:
                              "0 4px 18px rgba(23,59,42,0.06)",
                            textAlign:
                              "left",
                            maxWidth:
                              "100%",
                            boxSizing:
                              "border-box"
                          }}
                        >

                          <div
                            style={{
                              textAlign:
                                "left"
                            }}
                          >
                            {renderMarkdown(
                              msg.answer
                            )}
                          </div>

                          {msg.why && (
                            <div
                              style={{
                                marginTop:
                                  "18px",
                                padding:
                                  "15px 17px",
                                background:
                                  "#F4F0E7",
                                borderRadius:
                                  "12px",
                                borderLeft:
                                  "4px solid #3F7F9D"
                              }}
                            >

                              <strong
                                style={{
                                  display:
                                    "block",
                                  marginBottom:
                                    "6px",
                                  color:
                                    "#173B2A"
                                }}
                              >
                                Why this
                                matters
                              </strong>

                              <span
                                style={{
                                  color:
                                    "#52645b",
                                  fontSize:
                                    "14px",
                                  lineHeight:
                                    1.6
                                }}
                              >
                                {msg.why}
                              </span>

                            </div>
                          )}

                          {msg.routes &&
                            msg.routes.length >
                              0 && (
                              <div
                                style={{
                                  marginTop:
                                    "18px",
                                  padding:
                                    "15px 17px",
                                  background:
                                    "#F9E7B5",
                                  borderRadius:
                                    "12px"
                                }}
                              >

                                <strong
                                  style={{
                                    display:
                                      "block",
                                    marginBottom:
                                      "9px",
                                    color:
                                      "#173B2A"
                                  }}
                                >
                                  Recommended
                                  checks
                                </strong>

                                <ol
                                  style={{
                                    margin:
                                      0,
                                    paddingLeft:
                                      "22px"
                                  }}
                                >

                                  {msg.routes.map(
                                    (
                                      route,
                                      index
                                    ) => (
                                      <li
                                        key={
                                          index
                                        }
                                        style={{
                                          marginBottom:
                                            "6px",
                                          color:
                                            "#40584B",
                                          lineHeight:
                                            1.55
                                        }}
                                      >
                                        {route}
                                      </li>
                                    )
                                  )}

                                </ol>

                              </div>
                            )}

                          {showCitations &&
                            msg.sources &&
                            msg.sources.length >
                              0 && (
                              <div
                                style={{
                                  marginTop:
                                    "18px"
                                }}
                              >

                                <strong
                                  style={{
                                    display:
                                      "block",
                                    color:
                                      "#173B2A",
                                    marginBottom:
                                      "8px"
                                  }}
                                >
                                  Sources
                                </strong>

                                {msg.sources.map(
                                  (
                                    source,
                                    index
                                  ) => (
                                    <div
                                      key={
                                        index
                                      }
                                      style={{
                                        display:
                                          "flex",
                                        alignItems:
                                          "flex-start",
                                        gap:
                                          "7px",
                                        fontSize:
                                          "13px",
                                        color:
                                          "#52645b",
                                        marginBottom:
                                          "8px"
                                      }}
                                    >

                                      <BookOpen
                                        size={14}
                                        style={{
                                          flexShrink:
                                            0,
                                          marginTop:
                                            "2px"
                                        }}
                                      />

                                      <div>

                                        <div
                                          style={{
                                            fontWeight:
                                              600,
                                            color:
                                              "#173B2A"
                                          }}
                                        >
                                          {
                                            source.title
                                          }
                                        </div>

                                        <div
                                          style={{
                                            fontSize:
                                              "12px",
                                            color:
                                              "#52645b"
                                          }}
                                        >
                                          {
                                            source.authority
                                          }
                                        </div>

                                        {source.officialSource && (
                                          <div
                                            style={{
                                              fontSize:
                                                "11px",
                                              color:
                                                "#3F7F9D",
                                              marginTop:
                                                "2px",
                                              wordBreak:
                                                "break-all"
                                            }}
                                          >
                                            {
                                              source.officialSource
                                            }
                                          </div>
                                        )}

                                      </div>

                                    </div>
                                  )
                                )}

                              </div>
                            )}

         {showConfidence &&
  msg.confidence && (
    <div
      style={{
        marginTop: "18px",
        padding: "12px 14px",
        background: "#EEF3EF",
        borderRadius: "9px",
        fontSize: "12px",
        color: "#52645b",
        lineHeight: 1.6
      }}
    >
      <strong style={{ color: "#173B2A" }}>
        Confidence:
      </strong>

      {typeof msg.confidence === "object" ? (
        <div style={{ marginTop: "5px" }}>
          {msg.confidence.level && (
            <div>
              <strong>Level:</strong>{" "}
              {msg.confidence.level}
            </div>
          )}

          {msg.confidence.score !== undefined && (
            <div>
              <strong>Score:</strong>{" "}
              {msg.confidence.score}
            </div>
          )}

          {msg.confidence.coverage && (
            <div>
              <strong>Coverage:</strong>{" "}
              {msg.confidence.coverage}
            </div>
          )}

          {msg.confidence.reason && (
            <div style={{ marginTop: "3px" }}>
              <strong>Reason:</strong>{" "}
              {msg.confidence.reason}
            </div>
          )}
        </div>
      ) : (
        <span> {msg.confidence}</span>
      )}
    </div>
  )}

                          {msg.disclaimer && (
                            <div
                              style={{
                                display:
                                  "flex",
                                alignItems:
                                  "flex-start",
                                gap:
                                  "8px",
                                marginTop:
                                  "15px",
                                padding:
                                  "12px 13px",
                                borderTop:
                                  "1px solid #E2E8E4",
                                color:
                                  "#68776E",
                                fontSize:
                                  "12px",
                                lineHeight:
                                  1.5
                              }}
                            >

                              <ShieldCheck
                                size={15}
                                style={{
                                  flexShrink:
                                    0,
                                  marginTop:
                                    "2px"
                                }}
                              />

                              <span>
                                {
                                  msg.disclaimer
                                }
                              </span>

                            </div>
                          )}

                        </div>

                      )}

                    </div>

                  </div>
                )
              )}

              {/* TYPING */}

              {isTyping && (
                <div
                  style={{
                    display:
                      "flex",
                    alignItems:
                      "flex-start",
                    gap:
                      "12px",
                    marginBottom:
                      "28px"
                  }}
                >

                  <div
                    className="message-avatar"
                  >
                    V
                  </div>

                  <div>

                    <span
                      style={{
                        display:
                          "block",
                        marginBottom:
                          "8px",
                        color:
                          "#173B2A",
                        fontWeight:
                          700
                      }}
                    >
                      VedaLex
                    </span>

                    <div
                      style={{
                        display:
                          "flex",
                        alignItems:
                          "center",
                        gap:
                          "7px",
                        background:
                          "white",
                        border:
                          "1px solid #DCE5DF",
                        padding:
                          "13px 16px",
                        borderRadius:
                          "14px"
                      }}
                    >

                      <span
                        style={{
                          color:
                            "#2C633D",
                          fontSize:
                            "13px"
                        }}
                      >
                        Checking your
                        query…
                      </span>

                    </div>

                  </div>

                </div>
              )}

            </div>
          )}

          {/* ===================================================
              TOOLS
          =================================================== */}

          {messages.length ===
            0 && (
            <div className="tool-grid">

              {tools.map(
                (tool, index) => (
                  <button
                    key={index}
                    className={`tool-card ${
                      activeTool ===
                      index
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      handleToolClick(
                        index,
                        tool
                      )
                    }
                  >

                    <div className="tool-icon">
                      {tool.icon}
                    </div>

                    <div className="tool-text">

                      <h3>
                        {tool.title}
                      </h3>

                      <p>
                        {tool.description}
                      </p>

                    </div>

                  </button>
                )
              )}

            </div>
          )}

          {/* ===================================================
              JOURNEY
          =================================================== */}

          {messages.length ===
            0 && (
            <div
              className="journey-card"
            >

              <div
                className="journey-heading"
              >

                <div>

                  <span
                    className="eyebrow"
                  >
                    VedaLex Intelligence
                  </span>

                  <h2>
                    Classify →
                    Check →
                    Protect →
                    Comply →
                    Commercialise
                  </h2>

                </div>

              </div>

             <div className="journey-steps">

  <button
    type="button"
    className="journey-step active"
    onClick={onClassification}
  >
    <span>1</span>
    <strong>Classify</strong>
  </button>

  <div className="journey-line"></div>

  <button
    type="button"
    className="journey-step"
    onClick={onCheck}
  >
    <span>2</span>
    <strong>Check</strong>
  </button>

  <div className="journey-line"></div>

  <button
    type="button"
    className="journey-step"
    onClick={onIPR}
  >
    <span>3</span>
    <strong>Protect</strong>
  </button>

  <div className="journey-line"></div>

  <button
    type="button"
    className="journey-step"
    onClick={onCompliance}
  >
    <span>4</span>
    <strong>Comply</strong>
  </button>

  <div className="journey-line"></div>

  <button
    type="button"
    className="journey-step"
    onClick={onCommercialise}
  >
    <span>5</span>
    <strong>Commercialise</strong>
  </button>

</div>


            </div>
          )}

          {/* ===================================================
              CONTEXT
          =================================================== */}

          <div
            style={{
              display:
                "flex",
              justifyContent:
                "center",
              marginBottom:
                "10px"
            }}
          >

            <div
              style={{
                display:
                  "inline-flex",
                alignItems:
                  "center",
                gap:
                  "7px",
                padding:
                  "7px 11px",
                borderRadius:
                  "999px",
                background:
                  "#F4F0E7",
                border:
                  "1px solid #d7e0da",
                color:
                  "#52645b",
                fontSize:
                  "12px"
              }}
            >

              <Globe size={14} />

              <span>
                {jurisdiction}
              </span>

              <span>
                •
              </span>

              <span>
                {language}
              </span>

              {privacyMode && (
                <>
                  <span>
                    •
                  </span>

                  <span>
                    Privacy mode
                  </span>
                </>
              )}

            </div>

          </div>

          {/* ===================================================
              INPUT
          =================================================== */}

          <div
            className="chat-input-container"
          >

            <textarea
              ref={messageInputRef}
              defaultValue=""
              placeholder="Ask VedaLex about your Ayurveda product..."
              rows={1}
              disabled={isTyping}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey
                ) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />

            <button
              type="button"
              className="send-button"
              onClick={() =>
                handleSend()
              }
              disabled={
                isTyping
              }
              aria-label="Send message"
              title="Send message"
            >
              <Send size={20} />
            </button>

          </div>

          <p className="input-note">
            VedaLex provides
            AI-generated guidance.
            Verify important legal
            and regulatory decisions
            against current official
            sources or with a
            qualified professional.
          </p>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;