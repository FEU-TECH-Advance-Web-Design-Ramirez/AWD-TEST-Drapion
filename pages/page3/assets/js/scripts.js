const calendar = document.querySelector(".calendar"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  todayBtn = document.querySelector(".today-btn"),
  gotoBtn = document.querySelector(".goto-btn"),
  dateInput = document.querySelector(".date-input"),
  journalDay = document.querySelector(".journal-day"),
  journalDate = document.querySelector(".journal-date"),
  journalsContainer = document.querySelector(".journals"),
  addEntryBtn = document.querySelector(".add-entry"),
  addJournalWrapper = document.querySelector(".add-journal-wrapper"),
  addJournalCloseBtn = document.querySelector(".close-journal-btn"),
  addJournalTitle = document.querySelector(".journal-name"),
  addJournalContent = document.querySelector(".journal-text"),
  addJournalSubmit = document.querySelector(".save-journal-btn");

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const eventsArr = [];
getEntries();
console.log(eventsArr);

console.log(addEntryBtn);
console.log(addJournalWrapper);

// ensure the journal wrapper is hidden when the page loads
addJournalWrapper.style.display = "none";

// function to toggle journal visibility
function showJournal() {
  addJournalWrapper.style.display = "flex";
}

function hideJournal() {
  addJournalWrapper.style.display = "none";
}

// show journal when plus button is clicked
addEntryBtn.addEventListener("click", showJournal);

// hide journal when close button or exit icon is clicked
addJournalCloseBtn.addEventListener("click", hideJournal);

// function to add days in days with class day and prev-date next-date on previous month and next month days and active on today
function initCalendar() {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay() - 1;

  date.innerHTML = months[month] + " " + year;

  let days = "";

  for (let x = day; x > 0; x--) {
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDate; i++) {
    let event = false;
    eventsArr.forEach((eventObj) => {
      if (
        eventObj.day === i &&
        eventObj.month === month + 1 &&
        eventObj.year === year
      ) {
        event = true;
      }
    });
    if (
      i === new Date().getDate() &&
      year === new Date().getFullYear() &&
      month === new Date().getMonth()
    ) {
      activeDay = i;
      getActiveDay(i);
      updateJournals(i);
      if (event) {
        days += `<div class="day today active event">${i}</div>`;
      } else {
        days += `<div class="day today active">${i}</div>`;
      }
    } else {
      if (event) {
        days += `<div class="day event">${i}</div>`;
      } else {
        days += `<div class="day ">${i}</div>`;
      }
    }
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }
  daysContainer.innerHTML = days;
  addListner();
}

// function to add month and year on prev and next button
function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  initCalendar();
}

function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  initCalendar();
}

prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

initCalendar();

// function to add active on day
function addListner() {
  const days = document.querySelectorAll(".day");
  days.forEach((day) => {
    day.addEventListener("click", (e) => {
      getActiveDay(e.target.innerHTML);
      updateJournals(Number(e.target.innerHTML));
      activeDay = Number(e.target.innerHTML);
      days.forEach((day) => {
        day.classList.remove("active");
      });
      // if clicked prev-date or next-date switch to that month
      if (e.target.classList.contains("prev-date")) {
        prevMonth();
        // add active to clicked day after month is changed
        setTimeout(() => {
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("prev-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else if (e.target.classList.contains("next-date")) {
        nextMonth();
        // add active to clicked day after month is changed
        setTimeout(() => {
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("next-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else {
        e.target.classList.add("active");
      }
    });
  });
}

todayBtn.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  initCalendar();
});

dateInput.addEventListener("input", (e) => {
  dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");
  if (dateInput.value.length === 2) {
    dateInput.value += "/";
  }
  if (dateInput.value.length > 7) {
    dateInput.value = dateInput.value.slice(0, 7);
  }
  if (e.inputType === "deleteContentBackward") {
    if (dateInput.value.length === 3) {
      dateInput.value = dateInput.value.slice(0, 2);
    }
  }
});

gotoBtn.addEventListener("click", gotoDate);

function gotoDate() {
  console.log("here");
  const dateArr = dateInput.value.split("/");
  if (dateArr.length === 2) {
    if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
      month = dateArr[0] - 1;
      year = dateArr[1];
      initCalendar();
      return;
    }
  }
  alert("Invalid Date");
}

// function get active day day name and date and update journal day journal date
function getActiveDay(date) {
  const day = new Date(year, month, date);
  const dayName = day.toString().split(" ")[0];
  journalDay.innerHTML = dayName;
  journalDate.innerHTML = date + " " + months[month] + " " + year;
}

function updateJournals(date) {
  let journals = "";
  eventsArr.forEach((journal) => {
    if (
      date === journal.day &&
      month + 1 === journal.month &&
      year === journal.year
    ) {
      journal.journals.forEach((journal) => {
        journals += `<div class="journal">
          <div class="journal-title">
            <i class="fas fa-circle"></i>
            <h3 class="journal-title">${journal.title}</h3>
          </div>
          <div class="journal-time">
            <span class="event-time">${journal.time}</span>
          </div>
        </div>`;
      });
    }
  });

  if (journals === "") {
    journals = `<div class="no-journal">
      <h3>No Entries</h3>
    </div>`;
  }
  journalsContainer.innerHTML = journals;
  saveEntries();
}

journalsContainer.addEventListener("click", (e) => {
  // check if the clicked element is a journal entry
  if (e.target.closest(".journal")) {
    const journalElement = e.target.closest(".journal");
    const entryTitle = journalElement.querySelector(".journal-title").innerText;
    const entryTime = journalElement.querySelector(".event-time").innerText;

    let selectedJournal;
    eventsArr.forEach((journal) => {
      if (
        journal.day === activeDay &&
        journal.month === month + 1 &&
        journal.year === year
      ) {
        selectedJournal = journal.journals.find(
          (entry) => entry.title === entryTitle && entry.time === entryTime
        );
      }
    });

    if (selectedJournal) {
      addJournalTitle.value = selectedJournal.title;
      addJournalContent.value = selectedJournal.content;

      // show the journal popup for editing
      addJournalWrapper.classList.add("active");

      // update the Save button to modify the existing entry
      addJournalSubmit.onclick = () => {
        selectedJournal.title = addJournalTitle.value.trim();
        selectedJournal.content = addJournalContent.value.trim();

        if (selectedJournal.title === "" || selectedJournal.content === "") {
          alert("Please fill all fields");
          return;
        }
        // save changes to local storage and update the UI
        saveEntries();
        updateJournals(activeDay);

        addJournalWrapper.classList.remove("active");
        alert("Journal entry updated successfully!");
      };
    }
  }

  addJournalCloseBtn.addEventListener("click", () => {
    addJournalWrapper.classList.remove("active");
  });

  document.addEventListener("click", (e) => {
    if (e.target !== addJournalWrapper && e.target !== addJournalSubmit) {
      addJournalWrapper.classList.remove("active");
    }
  });

  // 50 characters for title and 500 characters for content
  addJournalTitle.addEventListener("input", () => {
    addJournalTitle.value = addJournalTitle.value.slice(0, 60);
  });

  addJournalContent.addEventListener("input", () => {
    addJournalContent.value = addJournalContent.value.slice(0, 500);
  });

  addJournalSubmit.addEventListener("click", () => {
    const title = addJournalTitle.value.trim();
    const content = addJournalContent.value.trim();

    console.log("Title:", title);
    console.log("Content:", content);

    if (title === "" || content === "") {
      alert("Please fill all fields");
      return;
    }

    let entryExists = false;

    // check if an entry already exists for the selected date
    eventsArr.forEach((journal) => {
      if (
        journal.day === activeDay &&
        journal.month === month + 1 &&
        journal.year === year
      ) {
        journal.journals.push({
          title: title,
          content: content,
          time: new Date().toLocaleTimeString(),
        });
        entryExists = true;
      }
    });

    // if no entry exists, create a new one
    if (!entryExists) {
      eventsArr.push({
        day: activeDay,
        month: month + 1,
        year: year,
        journals: [
          {
            title: title,
            content: content,
            time: new Date().toLocaleTimeString(),
          },
        ],
      });
    }

    // save entries to local storage
    saveEntries();

    // update the UI
    updateJournals(activeDay);

    const activeDayEl = document.querySelector(".day.active");
    if (!activeDayEl.classList.contains("entry")) {
      activeDayEl.classList.add("entry");
    }

    // clear the input fields and close the popup
    addJournalTitle.value = "";
    addJournalContent.value = "";
    addJournalWrapper.classList.remove("active");

    alert("Journal entry saved successfully!");
  });

  if (e.target.classList.contains("entry")) {
    if (confirm("Are you sure you want to delete this entry?")) {
      const entryTitle = e.target.children[0].children[1].innerHTML;
      eventsArr.forEach((journal) => {
        if (
          journal.day === activeDay &&
          journal.month === month + 1 &&
          journal.year === year
        ) {
          journal.journals.forEach((entry, index) => {
            if (entry.title === entryTitle) {
              journal.journals.splice(index, 1);
            }
          });
          if (journal.journals.length === 0) {
            eventsArr.splice(eventsArr.indexOf(journal), 1);
            const activeDayEl = document.querySelector(".day.active");
            if (activeDayEl.classList.contains("entry")) {
              activeDayEl.classList.remove("entry");
            }
          }
        }
      });
      updateJournals(activeDay);
    }
  }
});

function saveEntries() {
  localStorage.setItem("events", JSON.stringify(eventsArr));
  console.log("Entries saved:", eventsArr); 
}

function getEntries() {
  const storedEntries = localStorage.getItem("events");
  if (storedEntries === null) {
    console.log("No entries found in localStorage");
    return;
  }
  eventsArr.push(...JSON.parse(storedEntries));
}

function convertTime(time) {
  let timeArr = time.split(":");
  let timeHour = timeArr[0];
  let timeMin = timeArr[1];
  let timeFormat = timeHour >= 12 ? "PM" : "AM";
  timeHour = timeHour % 12 || 12;
  time = timeHour + ":" + timeMin + " " + timeFormat;
  return time;
}

document.addEventListener("DOMContentLoaded", function () {
  const addEntryButton = document.querySelector(".add-entry");
  const journalWrapper = document.querySelector(".add-journal-wrapper");
  const closeJournalButton = document.querySelector(".close-journal-btn");
  const exitIcon = document.querySelector(".exit");

  // ensure the journal wrapper is hidden when the page loads
  journalWrapper.style.display = "none";

  // function to toggle journal visibility
  function showJournal() {
    journalWrapper.style.display = "flex"; 
  }

  function hideJournal() {
    journalWrapper.style.display = "none";
  }

  // show journal when plus button is clicked
  addEntryButton.addEventListener("click", showJournal);

  // hide journal when close button is clicked
  closeJournalButton.addEventListener("click", hideJournal);
  exitIcon.addEventListener("click", hideJournal);
});
