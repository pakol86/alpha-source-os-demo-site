# Alpha Source OS Demo

Alpha Source OS is a draft concept for a workflow and evidence platform that helps companies:
- inventory AI use cases
- review AI vendors
- approve or reject new AI use cases
- track technical and governance risks
- assemble customer, legal, and executive evidence packs

This repository is a non-production alpha demo built with dummy data.

## What It Shows

The prototype models the core operating system Alpha Source could build over a 5-year horizon:
- AI use-case registry
- approval queue
- vendor due-diligence tracker
- control and risk views
- evidence pack generation ideas
- integration model, including Claude

## Modules In This Demo

### Dashboard
- Summary metrics
- Open approvals
- High-risk workflows
- Activity log

### Intake
- New AI workflow request form
- Auto-created approval queue records
- Browser persistence with local storage

### Use-Case Registry
- AI workflow catalog
- Owners
- Data sensitivity
- Vendor mapping
- Search and filtering

### Approval Queue
- New use cases pending approval
- Conditions and compensating controls
- Expiration and review dates
- In-session decision actions

### Vendor Reviews
- Vendor review status
- Legal/security checkpoints
- Risk notes

### Controls
- Control library mapped to frameworks
- Open remediation queue

### Evidence Packs
- Board summary
- Customer questionnaire packet
- Legal/compliance summary
- JSON export for test packets

### Integrations
- Claude
- ChatGPT Enterprise / OpenAI
- Microsoft Copilot
- Google Gemini
- Ticketing and document systems

## Files

- `index.html` - static prototype shell
- `styles.css` - visual styling
- `app.js` - rendering logic
- `data/demo-data.js` - dummy data
- `docs/product-draft.md` - product thesis and roadmap note

## Run Locally

Because this is a static prototype, you can open `index.html` directly in a browser. For the alpha flow, a local server is still recommended so testers can interact with it more naturally.

For a local server:

```bash
cd alpha-source-os-demo
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Notes

- This is still not production-ready.
- The goal is to make the core alpha workflows testable before any backend or enterprise integrations exist.
- All records and numbers are illustrative dummy data.
- State persists in browser `localStorage` and can be reset from the intake screen.
