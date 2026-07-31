/* ---------- storage helpers ---------- */
const store = {
  get(key, fallback) {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

/* ---------- tab navigation ---------- */
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

/* ================= PROFILE / HOME ================= */
const profileForm = document.getElementById("profile-form");
const pfName = document.getElementById("pf-name");
const pfSection = document.getElementById("pf-section");
const pfTransport = document.getElementById("pf-transport");
const pfBusMoneyWrap = document.getElementById("pf-busmoney-wrap");
const pfBusMoney = document.getElementById("pf-busmoney");
const profileSummary = document.getElementById("profile-summary");

function loadProfile() {
  return store.get("sp_profile", null);
}

function renderProfileSummary() {
  const p = loadProfile();
  if (!p) {
    profileSummary.innerHTML = '<p class="muted">No profile saved yet. Fill the form to get started.</p>';
    return;
  }
  const modeLabels = { bus: "School Bus", carpool: "Carpool", public: "Public Transport", walk: "Walk", self: "Self / Dropped off" };
  let html = `<p class="big">${escapeHtml(p.name)}</p>
    <p>Section: <strong>${escapeHtml(p.section)}</strong></p>
    <p>Transport: <strong>${modeLabels[p.transport] || p.transport}</strong></p>`;
  if (p.transport === "bus" && p.busMoney) {
    html += `<p>Bus money paid: <strong>₹${Number(p.busMoney).toFixed(2)}</strong></p>`;
  }
  profileSummary.innerHTML = html;
}

function fillProfileForm() {
  const p = loadProfile();
  if (!p) return;
  pfName.value = p.name || "";
  pfSection.value = p.section || "";
  pfTransport.value = p.transport || "bus";
  pfBusMoney.value = p.busMoney || "";
  toggleBusMoneyField();
}

function toggleBusMoneyField() {
  pfBusMoneyWrap.classList.toggle("hidden", pfTransport.value !== "bus");
}

pfTransport.addEventListener("change", toggleBusMoneyField);

profileForm.addEventListener("submit", e => {
  e.preventDefault();
  const profile = {
    name: pfName.value.trim(),
    section: pfSection.value.trim(),
    transport: pfTransport.value,
    busMoney: pfTransport.value === "bus" ? pfBusMoney.value : ""
  };
  store.set("sp_profile", profile);
  renderProfileSummary();
  renderTransportMode();
});

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

/* ================= TIMETABLE ================= */
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let activeDay = store.get("sp_active_day", "Monday");

const dayTabsEl = document.getElementById("day-tabs");
const timetableBody = document.getElementById("timetable-body");
const periodForm = document.getElementById("period-form");

function loadTimetable() {
  return store.get("sp_timetable", {});
}

function saveTimetable(tt) {
  store.set("sp_timetable", tt);
}

function renderDayTabs() {
  dayTabsEl.innerHTML = "";
  DAYS.forEach(day => {
    const b = document.createElement("button");
    b.textContent = day.slice(0, 3);
    if (day === activeDay) b.classList.add("active");
    b.addEventListener("click", () => {
      activeDay = day;
      store.set("sp_active_day", day);
      renderDayTabs();
      renderTimetable();
    });
    dayTabsEl.appendChild(b);
  });
}

function renderTimetable() {
  const tt = loadTimetable();
  const periods = tt[activeDay] || [];
  timetableBody.innerHTML = "";
  if (!periods.length) {
    timetableBody.innerHTML = `<tr><td colspan="4" class="muted">No periods added for ${activeDay} yet.</td></tr>`;
    return;
  }
  periods.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(p.time)}</td>
      <td>${escapeHtml(p.subject)}</td>
      <td>${escapeHtml(p.needs || "-")}</td>
      <td><button class="icon-btn danger" data-id="${p.id}">Remove</button></td>`;
    tr.querySelector("button").addEventListener("click", () => {
      const tt2 = loadTimetable();
      tt2[activeDay] = (tt2[activeDay] || []).filter(x => x.id !== p.id);
      saveTimetable(tt2);
      renderTimetable();
    });
    timetableBody.appendChild(tr);
  });
}

periodForm.addEventListener("submit", e => {
  e.preventDefault();
  const time = document.getElementById("pr-time").value.trim();
  const subject = document.getElementById("pr-subject").value.trim();
  const needs = document.getElementById("pr-needs").value.trim();
  const tt = loadTimetable();
  if (!tt[activeDay]) tt[activeDay] = [];
  tt[activeDay].push({ id: uid(), time, subject, needs });
  saveTimetable(tt);
  periodForm.reset();
  renderTimetable();
});

/* ================= ASSIGNMENTS ================= */
const assignmentForm = document.getElementById("assignment-form");
const assignmentList = document.getElementById("assignment-list");

function loadAssignments() {
  return store.get("sp_assignments", []);
}

function saveAssignments(list) {
  store.set("sp_assignments", list);
}

function renderAssignments() {
  const list = loadAssignments().slice().sort((a, b) => a.due.localeCompare(b.due));
  assignmentList.innerHTML = "";
  if (!list.length) {
    assignmentList.innerHTML = '<li class="muted">No assignments added yet.</li>';
    return;
  }
  list.forEach(a => {
    const li = document.createElement("li");
    if (a.done) li.classList.add("done");
    li.innerHTML = `
      <div>
        <div>${escapeHtml(a.subject)}: ${escapeHtml(a.title)}</div>
        <div class="meta">Due ${a.due}</div>
      </div>
      <div class="actions">
        <button class="icon-btn" data-act="toggle">${a.done ? "Undo" : "Done"}</button>
        <button class="icon-btn danger" data-act="del">Delete</button>
      </div>`;
    li.querySelector('[data-act="toggle"]').addEventListener("click", () => {
      const l = loadAssignments();
      const item = l.find(x => x.id === a.id);
      item.done = !item.done;
      saveAssignments(l);
      renderAssignments();
    });
    li.querySelector('[data-act="del"]').addEventListener("click", () => {
      saveAssignments(loadAssignments().filter(x => x.id !== a.id));
      renderAssignments();
    });
    assignmentList.appendChild(li);
  });
}

assignmentForm.addEventListener("submit", e => {
  e.preventDefault();
  const subject = document.getElementById("as-subject").value.trim();
  const title = document.getElementById("as-title").value.trim();
  const due = document.getElementById("as-due").value;
  const list = loadAssignments();
  list.push({ id: uid(), subject, title, due, done: false });
  saveAssignments(list);
  assignmentForm.reset();
  renderAssignments();
});

/* ================= TRANSPORT MODE ================= */
const modeButtons = document.querySelectorAll("#transport-mode-buttons button");
const currentModeLabel = document.getElementById("current-mode-label");
const modeLabels = { bus: "School Bus", carpool: "Carpool", public: "Public Transport", walk: "Walk", self: "Self / Dropped off" };

function renderTransportMode() {
  const p = loadProfile();
  const mode = p ? p.transport : null;
  modeButtons.forEach(b => b.classList.toggle("active", b.dataset.mode === mode));
  currentModeLabel.textContent = mode
    ? `Current mode: ${modeLabels[mode]}. Update your profile on the Home screen to change name/section too.`
    : "No transport mode set yet — pick one below.";
}

modeButtons.forEach(b => {
  b.addEventListener("click", () => {
    const p = loadProfile() || { name: "", section: "", transport: "bus", busMoney: "" };
    p.transport = b.dataset.mode;
    if (p.transport !== "bus") p.busMoney = "";
    store.set("sp_profile", p);
    renderTransportMode();
    renderProfileSummary();
    fillProfileForm();
  });
});

/* ================= CARPOOL ================= */
const carpoolForm = document.getElementById("carpool-form");
const carpoolList = document.getElementById("carpool-list");

function loadCarpool() { return store.get("sp_carpool", []); }
function saveCarpool(list) { store.set("sp_carpool", list); }

function renderCarpool() {
  const list = loadCarpool();
  carpoolList.innerHTML = "";
  if (!list.length) {
    carpoolList.innerHTML = '<li class="muted">No carpool posts yet.</li>';
    return;
  }
  list.forEach(c => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div>
        <div>${c.type === "offer" ? "🚗 Offering" : "🙋 Looking for"} a ride — ${escapeHtml(c.name)}</div>
        <div class="meta">${escapeHtml(c.route)}${c.seats ? ` · ${c.seats} seat(s)` : ""} · ${escapeHtml(c.contact)}</div>
      </div>
      <div class="actions">
        <button class="icon-btn danger" data-act="del">Delete</button>
      </div>`;
    li.querySelector('[data-act="del"]').addEventListener("click", () => {
      saveCarpool(loadCarpool().filter(x => x.id !== c.id));
      renderCarpool();
    });
    carpoolList.appendChild(li);
  });
}

carpoolForm.addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("cp-name").value.trim();
  const route = document.getElementById("cp-route").value.trim();
  const type = document.getElementById("cp-type").value;
  const seats = document.getElementById("cp-seats").value;
  const contact = document.getElementById("cp-contact").value.trim();
  const list = loadCarpool();
  list.unshift({ id: uid(), name, route, type, seats, contact });
  saveCarpool(list);
  carpoolForm.reset();
  renderCarpool();
});

/* ================= LATE NOTICES ================= */
const lateForm = document.getElementById("late-form");
const lateList = document.getElementById("late-list");

function loadLate() { return store.get("sp_late", []); }
function saveLate(list) { store.set("sp_late", list); }

function renderLate() {
  const list = loadLate();
  lateList.innerHTML = "";
  if (!list.length) {
    lateList.innerHTML = '<li class="muted">No late notices sent.</li>';
    return;
  }
  list.forEach(n => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div>
        <div>To ${escapeHtml(n.teacher)} — arriving around ${escapeHtml(n.eta)}</div>
        <div class="meta">${escapeHtml(n.reason || "No reason given")} · sent ${new Date(n.sentAt).toLocaleString()}</div>
      </div>
      <div class="actions">
        <button class="icon-btn danger" data-act="del">Delete</button>
      </div>`;
    li.querySelector('[data-act="del"]').addEventListener("click", () => {
      saveLate(loadLate().filter(x => x.id !== n.id));
      renderLate();
    });
    lateList.appendChild(li);
  });
}

lateForm.addEventListener("submit", e => {
  e.preventDefault();
  const teacher = document.getElementById("lt-teacher").value.trim();
  const eta = document.getElementById("lt-eta").value.trim();
  const reason = document.getElementById("lt-reason").value.trim();
  const list = loadLate();
  list.unshift({ id: uid(), teacher, eta, reason, sentAt: Date.now() });
  saveLate(list);
  lateForm.reset();
  renderLate();
});

/* ================= BUS DIRECTORY ================= */
const busForm = document.getElementById("bus-form");
const busBody = document.getElementById("bus-body");

const DEFAULT_BUSES = [
  { id: uid(), no: "Bus 1", route: "North Colony - Main Gate", time: "7:15 AM", stops: "Green Park, Lake View, School" },
  { id: uid(), no: "Bus 2", route: "East Side - Main Gate", time: "7:30 AM", stops: "Riverside, Market Square, School" },
  { id: uid(), no: "Bus 3", route: "West Hills - Main Gate", time: "7:20 AM", stops: "Hilltop, Station Road, School" }
];

function loadBuses() {
  let buses = store.get("sp_buses", null);
  if (!buses) {
    buses = DEFAULT_BUSES;
    store.set("sp_buses", buses);
  }
  return buses;
}

function saveBuses(list) { store.set("sp_buses", list); }

function renderBuses() {
  const list = loadBuses();
  busBody.innerHTML = "";
  list.forEach(b => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(b.no)}</td>
      <td>${escapeHtml(b.route)}</td>
      <td>${escapeHtml(b.time)}</td>
      <td>${escapeHtml(b.stops)}</td>
      <td><button class="icon-btn danger" data-id="${b.id}">Remove</button></td>`;
    tr.querySelector("button").addEventListener("click", () => {
      saveBuses(loadBuses().filter(x => x.id !== b.id));
      renderBuses();
    });
    busBody.appendChild(tr);
  });
}

busForm.addEventListener("submit", e => {
  e.preventDefault();
  const no = document.getElementById("bs-no").value.trim();
  const route = document.getElementById("bs-route").value.trim();
  const time = document.getElementById("bs-time").value.trim();
  const stops = document.getElementById("bs-stops").value.trim();
  const list = loadBuses();
  list.push({ id: uid(), no, route, time, stops });
  saveBuses(list);
  busForm.reset();
  renderBuses();
});

/* ================= CALENDAR ================= */
const calGrid = document.getElementById("calendar-grid");
const calMonthLabel = document.getElementById("cal-month-label");
const calPrev = document.getElementById("cal-prev");
const calNext = document.getElementById("cal-next");
const eventForm = document.getElementById("event-form");
const eventList = document.getElementById("event-list");
const calEventsTitle = document.getElementById("cal-events-title");

let calDate = new Date();
let selectedDate = toISODate(new Date());

function toISODate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function loadEvents() { return store.get("sp_events", []); }
function saveEvents(list) { store.set("sp_events", list); }

function renderCalendar() {
  const year = calDate.getFullYear();
  const month = calDate.getMonth();
  calMonthLabel.textContent = calDate.toLocaleString(undefined, { month: "long", year: "numeric" });

  const events = loadEvents();
  const eventsByDate = {};
  events.forEach(ev => {
    (eventsByDate[ev.date] = eventsByDate[ev.date] || []).push(ev);
  });

  calGrid.innerHTML = "";
  ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach(d => {
    const el = document.createElement("div");
    el.className = "dow";
    el.textContent = d;
    calGrid.appendChild(el);
  });

  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayISO = toISODate(new Date());

  for (let i = 0; i < startOffset; i++) {
    const el = document.createElement("div");
    el.className = "day-cell empty";
    calGrid.appendChild(el);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateISO = toISODate(new Date(year, month, day));
    const cell = document.createElement("div");
    cell.className = "day-cell";
    if (dateISO === todayISO) cell.classList.add("today");
    if (dateISO === selectedDate) cell.classList.add("selected");
    cell.innerHTML = `<div class="day-num">${day}</div>`;
    if (eventsByDate[dateISO] && eventsByDate[dateISO].length) {
      const dot = document.createElement("div");
      dot.className = "dot";
      cell.appendChild(dot);
    }
    cell.addEventListener("click", () => {
      selectedDate = dateISO;
      renderCalendar();
    });
    calGrid.appendChild(cell);
  }

  calEventsTitle.textContent = `Events on ${selectedDate}`;
  document.getElementById("ev-date").value = selectedDate;
  renderEventList(eventsByDate[selectedDate] || []);
}

function renderEventList(items) {
  eventList.innerHTML = "";
  if (!items.length) {
    eventList.innerHTML = '<li class="muted">No events on this day.</li>';
    return;
  }
  items.forEach(ev => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div>${escapeHtml(ev.title)}</div>
      <div class="actions"><button class="icon-btn danger" data-act="del">Delete</button></div>`;
    li.querySelector('[data-act="del"]').addEventListener("click", () => {
      saveEvents(loadEvents().filter(x => x.id !== ev.id));
      renderCalendar();
    });
    eventList.appendChild(li);
  });
}

calPrev.addEventListener("click", () => {
  calDate = new Date(calDate.getFullYear(), calDate.getMonth() - 1, 1);
  renderCalendar();
});

calNext.addEventListener("click", () => {
  calDate = new Date(calDate.getFullYear(), calDate.getMonth() + 1, 1);
  renderCalendar();
});

eventForm.addEventListener("submit", e => {
  e.preventDefault();
  const date = document.getElementById("ev-date").value;
  const title = document.getElementById("ev-title").value.trim();
  const list = loadEvents();
  list.push({ id: uid(), date, title });
  saveEvents(list);
  selectedDate = date;
  eventForm.reset();
  renderCalendar();
});

/* ================= INIT ================= */
function init() {
  fillProfileForm();
  renderProfileSummary();
  renderDayTabs();
  renderTimetable();
  renderAssignments();
  renderTransportMode();
  renderCarpool();
  renderLate();
  renderBuses();
  renderCalendar();
}

init();
