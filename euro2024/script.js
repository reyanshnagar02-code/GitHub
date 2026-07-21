const grid = document.getElementById("matchesGrid");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const stageFiltersWrap = document.getElementById("stageFilters");
const statsStrip = document.getElementById("statsStrip");

let activeStage = "All";

const STAGE_COLOR_INDEX = {};
function stageColorFor(stage) {
  const keys = [
    "Group A", "Group B", "Group C", "Group D", "Group E", "Group F",
    "Round of 16", "Quarter-final", "Semi-final", "Final"
  ];
  if (!(stage in STAGE_COLOR_INDEX)) {
    STAGE_COLOR_INDEX[stage] = keys.indexOf(stage) % 6;
  }
  return STAGE_COLOR_INDEX[stage];
}

function formatDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function renderStats() {
  const totalMatches = MATCHES.length;
  const totalGoals = MATCHES.reduce(
    (sum, m) => sum + m.teamA.score + m.teamB.score,
    0
  );
  const avgGoals = (totalGoals / totalMatches).toFixed(1);
  const teams = new Set();
  MATCHES.forEach((m) => {
    teams.add(m.teamA.name);
    teams.add(m.teamB.name);
  });

  const stats = [
    { num: totalMatches, label: "Matches" },
    { num: totalGoals, label: "Goals Scored" },
    { num: avgGoals, label: "Goals / Match" },
    { num: teams.size, label: "Teams" }
  ];

  statsStrip.innerHTML = stats
    .map(
      (s) => `
      <div class="stat-card">
        <div class="stat-num">${s.num}</div>
        <div class="stat-label">${s.label}</div>
      </div>`
    )
    .join("");
}

function renderStageFilters() {
  const stages = ["All", ...new Set(MATCHES.map((m) => m.stage))];
  stageFiltersWrap.innerHTML = stages
    .map(
      (stage) => `
      <button class="filter-pill ${stage === activeStage ? "active" : ""}" data-stage="${stage}">
        ${stage}
      </button>`
    )
    .join("");

  stageFiltersWrap.querySelectorAll(".filter-pill").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeStage = btn.dataset.stage;
      renderStageFilters();
      renderMatches();
    });
  });
}

function matchCardHTML(match) {
  const { teamA, teamB } = match;
  const aWins = teamA.score > teamB.score;
  const bWins = teamB.score > teamA.score;

  return `
    <article class="match-card" data-stage-color="${stageColorFor(match.stage)}">
      <div class="match-card-top">
        <span class="stage-badge">${match.stage}</span>
        <span class="match-date">${formatDate(match.date)}</span>
      </div>

      <div class="scoreboard">
        <div class="team">
          <span class="team-flag">${teamA.flag}</span>
          <span class="team-name">${teamA.name}</span>
        </div>

        <div class="score-box">
          <span class="${aWins ? "score-winner" : ""}">${teamA.score}</span>
          <span class="dash">–</span>
          <span class="${bWins ? "score-winner" : ""}">${teamB.score}</span>
        </div>

        <div class="team">
          <span class="team-flag">${teamB.flag}</span>
          <span class="team-name">${teamB.name}</span>
        </div>
      </div>

      <div class="venue">📍 ${match.venue}</div>

      ${
        match.penalties
          ? `<div class="penalties">🥅 ${match.penalties}</div>`
          : ""
      }

      <p class="summary">${match.summary}</p>

      <div class="stars">
        ${match.stars.map((s) => `<span class="star-chip">⭐ ${s}</span>`).join("")}
      </div>

      ${
        match.attendance
          ? `<div class="attendance">👥 ${match.attendance.toLocaleString()} fans in attendance</div>`
          : ""
      }
    </article>
  `;
}

function getFilteredMatches() {
  const query = searchInput.value.trim().toLowerCase();

  return MATCHES.filter((m) => {
    const matchesStage = activeStage === "All" || m.stage === activeStage;
    if (!matchesStage) return false;

    if (!query) return true;

    const haystack = [
      m.teamA.name,
      m.teamB.name,
      m.venue,
      m.summary,
      m.stage,
      ...m.stars
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  }).sort((a, b) => new Date(a.date) - new Date(b.date));
}

function renderMatches() {
  const filtered = getFilteredMatches();

  grid.innerHTML = filtered.map(matchCardHTML).join("");
  emptyState.hidden = filtered.length !== 0;
}

searchInput.addEventListener("input", renderMatches);

renderStats();
renderStageFilters();
renderMatches();
