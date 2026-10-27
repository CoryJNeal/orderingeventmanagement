# Documentation

Markdown intended for **GitHub Copilot knowledge**, **Microsoft 365 Copilot**, or **Copilot Studio**.

## Load into Copilot (one file)

Attach [`COPILOT-KNOWLEDGE.md`](./COPILOT-KNOWLEDGE.md). It is a self-contained brief.

## Load the full set

1. `README.md` at the repo root (product overview + credentials)
2. This folder:
   - `ARCHITECTURE.md` — layers, storage, scan actions
   - `DATA-MODEL.md` — types and localStorage
   - `USER-FLOWS.md` — click-paths
   - `ROUTES-AND-FILES.md` — map of pages and modules
   - `COPILOT-KNOWLEDGE.md` — combined brief

## GitHub Copilot in this repository

[`.github/copilot-instructions.md`](../.github/copilot-instructions.md) is picked up automatically by GitHub Copilot Chat in the repo. Custom instructions plus a knowledge base that includes `docs/` give the best results.

### GitHub Copilot Enterprise knowledge (typical)

1. Organization **Copilot** → **Knowledge** (or the Copilot space for your work account).
2. Create or edit a knowledge base.
3. Add this GitHub repository, or upload the markdown files in this folder.
4. Scope the knowledge base to the Copilot Chat users who need Event Scan Desk context.

### Microsoft 365 Copilot / Copilot Studio

1. Put this `docs/` folder (or a zip of the `.md` files) in a SharePoint / OneDrive library the Copilot agent can read, **or**
2. In Copilot Studio, add the files as **Knowledge** (upload or SharePoint URL).

Do not upload `node_modules`, lockfiles, or screenshots unless you need them. The markdown here is the intended knowledge corpus.
