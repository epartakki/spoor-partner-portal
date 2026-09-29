# Spoor Partner Portal

First version of the Spoor Partner Portal, built from the core content plan.
A static site (plain HTML, CSS and JavaScript, no build step) that runs on GitHub Pages.

## How it works

- Partners sign in with an access code. The code decides which segment they see:
  **Demand Shapers** (consultancies) or **Access Providers** (hardware and installers).
- Every partner sees the same four sections: Why Spoor, Bid with Spoor, Partner benefits, Get in touch.
- Assets are tagged `both`, `ds` or `ap`, so each segment only sees what applies to them.
- The request form opens a pre-filled email to the partner contact.

## Editing content

All content lives in [`config.js`](config.js):

| What | Where in `config.js` |
| --- | --- |
| Access codes | `accessCodes` |
| Partner contact name and email | `contact` |
| Section intros per segment | `sections[].intro` |
| Assets (title, audience, description) | `sections[].assets` |
| Tender text pack copy | the `snippets` on "Tender text pack" |

To publish an asset, add the file to the [`files/`](files) folder and set its `file` field,
for example `file: "files/spoor-overview-deck.pptx"`. Assets without a file show as "Coming soon".

To add a segment later (for example Legitimacy Partners), add it to `segments`, give it an
access code, add an `intro` for it in each section, and tag its assets with its key.

## Access and security (read this)

The access code is a **light gate, not real security**. On GitHub Pages the whole site is public:
anyone who has the URL can read `config.js` and every file in `files/`. That is fine for material
you are happy for partners to forward, but not for anything confidential (pricing detail,
unapproved client names, CVs with personal data).

When you need real logins, the simplest upgrades are:

1. **Cloudflare Pages + Cloudflare Access** (free for small teams): email one-time-code login per partner.
2. **Netlify + password protection or Netlify Identity**.
3. **GitHub Pages with private visibility** (GitHub Enterprise Cloud only): partners need GitHub accounts.

The site code does not need to change for options 1 and 2.

## Run locally

```bash
python3 -m http.server 8420
```

Then open http://localhost:8420.

## Publish on GitHub Pages

1. Create a new repository on GitHub (for example `spoor-partner-portal`).
2. Push this folder to it.
3. In the repository, go to **Settings > Pages**, set **Source** to "Deploy from a branch",
   pick `main` and `/ (root)`, and save.
4. The site goes live at `https://<your-account>.github.io/spoor-partner-portal/` within a minute or two.
