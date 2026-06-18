const seed = window.alphaSourceDemoData;
const STORAGE_KEY = "alpha-source-os-demo-state-v1";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function buildInitialRuntime() {
  return {
    useCases: clone(seed.useCases),
    approvals: clone(seed.approvals),
    vendors: clone(seed.vendors),
    controls: clone(seed.controls),
    remediations: clone(seed.remediations),
    priorities: clone(seed.priorities),
    activityLog: clone(seed.activityLog),
    evidencePacks: clone(seed.evidencePacks),
    integrations: clone(seed.integrations)
  };
}

function loadRuntime() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return buildInitialRuntime();
    }
    const parsed = JSON.parse(raw);
    return {
      ...buildInitialRuntime(),
      ...parsed
    };
  } catch {
    return buildInitialRuntime();
  }
}

const runtime = loadRuntime();

const state = {
  section: "dashboard",
  registrySearch: "",
  registryStatus: "All",
  registrySensitivity: "All",
  selectedUseCaseId: runtime.useCases[0].id,
  selectedApprovalId: runtime.approvals[0].id,
  selectedVendorId: runtime.vendors[0].id,
  selectedEvidencePackId: runtime.evidencePacks[0].id,
  selectedEvidenceUseCaseId: runtime.useCases[0].id,
  selectedAudience: "Default"
};

const sectionTitle = document.getElementById("section-title");
const navButtons = document.querySelectorAll(".nav-btn");
const sections = document.querySelectorAll(".content-section");

function persistRuntime() {
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      useCases: runtime.useCases,
      approvals: runtime.approvals,
      vendors: runtime.vendors,
      controls: runtime.controls,
      remediations: runtime.remediations,
      priorities: runtime.priorities,
      activityLog: runtime.activityLog,
      evidencePacks: runtime.evidencePacks,
      integrations: runtime.integrations
    })
  );
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 36);
}

function statusTone(value) {
  const normalized = value.toLowerCase();
  if (normalized.includes("approved") || normalized.includes("active") || normalized.includes("reviewed") || normalized.includes("managed") || normalized.includes("done") || normalized.includes("low")) {
    return "good";
  }
  if (normalized.includes("high") || normalized.includes("critical") || normalized.includes("rejected") || normalized.includes("blocked") || normalized.includes("initial")) {
    return "bad";
  }
  return "warn";
}

function makePills(items) {
  return `
    <div class="pill-row">
      ${items
        .map((item) => {
          const detail = typeof item === "string" ? { text: item, tone: statusTone(item) } : item;
          return `<span class="pill ${detail.tone}">${escapeHtml(detail.text)}</span>`;
        })
        .join("")}
    </div>
  `;
}

function makeMeta(items) {
  return `<div class="meta-line">${items.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>`;
}

function getUseCase(id) {
  return runtime.useCases.find((item) => item.id === id);
}

function getVendorByName(name) {
  return runtime.vendors.find((item) => item.name === name);
}

function getLinkedControls(useCase) {
  return runtime.controls.filter((control) => useCase.controls.includes(control.id));
}

function getApprovalForUseCase(useCaseId) {
  return runtime.approvals.find((item) => item.useCaseId === useCaseId);
}

function addActivity(title, label = "Just now") {
  runtime.activityLog.unshift({ label, title });
  runtime.activityLog = runtime.activityLog.slice(0, 8);
  persistRuntime();
}

function computeMetrics() {
  const pendingApprovals = runtime.approvals.filter((item) => item.status === "Pending").length;
  const highRisk = runtime.useCases.filter((item) => item.risk === "High").length;
  const approved = runtime.useCases.filter((item) => item.status.includes("Approved") || item.status === "Active").length;
  const openRemediation = runtime.remediations.length;

  return [
    { label: "Active or approved workflows", value: String(approved) },
    { label: "Pending approvals", value: String(pendingApprovals) },
    { label: "High-risk workflows", value: String(highRisk) },
    { label: "Open remediation actions", value: String(openRemediation) }
  ];
}

function renderMetrics() {
  document.getElementById("metric-grid").innerHTML = computeMetrics()
    .map(
      (metric) => `
        <article class="metric-card">
          <p>${escapeHtml(metric.label)}</p>
          <strong>${escapeHtml(metric.value)}</strong>
        </article>
      `
    )
    .join("");
}

function renderRiskList() {
  const items = runtime.useCases
    .filter((item) => item.risk === "High")
    .map(
      (item) => `
        <div class="stack-item">
          <h4>${escapeHtml(item.title)}</h4>
          ${makeMeta([`Owner: ${item.owner}`, `Vendor: ${item.vendor}`, `Review: ${item.reviewDate}`])}
          ${makePills([
            { text: item.risk, tone: "bad" },
            { text: item.status, tone: statusTone(item.status) },
            { text: item.sensitivity, tone: "warn" }
          ])}
        </div>
      `
    );

  document.getElementById("risk-list").innerHTML = items.join("");
}

function renderApprovalPreview() {
  document.getElementById("approval-preview").innerHTML = runtime.approvals
    .map(
      (item) => `
        <div class="stack-item">
          <h4>${escapeHtml(item.title)}</h4>
          ${makeMeta([`Requester: ${item.requester}`, `Decision by: ${item.decisionBy}`, `Owner: ${item.owner}`])}
          ${makePills([
            { text: item.status, tone: statusTone(item.status) },
            { text: item.risk, tone: statusTone(item.risk) }
          ])}
        </div>
      `
    )
    .join("");
}

function renderControlGapList() {
  document.getElementById("control-gap-list").innerHTML = runtime.controls
    .filter((item) => item.maturity !== "Managed")
    .map(
      (item) => `
        <div class="stack-item">
          <h4>${escapeHtml(item.title)}</h4>
          ${makeMeta([item.framework, `Owner: ${item.owner}`])}
          ${makePills([{ text: `Maturity: ${item.maturity}`, tone: statusTone(item.maturity) }])}
          <p class="stack-copy">${escapeHtml(item.gap)}</p>
        </div>
      `
    )
    .join("");
}

function renderActivity() {
  document.getElementById("activity-list").innerHTML = runtime.activityLog
    .map(
      (item) => `
        <div class="timeline-item">
          <span>${escapeHtml(item.label)}</span>
          <p>${escapeHtml(item.title)}</p>
        </div>
      `
    )
    .join("");
}

function getFilteredUseCases() {
  return runtime.useCases.filter((item) => {
    const searchHaystack = [item.title, item.owner, item.vendor, item.description].join(" ").toLowerCase();
    const matchesSearch = !state.registrySearch || searchHaystack.includes(state.registrySearch.toLowerCase());
    const matchesStatus = state.registryStatus === "All" || item.status === state.registryStatus;
    const matchesSensitivity = state.registrySensitivity === "All" || item.sensitivity === state.registrySensitivity;
    return matchesSearch && matchesStatus && matchesSensitivity;
  });
}

function renderRegistryFilters() {
  const statuses = ["All", ...new Set(runtime.useCases.map((item) => item.status))];
  const sensitivityLevels = ["All", ...new Set(runtime.useCases.map((item) => item.sensitivity))];

  document.getElementById("registry-status-filter").innerHTML = statuses
    .map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`)
    .join("");
  document.getElementById("registry-status-filter").value = state.registryStatus;

  document.getElementById("registry-sensitivity-filter").innerHTML = sensitivityLevels
    .map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`)
    .join("");
  document.getElementById("registry-sensitivity-filter").value = state.registrySensitivity;

  document.getElementById("registry-search").value = state.registrySearch;
}

function renderRegistry() {
  const items = getFilteredUseCases();
  if (!items.some((item) => item.id === state.selectedUseCaseId)) {
    state.selectedUseCaseId = items[0]?.id || runtime.useCases[0].id;
  }

  document.getElementById("registry-list").innerHTML = items
    .map((item) => {
      const activeClass = item.id === state.selectedUseCaseId ? "is-selected" : "";
      return `
        <button class="list-card ${activeClass}" data-use-case-id="${escapeHtml(item.id)}">
          <div class="list-card-top">
            <h4>${escapeHtml(item.title)}</h4>
            <span class="mini-tone ${statusTone(item.risk)}">${escapeHtml(item.risk)}</span>
          </div>
          ${makeMeta([item.owner, item.vendor, item.sensitivity])}
          ${makePills([{ text: item.status, tone: statusTone(item.status) }])}
        </button>
      `;
    })
    .join("");

  const useCase = getUseCase(state.selectedUseCaseId);
  const linkedControls = getLinkedControls(useCase);
  const approval = getApprovalForUseCase(useCase.id);
  const vendor = getVendorByName(useCase.vendor);

  document.getElementById("registry-detail").innerHTML = `
    <div class="detail-header">
      <div>
        <p class="detail-eyebrow">Workflow record</p>
        <h3>${escapeHtml(useCase.title)}</h3>
      </div>
      <span class="mini-tone ${statusTone(useCase.status)}">${escapeHtml(useCase.status)}</span>
    </div>
    <p class="detail-copy">${escapeHtml(useCase.description)}</p>
    ${makeMeta([
      `Owner: ${useCase.owner}`,
      `Vendor: ${useCase.vendor}`,
      `Sensitivity: ${useCase.sensitivity}`,
      `Review date: ${useCase.reviewDate}`
    ])}
    ${makePills([
      { text: `Risk: ${useCase.risk}`, tone: statusTone(useCase.risk) },
      { text: `${linkedControls.length} mapped controls`, tone: "neutral" },
      { text: `${useCase.evidence.length} evidence outputs`, tone: "neutral" }
    ])}
    <div class="detail-section">
      <h4>Required controls</h4>
      <ul>
        ${linkedControls.map((control) => `<li>${escapeHtml(control.id)} - ${escapeHtml(control.title)} (${escapeHtml(control.maturity)})</li>`).join("")}
      </ul>
    </div>
    <div class="detail-section">
      <h4>Operating notes</h4>
      <ul>
        ${useCase.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}
      </ul>
    </div>
    <div class="detail-section">
      <h4>Linked records</h4>
      <ul>
        <li>${approval ? `Approval state: ${approval.status} (${approval.decisionBy})` : "No approval record linked"}</li>
        <li>${vendor ? `Vendor posture: ${vendor.status}` : "Vendor review not found"}</li>
        <li>Evidence outputs: ${escapeHtml(useCase.evidence.join(", "))}</li>
      </ul>
    </div>
  `;

  document.querySelectorAll("[data-use-case-id]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedUseCaseId = button.dataset.useCaseId;
      state.selectedEvidenceUseCaseId = button.dataset.useCaseId;
      renderRegistry();
      renderEvidenceControls();
      renderEvidenceBuilder();
    });
  });
}

function renderApprovals() {
  if (!runtime.approvals.some((item) => item.id === state.selectedApprovalId)) {
    state.selectedApprovalId = runtime.approvals[0]?.id || "";
  }

  document.getElementById("approval-list").innerHTML = runtime.approvals
    .map((item) => {
      const activeClass = item.id === state.selectedApprovalId ? "is-selected" : "";
      return `
        <button class="list-card ${activeClass}" data-approval-id="${escapeHtml(item.id)}">
          <div class="list-card-top">
            <h4>${escapeHtml(item.title)}</h4>
            <span class="mini-tone ${statusTone(item.status)}">${escapeHtml(item.status)}</span>
          </div>
          ${makeMeta([`Requester: ${item.requester}`, `Decision by: ${item.decisionBy}`, `Owner: ${item.owner}`])}
          ${makePills([{ text: item.risk, tone: statusTone(item.risk) }])}
        </button>
      `;
    })
    .join("");

  const approval = runtime.approvals.find((item) => item.id === state.selectedApprovalId);
  document.getElementById("approval-detail").innerHTML = approval
    ? `
      <div class="detail-header">
        <div>
          <p class="detail-eyebrow">Decision record</p>
          <h3>${escapeHtml(approval.title)}</h3>
        </div>
        <span class="mini-tone ${statusTone(approval.status)}">${escapeHtml(approval.status)}</span>
      </div>
      <p class="detail-copy">${escapeHtml(approval.notes)}</p>
      ${makeMeta([`Requester: ${approval.requester}`, `Decision by: ${approval.decisionBy}`, `Owner: ${approval.owner}`])}
      <div class="detail-section">
        <h4>Conditions</h4>
        <ul>${approval.conditions.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </div>
      <div class="detail-section">
        <h4>Current blockers</h4>
        <ul>${approval.blockers.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </div>
    `
    : `<p class="detail-copy">No approval records available.</p>`;

  document.querySelectorAll("[data-approval-id]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedApprovalId = button.dataset.approvalId;
      renderApprovals();
    });
  });
}

function updateApprovalStatus(nextStatus) {
  const approval = runtime.approvals.find((item) => item.id === state.selectedApprovalId);
  if (!approval) {
    return;
  }
  approval.status = nextStatus;
  const useCase = getUseCase(approval.useCaseId);
  if (useCase) {
    if (nextStatus === "Approved") {
      useCase.status = "Approved";
    } else if (nextStatus === "Approved with conditions") {
      useCase.status = "Approved with conditions";
    } else if (nextStatus === "Rejected") {
      useCase.status = "Rejected";
    }
  }
  addActivity(`${approval.title} marked ${nextStatus.toLowerCase()}.`);
  persistRuntime();
  renderAll();
}

function renderVendors() {
  document.getElementById("vendor-list").innerHTML = runtime.vendors
    .map((item) => {
      const activeClass = item.id === state.selectedVendorId ? "is-selected" : "";
      return `
        <button class="list-card ${activeClass}" data-vendor-id="${escapeHtml(item.id)}">
          <div class="list-card-top">
            <h4>${escapeHtml(item.name)}</h4>
            <span class="mini-tone ${statusTone(item.status)}">${escapeHtml(item.status)}</span>
          </div>
          ${makeMeta([item.category, `Renewal: ${item.renewal}`, `Exposure: ${item.dataExposure}`])}
        </button>
      `;
    })
    .join("");

  const vendor = runtime.vendors.find((item) => item.id === state.selectedVendorId);
  document.getElementById("vendor-detail").innerHTML = `
    <div class="detail-header">
      <div>
        <p class="detail-eyebrow">Vendor record</p>
        <h3>${escapeHtml(vendor.name)}</h3>
      </div>
      <span class="mini-tone ${statusTone(vendor.status)}">${escapeHtml(vendor.status)}</span>
    </div>
    <p class="detail-copy">${escapeHtml(vendor.description)}</p>
    ${makeMeta([vendor.category, `Data exposure: ${vendor.dataExposure}`, `Renewal: ${vendor.renewal}`])}
    <div class="detail-section">
      <h4>Checkpoint status</h4>
      <div class="checkpoint-list">
        ${vendor.checkpoints
          .map(
            (checkpoint) => `
              <div class="checkpoint-row">
                <span>${escapeHtml(checkpoint.label)}</span>
                <span class="mini-tone ${statusTone(checkpoint.state)}">${escapeHtml(checkpoint.state)}</span>
              </div>
            `
          )
          .join("")}
      </div>
    </div>
    <div class="detail-section">
      <h4>Actions</h4>
      <ul>${vendor.actions.map((action) => `<li>${escapeHtml(action)}</li>`).join("")}</ul>
    </div>
  `;

  document.querySelectorAll("[data-vendor-id]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedVendorId = button.dataset.vendorId;
      renderVendors();
    });
  });
}

function renderControls() {
  document.getElementById("control-library").innerHTML = runtime.controls
    .map(
      (control) => `
        <div class="stack-item">
          <h4>${escapeHtml(control.id)} - ${escapeHtml(control.title)}</h4>
          ${makeMeta([control.framework, `Owner: ${control.owner}`])}
          ${makePills([{ text: `Maturity: ${control.maturity}`, tone: statusTone(control.maturity) }])}
          <p class="stack-copy">${escapeHtml(control.gap)}</p>
        </div>
      `
    )
    .join("");

  document.getElementById("remediation-list").innerHTML = runtime.remediations
    .map(
      (item) => `
        <div class="stack-item">
          <h4>${escapeHtml(item.title)}</h4>
          ${makeMeta([`Owner: ${item.owner}`, `Due: ${item.dueDate}`, `Linked: ${item.linkedTo}`])}
          ${makePills([{ text: item.priority, tone: statusTone(item.priority) }])}
        </div>
      `
    )
    .join("");
}

function renderEvidenceControls() {
  document.getElementById("evidence-pack-select").innerHTML = runtime.evidencePacks
    .map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.title)}</option>`)
    .join("");
  document.getElementById("evidence-pack-select").value = state.selectedEvidencePackId;

  document.getElementById("evidence-use-case-select").innerHTML = runtime.useCases
    .map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.title)}</option>`)
    .join("");
  document.getElementById("evidence-use-case-select").value = state.selectedEvidenceUseCaseId;

  const audienceOptions = ["Default", "Board", "Customer", "Legal"];
  document.getElementById("evidence-audience-select").innerHTML = audienceOptions
    .map((item) => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`)
    .join("");
  document.getElementById("evidence-audience-select").value = state.selectedAudience;
}

function renderEvidenceBuilder() {
  const pack = runtime.evidencePacks.find((item) => item.id === state.selectedEvidencePackId);
  const useCase = getUseCase(state.selectedEvidenceUseCaseId);
  const vendor = getVendorByName(useCase.vendor);
  const controls = getLinkedControls(useCase);
  const approval = getApprovalForUseCase(useCase.id);

  document.getElementById("evidence-summary").innerHTML = `
    <h4>${escapeHtml(pack.title)}</h4>
    <p>${escapeHtml(pack.audience)} audience with a ${escapeHtml(pack.tone.toLowerCase())} framing for ${escapeHtml(useCase.title)}.</p>
    ${makePills([
      { text: `Workflow: ${useCase.status}`, tone: statusTone(useCase.status) },
      { text: `Vendor: ${vendor ? vendor.status : "Unknown"}`, tone: statusTone(vendor ? vendor.status : "Unknown") },
      { text: `Audience: ${state.selectedAudience}`, tone: "neutral" }
    ])}
  `;

  const approvalLine = approval ? `${approval.status} decision owned by ${approval.owner} by ${approval.decisionBy}` : "No current approval decision.";
  document.getElementById("evidence-preview").innerHTML = `
    <div class="preview-section">
      <h4>Included sections</h4>
      <ul>${pack.includes.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </div>
    <div class="preview-section">
      <h4>Linked workflow summary</h4>
      <p>${escapeHtml(useCase.description)}</p>
      <ul>
        <li>${escapeHtml(`Risk posture: ${useCase.risk} / ${useCase.sensitivity}`)}</li>
        <li>${escapeHtml(`Approval status: ${approvalLine}`)}</li>
        <li>${escapeHtml(`Vendor posture: ${vendor ? vendor.status : "Unknown"}`)}</li>
      </ul>
    </div>
    <div class="preview-section">
      <h4>Control evidence</h4>
      <ul>${controls.map((control) => `<li>${escapeHtml(control.id)} - ${escapeHtml(control.title)} (${escapeHtml(control.maturity)})</li>`).join("")}</ul>
    </div>
  `;
}

function renderIntegrations() {
  document.getElementById("integration-grid").innerHTML = runtime.integrations
    .map(
      (item) => `
        <article class="record-card">
          <h4>${escapeHtml(item.title)}</h4>
          <p>${escapeHtml(item.description)}</p>
          ${makeMeta(item.meta)}
          <ul>${item.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}</ul>
        </article>
      `
    )
    .join("");
}

function renderTopbar() {
  document.getElementById("region-badge").textContent = `Region: ${seed.summary.region}`;
  document.getElementById("framework-badge").textContent = `Frameworks: ${seed.summary.frameworks}`;
  document.getElementById("snapshot-badge").textContent = `Snapshot: ${seed.summary.snapshot}`;
}

function renderIntakeControls() {
  const vendorSelect = document.getElementById("intake-vendor");
  vendorSelect.innerHTML = runtime.vendors
    .map((item) => `<option value="${escapeHtml(item.name)}">${escapeHtml(item.name)}</option>`)
    .join("");
  if (!document.getElementById("intake-review-date").value) {
    document.getElementById("intake-review-date").value = "2026-07-10";
  }
}

function renderIntakePreview() {
  const pending = runtime.approvals.filter((item) => item.status === "Pending").length;
  const recentCreate = runtime.activityLog[0]?.title || "No new requests created in this browser session yet.";
  document.getElementById("intake-preview").innerHTML = `
    <div class="preview-section">
      <h4>What testers can do</h4>
      <ul>
        <li>Create a workflow request and push it into the registry plus approval queue.</li>
        <li>Refresh the page and confirm the record persists through local browser storage.</li>
        <li>Open the evidence builder and export a packet for the new workflow.</li>
      </ul>
    </div>
    <div class="preview-section">
      <h4>Current alpha state</h4>
      <ul>
        <li>${escapeHtml(`${runtime.useCases.length} workflows loaded`)}</li>
        <li>${escapeHtml(`${pending} approvals still pending`)}</li>
        <li>${escapeHtml(`Latest activity: ${recentCreate}`)}</li>
      </ul>
    </div>
  `;
}

function renderAll() {
  renderMetrics();
  renderRiskList();
  renderApprovalPreview();
  renderControlGapList();
  renderActivity();
  renderRegistryFilters();
  renderRegistry();
  renderApprovals();
  renderVendors();
  renderControls();
  renderEvidenceControls();
  renderEvidenceBuilder();
  renderIntegrations();
  renderIntakeControls();
  renderIntakePreview();
}

function switchSection(sectionId, label) {
  state.section = sectionId;
  navButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.section === sectionId);
  });
  sections.forEach((section) => {
    section.classList.toggle("is-visible", section.id === sectionId);
  });
  sectionTitle.textContent = label;
}

function exportEvidencePacket() {
  const pack = runtime.evidencePacks.find((item) => item.id === state.selectedEvidencePackId);
  const useCase = getUseCase(state.selectedEvidenceUseCaseId);
  const vendor = getVendorByName(useCase.vendor);
  const approval = getApprovalForUseCase(useCase.id);
  const controls = getLinkedControls(useCase);
  const payload = {
    exportedAt: new Date().toISOString(),
    audience: state.selectedAudience,
    pack,
    useCase,
    vendor,
    approval,
    controls
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${slugify(pack.title)}-${slugify(useCase.title)}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  addActivity(`Exported ${pack.title} for ${useCase.title}.`);
  renderActivity();
  renderIntakePreview();
}

function createUseCaseFromIntake(form) {
  const formData = new FormData(form);
  const title = String(formData.get("title")).trim();
  const owner = String(formData.get("owner")).trim();
  const vendor = String(formData.get("vendor")).trim();
  const sensitivity = String(formData.get("sensitivity")).trim();
  const risk = String(formData.get("risk")).trim();
  const reviewDate = String(formData.get("reviewDate")).trim();
  const description = String(formData.get("description")).trim();
  const notes = String(formData.get("notes")).trim();

  const useCaseId = `uc-${slugify(title)}-${Date.now().toString().slice(-5)}`;
  const approvalId = `apr-${slugify(title)}-${Date.now().toString().slice(-5)}`;
  const suggestedControls = runtime.controls
    .filter((control) => {
      if (risk === "High") {
        return ["CTRL-01", "CTRL-03", "CTRL-05", "CTRL-06"].includes(control.id);
      }
      if (risk === "Low") {
        return ["CTRL-02", "CTRL-03"].includes(control.id);
      }
      return ["CTRL-02", "CTRL-03", "CTRL-06"].includes(control.id);
    })
    .map((control) => control.id);

  runtime.useCases.unshift({
    id: useCaseId,
    title,
    owner,
    vendor,
    status: "Pending approval",
    sensitivity,
    risk,
    description,
    reviewDate,
    controls: suggestedControls,
    evidence: ["Board Risk Snapshot", "Legal and Compliance Review Pack"],
    bullets: notes ? [notes, "Created through alpha intake form"] : ["Created through alpha intake form", "Awaiting governance review"]
  });

  runtime.approvals.unshift({
    id: approvalId,
    useCaseId,
    title,
    requester: owner,
    decisionBy: reviewDate,
    status: "Pending",
    risk,
    owner: "AI Governance Office",
    conditions: notes ? [notes, "Confirm system access scope", "Assign approval owner"] : ["Confirm system access scope", "Assign approval owner", "Review data handling posture"],
    blockers: risk === "High" ? ["High-risk workflow requires deeper validation"] : ["Initial controls not yet confirmed"],
    notes: description
  });

  state.selectedUseCaseId = useCaseId;
  state.selectedApprovalId = approvalId;
  state.selectedEvidenceUseCaseId = useCaseId;
  addActivity(`Created new intake request: ${title}.`);
  persistRuntime();
  renderAll();
  form.reset();
  renderIntakeControls();
}

function resetDemo() {
  window.localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
}

function bindEvents() {
  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      switchSection(button.dataset.section, button.textContent);
    });
  });

  document.getElementById("registry-search").addEventListener("input", (event) => {
    state.registrySearch = event.target.value;
    renderRegistry();
  });

  document.getElementById("registry-status-filter").addEventListener("change", (event) => {
    state.registryStatus = event.target.value;
    renderRegistry();
  });

  document.getElementById("registry-sensitivity-filter").addEventListener("change", (event) => {
    state.registrySensitivity = event.target.value;
    renderRegistry();
  });

  document.getElementById("approve-btn").addEventListener("click", () => updateApprovalStatus("Approved"));
  document.getElementById("conditional-btn").addEventListener("click", () => updateApprovalStatus("Approved with conditions"));
  document.getElementById("reject-btn").addEventListener("click", () => updateApprovalStatus("Rejected"));

  document.getElementById("evidence-pack-select").addEventListener("change", (event) => {
    state.selectedEvidencePackId = event.target.value;
    renderEvidenceBuilder();
  });

  document.getElementById("evidence-use-case-select").addEventListener("change", (event) => {
    state.selectedEvidenceUseCaseId = event.target.value;
    renderEvidenceBuilder();
  });

  document.getElementById("evidence-audience-select").addEventListener("change", (event) => {
    state.selectedAudience = event.target.value;
    renderEvidenceBuilder();
  });

  document.getElementById("export-evidence-btn").addEventListener("click", exportEvidencePacket);
  document.getElementById("intake-form").addEventListener("submit", (event) => {
    event.preventDefault();
    createUseCaseFromIntake(event.currentTarget);
  });
  document.getElementById("reset-demo-btn").addEventListener("click", resetDemo);
}

function init() {
  renderTopbar();
  renderAll();
  bindEvents();
}

init();
