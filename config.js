// Spoor Partner Portal content and settings.
// Everything a non-developer needs to edit lives in this file.
//
// To publish an asset: put the file in the /files folder and set `file`
// to its path, e.g. file: "files/spoor-overview-deck.pptx".
// Assets with an empty `file` show as "Coming soon".

window.PORTAL = {
  // Light access gate only. These codes are visible to anyone who reads the
  // page source, so do not treat them as real security. See README.md.
  accessCodes: {
    "SHAPE-2026": "ds",
    "ACCESS-2026": "ap",
  },

  segments: {
    ds: { name: "Demand Shapers", short: "Consultancies", tagline: "Environmental consultancies" },
    ap: { name: "Access Providers", short: "Hardware and installers", tagline: "Hardware, buoys and installation" },
  },

  contact: {
    name: "Partner team",          // TODO: named partner contact
    role: "Partnerships, Spoor",
    email: "partners@spoor.ai",    // TODO: confirm address
  },

  requestTypes: ["Tender support", "Demo", "Case study or reference", "Training", "Something else"],

  sections: [
    {
      id: "why",
      title: "Why Spoor",
      subtitle: "Value proposition",
      intro: {
        ds: "Why consultancies partner with Spoor: stronger bids, a differentiated methodology, and validated data your clients and regulators can trust.",
        ap: "Why installers partner with Spoor: additional scope and revenue on projects, repeat work, and a simple integration.",
      },
      assets: [
        {
          title: "Spoor overview deck",
          for: "both",
          type: "Slides",
          description: "Who we are, what we do, key results and approved clients. 6 to 8 slides you can drop into your own pitch.",
          file: "",
        },
        {
          title: "Value proposition one-pager",
          for: "ds",
          type: "Word",
          description: "Stronger bids, a differentiated methodology, and validated data clients and regulators can trust.",
          file: "",
        },
        {
          title: "Value proposition one-pager",
          for: "ap",
          type: "Word",
          description: "Additional scope and revenue on projects, repeat work, and a simple integration.",
          file: "",
        },
      ],
    },
    {
      id: "bid",
      title: "Bid with Spoor",
      subtitle: "Self-serve bidding",
      intro: {
        ds: "Everything you need to include Spoor in a bid without having to ask us. Copy the text, attach the CVs, and reference our work.",
        ap: "Everything you need to include Spoor in a quote or bid, including what you need to know to price the installation.",
      },
      assets: [
        {
          title: "Tender text pack",
          for: "ds",
          type: "Copy and paste",
          description: "Ready-to-use text for your bid documents.",
          file: "",
          snippets: [
            { title: "Company description", text: "" },
            { title: "Methodology", text: "" },
            { title: "Validation results", text: "" },
            { title: "Data management", text: "" },
            { title: "Quality assurance", text: "" },
          ],
        },
        {
          title: "Team CVs",
          for: "ds",
          type: "Word",
          description: "Tender-ready CVs for the Spoor core team.",
          file: "",
        },
        {
          title: "Case studies and references",
          for: "both",
          type: "PDF",
          description: "Client-approved case studies and a short reference list.",
          file: "",
        },
        {
          title: "Pricing structure explainer",
          for: "both",
          type: "PDF",
          description: "How Spoor pricing is built up and what drives cost, so you can scope it in your bid.",
          file: "",
        },
        {
          title: "Installation and hardware spec sheet",
          for: "ap",
          type: "PDF",
          description: "What you need to quote: equipment, power, connectivity, mounting and installation steps.",
          file: "",
        },
      ],
    },
    {
      id: "programme",
      title: "Partner benefits",
      subtitle: "What partners get",
      intro: {
        ds: "What you get as a Spoor partner, what we expect in return, and how to get started.",
        ap: "What you get as a Spoor partner, what we expect in return, and how to get started.",
      },
      assets: [
        {
          title: "Partner programme guide",
          for: "both",
          type: "PDF",
          description: "Tender support, co-marketing, training and commercial terms, plus what we expect and how to get started.",
          file: "",
        },
      ],
    },
    {
      id: "contact",
      title: "Get in touch",
      subtitle: "Help and requests",
      intro: {
        ds: "One contact for everything, and one form for requests such as tender support or a demo.",
        ap: "One contact for everything, and one form for requests such as tender support or a demo.",
      },
      assets: [],
    },
  ],
};
