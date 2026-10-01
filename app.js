(function () {
  const P = window.PORTAL;
  const U = P.ui;
  const STORE_KEY = "spoor-partner-segment";
  const $ = (sel) => document.querySelector(sel);

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fill = (s, vars) => s.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k] : ""));
  const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const num = (n) => Number(n).toLocaleString("en-GB");

  function getSegment() {
    try { const s = localStorage.getItem(STORE_KEY); return P.segments[s] ? s : null; } catch { return null; }
  }
  function setSegment(s) {
    try { s ? localStorage.setItem(STORE_KEY, s) : localStorage.removeItem(STORE_KEY); } catch {}
  }

  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => t.classList.remove("show"), 1800);
  }

  // ---------- Sign in ----------
  function showLogin() {
    current = null;
    document.body.removeAttribute("data-segment");
    $("#app").hidden = true;
    $("#login").hidden = false;
    const link = $("#login-contact");
    link.textContent = P.contact.email;
    link.href = "mailto:" + P.contact.email;
    $("#code").focus();
  }

  $("#login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const code = $("#code").value.trim().toUpperCase();
    const match = Object.keys(P.accessCodes).find((k) => k.toUpperCase() === code);
    if (!match) { $("#login-error").hidden = false; return; }
    $("#login-error").hidden = true;
    $("#code").value = "";
    setSegment(P.accessCodes[match]);
    if (!location.hash) location.hash = "#/why";
    start();
  });

  $("#logout").addEventListener("click", () => { setSegment(null); location.hash = ""; showLogin(); });

  // ---------- Portal ----------
  let current = null;      // id of the section on screen
  let observers = [];      // IntersectionObservers for the section on screen
  let registry = [];       // block objects, looked up by data-b index
  let usedIds = new Set();

  function start() {
    const seg = getSegment();
    if (!seg) return showLogin();
    current = null;
    document.body.dataset.segment = seg;
    $("#login").hidden = true;
    $("#app").hidden = false;
    $("#segment-pill").textContent = P.segments[seg].name;
    $("#nav").innerHTML = P.sections.map((s) => `<a href="#/${s.id}" data-id="${s.id}">${esc(s.title)}</a>`).join("");
    measureTopbar();
    render();
  }

  function measureTopbar() {
    const bar = document.querySelector(".topbar");
    if (bar) document.documentElement.style.setProperty("--topbar-h", bar.offsetHeight + "px");
  }
  window.addEventListener("resize", measureTopbar);

  // Routes look like #/product or #/product?tab=tim
  function parseRoute(hash) {
    const [id, query = ""] = hash.replace(/^#\/?/, "").split("?");
    return { id, params: new URLSearchParams(query) };
  }

  function render() {
    const seg = getSegment();
    if (!seg) return showLogin();
    const { id, params } = parseRoute(location.hash);
    const section = P.sections.find((s) => s.id === id) || P.sections[0];

    // Same section, new query (e.g. a tab link): update in place.
    if (section.id === current) {
      if (params.has("tab")) applyTab(params.get("tab"), true);
      else if (params.has("to")) scrollToId(params.get("to"), true);
      else window.scrollTo(0, 0);
      return;
    }
    current = section.id;

    document.querySelectorAll("#nav a").forEach((a) => {
      if (a.dataset.id === section.id) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    document.title = `${section.title} | Spoor Partner Portal`;

    observers.forEach((o) => o.disconnect());
    observers = [];
    registry = [];
    usedIds = new Set(["app", "content", "nav", "login", "code", "toast"]);

    let html = `
      <div class="section-head">
        <div class="eyebrow">${esc(section.subtitle)}</div>
        <h1>${esc(section.title)}</h1>
        <p>${esc(section.intro[seg])}</p>
      </div>`;

    if (section.id === P.sections[0].id) html = overview(seg) + html;

    if (section.id === "contact") {
      html += contactView(seg);
    } else {
      const toc = section.toc ? [] : null;
      const blocks = blocksHtml(section.blocks || [], seg, 2, toc);
      const assets = (section.assets || []).filter((a) => a.for === "both" || a.for === seg);
      const grid = assets.length ? `<div class="grid">${assets.map((a) => assetCard(a, seg)).join("")}</div>` : "";
      if (toc && toc.length) {
        html += `
          <div class="has-toc">
            <nav class="toc" aria-label="${esc(U.onThisPage)}">
              <p class="toc-title">${esc(U.onThisPage)}</p>
              <ul>${toc.map((t) => `<li><a href="#${t.id}" data-scroll="${t.id}">${esc(t.text)}</a></li>`).join("")}</ul>
            </nav>
            <div class="blocks">${blocks}${grid}</div>
          </div>`;
      } else {
        html += `<div class="blocks">${blocks}</div>${grid}`;
      }
    }

    const content = $("#content");
    content.innerHTML = html;
    bind(content, seg);
    window.scrollTo(0, 0);
    if (params.has("tab")) applyTab(params.get("tab"), true);
    if (params.has("to")) scrollToId(params.get("to"), false);
  }

  // Scroll to an element on the page, e.g. #/bid?to=case-studies
  function scrollToId(id, smooth) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: smooth && !reduceMotion() ? "smooth" : "auto", block: "start" });
    el.focus({ preventScroll: true });
  }

  function overview(seg) {
    return `
      <div class="section-head">
        <div class="eyebrow">${esc(P.segments[seg].tagline)}</div>
        <h1>${esc(U.welcomeHeading)}</h1>
        <p>${esc(U.welcomeText)}</p>
      </div>
      <div class="overview">
        ${P.sections.map((s) => `<a href="#/${s.id}"><h2>${esc(s.title)}</h2><p>${esc(s.subtitle)}</p></a>`).join("")}
      </div>
      <hr class="divider">`;
  }

  // ---------- Blocks ----------
  const visible = (seg) => (b) => !b.for || b.for === "both" || b.for === seg;

  function uniqueId(text) {
    const base = String(text).toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "block";
    let id = base, n = 2;
    while (usedIds.has(id)) id = `${base}-${n++}`;
    usedIds.add(id);
    return id;
  }

  // level: heading level for top-level blocks here. toc: array to collect
  // table-of-contents entries, or null.
  function blocksHtml(blocks, seg, level, toc) {
    return blocks.filter(visible(seg)).map((b) => blockHtml(b, seg, level, toc)).join("");
  }

  function blockHtml(b, seg, baseLevel, toc) {
    const fn = BLOCKS[b.type];
    if (!fn) return "";
    const level = Math.min(b.sub ? baseLevel + 1 : baseLevel, 6);
    const id = b.heading ? uniqueId(b.heading) : "";
    if (id && toc && !b.sub) toc.push({ id, text: b.heading });
    const key = registry.push(b) - 1;
    const ctx = {
      seg, level, key,
      // A sub block without its own heading continues the previous block's heading.
      inner: Math.min((b.heading ? level : baseLevel) + 1, 6),
      head: (cls = "") => b.heading
        ? `<div class="block-head"><h${level} id="${id}" class="block-title ${cls}" tabindex="-1">${esc(b.heading)}</h${level}>${b.tag ? `<span class="tag tag-highlight">${esc(b.tag)}</span>` : ""}</div>`
        : "",
    };
    ctx.link = () => linkHtml(b.link);
    const note = b.note ? `<p class="block-note">${esc(b.note)}</p>` : "";
    // Stats place their link inside the panel; other blocks get it underneath.
    const link = b.type === "stats" ? "" : ctx.link();
    return `<section class="block block-${b.type} ${b.sub ? "sub" : ""}" data-b="${key}" data-inner="${ctx.inner}">${fn(b, ctx)}${link}${note}</section>`;
  }

  const img = (src, alt, extra = 'loading="lazy"') => {
    const size = (P.imageSizes || {})[src];
    const dims = size ? `width="${size[0]}" height="${size[1]}"` : "";
    return `<img src="${esc(src)}" alt="${esc(alt || "")}" ${dims} ${extra} decoding="async">`;
  };
  function linkHtml(l) {
    if (!l || !l.href) return "";
    const ext = l.newTab ? ` target="_blank" rel="noopener"` : "";
    return `<p class="block-link"><a class="cta-link" href="${esc(l.href)}"${ext}>${esc(l.label || l.href)}<span class="cta-arrow" aria-hidden="true">${l.newTab ? "&#8599;" : "&#8594;"}</span>${l.newTab ? `<span class="sr-only"> ${esc(U.newTab)}</span>` : ""}</a></p>`;
  }
  const h = (level, text, cls = "") => `<h${level} class="${cls}">${esc(text)}</h${level}>`;
  const tagHtml = (t) => `<span class="tag ${t === "Live" ? "tag-live" : "tag-highlight"}">${esc(t)}</span>`;

  const BLOCKS = {
    hero: (b, c) => `
      <div class="hero">
        ${img(b.image, b.alt, 'fetchpriority="high"')}
        <div class="hero-panel">${c.head()}<p>${esc(b.text)}</p></div>
      </div>`,

    prose: (b, c) => {
      const paras = (b.paragraphs || []).map((p) => `<p>${esc(p)}</p>`).join("");
      const figure = b.image
        ? `<figure class="prose-figure">${img(b.image, b.alt)}${b.caption ? `<figcaption>${esc(b.caption)}</figcaption>` : ""}</figure>`
        : "";
      return `
        <div class="prose ${b.image ? `has-image img-${b.imageSide === "left" ? "left" : "right"}` : ""} ${b.italic ? "italic" : ""}">
          <div class="prose-text">${c.head()}${paras}</div>
          ${figure}
        </div>`;
    },

    toggle: (b, c) => `
      ${c.head()}
      <div class="toggle">
        <div class="segmented" role="group" ${b.heading ? `aria-label="${esc(b.heading)}"` : ""}>
          ${b.options.map((o, i) => `<button type="button" data-opt="${i}" aria-pressed="${i === 0}">${esc(o.label)}</button>`).join("")}
        </div>
        <div class="toggle-panel">${togglePanel(b.options[0], c.inner)}</div>
      </div>`,

    tabs: (b, c) => {
      const tabs = b.tabs.map((t, i) => ({ ...t, id: t.id || `tab${i}`, uid: `${c.key}-${i}` }));
      return `
        ${c.head()}
        <div class="tabs">
          <div class="tablist" role="tablist" ${b.heading ? `aria-label="${esc(b.heading)}"` : ""}>
            ${tabs.map((t, i) => `<button type="button" role="tab" id="tab-${t.uid}" data-tab="${esc(t.id)}" aria-controls="panel-${t.uid}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(t.label)}</button>`).join("")}
          </div>
          ${tabs.map((t, i) => `
            <div class="tabpanel" role="tabpanel" id="panel-${t.uid}" aria-labelledby="tab-${t.uid}" tabindex="0" ${i === 0 ? "" : "hidden"}>
              ${blocksHtml(t.blocks || [], c.seg, c.inner, null)}
            </div>`).join("")}
        </div>`;
    },

    video: (b, c) => `
      ${c.head()}
      <figure class="video">
        <video muted loop playsinline controls preload="metadata" poster="${esc(b.poster)}" aria-label="${esc(b.alt || "")}" data-autoplay>
          <source src="${esc(b.src)}" type="video/mp4">
        </video>
        ${b.caption ? `<figcaption>${esc(b.caption)}</figcaption>` : ""}
      </figure>`,

    picker: (b, c) => `
      ${c.head()}
      <div class="picker" data-picker>${pickerStep(b, 0, c.inner)}</div>`,

    stats: (b, c) => `
      <div class="stats ${b.image ? "has-bg" : ""}">
        ${b.image ? img(b.image, "", 'loading="lazy" class="stats-bg"') : ""}
        <div class="stats-inner">
          ${c.head()}
          <div class="stats-row" style="--n:${b.items.length}">
            ${b.items.map((s) => `
              <div class="stat">
                <div class="stat-value"><span aria-hidden="true" data-count="${Number(s.value)}" data-suffix="${esc(s.suffix || "")}">${num(s.value)}${esc(s.suffix || "")}</span><span class="sr-only">${num(s.value)}${esc(s.suffix || "")}</span></div>
                <div class="stat-label">${esc(s.label)}</div>
              </div>`).join("")}
          </div>
          ${b.caption ? `<p class="caption">${esc(b.caption)}</p>` : ""}
          ${c.link()}
        </div>
      </div>`,

    bars: (b, c) => {
      const max = b.max || 100;
      const suffix = b.suffix || "";
      return `
        ${c.head()}
        <div class="bars">
          ${b.items.map((it) => `
            <div class="bar-row">
              <span class="bar-label">${esc(it.label)}</span>
              <span class="bar-track" aria-hidden="true"><span class="bar-fill" style="--w:${Math.max(0, Math.min(100, (it.value / max) * 100))}%"></span></span>
              <span class="bar-value">${num(it.value)}${esc(suffix)}</span>
            </div>`).join("")}
        </div>
        ${b.caption ? `<p class="caption">${esc(b.caption)}</p>` : ""}`;
    },

    cards: (b, c) => `
      ${c.head()}
      ${b.intro ? `<p class="block-intro">${esc(b.intro)}</p>` : ""}
      <div class="cards cols-${[1, 2, 3].includes(b.columns) ? b.columns : 3}">
        ${b.items.map((it) => `
          <article class="info-card">
            ${it.tag ? `<div>${tagHtml(it.tag)}</div>` : ""}
            ${it.title ? h(c.inner, it.title) : ""}
            ${it.text ? `<p>${esc(it.text)}</p>` : ""}
          </article>`).join("")}
      </div>`,

    table: (b, c) => {
      const cols = b.columns || [];
      return `
        ${c.head()}
        <div class="table-wrap">
          <table class="rtable">
            <thead><tr>${cols.map((col) => col ? `<th scope="col">${esc(col)}</th>` : `<td></td>`).join("")}</tr></thead>
            <tbody>
              ${b.rows.map((row) => `<tr>${row.map((cell, i) => i === 0
                ? `<th scope="row" ${cols[0] ? `data-label="${esc(cols[0])}"` : ""}>${esc(cell)}</th>`
                : `<td data-label="${esc(cols[i] || "")}">${esc(cell)}</td>`).join("")}</tr>`).join("")}
            </tbody>
          </table>
        </div>`;
    },

    accordion: (b, c) => `
      ${c.head()}
      <div class="accordion">
        ${b.items.map((it, i) => `
          <div class="acc-item">
            <h${c.inner} class="acc-h">
              <button type="button" id="acc-${c.key}-${i}" aria-expanded="${i === 0}" aria-controls="accp-${c.key}-${i}">
                <span>${esc(it.title)}</span><span class="chev" aria-hidden="true"></span>
              </button>
            </h${c.inner}>
            <div class="acc-panel" id="accp-${c.key}-${i}" role="region" aria-labelledby="acc-${c.key}-${i}" ${i === 0 ? "" : "hidden"}>
              <p>${esc(it.text)}</p>
            </div>
          </div>`).join("")}
      </div>`,

    checklist: (b, c) => {
      const pid = `checklist-${c.key}`;
      return `
        ${b.collapsed ? `<button type="button" class="btn btn-primary" data-reveal aria-expanded="false" aria-controls="${pid}">${esc(b.revealLabel || b.buttonLabel)}</button>` : ""}
        <div class="checklist" id="${pid}" ${b.collapsed ? "hidden" : ""}>
          ${c.head()}
          ${b.intro ? `<p class="block-intro">${esc(b.intro)}</p>` : ""}
          <form data-checklist novalidate>
            ${b.items.map((it, i) => `
              <div class="check-item">
                <input type="checkbox" id="ck-${c.key}-${i}" data-i="${i}">
                <label for="ck-${c.key}-${i}" id="ckl-${c.key}-${i}">${esc(it.label)}</label>
                <input type="text" id="ckt-${c.key}-${i}" aria-labelledby="ckl-${c.key}-${i}" placeholder="${esc(it.placeholder || "")}" data-t="${i}">
              </div>`).join("")}
            <p class="error" role="alert" hidden>${esc(U.checklistNothingTicked)}</p>
            <div><button class="btn btn-primary" type="submit">${esc(b.buttonLabel)}</button></div>
            <p class="muted small">${esc(U.checklistMailNote)}</p>
          </form>
        </div>`;
    },

    callout: (b) => `<div class="callout"><p>${esc(b.text)}</p></div>`,

    steps: (b, c) => `
      ${c.head()}
      <ol class="steps">
        ${b.items.map((it, i) => `
          <li>
            <span class="step-num" aria-hidden="true">${i + 1}</span>
            ${h(c.inner, it.title)}
            <p>${esc(it.text)}</p>
          </li>`).join("")}
      </ol>`,
  };

  function togglePanel(o, level) {
    return `
      <div class="toggle-body">
        ${img(o.image, o.alt)}
        <div>
          ${o.heading ? h(level, o.heading) : ""}
          ${o.points && o.points.length ? `<ul>${o.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>` : ""}
          ${o.note ? `<p class="toggle-note"><strong>${esc(o.note)}</strong></p>` : ""}
        </div>
      </div>`;
  }

  function pickerStep(b, i, level) {
    const step = b.steps[i];
    return `
      <div class="picker-step">
        ${b.steps.length > 1 ? `<p class="picker-count">${esc(fill(U.stepOf, { n: i + 1, total: b.steps.length }))}</p>` : ""}
        <h${level} class="picker-q" tabindex="-1">${esc(step.question)}</h${level}>
        <div class="picker-answers">
          ${step.answers.map((a) => `<button type="button" class="btn btn-soft" data-answer="${esc(a.value)}">${esc(a.label)}</button>`).join("")}
        </div>
      </div>`;
  }

  function pickerResult(b, key, level) {
    const r = b.results[key];
    if (!r) return "";
    return `
      <div class="picker-result">
        <h${level} class="picker-q" tabindex="-1">${esc(r.heading)}</h${level}>
        <p>${esc(r.text)}</p>
        ${r.note ? `<p class="block-note">${esc(r.note)}</p>` : ""}
        <div class="picker-actions">
          ${r.link ? `<a class="btn btn-primary" href="${esc(r.link)}">${esc(r.linkLabel || r.link)}</a>` : ""}
          <button type="button" class="link-btn" data-restart>${esc(U.startAgain)}</button>
        </div>
      </div>`;
  }

  // ---------- Assets and contact ----------
  function assetCard(a, seg) {
    const ready = Boolean(a.file);
    const specific = a.for !== "both";
    const hasSnippets = Array.isArray(a.snippets) && a.snippets.length;
    const tags = [
      `<span class="tag">${esc(a.type)}</span>`,
      specific ? `<span class="tag for-you">${esc(fill(U.forSegment, { segment: P.segments[seg].short.toLowerCase() }))}</span>` : "",
      !ready && !hasSnippets ? `<span class="tag tag-highlight">${esc(U.comingSoon)}</span>` : "",
    ].join("");

    const action = ready
      ? `<a class="btn btn-primary" href="${esc(a.file)}" download>${esc(U.download)}</a>`
      : hasSnippets ? "" : `<button class="btn btn-ghost" disabled>${esc(U.notAvailable)}</button>`;

    const snippets = hasSnippets
      ? `<div class="snippets">${a.snippets.map((s, i) => `
          <div class="snippet">
            <div class="snippet-head">
              <h4>${esc(s.title)}</h4>
              <button class="btn btn-soft" data-copy="${i}" ${s.text ? "" : "disabled"}>${esc(U.copy)}</button>
            </div>
            <div class="snippet-body ${s.text ? "" : "empty"}" data-text="${i}">${s.text ? esc(s.text) : esc(U.textComingSoon)}</div>
          </div>`).join("")}</div>`
      : "";

    return `
      <article class="card ${hasSnippets ? "wide" : ""}" ${a.id ? `id="${esc(a.id)}" tabindex="-1"` : ""} ${hasSnippets ? 'data-snippets="1"' : ""}>
        <div class="card-meta">${tags}</div>
        <h3>${esc(a.title)}</h3>
        <p>${esc(a.description)}</p>
        ${snippets}
        ${action ? `<div class="actions">${action}</div>` : ""}
      </article>`;
  }

  function contactView(seg) {
    const c = P.contact;
    const initials = c.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
    return `
      <div class="contact-layout">
        <article class="card">
          <div class="person">
            <div class="avatar" aria-hidden="true">${esc(initials)}</div>
            <div><h2>${esc(c.name)}</h2><p>${esc(c.role)}</p></div>
          </div>
          <p>${esc(U.contactBlurb)}</p>
          <div class="actions"><a class="btn btn-soft" href="mailto:${esc(c.email)}">${esc(c.email)}</a></div>
        </article>
        <article class="card">
          <h2>${esc(U.requestHeading)}</h2>
          <p>${esc(U.requestText)}</p>
          <form class="form" id="request-form">
            <div class="row">
              <div class="field"><label for="r-name">${esc(U.requestName)}</label><input id="r-name" required></div>
              <div class="field"><label for="r-org">${esc(U.requestOrg)}</label><input id="r-org" required></div>
            </div>
            <div class="row">
              <div class="field"><label for="r-type">${esc(U.requestType)}</label>
                <select id="r-type">${P.requestTypes.map((t) => `<option>${esc(t)}</option>`).join("")}</select>
              </div>
              <div class="field"><label for="r-deadline">${esc(U.requestDeadline)}</label><input id="r-deadline" type="date"></div>
            </div>
            <div class="field"><label for="r-msg">${esc(U.requestDetails)}</label>
              <textarea id="r-msg" required placeholder="${esc(U.requestPlaceholder)}"></textarea>
            </div>
            <div><button class="btn btn-primary" type="submit">${esc(U.requestSubmit)}</button></div>
            <p class="muted small" style="margin:0">${esc(U.requestNote)}</p>
          </form>
        </article>
      </div>`;
  }

  // Every form sends to contact.requestEmail with a subject that says where it came from.
  function mailto(request, seg, body) {
    const page = (P.sections.find((s) => s.id === current) || {}).title || "";
    const subject = fill(U.mailSubject, { request, segment: P.segments[seg].name, page });
    const to = P.contact.requestEmail || P.contact.email;
    return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`${body}\n\n${U.sentFrom}: ${page}`)}`;
  }

  // ---------- Behaviour ----------
  function observe(els, opts, onEnter, once = true) {
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        onEnter(e.target, e.isIntersecting, e);
        if (once && e.isIntersecting) io.unobserve(e.target);
      });
    }, opts);
    els.forEach((el) => io.observe(el));
    observers.push(io);
  }

  function applyTab(tabId, scroll) {
    const btn = document.querySelector(`#content [role="tab"][data-tab="${CSS.escape(tabId)}"]`);
    if (!btn) return;
    selectTab(btn, false);
    if (scroll) btn.closest(".block").scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth", block: "start" });
  }

  function selectTab(btn, updateUrl) {
    const list = btn.closest('[role="tablist"]');
    list.querySelectorAll('[role="tab"]').forEach((t) => {
      const on = t === btn;
      t.setAttribute("aria-selected", on);
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
    if (updateUrl) history.replaceState(null, "", `#/${current}?tab=${encodeURIComponent(btn.dataset.tab)}`);
  }

  function countUp(el) {
    const to = Number(el.dataset.count);
    const suffix = el.dataset.suffix;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / 1200);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = num(Math.round(to * eased)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  function bind(root, seg) {
    const still = reduceMotion();

    // Snippet copy buttons
    root.querySelectorAll("[data-copy]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const body = btn.closest(".snippet").querySelector("[data-text]");
        try { await navigator.clipboard.writeText(body.textContent); toast(U.copied); }
        catch { toast(U.copyFailed); }
      });
    });

    // Toggles
    root.querySelectorAll(".block-toggle").forEach((sec) => {
      const b = registry[sec.dataset.b];
      const panel = sec.querySelector(".toggle-panel");
      const level = Number(sec.dataset.inner);
      sec.querySelectorAll("[data-opt]").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (btn.getAttribute("aria-pressed") === "true") return;
          sec.querySelectorAll("[data-opt]").forEach((x) => x.setAttribute("aria-pressed", x === btn));
          const swap = () => { panel.innerHTML = togglePanel(b.options[btn.dataset.opt], level); panel.classList.remove("fading"); };
          if (still) return swap();
          panel.classList.add("fading");
          setTimeout(swap, 150);
        });
      });
    });

    // Tabs
    root.querySelectorAll('[role="tablist"]').forEach((list) => {
      const tabs = [...list.querySelectorAll('[role="tab"]')];
      tabs.forEach((t, i) => {
        t.addEventListener("click", () => selectTab(t, true));
        t.addEventListener("keydown", (e) => {
          let j = null;
          if (e.key === "ArrowRight") j = (i + 1) % tabs.length;
          if (e.key === "ArrowLeft") j = (i - 1 + tabs.length) % tabs.length;
          if (e.key === "Home") j = 0;
          if (e.key === "End") j = tabs.length - 1;
          if (j === null) return;
          e.preventDefault();
          tabs[j].focus();
          selectTab(tabs[j], true);
        });
      });
    });

    // Accordions: one open at a time
    root.querySelectorAll(".accordion").forEach((acc) => {
      const btns = [...acc.querySelectorAll(".acc-h button")];
      btns.forEach((btn) => {
        btn.addEventListener("click", () => {
          const open = btn.getAttribute("aria-expanded") !== "true";
          btns.forEach((x) => {
            const on = x === btn && open;
            x.setAttribute("aria-expanded", on);
            document.getElementById(x.getAttribute("aria-controls")).hidden = !on;
          });
        });
      });
    });

    // Pickers
    root.querySelectorAll(".block-picker").forEach((sec) => {
      const b = registry[sec.dataset.b];
      const box = sec.querySelector("[data-picker]");
      const level = Number(box.querySelector(".picker-q").tagName.slice(1));
      let answers = [];
      const show = (html) => { box.innerHTML = html; box.querySelector(".picker-q").focus(); };
      box.addEventListener("click", (e) => {
        const ans = e.target.closest("[data-answer]");
        if (ans) {
          answers.push(ans.dataset.answer);
          if (answers.length < b.steps.length) return show(pickerStep(b, answers.length, level));
          const joined = answers.join("+");
          const key = b.resolve ? b.resolve[joined] : joined;
          return show(pickerResult(b, key, level) || pickerStep(b, (answers = [], 0), level));
        }
        if (e.target.closest("[data-restart]")) {
          answers = [];
          show(pickerStep(b, 0, level));
        }
      });
    });

    // Checklists
    root.querySelectorAll(".block-checklist").forEach((sec) => {
      const b = registry[sec.dataset.b];
      const reveal = sec.querySelector("[data-reveal]");
      if (reveal) {
        reveal.addEventListener("click", () => {
          const box = document.getElementById(reveal.getAttribute("aria-controls"));
          box.hidden = false;
          reveal.setAttribute("aria-expanded", "true");
          reveal.hidden = true;
          const first = box.querySelector(".block-title") || box.querySelector("input");
          first.focus();
        });
      }
      const form = sec.querySelector("[data-checklist]");
      form.querySelectorAll("[data-t]").forEach((t) => {
        t.addEventListener("input", () => { if (t.value.trim()) form.querySelector(`[data-i="${t.dataset.t}"]`).checked = true; });
      });
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const lines = b.items.map((it, i) => {
          if (!form.querySelector(`[data-i="${i}"]`).checked) return null;
          const text = form.querySelector(`[data-t="${i}"]`).value.trim();
          return `- ${it.label}${text ? `: ${text}` : ""}`;
        }).filter(Boolean);
        const err = form.querySelector(".error");
        err.hidden = lines.length > 0;
        if (!lines.length) return;
        const body = [`${U.partnerType}: ${P.segments[seg].name}`, "", ...lines].join("\n");
        location.href = mailto(b.subject, seg, body);
      });
    });

    // Stats: count up once on scroll into view
    const counters = [...root.querySelectorAll("[data-count]")];
    if (!still) {
      counters.forEach((el) => { el.textContent = "0" + el.dataset.suffix; });
      observe(counters, { threshold: 0.4 }, (el, on) => { if (on) countUp(el); });
    }

    // Bars: grow once on scroll into view
    const bars = [...root.querySelectorAll(".bars")];
    if (still) bars.forEach((el) => el.classList.add("in"));
    else observe(bars, { threshold: 0.4 }, (el, on) => { if (on) el.classList.add("in"); });

    // Videos: play only while visible
    const videos = [...root.querySelectorAll("video[data-autoplay]")];
    videos.forEach((v) => {
      // Remember when the viewer pauses, so scrolling does not restart it.
      // Pauses while the tab is hidden come from the browser, not the viewer.
      v.addEventListener("pause", () => { if (!v._sys && !document.hidden) v.dataset.held = "1"; v._sys = false; });
      v.addEventListener("play", () => { if (!v._sys) delete v.dataset.held; v._sys = false; });
    });
    if (!still) {
      observe(videos, { threshold: 0.5 }, (v, on) => {
        v._inView = on;
        if (on && v.paused && !v.dataset.held) playQuietly(v);
        if (!on && !v.paused) { v._sys = true; v.pause(); }
      }, false);
    }

    // Table of contents: mark the block in view
    const tocLinks = [...root.querySelectorAll(".toc a")];
    if (tocLinks.length) {
      const heads = tocLinks.map((a) => document.getElementById(a.dataset.scroll)).filter(Boolean);
      observe(heads, { rootMargin: "0px 0px -65% 0px" }, (el, on) => {
        if (!on) return;
        tocLinks.forEach((a) => a.toggleAttribute("aria-current", a.dataset.scroll === el.id));
        const active = root.querySelector(".toc a[aria-current]");
        const strip = root.querySelector(".toc ul");
        if (active && strip && strip.scrollWidth > strip.clientWidth) {
          strip.scrollTo({ left: active.offsetLeft - 16, behavior: still ? "auto" : "smooth" });
        }
      }, false);
    }

    // Contact request form
    const form = root.querySelector("#request-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const v = (id) => root.querySelector(id).value.trim();
        const type = v("#r-type");
        const request = fill(U.requestSubject, { type, org: v("#r-org") });
        const body = [
          `${U.requestName}: ${v("#r-name")}`,
          `${U.requestOrg}: ${v("#r-org")}`,
          `${U.partnerType}: ${P.segments[seg].name}`,
          `${U.requestType}: ${type}`,
          v("#r-deadline") ? `${U.requestDeadlineMail}: ${v("#r-deadline")}` : "",
          "",
          v("#r-msg"),
        ].filter((l, i, arr) => l !== "" || arr[i - 1] !== "").join("\n");
        location.href = mailto(request, seg, body);
      });
    }
  }

  // Links within the current section (e.g. "#/product?tab=tim" from a picker)
  $("#content").addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#/"]');
    if (a) {
      const r = parseRoute(a.getAttribute("href"));
      if (r.id === current && r.params.has("tab")) {
        e.preventDefault();
        history.replaceState(null, "", a.getAttribute("href"));
        applyTab(r.params.get("tab"), true);
      }
      return;
    }
    const s = e.target.closest("[data-scroll]");
    if (s) {
      e.preventDefault();
      const target = document.getElementById(s.dataset.scroll);
      if (target) {
        target.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth", block: "start" });
        target.focus({ preventScroll: true });
      }
    }
  });

  function playQuietly(v) {
    v._sys = true;
    v.play().catch(() => { v._sys = false; });
  }
  document.addEventListener("visibilitychange", () => {
    if (document.hidden || reduceMotion()) return;
    document.querySelectorAll("#content video[data-autoplay]").forEach((v) => {
      if (v._inView && v.paused && !v.dataset.held) playQuietly(v);
    });
  });

  window.addEventListener("hashchange", render);
  start();
})();
