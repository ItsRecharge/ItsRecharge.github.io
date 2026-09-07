/* Portfolio data + rendering. No runtime network calls; GitHub stats are baked. */
const PROJECTS = [
  {
    slug: "freshline", name: "Freshline", tag: "Company · in beta",
    kind: "startup", featured: true, accent: "signal",
    one: "Meals that know you. Groceries that arrive the day you cook.",
    body: "Freshline plots individual ingredients into a graph database and runs a taste-prediction algorithm to build recipes tailored to one person — no two are alike. It reads what's already in your fridge, plans the week, and orders only what's missing so everything arrives fresh the day you cook it. Fulfilled through Walmart; currently in beta.",
    born: "Born at the Divergent National Hackathon (Seattle); now a company.",
    tech: ["Graph DB", "Taste-prediction algorithm", "React", "Vite", "Walmart fulfillment"],
    links: [
      { label: "freshline.life", href: "https://freshline.life", kind: "live" },
      { label: "Explore the site", href: "demo/freshline/", kind: "demo" },
    ],
    note: "Beta key: support@freshline.life",
    gallery: [
      "assets/img/freshline/freshline-hero.webp", "assets/img/freshline/freshline-section2.webp",
      "assets/img/freshline/freshline-section3.webp", "assets/img/freshline/cucumber-poster.webp",
    ],
    cover: "assets/img/freshline/freshline-hero.webp",
  },

  // --- Live, runs-in-your-browser ---
  {
    slug: "relativity", name: "Relativity Express", tag: "Runs in your browser",
    kind: "live", accent: "signal2",
    one: "Einstein's light-clock train, from two reference frames.",
    body: "An interactive 3D demo of special relativity: watch the same light clock from the platform and from the moving train, with length contraction, time dilation, and the Terrell–Penrose rotation computed live from the Lorentz transform. Pure static site, three.js, no build step.",
    tech: ["three.js", "JavaScript", "Lorentz transform"],
    links: [
      { label: "Launch demo", href: "demo/relativity-train/", kind: "demo" },
      { label: "GitHub", href: "https://github.com/ItsRecharge/relativity-train", kind: "repo" },
    ],
    gallery: ["assets/img/relativity/relativity-platform.webp", "assets/img/relativity/relativity-train.webp", "assets/img/relativity/relativity-fast.webp"],
    cover: "assets/img/relativity/relativity-platform.webp",
    embed: "demo/relativity-train/",
  },
  {
    slug: "humscore", name: "HumScore", tag: "Runs in your browser",
    kind: "live", accent: "signal",
    one: "Hum each part; get real, playable sheet music.",
    body: "Sing a song's parts one at a time — melody, bass, countermelody — and HumScore turns them into editable, playable notation. McLeod pitch detection and Viterbi diatonic harmonization, exporting MusicXML and MIDI. Entirely rule-based: no AI in the notation.",
    tech: ["TypeScript", "Pitch detection", "Viterbi harmonization", "MusicXML / MIDI"],
    links: [
      { label: "Launch demo", href: "demo/humscore/", kind: "demo" },
      { label: "GitHub", href: "https://github.com/ItsRecharge/HumScore", kind: "repo" },
    ],
    gallery: [
      "assets/img/humscore/3-score.webp", "assets/img/humscore/4-two-parts.webp", "assets/img/humscore/5-playing.webp",
      "assets/img/humscore/6-three-four.webp", "assets/img/humscore/2-preview.webp", "assets/img/humscore/1-empty.webp",
    ],
    cover: "assets/img/humscore/3-score.webp",
    embed: "demo/humscore/",
  },
  {
    slug: "rotlang", name: "RotLang", tag: "Runs in your browser",
    kind: "live", accent: "signal2", private: true,
    one: "A programming language whose syntax is brainrot slang.",
    body: "A full language built in TypeScript — lexer, parser, AST, tree-walking interpreter — where the keywords are English plus internet slang (cook x be 5, sigma name(){}, yap() to print). The playground runs the interpreter in your browser; Flappy Bird is written in the language itself.",
    tech: ["TypeScript", "Lexer / parser / AST", "Tree-walking interpreter"],
    links: [
      { label: "Open playground", href: "demo/rotlang/play/#example=flappy", kind: "demo" },
      { label: "Read the docs", href: "demo/rotlang/", kind: "demo" },
    ],
    gallery: ["assets/img/rotlang/rotlang-docs.webp", "assets/img/rotlang/rotlang-play-flappy.webp"],
    cover: "assets/img/rotlang/rotlang-play-flappy.webp",
  },

  // --- Tools people use ---
  {
    slug: "grantbridge", name: "GrantBridge", tag: "🥈 Microsoft hackathon",
    kind: "tool", accent: "signal", award: "2nd place",
    one: "Swipe to match with the scholarships that actually fit you.",
    body: "Divergent College matches students to scholarships fast. Six agents, each fine-tuned with LoRA, categorize different student parameters; multimodal models combine them into a percent match against the full scholarship database. Swipe right to add a grant to your calendar — deadlines and essays plot onto the site. A FAFSA helper estimates, per school, how much you might get in aid versus what you'd need to recover through scholarships.",
    tech: ["6× LoRA-tuned agents", "Multimodal models", "React", "Express", "PostgreSQL"],
    links: [
      { label: "Interactive mock", href: "demo/grantbridge/mock/", kind: "demo" },
      { label: "GitHub", href: "https://github.com/ItsRecharge/GrantBridge-Hackathon", kind: "repo" },
    ],
    gallery: ["assets/img/grantbridge/swipe.webp", "assets/img/grantbridge/dashboard.webp", "assets/img/grantbridge/scholarships.webp", "assets/img/grantbridge/fafsa.webp", "assets/img/grantbridge/colleges.webp", "assets/img/grantbridge/education.webp"],
    cover: "assets/img/grantbridge/swipe.webp",
  },
  {
    slug: "safetyboston", name: "SafetyBoston", tag: "🥇 BU hackathon",
    kind: "tool", accent: "signal2", award: "1st place", private: true,
    one: "A sense of what's happening around you when you walk alone.",
    body: "SafetyBoston pulls from a large network of open cameras and plots activity on a map. A model trained during the hackathon flags potentially dangerous behavior with a confidence score; every alert is human-reviewed before it's treated as real. The public sees a broad awareness layer — not specific feeds, which stay with law enforcement — so someone walking alone has a better sense of their surroundings.",
    tech: ["OpenCV", "Custom risk model", "FastAPI", "React", "Map view"],
    links: [
      { label: "Static demo", href: "demo/safetyboston/dashboard/", kind: "demo" },
    ],
    gallery: [
      "assets/img/safetyboston/gallery/feed.webp", "assets/img/safetyboston/gallery/reports.webp",
      "assets/img/safetyboston/gallery/detail.webp", "assets/img/safetyboston/gallery/map.webp",
    ],
    cover: "assets/img/safetyboston/gallery/feed.webp",
    stat: { value: "human-reviewed", label: "every alert, before it counts" },
  },
  {
    slug: "drummajor", name: "Drum Major Portal", tag: "~120 students",
    kind: "tool", accent: "signal", private: true,
    one: "Announcements and a whole music library, run by student leaders.",
    body: "A secure, invite-only operating system for a school's drum majors. It's the front end for a school-guideline-compliant group email account, turning announcements into email templates fast. Music that used to be scattered across many Google Classrooms is sorted into one library — mention a piece in an announcement and its Drive folder attaches automatically, PDFs backdated and all. Used by about 120 students.",
    tech: ["Next.js", "TypeScript", "Prisma", "Auth + AES-256", "Gmail / Drive"],
    links: [
      { label: "Static demo", href: "demo/drummajor/admin/dashboard/", kind: "demo" },
      { label: "GitHub", href: "https://github.com/ItsRecharge/drummajor-portal", kind: "repo" },
    ],
    gallery: [
      "assets/img/drummajor/gallery/dashboard.webp", "assets/img/drummajor/gallery/announcements.webp",
      "assets/img/drummajor/gallery/announcement-composer.webp", "assets/img/drummajor/gallery/announcement-detail.webp",
      "assets/img/drummajor/gallery/library.webp", "assets/img/drummajor/gallery/events.webp",
      "assets/img/drummajor/gallery/tasks.webp", "assets/img/drummajor/gallery/notes.webp",
      "assets/img/drummajor/gallery/handoff.webp", "assets/img/drummajor/gallery/rosters.webp",
      "assets/img/drummajor/gallery/audit.webp", "assets/img/drummajor/gallery/users.webp",
      "assets/img/drummajor/gallery/login.webp",
    ],
    cover: "assets/img/drummajor/gallery/dashboard.webp",
  },
  {
    slug: "instrument-tracking", name: "Instrument Asset Tracking", tag: "7 schools",
    kind: "tool", accent: "signal2", private: true,
    one: "A library system for band instruments — so none go missing.",
    body: "After 35+ instruments were thrown away — broken, never reported, left for years — I built a library-style checkout system. Students check out, view, and manage instruments; every checkout keeps a photo history and an electronic log, with condition and damage notes so instruments are tracked at all times. Full email notifications. In use across seven schools, with Arlington High School and UMass Boston next.",
    tech: ["Flask", "Python", "Photo history", "Email notifications", "Google Sheets"],
    links: [
      { label: "Static demo", href: "demo/instrument-tracking/admin/dashboard/", kind: "demo" },
    ],
    gallery: [
      "assets/img/instrument-tracking/gallery/instruments.webp", "assets/img/instrument-tracking/gallery/dashboard.webp",
      "assets/img/instrument-tracking/gallery/instrument-history.webp", "assets/img/instrument-tracking/gallery/edit-instrument.webp",
      "assets/img/instrument-tracking/gallery/add-instrument.webp", "assets/img/instrument-tracking/gallery/check-in.webp",
      "assets/img/instrument-tracking/gallery/catalog.webp", "assets/img/instrument-tracking/gallery/landing.webp",
      "assets/img/instrument-tracking/gallery/features.webp", "assets/img/instrument-tracking/gallery/users.webp",
      "assets/img/instrument-tracking/gallery/login.webp",
    ],
    cover: "assets/img/instrument-tracking/gallery/instruments.webp",
    stat: { value: "35+", label: "instruments once lost to unreported damage" },
  },
  {
    slug: "trim-hours", name: "Tri-M Hours Log", tag: "~150 students",
    kind: "tool", accent: "signal", private: true,
    one: "Replacing “text one person, who types it into a spreadsheet.”",
    body: "Tri-M members log service hours for music. The old flow: post on Google Classroom, then text one person who logged all 150 students into a spreadsheet by hand. I replaced it entirely — members and officers are separate, with quotas, email notifications, event slots, and organizer-run attendance that allocates hours automatically. Students can even propose their own volunteer opportunities and send them to the officers for a vote.",
    tech: ["Next.js", "TypeScript", "Prisma / SQLite", "Email notifications"],
    links: [
      { label: "Static demo", href: "demo/trim-hours/officer/dashboard/", kind: "demo" },
    ],
    gallery: [
      "assets/img/trim-hours/gallery/officer-dashboard.webp", "assets/img/trim-hours/gallery/officer-events.webp",
      "assets/img/trim-hours/gallery/officer-attendance.webp", "assets/img/trim-hours/gallery/officer-requests.webp",
      "assets/img/trim-hours/gallery/officer-members.webp", "assets/img/trim-hours/gallery/officer-member-detail.webp",
      "assets/img/trim-hours/gallery/officer-invites.webp", "assets/img/trim-hours/gallery/officer-audit.webp",
      "assets/img/trim-hours/gallery/member-dashboard.webp", "assets/img/trim-hours/gallery/member-events.webp",
      "assets/img/trim-hours/gallery/member-report-hours.webp", "assets/img/trim-hours/gallery/member-request-event.webp",
      "assets/img/trim-hours/gallery/landing.webp", "assets/img/trim-hours/gallery/login.webp",
    ],
    cover: "assets/img/trim-hours/gallery/officer-dashboard.webp",
  },
  {
    slug: "nhs-hours", name: "NHS Hours Log", tag: "~180 students",
    kind: "tool", accent: "signal2", private: true,
    one: "The same idea, rebuilt for a National Honor Society chapter.",
    body: "After Tri-M, National Honor Society wanted something similar, so I built it for their rules: houses, graduation cohorts, inside/outside hours, and public share links for outside organizers. Same member/officer split, quotas, and auto-allocated attendance. Used by about 180 students.",
    tech: ["Next.js", "TypeScript", "Prisma / SQLite", "Share links"],
    links: [
      { label: "Static demo", href: "demo/nhs-hours/officer/dashboard/", kind: "demo" },
    ],
    gallery: [
      "assets/img/nhs-hours/gallery/officer-dashboard.webp", "assets/img/nhs-hours/gallery/officer-events.webp",
      "assets/img/nhs-hours/gallery/officer-attendance.webp", "assets/img/nhs-hours/gallery/officer-requests.webp",
      "assets/img/nhs-hours/gallery/officer-members.webp", "assets/img/nhs-hours/gallery/officer-member-detail.webp",
      "assets/img/nhs-hours/gallery/officer-chapter.webp", "assets/img/nhs-hours/gallery/officer-invites.webp",
      "assets/img/nhs-hours/gallery/member-dashboard.webp", "assets/img/nhs-hours/gallery/member-events.webp",
      "assets/img/nhs-hours/gallery/member-history.webp", "assets/img/nhs-hours/gallery/landing.webp",
      "assets/img/nhs-hours/gallery/login.webp",
    ],
    cover: "assets/img/nhs-hours/gallery/officer-dashboard.webp",
  },

  // --- Also ---
  {
    slug: "gauntlet", name: "Combat Robot Gauntlet", tag: "Robotics team · NHRL",
    kind: "also", accent: "signal",
    one: "Where will a combat robot break — before you build it?",
    body: "A desktop simulator used by our school's robotics team and other members of the National Havoc Robot League (NHRL). Load an STL/3MF/glTF, run it through a MuJoCo physics test cage plus an analytic mechanics-of-materials model, and get damage heatmaps showing which parts to strengthen. Hand-calc grade, not FEA — fast enough to use while you're still designing.",
    tech: ["Python", "MuJoCo", "Mechanics of materials", "STL / glTF"],
    links: [{ label: "GitHub", href: "https://github.com/ItsRecharge/Combat-Robot-Gauntlet", kind: "repo" }],
    gallery: ["assets/img/gauntlet/dashboard.webp", "assets/img/gauntlet/heatmap_failure.webp", "assets/img/gauntlet/heatmap_energy.webp"],
    cover: "assets/img/gauntlet/heatmap_failure.webp",
    desktop: true,
  },
  {
    slug: "discord", name: "Neel's Discord", tag: "6★ · adopted by other communities",
    kind: "also", accent: "signal2",
    one: "A dark, rounded Discord theme other communities picked up.",
    body: "A custom Discord theme I coded for my own preferences — dark, rounded, with a matching icon set — for BetterDiscord and Vencord. Other communities liked it enough to adopt it too.",
    tech: ["CSS", "BetterDiscord", "Vencord"],
    links: [{ label: "GitHub", href: "https://github.com/ItsRecharge/Neels-Discord", kind: "repo" }],
    gallery: ["assets/img/discord/Main.webp", "assets/img/discord/Banner.webp", "assets/img/discord/Icons.webp"],
    cover: "assets/img/discord/Main.webp",
    desktop: true,
  },

  // --- Hardware & systems (placeholders — real photos to come) ---
  {
    slug: "opt", name: "Ocean Power Technologies", tag: "Proprietary · current",
    kind: "make", accent: "signal", cover: "assets/img/covers/opt.webp", placeholder: true,
    one: "Engineering work on ocean wave-energy systems.",
    body: "Proprietary work I'm currently doing for Ocean Power Technologies. Details to be filled in — this is a placeholder for now.",
    tech: ["Placeholder"], links: [],
    note: "Details coming soon.",
  },
  {
    slug: "nas", name: "Home NAS", tag: "Self-hosted storage",
    kind: "make", accent: "signal2", cover: "assets/img/covers/nas.webp", placeholder: true,
    one: "A network-attached storage server I built and run.",
    body: "A home NAS for backups and self-hosted storage across my devices. Write-up and photos coming soon.",
    tech: ["Linux", "ZFS", "Networking"], links: [],
    note: "Details coming soon.",
  },
  {
    slug: "linux-wrappers", name: "Custom Linux Wrappers", tag: "Tooling",
    kind: "make", accent: "signal", cover: "assets/img/covers/linux-wrappers.webp", placeholder: true,
    one: "Command-line wrappers I hand-coded to fit how I work.",
    body: "A set of custom Linux wrappers and scripts I wrote to streamline my own workflow. Write-up coming soon.",
    tech: ["Bash", "Linux", "CLI"], links: [],
    note: "Details coming soon.",
  },
  {
    slug: "hackintosh", name: "Touchscreen Hackintosh", tag: "First build",
    kind: "make", accent: "signal2", cover: "assets/img/covers/hackintosh.webp", placeholder: true,
    one: "My first touchscreen Mac — a Hackintosh I assembled.",
    body: "My first touchscreen Mac: a Hackintosh I built and configured from non-Apple hardware running macOS. Build notes and photos coming soon.",
    tech: ["macOS", "Hardware", "Bootloaders"], links: [],
    note: "Details coming soon.",
  },
  {
    slug: "arcade", name: "Arcade Cabinet", tag: "Built during COVID",
    kind: "make", accent: "signal", cover: "assets/img/covers/arcade.webp", placeholder: true,
    one: "A full arcade cabinet I designed and built during lockdown.",
    body: "During COVID I built an arcade cabinet from scratch — woodworking, wiring, and the software to run it. Photos and build log coming soon.",
    tech: ["Woodworking", "Electronics", "Emulation"], links: [],
    note: "Details coming soon.",
  },
  {
    slug: "wireless-charger", name: "iPhone 6 Wireless Charger", tag: "Age 7 · first build",
    kind: "make", accent: "signal2", cover: "assets/img/covers/wireless-charger.webp", placeholder: true,
    one: "A wireless charger I made for the iPhone 6 — when I was seven.",
    body: "The first thing I ever built: a wireless charger for the iPhone 6, made when I was seven years old. Photos and the story coming soon.",
    tech: ["Electronics", "Induction"], links: [],
    note: "Details coming soon.",
  },
];

/* ------------------------------------------------------------------ */
/* Hackathons — origin stories pulled together                         */
/* ------------------------------------------------------------------ */
const HACKATHONS = [
  {
    name: "GrantBridge — Divergent College", award: "🥈 2nd place", venue: "Microsoft hackathon",
    body: "A scholarship-matching platform: six LoRA-tuned agents categorize student parameters, multimodal models combine them into a percent match against the scholarship database, and a swipe interface plots deadlines and essays onto your calendar. Placed 2nd at a Microsoft hackathon.",
    href: "#work", link: "See it in Projects", accent: "signal",
  },
  {
    name: "SafetyBoston", award: "🥇 1st place", venue: "Boston University",
    body: "A public-safety awareness map built in one weekend: open-camera activity plotted onto a map, with a model trained during the event flagging potentially dangerous behavior for human review. Won 1st place at Boston University.",
    href: "#work", link: "See it in Projects", accent: "signal2",
  },
  {
    name: "Freshline", award: "Now a company", venue: "Divergent National Hackathon · Seattle",
    body: "Born at the Divergent National Hackathon in Seattle — meals tailored to your taste from a graph database of ingredients, with same-day fresh delivery. It's now a company in beta.",
    href: "#work", link: "See it in Projects", accent: "signal",
  },
];

/* ------------------------------------------------------------------ */
/* Leadership                                                          */
/* ------------------------------------------------------------------ */
const LEADERSHIP = [
  {
    org: "Scouting BSA — Troop of ~80",
    role: "Assistant Scoutmaster (incoming Dec 2026)",
    body: "I joined in 7th grade and grew into leadership: patrol leader, then assistant senior patrol leader, and this December I become an assistant scoutmaster of the troop — about 80 people. It's the through-line of how I learned to run things and bring people along.",
    timeline: [
      { when: "7th grade", what: "Joined as a member" },
      { when: "Soon after", what: "Patrol Leader" },
      { when: "This year", what: "Assistant Senior Patrol Leader" },
      { when: "Dec 2026", what: "Assistant Scoutmaster (~80-person troop)" },
    ],
    accent: "signal",
  },
  {
    org: "Robotics Club", role: "President", accent: "signal2",
    body: "President of my school's robotics club — running builds, competitions, and the team that uses the Combat Robot Gauntlet.",
    timeline: [],
  },
  {
    org: "DECA", role: "President", accent: "signal",
    body: "President of our DECA chapter — business, marketing, and competitive events.",
    timeline: [],
  },
  {
    org: "Mock Trial", role: "President", accent: "signal2",
    body: "President of the Mock Trial team — case prep, argument, and competition.",
    timeline: [],
  },
];

/* ------------------------------------------------------------------ */
/* Milestones & events                                                 */
/* ------------------------------------------------------------------ */
const MILESTONES = [
  {
    title: "Eagle Scout Project", tag: "Scouting BSA", accent: "signal",
    body: "My Eagle Scout service project — the capstone of the Scouting trail, planned and led start to finish. Details and photos coming soon.",
    placeholder: true,
  },
  {
    title: "Philmont", tag: "High-adventure trek", accent: "signal2",
    body: "A high-adventure backcountry trek at Philmont Scout Ranch. Write-up coming soon.",
    placeholder: true,
  },
];

const VOLUNTEER = {
  title: "Volunteering",
  body: "Beyond organized programs, a running record of the service work I do — through Scouting, music honor societies, and on my own. Details coming soon.",
  placeholder: true,
};

/* ---------------- rendering ---------------- */
const $ = (s, r = document) => r.querySelector(s);
const el = (t, cls, html) => { const e = document.createElement(t); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const chip = (t) => `<span class="chip">${t}</span>`;

function linkBtn(l) {
  const cls = { live: "btn btn-live", demo: "btn btn-demo", repo: "btn btn-ghost" }[l.kind] || "btn btn-ghost";
  const ext = l.kind !== "demo";
  return `<a class="${cls}" href="${l.href}"${ext ? ' target="_blank" rel="noopener"' : ""}>${l.label}</a>`;
}

function projectCard(p, opts = {}) {
  const card = el("article", `card card-${p.kind}${opts.wide ? " card-wide" : ""}${p.placeholder ? " card-placeholder" : ""}`);
  card.dataset.slug = p.slug;
  const media = el("div", "card-media");
  const img = el("img");
  img.loading = "lazy"; img.src = p.cover; img.alt = p.placeholder ? `${p.name} cover art` : `${p.name} screenshot`;
  media.appendChild(img);
  const hasGallery = p.gallery && p.gallery.length > 1;
  if (hasGallery) {
    const count = el("button", "gallery-open", `${p.gallery.length} views`);
    count.addEventListener("click", () => openLightbox(p, 0));
    media.appendChild(count);
  }
  if (p.placeholder) media.appendChild(el("span", "media-tag", "📷 photos coming"));
  if (hasGallery) media.addEventListener("click", (e) => { if (e.target.closest(".gallery-open")) return; openLightbox(p, 0); });
  const badges = [];
  if (p.award) badges.push(`<span class="badge badge-award">${p.tag}</span>`);
  if (p.private) badges.push(`<span class="badge badge-private" title="Source is private">private</span>`);
  const body = el("div", "card-body");
  body.innerHTML = `
    <div class="card-head">
      <h3>${p.name}</h3>
      ${!p.award ? `<span class="card-tag">${p.tag}</span>` : ""}
    </div>
    ${badges.length ? `<div class="badges">${badges.join("")}</div>` : ""}
    <p class="card-one">${p.one}</p>
    <p class="card-lede">${p.body}</p>
    ${p.stat ? `<div class="datum"><span class="datum-v mono">${p.stat.value}</span><span class="datum-l">${p.stat.label}</span></div>` : ""}
    <div class="chips">${p.tech.map(chip).join("")}</div>
    ${p.links.length ? `<div class="card-links">${p.links.map(linkBtn).join("")}</div>` : (p.note ? `<p class="card-soon">${p.note}</p>` : "")}
  `;
  card.append(media, body);
  return card;
}

function render() {
  const feat = PROJECTS.find((p) => p.featured);
  if ($("#featured")) $("#featured").appendChild(featuredCard(feat));

  const live = PROJECTS.filter((p) => p.kind === "live");
  const liveWrap = $("#live-grid");
  if (liveWrap) live.forEach((p) => liveWrap.appendChild(liveCard(p)));

  const grid = $("#work-grid");
  if (grid) PROJECTS.filter((p) => p.kind === "tool").forEach((p) => grid.appendChild(projectCard(p)));
  const also = $("#also-grid");
  if (also) PROJECTS.filter((p) => p.kind === "also").forEach((p) => also.appendChild(projectCard(p)));
  const make = $("#make-grid");
  if (make) PROJECTS.filter((p) => p.kind === "make").forEach((p) => make.appendChild(projectCard(p)));

  renderHackathons();
  renderLeadership();
  renderMilestones();
}

function renderHackathons() {
  const wrap = $("#hackathon-grid");
  if (!wrap) return;
  HACKATHONS.forEach((h) => {
    const c = el("article", `hack-card accent-${h.accent}`);
    c.innerHTML = `
      <div class="hack-top">
        <span class="hack-award">${h.award}</span>
        <span class="hack-venue">${h.venue}</span>
      </div>
      <h3 class="hack-name">${h.name}</h3>
      <p class="hack-body">${h.body}</p>
      <a class="hack-link" href="${h.href}">${h.link} →</a>`;
    wrap.appendChild(c);
  });
}

function renderLeadership() {
  const wrap = $("#leadership-grid");
  if (!wrap) return;
  LEADERSHIP.forEach((l) => {
    const c = el("article", `lead-card accent-${l.accent}${l.timeline.length ? " lead-featured" : ""}`);
    const tl = l.timeline.length
      ? `<ol class="lead-timeline">${l.timeline.map((t) => `<li><span class="lt-when mono">${t.when}</span><span class="lt-what">${t.what}</span></li>`).join("")}</ol>`
      : "";
    c.innerHTML = `
      <div class="lead-head"><h3>${l.org}</h3><span class="lead-role">${l.role}</span></div>
      <p class="lead-body">${l.body}</p>
      ${tl}`;
    wrap.appendChild(c);
  });
}

function renderMilestones() {
  const wrap = $("#milestone-grid");
  if (!wrap) return;
  [...MILESTONES, { ...VOLUNTEER, tag: "Ongoing", accent: "signal", volunteer: true }].forEach((m) => {
    const c = el("article", `mile-card accent-${m.accent}`);
    c.innerHTML = `
      <div class="mile-head"><h3>${m.title}</h3><span class="mile-tag">${m.tag}</span></div>
      <p class="mile-body">${m.body}</p>
      ${m.placeholder ? `<span class="mile-soon">More coming soon</span>` : ""}`;
    wrap.appendChild(c);
  });
}

function featuredCard(p) {
  const wrap = el("article", "featured-card");
  wrap.innerHTML = `
    <div class="featured-text">
      <div class="featured-kicker"><span class="dot"></span>${p.tag}</div>
      <h3 class="featured-name">${p.name}</h3>
      <p class="featured-one">${p.one}</p>
      <p class="featured-body">${p.body}</p>
      <p class="featured-born">${p.born}</p>
      <div class="chips">${p.tech.map(chip).join("")}</div>
      <div class="card-links">${p.links.map(linkBtn).join("")}</div>
      <p class="featured-note">${p.note}</p>
    </div>
    <div class="featured-media"></div>
  `;
  const media = $(".featured-media", wrap);
  p.gallery.forEach((src, i) => {
    const im = el("img", i === 0 ? "fm-main" : "fm-thumb");
    im.loading = "lazy"; im.src = src; im.alt = `${p.name} ${i}`;
    im.addEventListener("click", () => openLightbox(p, i));
    media.appendChild(im);
  });
  return wrap;
}

function liveCard(p) {
  const c = el("article", "live-card");
  c.innerHTML = `
    <div class="live-frame" data-embed="${p.embed || ""}">
      <img class="live-poster" loading="lazy" src="${p.cover}" alt="${p.name}">
      ${p.embed ? `<button class="live-play" aria-label="Load ${p.name}">▶ Load live demo</button>` : ""}
    </div>
    <div class="live-info">
      <h3>${p.name}</h3>
      <p>${p.one}</p>
      <div class="card-links">${p.links.map(linkBtn).join("")}</div>
    </div>
  `;
  const frame = $(".live-frame", c);
  const play = $(".live-play", c);
  if (play) {
    play.addEventListener("click", () => {
      const f = el("iframe", "live-iframe");
      f.src = p.embed; f.title = p.name; f.loading = "lazy";
      f.allow = "microphone; fullscreen";
      frame.innerHTML = ""; frame.appendChild(f); frame.classList.add("loaded");
    });
  }
  return c;
}

/* ---------------- lightbox ---------------- */
let lb, lbState = { imgs: [], i: 0 };
function openLightbox(p, i) {
  if (!lb) buildLightbox();
  lbState = { imgs: p.gallery, i, name: p.name };
  showLb();
  lb.hidden = false;
  document.body.style.overflow = "hidden";
}
function showLb() {
  $(".lb-img", lb).src = lbState.imgs[lbState.i];
  $(".lb-cap", lb).textContent = `${lbState.name} — ${lbState.i + 1} / ${lbState.imgs.length}`;
}
function buildLightbox() {
  lb = el("div", "lb"); lb.hidden = true;
  lb.innerHTML = `
    <button class="lb-close" aria-label="Close">✕</button>
    <button class="lb-prev" aria-label="Previous">‹</button>
    <img class="lb-img" alt="">
    <button class="lb-next" aria-label="Next">›</button>
    <div class="lb-cap"></div>`;
  document.body.appendChild(lb);
  const close = () => { lb.hidden = true; document.body.style.overflow = ""; };
  $(".lb-close", lb).addEventListener("click", close);
  lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
  $(".lb-prev", lb).addEventListener("click", () => { lbState.i = (lbState.i - 1 + lbState.imgs.length) % lbState.imgs.length; showLb(); });
  $(".lb-next", lb).addEventListener("click", () => { lbState.i = (lbState.i + 1) % lbState.imgs.length; showLb(); });
  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") $(".lb-prev", lb).click();
    if (e.key === "ArrowRight") $(".lb-next", lb).click();
  });
}

/* ---------------- hero telemetry canvas ---------------- */
function hero() {
  const cv = $("#telemetry");
  if (!cv) return;
  const ctx = cv.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let W, H, dpr;
  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  size();
  const series = [
    { color: "#35e0d0", amp: 0.20, freq: 1.3, phase: 0, drift: 0.0006, w: 2 },
    { color: "#7aa2ff", amp: 0.13, freq: 2.1, phase: 1.6, drift: 0.0011, w: 1.5 },
    { color: "#ffb454", amp: 0.08, freq: 3.4, phase: 3.1, drift: -0.0009, w: 1.2 },
  ];
  let t = 0;
  function frame() {
    ctx.clearRect(0, 0, W, H);
    // baseline
    ctx.strokeStyle = "rgba(120,150,190,.14)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, H * 0.5); ctx.lineTo(W, H * 0.5); ctx.stroke();
    series.forEach((s, si) => {
      ctx.beginPath();
      ctx.strokeStyle = s.color; ctx.globalAlpha = 0.9; ctx.lineWidth = s.w;
      for (let x = 0; x <= W; x += 4) {
        const u = x / W;
        const env = Math.sin(u * Math.PI); // taper at edges
        const y = H * 0.5 + Math.sin(u * Math.PI * 2 * s.freq + s.phase + t * (0.6 + si * 0.2)) * H * s.amp * env
          + Math.sin(u * Math.PI * 7 + t * 0.4) * H * 0.015 * env;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      s.phase += s.drift;
    });
    ctx.globalAlpha = 1;
    if (!reduce) { t += 0.02; requestAnimationFrame(frame); }
  }
  frame();
  let rt; window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { size(); if (reduce) frame(); }, 150); });
}

/* ---------------- nav scrollspy + mobile ---------------- */
function nav() {
  const links = [...document.querySelectorAll(".nav-links a")];
  const map = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
  const io = new IntersectionObserver((ents) => {
    ents.forEach((e) => { if (e.isIntersecting) {
      links.forEach((l) => l.classList.remove("active"));
      map.get(e.target.id)?.classList.add("active");
    }});
  }, { rootMargin: "-45% 0px -50% 0px" });
  ["work", "live", "hackathons", "leadership", "milestones", "research", "about"].forEach((id) => { const s = document.getElementById(id); if (s) io.observe(s); });
  const toggle = $(".nav-toggle");
  if (toggle) toggle.addEventListener("click", () => document.body.classList.toggle("nav-open"));
  links.forEach((l) => l.addEventListener("click", () => document.body.classList.remove("nav-open")));
}

/* ---------------- first-visit intro ---------------- */
function intro() {
  const stage = document.getElementById("intro");
  if (!stage) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let seen = false;
  try { seen = sessionStorage.getItem("nb-intro-seen") === "1"; } catch (e) {}
  if (seen || reduce) { stage.remove(); return; }
  try { sessionStorage.setItem("nb-intro-seen", "1"); } catch (e) {}

  document.body.classList.add("intro-active");
  const skip = () => finish();
  let done = false;
  function finish() {
    if (done) return; done = true;
    stage.classList.add("intro-out");
    document.body.classList.remove("intro-active");
    setTimeout(() => stage.remove(), 700);
  }
  stage.addEventListener("click", (e) => { if (e.target.closest(".intro-choice")) return; skip(); });
  document.addEventListener("keydown", function esc(e) { if (e.key === "Escape") { skip(); document.removeEventListener("keydown", esc); } });

  // choices navigate then dismiss
  stage.querySelectorAll(".intro-choice").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-target");
      finish();
      if (target && target !== "#top") {
        setTimeout(() => { const el2 = document.querySelector(target); if (el2) el2.scrollIntoView({ behavior: "smooth" }); }, 300);
      }
    });
  });

  // orchestrated sequence via class toggles (CSS drives the transitions)
  const seq = [
    [250, () => stage.classList.add("s-welcome")],   // "Welcome" + dots fade in
    [900, () => stage.classList.add("s-domain")],    // bansalcloud.com appears
    [2000, () => stage.classList.add("s-swish")],    // swish → neel.bansalcloud.com
    [3100, () => stage.classList.add("s-rise")],     // rises up, reveals the question + choices
  ];
  seq.forEach(([t, fn]) => setTimeout(fn, t));
}

document.addEventListener("DOMContentLoaded", () => { intro(); render(); hero(); nav(); });
