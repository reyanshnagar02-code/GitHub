(function () {
  "use strict";

  var STORAGE_KEY = "roomBookings_v1";

  // ---------- storage ----------
  function loadBookings() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveBookings(bookings) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  }

  function makeId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  // ---------- date/time helpers ----------
  function formatLocalDate(d) {
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + day;
  }

  function todayStr() {
    return formatLocalDate(new Date());
  }

  function toDateTime(dateStr, timeStr) {
    return new Date(dateStr + "T" + timeStr + ":00");
  }

  function formatTime12(t) {
    var parts = t.split(":").map(Number);
    var h = parts[0], m = parts[1];
    var period = h >= 12 ? "PM" : "AM";
    var h12 = h % 12;
    if (h12 === 0) h12 = 12;
    return h12 + ":" + String(m).padStart(2, "0") + " " + period;
  }

  function formatDateLong(dateStr) {
    var d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString(undefined, {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function weekdayName(dateStr) {
    var d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString(undefined, { weekday: "long" });
  }

  // ---------- domain logic ----------
  function rangesOverlap(startA, endA, startB, endB) {
    return startA < endB && startB < endA;
  }

  function findConflict(bookings, candidate, excludeId) {
    for (var i = 0; i < bookings.length; i++) {
      var b = bookings[i];
      if (b.id === excludeId) continue;
      if (b.date !== candidate.date) continue;
      if (rangesOverlap(b.startTime, b.endTime, candidate.startTime, candidate.endTime)) {
        return b;
      }
    }
    return null;
  }

  function sortByStart(bookings) {
    return bookings.slice().sort(function (a, b) {
      var da = toDateTime(a.date, a.startTime).getTime();
      var db = toDateTime(b.date, b.startTime).getTime();
      return da - db;
    });
  }

  function splitUpcomingPast(bookings, now) {
    var upcoming = [];
    var past = [];
    bookings.forEach(function (b) {
      var end = toDateTime(b.date, b.endTime);
      if (end.getTime() > now.getTime()) {
        upcoming.push(b);
      } else {
        past.push(b);
      }
    });
    return {
      upcoming: sortByStart(upcoming),
      past: sortByStart(past).reverse(),
    };
  }

  function whoEmoji(who) {
    return who === "Papa" ? "👨" : "👩";
  }

  // ---------- rendering ----------
  var reminderCard = document.getElementById("reminderCard");
  var reminderIcon = document.getElementById("reminderIcon");
  var reminderLabel = document.getElementById("reminderLabel");
  var reminderMain = document.getElementById("reminderMain");
  var upcomingListEl = document.getElementById("upcomingList");
  var pastListEl = document.getElementById("pastList");
  var pastSection = document.getElementById("pastSection");
  var togglePastBtn = document.getElementById("togglePastBtn");
  var form = document.getElementById("bookingForm");
  var formError = document.getElementById("formError");
  var dateInput = document.getElementById("date");
  var startTimeInput = document.getElementById("startTime");
  var endTimeInput = document.getElementById("endTime");
  var noteInput = document.getElementById("note");
  var dayHint = document.getElementById("dayHint");

  function renderReminder(bookings, now) {
    var upcoming = sortByStart(
      bookings.filter(function (b) {
        return toDateTime(b.date, b.endTime).getTime() > now.getTime();
      })
    );

    reminderCard.classList.remove("now", "empty");

    if (upcoming.length === 0) {
      reminderCard.classList.add("empty");
      reminderIcon.textContent = "🗓️";
      reminderLabel.textContent = "No bookings yet";
      reminderMain.textContent = "The room is free — book a slot below!";
      return;
    }

    var next = upcoming[0];
    var start = toDateTime(next.date, next.startTime);
    var end = toDateTime(next.date, next.endTime);
    var isOngoing = start.getTime() <= now.getTime() && now.getTime() < end.getTime();

    var whenLabel;
    if (next.date === todayStr()) {
      whenLabel = "today";
    } else {
      whenLabel = weekdayName(next.date) + ", " + formatDateLong(next.date).split(", ").slice(1).join(", ");
    }

    if (isOngoing) {
      reminderCard.classList.add("now");
      reminderIcon.textContent = whoEmoji(next.who);
      reminderLabel.textContent = "Happening now";
      reminderMain.textContent =
        next.who + " has the room right now, until " + formatTime12(next.endTime) + ".";
    } else {
      reminderIcon.textContent = whoEmoji(next.who);
      reminderLabel.textContent = "Next up";
      reminderMain.textContent =
        next.who +
        " — " +
        whenLabel +
        " · " +
        formatTime12(next.startTime) +
        "–" +
        formatTime12(next.endTime) +
        (next.note ? " (" + next.note + ")" : "");
    }
  }

  function bookingItemHtml(b, now, allowCancel) {
    var start = toDateTime(b.date, b.startTime);
    var end = toDateTime(b.date, b.endTime);
    var isOngoing = start.getTime() <= now.getTime() && now.getTime() < end.getTime();
    var whoClass = b.who === "Papa" ? "who-papa" : "who-mumma";

    var li = document.createElement("li");
    li.className = "booking-item " + whoClass + (isOngoing ? " ongoing" : "");

    var avatar = document.createElement("span");
    avatar.className = "booking-avatar";
    avatar.textContent = whoEmoji(b.who);

    var info = document.createElement("div");
    info.className = "booking-info";

    var whoP = document.createElement("p");
    whoP.className = "booking-who";
    whoP.textContent = b.who;
    if (isOngoing) {
      var badge = document.createElement("span");
      badge.className = "badge-now";
      badge.textContent = "NOW";
      whoP.appendChild(badge);
    }

    var whenP = document.createElement("p");
    whenP.className = "booking-when";
    whenP.textContent =
      weekdayName(b.date) +
      ", " +
      formatDateLong(b.date).split(", ").slice(1).join(", ") +
      " · " +
      formatTime12(b.startTime) +
      "–" +
      formatTime12(b.endTime);

    info.appendChild(whoP);
    info.appendChild(whenP);

    if (b.note) {
      var noteP = document.createElement("p");
      noteP.className = "booking-note";
      noteP.textContent = b.note;
      info.appendChild(noteP);
    }

    li.appendChild(avatar);
    li.appendChild(info);

    if (allowCancel) {
      var cancelBtn = document.createElement("button");
      cancelBtn.type = "button";
      cancelBtn.className = "btn-cancel";
      cancelBtn.textContent = "Cancel";
      cancelBtn.addEventListener("click", function () {
        if (window.confirm("Cancel " + b.who + "'s booking on " + formatDateLong(b.date) + "?")) {
          removeBooking(b.id);
        }
      });
      li.appendChild(cancelBtn);
    }

    return li;
  }

  function renderLists(bookings, now) {
    var split = splitUpcomingPast(bookings, now);

    upcomingListEl.innerHTML = "";
    if (split.upcoming.length === 0) {
      var emptyLi = document.createElement("li");
      emptyLi.className = "empty-state";
      emptyLi.textContent = "No upcoming bookings. The room is free!";
      upcomingListEl.appendChild(emptyLi);
    } else {
      split.upcoming.forEach(function (b) {
        upcomingListEl.appendChild(bookingItemHtml(b, now, true));
      });
    }

    pastListEl.innerHTML = "";
    if (split.past.length === 0) {
      var emptyPastLi = document.createElement("li");
      emptyPastLi.className = "empty-state";
      emptyPastLi.textContent = "No past bookings.";
      pastListEl.appendChild(emptyPastLi);
    } else {
      split.past.forEach(function (b) {
        pastListEl.appendChild(bookingItemHtml(b, now, false));
      });
    }
  }

  function renderAll() {
    var bookings = loadBookings();
    var now = new Date();
    renderReminder(bookings, now);
    renderLists(bookings, now);
  }

  function removeBooking(id) {
    var bookings = loadBookings().filter(function (b) {
      return b.id !== id;
    });
    saveBookings(bookings);
    renderAll();
  }

  // ---------- form handling ----------
  function updateDayHint() {
    if (dateInput.value) {
      dayHint.textContent = weekdayName(dateInput.value);
    } else {
      dayHint.textContent = "";
    }
  }

  function initForm() {
    var today = todayStr();
    dateInput.min = today;
    dateInput.value = today;
    updateDayHint();
  }

  dateInput.addEventListener("change", updateDayHint);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    formError.textContent = "";

    var whoRadio = form.querySelector('input[name="who"]:checked');
    var date = dateInput.value;
    var startTime = startTimeInput.value;
    var endTime = endTimeInput.value;
    var note = noteInput.value.trim();

    if (!whoRadio) {
      formError.textContent = "Please choose Mumma or Papa.";
      return;
    }
    if (!date) {
      formError.textContent = "Please choose a date.";
      return;
    }
    if (date < todayStr()) {
      formError.textContent = "Please choose today or a future date.";
      return;
    }
    if (!startTime || !endTime) {
      formError.textContent = "Please choose a start and end time.";
      return;
    }
    if (endTime <= startTime) {
      formError.textContent = "End time must be after start time.";
      return;
    }

    var candidateStart = toDateTime(date, startTime);
    if (candidateStart.getTime() < new Date().getTime()) {
      formError.textContent = "That start time has already passed today. Please pick a later time.";
      return;
    }

    var candidate = { date: date, startTime: startTime, endTime: endTime };
    var bookings = loadBookings();
    var conflict = findConflict(bookings, candidate, null);
    if (conflict) {
      formError.textContent =
        "Sorry, that time is already booked by " +
        conflict.who +
        " (" +
        formatTime12(conflict.startTime) +
        "–" +
        formatTime12(conflict.endTime) +
        "). Please choose a different time.";
      return;
    }

    var booking = {
      id: makeId(),
      who: whoRadio.value,
      date: date,
      startTime: startTime,
      endTime: endTime,
      note: note,
      createdAt: new Date().toISOString(),
    };

    bookings.push(booking);
    saveBookings(bookings);

    form.reset();
    initForm();

    renderAll();
  });

  togglePastBtn.addEventListener("click", function () {
    var isHidden = pastSection.classList.contains("hidden");
    pastSection.classList.toggle("hidden");
    togglePastBtn.textContent = isHidden ? "Hide past bookings" : "Show past bookings";
  });

  // ---------- init ----------
  initForm();
  renderAll();
  setInterval(renderAll, 30000);
})();
