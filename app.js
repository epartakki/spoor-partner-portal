(function () {
  const P = window.PORTAL;
  const STORE_KEY = "spoor-partner-segment";
  const $ = (sel) => document.querySelector(sel);

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

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
  function start() {
    const seg = getSegment();
    if (!seg) return showLogin();
    document.body.dataset.segment = seg;
    $("#login").hidden = true;
    $("#app").hidden = false;
    $("#segment-pill").textContent = P.segments[seg].name;
    $("#nav").innerHTML = P.sections.map((s) => `<a href="#/${s.id}" data-id="${s.id}">${esc(s.title)}</a>`).join("");
    render();
  }

  function currentSection() {
    const id = location.hash.replace(/^#\/?/, "");
    return P.sections.find((s) => s.id === id) || P.sections[0];
  }

  function render() {
    const seg = getSegment();
    if (!seg) return showLogin();
    const section = currentSection();
    document.querySelectorAll("#nav a").forEach((a) => {
      a.toggleAttribute("aria-current", a.dataset.id === section.id);
      if (a.dataset.id === section.id) a.setAttribute("aria-current", "page");
    });
    document.title = `${section.title} | Spoor Partner Portal`;

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
      const assets = section.assets.filter((a) => a.for === "both" || a.for === seg);
      html += `<div class="grid">${assets.map((a) => assetCard(a, seg)).join("")}</div>`;
    }

    const content = $("#content");
    content.innerHTML = html;
    bind(content, seg);
    window.scrollTo(0, 0);
  }

  function overview(seg) {
    return `
      <div class="section-head">
        <div class="eyebrow">${esc(P.segments[seg].tagline)}</div>
        <h1>Welcome to the Spoor Partner Portal</h1>
        <p>Find what you need to pitch, bid and deliver with Spoor, without having to ask us first.</p>
      </div>
      <div class="overview">
        ${P.sections.map((s) => `<a href="#/${s.id}"><h3>${esc(s.title)}</h3><p>${esc(s.subtitle)}</p></a>`).join("")}
      </div>
      <hr style="border:0;border-top:1px solid var(--border);margin:36px 0">`;
  }

  function assetCard(a, seg) {
    const ready = Boolean(a.file);
    const specific = a.for !== "both";
    const hasSnippets = Array.isArray(a.snippets) && a.snippets.length;
    const tags = [
      `<span class="tag">${esc(a.type)}</span>`,
      specific ? `<span class="tag for-you">For ${esc(P.segments[seg].short.toLowerCase())}</span>` : "",
      !ready && !hasSnippets ? `<span class="tag soon">Coming soon</span>` : "",
    ].join("");

    const action = ready
      ? `<a class="btn btn-primary" href="${esc(a.file)}" download>Download</a>`
      : hasSnippets ? "" : `<button class="btn btn-ghost" disabled>Not available yet</button>`;

    const snippets = hasSnippets
      ? `<div class="snippets">${a.snippets.map((s, i) => `
          <div class="snippet">
            <div class="snippet-head">
              <h4>${esc(s.title)}</h4>
              <button class="btn btn-soft" data-copy="${i}" ${s.text ? "" : "disabled"}>Copy</button>
            </div>
            <div class="snippet-body ${s.text ? "" : "empty"}" data-text="${i}">${s.text ? esc(s.text) : "Text coming soon."}</div>
          </div>`).join("")}</div>`
      : "";

    return `
      <article class="card ${hasSnippets ? "wide" : ""}" ${hasSnippets ? 'data-snippets="1"' : ""}>
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
            <div><h3>${esc(c.name)}</h3><p>${esc(c.role)}</p></div>
          </div>
          <p>Your single point of contact for bids, questions and anything else about working with Spoor.</p>
          <div class="actions"><a class="btn btn-soft" href="mailto:${esc(c.email)}">${esc(c.email)}</a></div>
        </article>
        <article class="card">
          <h3>Send a request</h3>
          <p>Tender support, a demo, a reference or anything else. We will get back to you.</p>
          <form class="form" id="request-form">
            <div class="row">
              <div class="field"><label for="r-name">Your name</label><input id="r-name" required></div>
              <div class="field"><label for="r-org">Organisation</label><input id="r-org" required></div>
            </div>
            <div class="row">
              <div class="field"><label for="r-type">Request type</label>
                <select id="r-type">${P.requestTypes.map((t) => `<option>${esc(t)}</option>`).join("")}</select>
              </div>
              <div class="field"><label for="r-deadline">Deadline (optional)</label><input id="r-deadline" type="date"></div>
            </div>
            <div class="field"><label for="r-msg">Details</label>
              <textarea id="r-msg" required placeholder="Project, client, tender reference and what you need from us"></textarea>
            </div>
            <div><button class="btn btn-primary" type="submit">Send request</button></div>
            <p class="muted small" style="margin:0">This opens an email to the partner team with your request filled in.</p>
          </form>
        </article>
      </div>`;
  }

  function bind(root, seg) {
    root.querySelectorAll("[data-copy]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const body = btn.closest(".snippet").querySelector("[data-text]");
        try { await navigator.clipboard.writeText(body.textContent); toast("Copied to clipboard"); }
        catch { toast("Copy failed. Select the text and copy it manually."); }
      });
    });

    const form = root.querySelector("#request-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const v = (id) => root.querySelector(id).value.trim();
        const type = v("#r-type");
        const subject = `Partner request: ${type} (${v("#r-org")})`;
        const body = [
          `Name: ${v("#r-name")}`,
          `Organisation: ${v("#r-org")}`,
          `Partner type: ${P.segments[seg].name}`,
          `Request type: ${type}`,
          v("#r-deadline") ? `Deadline: ${v("#r-deadline")}` : "",
          "",
          v("#r-msg"),
        ].filter((l, i, arr) => l !== "" || arr[i - 1] !== "").join("\n");
        location.href = `mailto:${P.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      });
    }
  }

  window.addEventListener("hashchange", render);
  start();
})();
