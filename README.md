# Spoor Partner Portal

The Spoor Partner Portal: a static site (plain HTML, CSS and JavaScript, no build step)
that runs on GitHub Pages.

## How it works

- Partners sign in with an access code. The code decides which segment they see:
  **Consultancies** (key `ds`) or **Hardware and installation partners** (key `ap`).
- Every partner sees the same five sections: Why Spoor, The product, Bid with Spoor,
  Partner benefits, Get in touch.
- Content blocks and assets are tagged `both`, `ds` or `ap`, so each segment only sees what applies to them.
- The request form opens a pre-filled email to the partner contact.

## Editing content

All content lives in [`config.js`](config.js):

| What | Where in `config.js` |
| --- | --- |
| Access codes | `accessCodes` |
| Partner contact name and email | `contact` |
| Section intros per segment | `sections[].intro` |
| Content blocks shown above the assets | `sections[].blocks` |
| Assets (title, audience, description) | `sections[].assets` |
| Tender text pack copy | the `snippets` on "Tender text pack" |
| Buttons, labels and other interface text | `ui` |
| Image sizes (optional, stops the page jumping while images load) | `imageSizes` |

Images and videos live in [`assets/`](assets). Refer to them as `assets/name.jpg`
(no leading slash, so the site also works under the GitHub Pages sub-path).

### Content blocks

Every block has a `type` and a `for` (`"ds"`, `"ap"` or `"both"`). Most take an optional
`heading`. Optional on every block: `sub: true` (continues the block before it: closer
spacing, smaller heading, left out of the table of contents), `tag` (a small orange label
next to the heading) and `note` (small print under the block).

| `type` | Fields |
| --- | --- |
| `hero` | `image`, `alt`, `heading`, `text` |
| `prose` | `paragraphs[]`; optional `image`, `alt`, `caption`, `imageSide` (`"left"` or `"right"`), `italic` |
| `toggle` | `options[]`, each `{ label, image, alt, heading, points[], note }` |
| `tabs` | `tabs[]`, each `{ id, label, blocks[] }`. Link to a tab with `#/section?tab=id` |
| `video` | `src`, `poster`, `alt`, `caption` |
| `picker` | `steps[]` each `{ question, answers[{ label, value }] }`, `results{ key: { heading, text, link, linkLabel, note } }`, `resolve` (answer values joined with `+` mapped to a result key; leave out for one question, where the answer value is the key) |
| `stats` | `items[{ value, suffix, label }]`; optional `caption`, `image` (background) |
| `bars` | `items[{ label, value }]`, `max` (default 100), `suffix`, `caption` |
| `cards` | `columns` (1, 2 or 3), `items[{ title, text, tag }]`, optional `intro` |
| `table` | `columns[]`, `rows[][]` |
| `accordion` | `items[{ title, text }]` |
| `checklist` | `intro`, `items[{ label, placeholder }]`, `buttonLabel`, `subject`; optional `collapsed` and `revealLabel` to show only a button at first |
| `callout` | `text` |
| `steps` | `items[{ title, text }]` |

A section with `toc: true` gets an "On this page" list of its block headings.

To publish an asset, add the file to the [`files/`](files) folder and set its `file` field,
for example `file: "files/spoor-overview-deck.pptx"`. Assets without a file show as "Coming soon".

To add a segment later, add it to `segments`, give it an access code, add an `intro` for it
in each section, and tag its blocks and assets with its key.

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
