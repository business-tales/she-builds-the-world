(function () {
  const GROUPS = {
    watch: "Watch this week",
    industry: "Industry leaders",
    trail: "Trailblazers",
    home: "Near home",
  };

  const DOMAINS = {
    "mechanical-engineering": "Mechanical Engineering",
    cybersecurity: "Cybersecurity",
    ai: "Artificial Intelligence",
    "product-design": "Product Design",
  };

  const grid = document.getElementById("grid");
  const countEl = document.getElementById("count");
  const searchEl = document.getElementById("q");
  const overlay = document.getElementById("overlay");
  const panel = document.getElementById("panel");
  const panelBody = document.getElementById("panel-body");
  const closeBtn = document.getElementById("close");
  const countryEl = document.getElementById("country");

  let domainFilter = "all";
  let groupFilter = "all";
  let query = "";
  let countryFilter = "all";
  let lastFocus = null;
  let openId = null;

  function initials(name) {
    return name
      .replace(/[“”"']/g, "")
      .split(/\s+/)
      .filter((w) => !/^(dr|prof|the)$/i.test(w.replace(/\./g, "")))
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  function portraitHTML(p, className) {
    if (p.photo) {
      return `<div class="${className}"><img src="${p.photo}" alt="Portrait of ${escapeHtml(p.name)}" width="240" height="240"></div>`;
    }
    return `<div class="${className}"><div class="monogram" aria-hidden="true">${escapeHtml(initials(p.name))}</div></div>`;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function matches(p) {
    if (domainFilter !== "all" && p.domain !== domainFilter) return false;
    if (groupFilter !== "all" && p.group !== groupFilter) return false;
    if (countryFilter !== "all") {
      if (countryFilter.startsWith("region:")) {
        if (p.region !== countryFilter.slice(7)) return false;
      } else if (!countriesOf(p).includes(countryFilter)) return false;
    }
    if (!query) return true;
    const hay = [
      p.name,
      p.field,
      p.role,
      p.domain,
      DOMAINS[p.domain] || "",
      p.country || "",
      p.region || "",
      ...(p.tags || []),
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(query);
  }

  function countriesOf(p) {
    return String(p.country || "")
      .split("/")
      .map((c) => c.replace(/\(.*\)/, "").trim())
      .filter(Boolean);
  }

  function buildCountryOptions() {
    if (!countryEl) return;
    const countries = new Map();
    const regions = new Map();
    PROFILES.forEach((p) => {
      countriesOf(p).forEach((c) => countries.set(c, (countries.get(c) || 0) + 1));
      if (p.region) regions.set(p.region, (regions.get(p.region) || 0) + 1);
    });
    const opt = (v, label) => `<option value="${escapeHtml(v)}">${escapeHtml(label)}</option>`;
    const regionOpts = [...regions.keys()].sort().map((r) => opt("region:" + r, `${r} (${regions.get(r)})`)).join("");
    const countryOpts = [...countries.keys()].sort().map((c) => opt(c, `${c} (${countries.get(c)})`)).join("");
    countryEl.innerHTML = opt("all", "All countries") +
      `<optgroup label="Regions">${regionOpts}</optgroup><optgroup label="Countries">${countryOpts}</optgroup>`;
    countryEl.addEventListener("change", () => {
      countryFilter = countryEl.value;
      render();
    });
  }

  function render() {
    const list = PROFILES.filter(matches);
    countEl.textContent = list.length === 1 ? "1 profile" : list.length + " profiles";
    if (!list.length) {
      grid.innerHTML = `<div class="empty">
        <h2>No one by that name — yet.</h2>
        <p>Try another spelling, clear the search, or switch domains. This is a starter gallery, not a roll call of every woman in these fields.</p>
      </div>`;
      return;
    }
    grid.innerHTML = list.map(cardHTML).join("");
  }

  function cardHTML(p) {
    const adj =
      p.adjacent && p.adjacentNote
        ? `<span class="tag adj">${escapeHtml(p.adjacentNote)}</span>`
        : "";
    const tags = (p.tags || [])
      .slice(0, 2)
      .map((t) => `<span class="tag">${escapeHtml(t)}</span>`)
      .join("");
    const pills = (p.links || [])
      .slice(0, 3)
      .map(
        (l) =>
          `<a class="pill" href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer" data-stop="1">${escapeHtml(l.label)}</a>`
      )
      .join("");
    const domainLabel = DOMAINS[p.domain] || p.domain || "";
    return `<article class="card">
      <button class="card-main" data-id="${escapeHtml(p.id)}" type="button" aria-haspopup="dialog">
        <div class="card-labels">
          <span class="domain-label">${escapeHtml(domainLabel)}</span>
          <span class="group-label">${escapeHtml(GROUPS[p.group] || "")}</span>
        </div>
        ${portraitHTML(p, "portrait-wrap")}
        <h2 class="card-name">${escapeHtml(p.name)}</h2>
        <p class="card-role">${escapeHtml(p.role)}</p>
        ${p.country ? `<p class="card-country">${escapeHtml(p.country)}</p>` : ""}
        <div class="tags">${tags}${adj}</div>
      </button>
      <div class="pills">${pills}</div>
    </article>`;
  }

  function openPanel(id) {
    const p = PROFILES.find((x) => x.id === id);
    if (!p) return;
    lastFocus = document.activeElement;
    openId = id;
    panelBody.innerHTML = cvHTML(p);
    panel.classList.add("open");
    overlay.classList.add("open");
    overlay.hidden = false;
    panel.hidden = false;
    document.body.classList.add("locked");
    closeBtn.focus();
  }

  function cvHTML(p) {
    const adj =
      p.adjacent && p.adjacentNote
        ? `<span class="tag adj">${escapeHtml(p.adjacentNote)}</span>`
        : "";
    const exp = (p.experience || []).map((x) => `<li>${escapeHtml(x)}</li>`).join("");
    const ach = (p.achievements || []).map((x) => `<li>${escapeHtml(x)}</li>`).join("");
    const links = (p.links || [])
      .map(
        (l) =>
          `<a class="link-btn" href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(l.label)}</a>`
      )
      .join("");
    const why = p.whyRoleModel
      ? `<p class="why">${escapeHtml(p.whyRoleModel)}</p>`
      : "";
    const domainLabel = DOMAINS[p.domain] || p.domain || "";
    const sources = (p.links || [])
      .map(
        (l) =>
          `<a href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(l.url.replace(/^https?:\/\//, "").replace(/\/$/, ""))}</a>`
      )
      .join(" · ");
    return `
      <div class="cv-hero">
        ${portraitHTML(p, "cv-portrait")}
        <div>
          <p class="domain-label" style="text-align:left;margin:0 0 .25rem">${escapeHtml(domainLabel)}</p>
          <p class="group-label" style="text-align:left">${escapeHtml(GROUPS[p.group] || "")}</p>
          <h2 id="cv-title">${escapeHtml(p.name)}</h2>
          <p class="role">${escapeHtml(p.role)}</p>
          <p class="field">${escapeHtml(p.field)}</p>
          ${p.country ? `<p class="field">${escapeHtml(p.country)}</p>` : ""}
          <div class="tags" style="justify-content:flex-start;margin-top:.5rem">${(p.tags || [])
            .map((t) => `<span class="tag">${escapeHtml(t)}</span>`)
            .join("")}${adj}</div>
        </div>
      </div>
      <p class="cv-bio">${escapeHtml(p.bio)}</p>
      ${why}
      <h3>Experience</h3>
      <ul>${exp}</ul>
      <h3>Achievements</h3>
      <ul>${ach}</ul>
      <h3>Links</h3>
      <div class="link-row">${links}</div>
      ${sources ? `<h3>Sources</h3><p class="sources">Verified against: ${sources}</p>` : ""}
    `;
  }

  function closePanel() {
    panel.classList.remove("open");
    overlay.classList.remove("open");
    document.body.classList.remove("locked");
    openId = null;
    window.setTimeout(() => {
      if (!panel.classList.contains("open")) {
        panel.hidden = true;
        overlay.hidden = true;
      }
    }, 280);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.querySelectorAll(".chip-domain").forEach((chip) => {
    chip.addEventListener("click", () => {
      domainFilter = chip.dataset.domain;
      document
        .querySelectorAll(".chip-domain")
        .forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
      render();
    });
  });

  document.querySelectorAll(".chip-group").forEach((chip) => {
    chip.addEventListener("click", () => {
      groupFilter = chip.dataset.filter;
      document
        .querySelectorAll(".chip-group")
        .forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
      render();
    });
  });

  searchEl.addEventListener("input", () => {
    query = searchEl.value.trim().toLowerCase();
    render();
  });

  grid.addEventListener("click", (e) => {
    if (e.target.closest("[data-stop]")) {
      e.stopPropagation();
      return;
    }
    const btn = e.target.closest(".card-main");
    if (btn) openPanel(btn.dataset.id);
  });

  closeBtn.addEventListener("click", closePanel);
  overlay.addEventListener("click", closePanel);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panel.classList.contains("open")) {
      e.preventDefault();
      closePanel();
    }
  });

  panel.addEventListener("keydown", (e) => {
    if (e.key !== "Tab" || !panel.classList.contains("open")) return;
    const focusable = panel.querySelectorAll("button, a[href]");
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  const heroCount = document.getElementById("hero-count");
  if (heroCount) heroCount.textContent = String(PROFILES.length);

  buildCountryOptions();
  render();
})();
