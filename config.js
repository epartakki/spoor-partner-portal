// Spoor Partner Portal content and settings.
// Everything a non-developer needs to edit lives in this file.
//
// To publish an asset: put the file in the /files folder and set `file`
// to its path, e.g. file: "files/spoor-overview-deck.pptx".
// Assets with an empty `file` show as "Coming soon".
//
// Sections can also have `blocks`: content shown above the assets, in order.
// Every block has a `type` and a `for` ("ds", "ap" or "both"). See README.md
// for the fields each block type takes. A block with `sub: true` continues
// the block before it: it sits closer to it, uses a smaller heading and is
// left out of the table of contents.

// Shared by The product and Bid with Spoor.
const SCOPING_CHECKLIST = {
  type: "checklist",
  heading: "What we need from you",
  intro: "Tick what you already know and we'll come back with a camera plan.",
  items: [
    { label: "Species of interest", placeholder: "e.g. kittiwake, gannet, white-tailed eagle" },
    { label: "Site layout and turbine specs", placeholder: "Onshore or offshore, fixed or floating, rotor diameter, hub height" },
    { label: "Regulatory requirements", placeholder: "What the regulator or lender has asked for" },
    { label: "Monitoring period", placeholder: "e.g. 12 months from first power" },
  ],
  buttonLabel: "Send a scoping request",
  subject: "Scoping request",
};

window.PORTAL = {
  // Light access gate only. These codes are visible to anyone who reads the
  // page source, so do not treat them as real security. See README.md.
  accessCodes: {
    "SHAPE-2026": "ds",
    "ACCESS-2026": "ap",
  },

  segments: {
    ds: { name: "Consultancies", short: "Consultancies", tagline: "Environmental consultancies" },
    ap: { name: "Hardware and installation partners", short: "Installers", tagline: "Hardware, buoys and installation" },
  },

  contact: {
    name: "Partner team",          // TODO: named partner contact
    role: "Partnerships, Spoor",
    email: "partners@spoor.ai",    // TODO: confirm address. Shown on the site.
    requestEmail: "hanne@spoor.ai", // Where the request forms and checklists send to.
  },

  // Pixel sizes of images, so the page does not jump while they load.
  // Optional: a new image works without an entry here.
  imageSizes: {
    "assets/hero-kittiwake.webp": [1961, 1103],
    "assets/survey.png": [1952, 1232],
    "assets/buoysectors.png": [1952, 1232],
    "assets/when_used.png": [2796, 1116],
    "assets/app_video.jpg": [2000, 1594],
    "assets/two_views.png": [3264, 912],
    "assets/outcomes.png": [2792, 1002],
    "assets/arrays.png": [1886, 624],
    "assets/aberdeen.jpg": [2000, 1324],
    "assets/camerapair.jpg": [2000, 1500],
    "assets/ir_panels.jpg": [886, 646],
  },

  requestTypes: ["Tender support", "Demo", "Case study or reference", "Training", "Something else"],

  // Interface text used across the portal.
  ui: {
    welcomeHeading: "Welcome to the Spoor Partner Portal",
    welcomeText: "Find what you need to pitch, bid and deliver with Spoor, without having to ask us first.",
    comingSoon: "Coming soon",
    forSegment: "For {segment}",
    download: "Download",
    notAvailable: "Not available yet",
    copy: "Copy",
    copied: "Copied to clipboard",
    copyFailed: "Copy failed. Select the text and copy it manually.",
    textComingSoon: "Text coming soon.",
    onThisPage: "On this page",
    stepOf: "Question {n} of {total}",
    startAgain: "Start again",
    checklistNothingTicked: "Tick at least one item first.",
    checklistMailNote: "This opens an email to the partner team with your answers filled in.",
    partnerType: "Partner type",
    contactBlurb: "Your single point of contact for bids, questions and anything else about working with Spoor.",
    requestHeading: "Send a request",
    requestText: "Tender support, a demo, a reference or anything else. We will get back to you.",
    requestName: "Your name",
    requestOrg: "Organisation",
    requestType: "Request type",
    requestDeadline: "Deadline (optional)",
    requestDeadlineMail: "Deadline",
    requestDetails: "Details",
    requestPlaceholder: "Project, client, tender reference and what you need from us",
    requestSubmit: "Send request",
    requestNote: "This opens an email to the partner team with your request filled in.",
    // Email subject for every form: {request} is the form's own subject.
    mailSubject: "Spoor Partner Portal: {request} | {segment} | {page}",
    requestSubject: "{type} request from {org}",
    sentFrom: "Sent from",
    newTab: "(opens in a new tab)",
  },

  sections: [
    {
      id: "why",
      title: "Why Spoor",
      subtitle: "Value proposition",
      intro: {
        ds: "Camera-based bird and bat monitoring that adds a continuous, checkable layer of evidence to your studies, and a partnership built around the projects you win.",
        // TODO: Hanne to confirm wording for installers.
        ap: "Camera systems you can mount, power and connect as part of your scope, with Spoor handling specification, configuration and remote commissioning.",
      },
      blocks: [
        {
          type: "hero",
          for: "both",
          image: "assets/hero-kittiwake.webp",
          alt: "Offshore wind farm under a blue sky. A Black-legged Kittiwake is tracked past a turbine, with a Spoor detection card showing no interaction, its time, direction, speed, height and the weather.",
          heading: "Evidence your clients and regulators can check",
          text: "Every figure we report traces back to a video clip, a track and a record of how it was produced.",
        },
        {
          type: "toggle",
          for: "ds",
          heading: "The gap in today's survey data",
          options: [
            {
              label: "Vessel and aerial surveys",
              image: "assets/survey.png",
              alt: "Survey transects covered back and forth by plane and by vessel",
              heading: "A few snapshots across the year",
              points: [
                "Broad coverage across the whole site",
                "A handful of survey days per year",
                "Little flight height data",
                "Only when the weather allows",
              ],
              note: "Good for the spatial picture.",
            },
            {
              label: "Cameras on buoys",
              image: "assets/buoysectors.png",
              alt: "Two buoy-mounted cameras, each watching two fixed sectors of airspace",
              heading: "Continuous, all year round",
              points: [
                "Every daylight hour, in the same airspace",
                "A flight height for every detection",
                "Species where the bird is close enough",
                "A local volume, not the whole site",
              ],
              note: "Good for the temporal picture.",
            },
          ],
        },
        {
          type: "callout",
          for: "ds",
          sub: true,
          text: "Used together, surveys give you the spatial picture and cameras give you the temporal one.",
        },
        {
          type: "cards",
          for: "ds",
          heading: "What's in it for your consultancy",
          columns: 2,
          items: [
            { title: "Monitoring in your scope, without building it", text: "Offer continuous camera-based monitoring as part of your own service. Spoor runs the hardware, AI and data. You design the study, interpret the results and advise your client." },
            { title: "Temporal data that enriches your methods", text: "Continuous monitoring fills the gaps between survey days: seasons, weather and time of day. It adds to your scope rather than replacing any of it." },
            { title: "Data that fits your workflow", text: "Data built for ecologists and statisticians, a video and image for every detection, and an audit trail you can stand behind in front of a regulator." },
            { title: "Deals flow both ways", text: "Over half of our pipeline involves partners, and we refer work to the partners we trust." },
          ],
        },
        {
          // TODO: four cards to be written by Hanne.
          type: "cards",
          for: "ap",
          heading: "What's in it for installers",
          columns: 2,
          items: [
            { tag: "Coming soon", text: "We're writing this now." },
          ],
        },
        {
          type: "stats",
          for: "both",
          heading: "Aberdeen Bay: what 19 months of monitoring showed",
          image: "assets/aberdeen.jpg",
          items: [
            { value: 137000, suffix: "+", label: "birds detected near an operating turbine" },
            { value: 0, suffix: "", label: "confirmed collisions" },
            { value: 8, suffix: "+", label: "collisions per turbine per year predicted by the pre-construction models" },
          ],
          caption: "Source: Cook, A. 2026. Review of Aberdeen Bay Collision Monitoring Data. The Biodiversity Consultancy.",
          link: { href: "#/bid?to=case-studies", label: "Read the case studies", newTab: true },
        },
        {
          type: "cards",
          for: "both",
          heading: "Selected projects",
          columns: 3,
          link: { href: "#/bid?to=case-studies", label: "Read the case studies", newTab: true },
          items: [
            { title: "SeaMe, RWE Kaskasi (Germany)", text: "AI-based bird monitoring at the Kaskasi offshore wind farm in the German North Sea, as part of RWE's SeaMe programme. Our optical data is combined with acoustic and radar monitoring." },
            { title: "Hafslund (Norway, onshore)", text: "A 12-month pre-construction baseline for birds and bats, informing the EIA, turbine siting and shutdown protocols." },
            { title: "Equinor Hywind Tampen (Norway, floating offshore)", text: "Buoy-mounted monitoring before installation, independently reviewed by The Biodiversity Consultancy (2024)." },
          ],
        },
        {
          type: "prose",
          for: "both",
          sub: true,
          italic: true,
          paragraphs: [
            "\"Witnessing the remarkable performance and team spirit of both teams was a true testament to how the seemingly impossible can be achieved through collaboration.\" Dr. Petra Ringeltaube, Senior Environment & Permit Manager, RWE Offshore Wind.",
          ],
        },
      ],
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
      id: "product",
      title: "The product",
      subtitle: "AAM and TIM",
      toc: true,
      intro: {
        ds: "How Sky Intelligence works, what each product delivers, and how we make sure the data is right.",
        ap: "What the systems are, where they are mounted, and what each product needs on site.",
      },
      blocks: [
        {
          type: "prose",
          for: "both",
          heading: "One platform, two products",
          paragraphs: [
            "Sky Intelligence is Spoor's camera and AI platform. It detects, tracks and classifies birds in the airspace our cameras watch, and the same foundation is used before a wind farm is built, for site screening, EIAs and permits, and after it is built, to show compliance.",
            "The number of camera positions decides which product you need. One camera position measures how much activity there is in a volume of air: that is Aerial Activity Monitoring (AAM). Two camera positions on neighbouring turbines pin a bird's position in 3D beside a turbine: that is Turbine Interaction Monitoring (TIM).",
          ],
          image: "assets/when_used.png",
          alt: "AAM uses one camera viewpoint from site screening onwards; TIM uses cameras on the two adjacent turbines from first power. AAM often continues after the farm is built.",
          imageSide: "right",
        },
        {
          type: "picker",
          for: "both",
          heading: "Which product do you need?",
          steps: [
            {
              question: "When is the monitoring?",
              answers: [
                { label: "Pre-construction", value: "pre" },
                { label: "Post-construction", value: "post" },
              ],
            },
            {
              question: "What do you need to know?",
              answers: [
                { label: "How much bird activity there is, when and how high", value: "activity" },
                { label: "What happens when birds meet an operating turbine", value: "interaction" },
              ],
            },
          ],
          // Answer values joined with "+", in step order.
          resolve: {
            "pre+activity": "aam",
            "pre+interaction": "aam_note",
            "post+activity": "aam_post",
            "post+interaction": "tim",
          },
          results: {
            aam: {
              heading: "Aerial Activity Monitoring",
              text: "AAM gives you a full count of every bird in the airspace the cameras watch, with flight heights, directions, timing and weather. It is the product most often used for EIAs and permits.",
              link: "#/product?tab=aam",
              linkLabel: "See how AAM works",
            },
            aam_note: {
              heading: "Aerial Activity Monitoring, for now",
              text: "Interactions can only be measured at operating turbines, so before construction the question is about activity and flight heights. AAM covers that, and TIM can follow once the turbines are running.",
              link: "#/product?tab=aam",
              linkLabel: "See how AAM works",
            },
            aam_post: {
              heading: "Aerial Activity Monitoring",
              text: "AAM also runs on operating sites, for example to show compliance with activity-related permit conditions or to support a repowering project. If the site is floating, AAM is the option, since TIM needs fixed foundations.",
              link: "#/product?tab=aam",
              linkLabel: "See how AAM works",
            },
            tim: {
              heading: "Turbine Interaction Monitoring",
              text: "TIM tracks birds in 3D around an operating turbine, records every encounter with the rotor swept volume and flags possible collisions for expert review. It works on fixed-foundation turbines.",
              link: "#/product?tab=tim",
              linkLabel: "See how TIM works",
            },
          },
        },
        {
          type: "tabs",
          for: "both",
          heading: "How each product works",
          tabs: [
            {
              id: "aam",
              label: "AAM",
              blocks: [
                {
                  type: "prose",
                  heading: "How it works",
                  paragraphs: [
                    "A camera at a fixed vantage point records the same volume of air continuously. Inside that volume, every bird is detected, tracked and counted, not sampled. That is up to 27 million cubic metres per camera, depending on the size of the bird.",
                    "One camera gives a direction, not a distance, so AAM reports flight height bands rather than exact positions.",
                    "Onshore, cameras sit on masts, turbines or powered vantage points such as a powerbox or a solar trailer. Offshore, they sit on buoys, substations, foundations and floating platforms, where we correct for wave motion.",
                  ],
                },
                {
                  type: "video",
                  src: "assets/buoy.mp4",
                  poster: "assets/buoy_still.jpg",
                  alt: "A bird tracked from a buoy-mounted camera offshore",
                  caption: "A bird tracked from a buoy-mounted camera offshore. The camera moves with the waves, and the AI still follows the bird.",
                },
                {
                  type: "prose",
                  heading: "What your team gets",
                  image: "assets/app_video.jpg",
                  alt: "A detection in the Spoor app: a Northern Gannet's flight path drawn over the video, with zoomed thumbnails and an export button",
                  imageSide: "left",
                  paragraphs: [
                    "Detection events with start time, duration, flight direction and the weather at the time, delivered as CSV with timestamps in UTC. Behind each event sits a frame-by-frame timeline, which is where height and direction come from.",
                    "A video clip and an image for every detection, so every number can be checked and re-classified by your own ecologists.",
                    "Height distributions by height band, adjusted for the volume of air watched at each height, and analytics for time of day, observation rate, and activity by wind speed and direction.",
                    "Species from expert review of a random sample of 2 to 5% across the full period, or the most detailed level we are sure of, such as \"large gull\".",
                  ],
                },
              ],
            },
            {
              id: "tim",
              label: "TIM",
              blocks: [
                {
                  type: "prose",
                  heading: "How it works",
                  image: "assets/two_views.png",
                  alt: "Two cameras a baseline apart each see the bird along a ray; only the point where both rays cross is the bird's position",
                  imageSide: "right",
                  paragraphs: [
                    "Cameras on the two turbines next to the one being monitored watch the same turbine. Where their two views cross is where the bird is, to within 5 m, without assuming its size.",
                    "We calibrate against the turbine itself, using its known dimensions, so every position is measured from the rotor. That is why TIM works on fixed foundations only. Floating turbines move, and the two camera positions would not stay in a known relationship.",
                    "Several cameras can share one view, so smaller birds fill enough pixels to be identified. With turbine data from the operator (orientation and rpm), we can also tell whether a bird crossed the rotor swept plane.",
                  ],
                },
                {
                  type: "prose",
                  heading: "What your team gets",
                  image: "assets/outcomes.png",
                  alt: "The collision risk zone contains the rotor swept volume and the rotor swept plane. Three outcomes: non-interaction, interaction and collision.",
                  imageSide: "left",
                  paragraphs: [
                    "Interaction events, one per encounter, from the moment a bird enters the rotor swept volume to the moment it leaves: the turbine involved, the closest approach to the hub, and whether it crossed the rotor swept plane. Each comes with a 3D timeline measured from the rotor centre, in metres, with its uncertainty.",
                    "Each encounter is classified as a non-interaction, an interaction (a clear change of speed or direction) or a possible collision. Possible collisions are flagged for expert review. We never confirm a collision automatically.",
                    "Every detection inside the rotor swept sphere is labelled by hand, not sampled. TIM also includes all of AAM's activity data for the same cameras.",
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "prose",
          for: "both",
          heading: "Night-time monitoring and bats",
          tag: "Being piloted now",
          paragraphs: [
            "Infrared panels light the airspace so the cameras keep detecting after dark.",
            "It combines well with acoustics. Cameras show flight paths, heights and behaviour around the turbine, while acoustic surveys add species detail. Our platform takes acoustic and radar data alongside video, as at RWE's Kaskasi wind farm.",
          ],
        },
        {
          type: "video",
          for: "both",
          sub: true,
          src: "assets/ir_night.mp4",
          poster: "assets/ir_still.jpg",
          alt: "Infrared footage at night: a bird tracked past wind turbines in the dark",
          caption: "A real infrared detection at night: a bird tracked past the turbines in the dark.",
        },
        {
          type: "cards",
          for: "both",
          sub: true,
          columns: 1,
          items: [
            { title: "The WINGS research project", text: "Led by Spoor with NMBU (Norwegian University of Life Sciences), 2025 to 2028, as an Innovation Project for the Industrial Sector. WINGS is developing and validating night-time monitoring for birds and bats, combining monitoring with mitigation, studying species behaviour and risk patterns, and turning the results into practical guidance. More at spoor.ai/wings." },
          ],
        },
        {
          type: "bars",
          for: "both",
          heading: "How we know the data is right",
          caption: "2024 field test: share of birds detected, against a trained ornithologist watching the same sky.",
          suffix: "%",
          max: 100,
          items: [
            { label: "Spoor AI", value: 94 },
            { label: "Ornithologist", value: 88 },
          ],
        },
        {
          type: "stats",
          for: "both",
          sub: true,
          items: [
            { value: 90, suffix: "%+", label: "precision, assured in our contracts" },
            { value: 96, suffix: "%", label: "precision measured across all distances" },
          ],
        },
        {
          type: "accordion",
          for: "both",
          sub: true,
          heading: "Checks that run all the time",
          items: [
            { title: "Before go-live", text: "Each site is commissioned and calibrated before it goes live, with a baseline of samples labelled by experts." },
            { title: "Every week", text: "A trained ornithologist reviews about 100 clips per active site and marks any errors. An engineer on duty watches for drift." },
            { title: "Every detection", text: "Each detection is stored with the model and code version that produced it, so any figure can be traced years later." },
            { title: "Independent reviews", text: "BTO validated our single-camera method at Aberdeen. The Biodiversity Consultancy reviewed the Hywind Tampen buoy programme (2024) and the Aberdeen Bay collision dataset." },
          ],
          note: "Figures apply to daytime bird detection.",
        },
        {
          type: "prose",
          for: "both",
          heading: "Designing a study together",
          paragraphs: [
            "Range is not one number. It depends on the size of the bird, the lens and the weather. When a client asks how far the cameras can see, the honest first answer is a question: which species?",
          ],
        },
        {
          type: "table",
          for: "both",
          sub: true,
          columns: ["For a 1 m wingspan bird, such as a kittiwake", "Detected to", "Species identified to"],
          rows: [
            ["8K camera on a turbine", "1,800 m", "432 m"],
            ["Wide-angle camera on a buoy", "278 m", "89 m"],
          ],
        },
        {
          type: "prose",
          for: "both",
          sub: true,
          heading: "Arrays for detail",
          image: "assets/arrays.png",
          alt: "One camera framing the whole rotor, next to six cameras in a grid covering the same rotor",
          imageSide: "right",
          paragraphs: [
            "For a turbine 820 m away with a 164 m rotor, one camera at 50 mm covers the whole rotor but can only detect a bird. Six cameras at 150 mm cover the same rotor with enough detail to name the species. Haze, fog and rain shorten every range.",
          ],
        },
        {
          type: "callout",
          for: "both",
          sub: true,
          text: "We calculate coverage for every species that matters before anything is installed, and give you a coverage map you can use in the EIA. Getting this right up front is what keeps data from being ruled insufficient.",
        },
        { ...SCOPING_CHECKLIST, for: "both", sub: true },
        {
          type: "toggle",
          for: "both",
          heading: "Installation: two ways to get set up",
          options: [
            {
              label: "Your team or the client installs",
              image: "assets/camerapair.jpg",
              alt: "A pair of Spoor cameras on a mount",
              heading: "Spoor as your subcontractor",
              points: [
                "The physical installation is done on site by the client, your team or their usual contractor",
                "Spoor specifies the system, configures and tests it before shipping, and provides the installation procedure",
                "We guide the installation remotely and commission the system remotely",
              ],
              note: "Onshore greenfield sites can use a powered vantage point: a powerbox or a trailer with solar panels.",
            },
            {
              label: "A certified installation partner installs",
              image: "assets/ir_panels.jpg",
              alt: "Infrared panels and cameras mounted on an offshore platform railing",
              heading: "When the expertise isn't in-house",
              points: [
                "One of our certified installation partners does the mounting and site work",
                "Spoor still specifies, configures, tests and commissions the system",
                "The same remote support throughout the campaign",
              ],
              note: "Installation costs are not covered by the partner discount.",
            },
          ],
        },
        {
          type: "table",
          for: "both",
          sub: true,
          heading: "What installation involves",
          columns: ["", "AAM", "TIM"],
          rows: [
            ["Mounting", "Cameras and a cabinet on a mast, turbine, substation, buoy or floating platform, or on a powered vantage point onshore", "Cameras and cabinets on the two fixed-foundation turbines next to the one being monitored"],
            ["Power and internet", "At the cabinet", "On each of the two host turbines"],
            ["From the site owner", "Site access and permits", "Site access and permits, plus turbine specs and turbine data (orientation and rpm)"],
          ],
        },
        {
          type: "steps",
          for: "both",
          sub: true,
          heading: "Every installation ends the same way",
          items: [
            { title: "Design", text: "We agree camera positions and lenses based on the species that matter." },
            { title: "Install", text: "Mount the cameras and cabinet, connect power and internet." },
            { title: "Commission", text: "We check the field of view, connection and data flow remotely, and issue a commissioning record." },
            { title: "Monitor", text: "Data starts flowing. We watch system health remotely throughout." },
          ],
        },
        {
          type: "accordion",
          for: "both",
          heading: "Questions we often get",
          items: [
            { title: "How far can your cameras see?", text: "It depends on the species and the lens. Tell us which species matter and we'll calculate the range and the volume covered for each one." },
            { title: "Do you count the same bird twice?", text: "Yes, as in any fixed camera survey: a bird that returns is counted again. We report measures ecologists already use, such as bird minutes, density and the most birds seen at once." },
            { title: "Which cameras do you use?", text: "Our reference design uses Axis cameras, which we know how to calibrate and operate. Where a project needs something else, we can assess alternatives." },
            { title: "Does TIM work on floating turbines?", text: "Not today. TIM needs both camera positions to stay fixed. AAM works on buoys and floating platforms, correcting for their motion." },
          ],
        },
      ],
      assets: [],
    },
    {
      id: "bid",
      title: "Bid with Spoor",
      subtitle: "Self-serve bidding",
      intro: {
        ds: "Everything you need to include Spoor in a bid without having to ask us. Copy the text, attach the CVs, and reference our work.",
        ap: "Everything you need to include Spoor in a quote or bid, including what you need to know to price the installation.",
      },
      blocks: [
        {
          type: "prose",
          for: "both",
          heading: "Start with a scoping call",
          paragraphs: [
            "Every bid starts with the same questions: which species, what site, what the regulator expects and how long the monitoring runs. Send us those and we'll come back with a camera plan and a price you can scope into your bid.",
          ],
        },
        // `collapsed` shows only a button until the partner opens the checklist.
        { ...SCOPING_CHECKLIST, for: "both", sub: true, collapsed: true, revealLabel: "Send a scoping request" },
        {
          type: "cards",
          for: "both",
          heading: "How pricing is built up",
          columns: 2,
          items: [
            { title: "Two fees", text: "A software fee, which includes Spoor's own services, plus a hardware fee that depends on the setup. Installation is done by the client or a certified installation partner and is priced separately." },
            { tag: "Coming soon", title: "Pricing explainer", text: "A full explainer of what drives cost, so you can scope Spoor into your bid." },
          ],
        },
      ],
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
          id: "case-studies",
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
      subtitle: "The partner programme",
      toc: true,
      intro: {
        ds: "What you get as a Spoor partner, how we work together on a deal, and what we ask in return.",
        ap: "What you get as a Spoor partner, how we work together on a deal, and what we ask in return.",
      },
      blocks: [
        {
          type: "cards",
          for: "both",
          heading: "What you get as a Spoor partner",
          columns: 3,
          items: [
            { title: "Partner pricing", text: "18% below our standard price for the first 12 months, so you can price competitively or keep the margin." },
            { title: "You keep the client", text: "Spoor works as your subcontractor. You hold the relationship and the contract." },
            { title: "Opportunity protection", text: "Register a deal we're not already working on. Once confirmed, private opportunities stay yours for 6 months." },
            { title: "Referral fee", text: "10% of the deal size when you bring us a deal but don't want to bid or take part." },
            { title: "We bring work to you", text: "You're on our list of recommended partners, so our projects and monitoring data create advisory work for you, such as interpreting results, curtailment strategies and regulatory reporting." },
          ],
        },
        {
          type: "picker",
          for: "both",
          heading: "Which model fits your project?",
          steps: [
            {
              question: "How does the deal come about?",
              answers: [
                { label: "We bring the deal and bid with Spoor", value: "bring_bid" },
                { label: "We bring the deal but won't bid", value: "bring_refer" },
                { label: "Spoor brings the deal and asks us to bid", value: "spoor_brings" },
                { label: "We need to stay neutral and can't accept fees", value: "neutral" },
              ],
            },
          ],
          // With one question and no `resolve`, the answer value is the result key.
          results: {
            bring_bid: {
              heading: "Partner pricing and protection",
              text: "You register the opportunity. Once confirmed, it stays yours for 6 months. Spoor is your subcontractor at partner pricing, 18% below standard for the first 12 months, which you can pass on to the client or keep as margin.",
              note: "Open tenders are not exclusive. Registered partners get priority bid support instead.",
            },
            bring_refer: {
              heading: "Referral fee",
              text: "You introduce us and step back. If the deal closes, you receive 10% of the deal size.",
            },
            spoor_brings: {
              heading: "Standard terms",
              text: "We ask you to bid with us because your expertise is needed. Standard pricing applies, and the project counts towards your partner track record and case studies.",
            },
            neutral: {
              heading: "A discount instead of a fee",
              text: "Some consultancies cannot accept fees in order to stay neutral. In that case the incentive becomes a product discount passed on to your client, so your recommendation stays independent.",
            },
          },
        },
        {
          type: "cards",
          for: "both",
          heading: "Support to win together",
          intro: "We're building this now in one partner portal, and early partners help shape it.",
          columns: 3,
          items: [
            { tag: "Live", title: "Partner portal", text: "Bid material, training and updates in one place, with access as soon as you sign." },
            { tag: "Coming soon", title: "Self-serve tender kit", text: "Tender text, CVs, case studies and a pricing explainer, ready to reuse in your bids." },
            { tag: "Live", title: "Priority bid support", text: "Our experts help shape methods and join bid calls, with a fast response time." },
            { tag: "Coming soon", title: "Certification", text: "Your team becomes certified in using and interpreting Spoor data." },
            { tag: "Live", title: "Credibility and visibility", text: "Joint case studies, co-authored papers, conference talks and a listing on our website." },
            { tag: "Live", title: "Early access", text: "A first look at product developments, and a seat on our partner advisory board for early members." },
          ],
        },
        {
          type: "prose",
          for: "both",
          heading: "What we ask in return",
          paragraphs: [
            "Register opportunities so we can protect them. Complete a short introduction training. Include Spoor in relevant bids. Share project outcomes for case studies, with your client's approval. The ornithology, analysis and reporting stay with you: Spoor supplies validated data.",
          ],
        },
        {
          type: "callout",
          for: "both",
          text: "Early partners get a seat on our partner advisory board, and a say in what this portal and the programme become. Ask us about it when you get in touch.",
        },
      ],
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
