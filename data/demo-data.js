window.alphaSourceDemoData = {
  summary: {
    region: "Mexico",
    frameworks: "NIST AI RMF / ISO 42001 / ISO 27001",
    snapshot: "Q2 2026"
  },
  useCases: [
    {
      id: "uc-claims-copilot",
      title: "Insurance claims intake copilot",
      owner: "Claims Ops",
      vendor: "Claude",
      status: "Approved with conditions",
      sensitivity: "Sensitive PII",
      risk: "High",
      description: "Internal assistant used by claims analysts to summarize intake notes and propose triage categories.",
      reviewDate: "2026-07-15",
      controls: ["CTRL-01", "CTRL-03", "CTRL-05"],
      evidence: ["Board Risk Snapshot", "Legal and Compliance Review Pack"],
      bullets: ["Requires masked exports", "Quarterly model review", "Manual override required"]
    },
    {
      id: "uc-support-assistant",
      title: "Customer support knowledge assistant",
      owner: "Customer Experience",
      vendor: "OpenAI / ChatGPT Enterprise",
      status: "Active",
      sensitivity: "Internal only",
      risk: "Medium",
      description: "AI search assistant grounded on approved support documentation and process runbooks.",
      reviewDate: "2026-08-02",
      controls: ["CTRL-02", "CTRL-03", "CTRL-06"],
      evidence: ["Customer Security Questionnaire Pack"],
      bullets: ["Prompt library versioned", "Audit log retention 180 days", "Escalation path defined"]
    },
    {
      id: "uc-sales-drafting",
      title: "Sales proposal drafting workflow",
      owner: "Revenue Ops",
      vendor: "Microsoft Copilot",
      status: "Pending refresh",
      sensitivity: "Commercial",
      risk: "Medium",
      description: "Generates first-draft proposal language using approved templates and account notes.",
      reviewDate: "2026-06-29",
      controls: ["CTRL-02", "CTRL-04"],
      evidence: ["Board Risk Snapshot", "Customer Security Questionnaire Pack"],
      bullets: ["Needs CRM access review", "Legal disclaimer block required", "No pricing auto-send"]
    },
    {
      id: "uc-fintech-kyc",
      title: "Fintech onboarding document classifier",
      owner: "Risk Ops",
      vendor: "Claude",
      status: "Pending approval",
      sensitivity: "Sensitive KYC data",
      risk: "High",
      description: "Classifies onboarding documents and flags missing KYC artifacts for financial-services intake teams.",
      reviewDate: "2026-06-30",
      controls: ["CTRL-01", "CTRL-04", "CTRL-05", "CTRL-06"],
      evidence: ["Legal and Compliance Review Pack", "Board Risk Snapshot"],
      bullets: ["Control plan draft ready", "Red-team test not completed", "Data minimization exceptions under review"]
    },
    {
      id: "uc-legal-summary",
      title: "Legal contract summarization bot",
      owner: "Legal Ops",
      vendor: "OpenAI / ChatGPT Enterprise",
      status: "Pending approval",
      sensitivity: "Confidential contracts",
      risk: "Medium",
      description: "Summarizes contracts and highlights negotiation deltas for internal legal review before counsel signoff.",
      reviewDate: "2026-06-28",
      controls: ["CTRL-02", "CTRL-03", "CTRL-06"],
      evidence: ["Legal and Compliance Review Pack"],
      bullets: ["Needs vendor legal review", "Human approval required", "Model output disclaimer missing"]
    }
  ],
  approvals: [
    {
      id: "apr-legal-bot",
      useCaseId: "uc-legal-summary",
      title: "Legal contract summarization bot",
      requester: "Legal Ops",
      decisionBy: "2026-06-28",
      status: "Pending",
      risk: "Medium",
      owner: "Mariana Ruiz",
      conditions: ["Finish vendor legal review", "Add lawyer-only access group", "Publish prompt restrictions"],
      blockers: ["Outside counsel terms not mapped"],
      notes: "Legal wants faster first-pass review but needs tighter evidence for contract data handling."
    },
    {
      id: "apr-fintech-kyc",
      useCaseId: "uc-fintech-kyc",
      title: "Fintech onboarding document classifier",
      requester: "Risk Ops",
      decisionBy: "2026-06-30",
      status: "Pending",
      risk: "High",
      owner: "Javier Ortega",
      conditions: ["Complete red-team exercise", "Approve exception for sample retention", "Add manual quality gate"],
      blockers: ["Sensitive KYC data", "No adversarial abuse test"],
      notes: "This workflow is commercially valuable but likely needs conditional approval with strict oversight."
    },
    {
      id: "apr-sales-refresh",
      useCaseId: "uc-sales-drafting",
      title: "Sales proposal drafting workflow refresh",
      requester: "Revenue Ops",
      decisionBy: "2026-07-02",
      status: "Escalated",
      risk: "Medium",
      owner: "Sofia Navarro",
      conditions: ["Restrict CRM export fields", "Block external sharing", "Refresh user training acknowledgment"],
      blockers: ["CRM field inventory outdated"],
      notes: "Existing workflow is active in a narrow pilot but needs expanded controls before a broader rollout."
    }
  ],
  vendors: [
    {
      id: "vendor-claude",
      name: "Claude",
      category: "Model provider",
      status: "Legal in progress",
      dataExposure: "Medium",
      renewal: "Q4 2026",
      description: "Used for internal copilots and knowledge workflows where stronger long-form reasoning is preferred.",
      checkpoints: [
        { label: "Security review", state: "done" },
        { label: "Legal review", state: "in-progress" },
        { label: "Procurement", state: "done" },
        { label: "Retention review", state: "blocked" }
      ],
      actions: ["Add approved use policy", "Review retention defaults", "Map model usage to business owners"]
    },
    {
      id: "vendor-openai",
      name: "OpenAI / ChatGPT Enterprise",
      category: "Model provider",
      status: "Reviewed",
      dataExposure: "Medium",
      renewal: "Q1 2027",
      description: "Used for support and internal drafting workflows with structured approval and logging expectations.",
      checkpoints: [
        { label: "Security review", state: "done" },
        { label: "Legal review", state: "done" },
        { label: "Customer evidence", state: "done" },
        { label: "Connector review", state: "in-progress" }
      ],
      actions: ["Customer evidence pack available", "Prompt handling restrictions defined", "Connector review pending"]
    },
    {
      id: "vendor-copilot",
      name: "Microsoft Copilot",
      category: "Productivity platform",
      status: "Reviewed with gaps",
      dataExposure: "Medium",
      renewal: "Q3 2026",
      description: "Used in Microsoft 365 workflows for document drafting and meeting summarization.",
      checkpoints: [
        { label: "Security review", state: "done" },
        { label: "Legal review", state: "done" },
        { label: "SharePoint mapping", state: "blocked" },
        { label: "Usage telemetry", state: "in-progress" }
      ],
      actions: ["Needs SharePoint access mapping", "User enablement policy update", "Usage metrics not centralized"]
    }
  ],
  controls: [
    {
      id: "CTRL-01",
      title: "Sensitive-data minimization",
      framework: "NIST AI RMF Map / ISO 42001",
      maturity: "Partial",
      owner: "Security Engineering",
      appliesTo: ["uc-claims-copilot", "uc-fintech-kyc"],
      gap: "Masked exports exist, but exception handling is not standardized."
    },
    {
      id: "CTRL-02",
      title: "Prompt and output governance",
      framework: "NIST AI RMF Govern",
      maturity: "Managed",
      owner: "AI Governance Office",
      appliesTo: ["uc-support-assistant", "uc-sales-drafting", "uc-legal-summary"],
      gap: "Prompt library exists, but disclaimer coverage is inconsistent."
    },
    {
      id: "CTRL-03",
      title: "Human oversight gate",
      framework: "ISO 42001 / NIST AI RMF Manage",
      maturity: "Managed",
      owner: "Business Operations",
      appliesTo: ["uc-claims-copilot", "uc-support-assistant", "uc-legal-summary"],
      gap: "Manual approval exists, but evidence of reviewer completion is not centralized."
    },
    {
      id: "CTRL-04",
      title: "System access scoping",
      framework: "ISO 27001",
      maturity: "Initial",
      owner: "Identity and Access",
      appliesTo: ["uc-sales-drafting", "uc-fintech-kyc"],
      gap: "Connected-system field scopes are still documented manually."
    },
    {
      id: "CTRL-05",
      title: "Model robustness testing",
      framework: "NIST AI RMF Measure",
      maturity: "Initial",
      owner: "Security Validation",
      appliesTo: ["uc-claims-copilot", "uc-fintech-kyc"],
      gap: "Red-team exercises are not complete for high-sensitivity workflows."
    },
    {
      id: "CTRL-06",
      title: "Logging and audit trail",
      framework: "ISO 42001 / ISO 27001",
      maturity: "Managed",
      owner: "Platform Operations",
      appliesTo: ["uc-support-assistant", "uc-fintech-kyc", "uc-legal-summary"],
      gap: "Logs are retained, but exportable evidence is not yet standardized by audience."
    }
  ],
  remediations: [
    {
      title: "Run red-team exercise for fintech classifier",
      owner: "Security Validation",
      dueDate: "2026-06-24",
      priority: "Critical",
      linkedTo: "uc-fintech-kyc"
    },
    {
      title: "Finalize contract-data retention position for Claude",
      owner: "Legal + Procurement",
      dueDate: "2026-06-26",
      priority: "High",
      linkedTo: "vendor-claude"
    },
    {
      title: "Update CRM field-level access map for Copilot drafting",
      owner: "Revenue Systems",
      dueDate: "2026-06-27",
      priority: "High",
      linkedTo: "uc-sales-drafting"
    }
  ],
  priorities: [
    {
      label: "This week",
      title: "Close pending approval decisions before quarter-end governance review."
    },
    {
      label: "Next",
      title: "Standardize evidence exports by board, customer, and legal audience."
    },
    {
      label: "Then",
      title: "Connect remediation tickets into Jira and vendor records into the document repository."
    }
  ],
  activityLog: [
    {
      label: "Today",
      title: "Legal contract summarization bot entered the approval queue with vendor legal review still open."
    },
    {
      label: "This week",
      title: "Fintech onboarding classifier was flagged high-risk because red-team evidence is still missing."
    },
    {
      label: "Recently",
      title: "Customer support assistant evidence pack was refreshed for enterprise questionnaire responses."
    }
  ],
  evidencePacks: [
    {
      id: "pack-board",
      title: "Board Risk Snapshot",
      audience: "Executive leadership",
      includes: ["Top risks", "Decision log", "Control maturity trend", "Renewal calendar"],
      tone: "Strategic"
    },
    {
      id: "pack-customer",
      title: "Customer Security Questionnaire Pack",
      audience: "Enterprise customer",
      includes: ["Approved tools list", "Data handling controls", "Human oversight summary", "Open exceptions"],
      tone: "Assurance"
    },
    {
      id: "pack-legal",
      title: "Legal and Compliance Review Pack",
      audience: "Internal counsel",
      includes: ["Vendor review status", "Policy references", "Incident and escalation rules", "Retention position"],
      tone: "Control-focused"
    }
  ],
  integrations: [
    {
      title: "Claude",
      description: "Track approved Claude workflows, attach vendor review status, and later ingest policy telemetry for prompt and output controls.",
      meta: ["Type: Model provider", "Status: Phase 2 target", "Priority: High"],
      bullets: ["Workflow inventory linkage", "Vendor governance evidence", "Future telemetry hooks"]
    },
    {
      title: "ChatGPT Enterprise / OpenAI",
      description: "Support governed registry entries, evidence generation, and customer-facing assurance workflows.",
      meta: ["Type: Model provider", "Status: Phase 2 target", "Priority: High"],
      bullets: ["Customer evidence support", "Prompt restriction mapping", "Connector checkpointing"]
    },
    {
      title: "Microsoft Copilot",
      description: "Govern Microsoft 365 usage by user group, access scope, and business process owner.",
      meta: ["Type: Productivity platform", "Status: Phase 2 target", "Priority: High"],
      bullets: ["Entitlement mapping", "SharePoint exposure notes", "Policy acknowledgment flow"]
    },
    {
      title: "Jira / ticketing",
      description: "Route remediation actions and control gaps into owned tasks with due dates and status tracking.",
      meta: ["Type: Workflow system", "Status: Near-term", "Priority: Medium"],
      bullets: ["Risk-to-ticket linkage", "Remediation ownership", "Evidence of closure"]
    },
    {
      title: "Document repository",
      description: "Publish board packs, legal summaries, and customer responses into versioned, access-controlled artifacts.",
      meta: ["Type: Content system", "Status: Near-term", "Priority: Medium"],
      bullets: ["Versioned artifacts", "Client pack exports", "Retention and access controls"]
    }
  ]
};
