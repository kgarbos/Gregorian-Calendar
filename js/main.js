var go = {};
go.cal = new Calendar();
let obj = {}; // to store data from JSON file

document.addEventListener("DOMContentLoaded", main, false);

function main() {
  // get elements
  go.calDat = document.getElementById("cal_dat");
  go.calMon = document.getElementById("cal_mon_name");

  // get the data from json file and initialize obj to store the values
  fetch("holidays.json")
    .then(function (resp) {
      return resp.json();
    })
    .then(function (data) {
      obj = data;
      buildCalendar();
    }).catch(() => {
      buildCalendar();
    });

}

function buildCalendar() {

  // initializing necessary variables
  let dateCount = go.cal.getDaysOfMonth();
  let firstDay = go.cal.getFirstDayOfMonth();
  let lastDay = go.cal.getLastDayOfMonth();
  let prevLastDate = go.cal.getLastDateOfPreviousMonth();

  // month title
  go.calMon.innerHTML = go.cal.getMonthString(0) + " " + go.cal.year;

  let html = ""; // to store dynamic date items

  // previous month
  for (let i = firstDay - 1; i >= 1; --i) {

    let date = prevLastDate - i + 1;
    if (date == prevLastDate) {
      html += "<div id='cal_pmd" + date + "' class='cal_pmd'>" + date + "<br>" + go.cal.getMonthString(-1) + "</div>";
    } else {
      html += "<div id='cal_pmd" + date + "' class='cal_pmd'>" + date + "</div>";
    }
  }

  // current month
  for (let i = 1; i <= dateCount; ++i) {
    html += "<div id='cal_cmd" + i + " 'class='cal_cmd";

    if (i == go.cal.date) {
      html += " cal_today'>" + i + "<br>Today" + "</div>";
    }

    if (isHoliday(i)) {
      html += " cal_holiday'>" + i + "<br>" + getHoliday(go.cal.year, go.cal.month, i) + '</div>';
    }

    if (i != go.cal.date && !isHoliday(i)) {
      if (i == 1) {
        html += "'>" + i + "<br>" + go.cal.getMonthString(0) + "</div>";
      } else {
        html += "'>" + i + "</div>";
      }
    }
  }

  // next month
  for (let i = lastDay + 1, j = 1; i <= 7; ++i, ++j) {
    if (j == 1) {
      html += "<div id='cal_nmd" + j + "' class='cal_nmd'>" + j + "<br>" + go.cal.getMonthString(1) + "</div>";
    } else {
      html += "<div id='cal_nmd" + j + "' class='cal_nmd'>" + j + "</div>";
    }

  }

  // display collected strings in html
  go.calDat.innerHTML = html;
}

// to check if month that will be presented has any holidays
function isHoliday(d) {
  try {
    if (obj[go.cal.year][go.cal.month][d] !== undefined) {
      return true;
    } else {
      return false;
    }
  } catch (E) {}
}

// return the string from json
function getHoliday(y, m, d) {
  return obj[y][m][d];
}

// user clicks on previous month button
function previous() {
  go.cal.setMonth(go.cal.month - 1);
  buildCalendar();
}

// user clicks on next month button
function next() {
  go.cal.setMonth(go.cal.month + 1);
  buildCalendar();
}
