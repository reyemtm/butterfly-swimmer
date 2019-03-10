import jquery from 'jquery';
import moment from 'moment';
import Chart from 'chart.js';
import chroma from 'chroma-js';
// import Chartist from 'chartist';
// require('chartist-plugin-tooltip');
window.$ = window.jQuery = jquery; // notice the definition of global variables here

var timesSpreadsheet = "1jcCo55O-DfkJ57b9rW8j-QW4OhAbEbl5ZmnO8zg_MYE";
initChart(timesSpreadsheet)

var medalsSpreadsheet = "1nP60cKSG3qZPvjZ4gZXkSzkvqD-KwfY7X-K-7cfTK4s";
initMedals(medalsSpreadsheet);

function _log(string) {
  console.log(string)
}


function initMedals(id) {
  var url = "https://spreadsheets.google.com/feeds/list/" + id + "/od6/public/values?alt=json";

  var div = document.getElementById('swimmedals');

  $.getJSON(url, function(data) {
    var medals = data.feed.entry;
    console.log(medals);
    var places = {
      "First": "gold",
      "Second": "#919191",
      "Third": "goldenrod"
    };
    var html = "";
    var json = {};
    medals.map(e => {
      let template = `<div class="col col-2">
        <div class="card">
          <div class="is-horizontal-align">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="280"
              height="280" viewBox="0 0 24 24" fill="${places[e.gsx$place.$t]}">
              <path d="M20,2H4V4L9.81,8.36C6.14,9.57 4.14,13.53 5.35,17.2C6.56,20.87 10.5,22.87 14.19,21.66C17.86,20.45 19.86,16.5 18.65,12.82C17.95,10.71 16.3,9.05 14.19,8.36L20,4V2M14.94,19.5L12,17.78L9.06,19.5L9.84,16.17L7.25,13.93L10.66,13.64L12,10.5L13.34,13.64L16.75,13.93L14.16,16.17L14.94,19.5Z" /></svg>
          </div>
          <header>
            <h3>${e.gsx$event.$t}</h3>
            <h4>${e.gsx$place.$t} Place</h4>
          </header>
          <p>${e.gsx$meet.$t}<br>${e.gsx$date.$t}</p>
        </div>
      </div>`;
      html += template;
    });

    div.innerHTML += html;
  })
}

/**
 * create the swim time charts
 * @param {*} id 
 */
function initChart(id) {
  var url = "https://spreadsheets.google.com/feeds/list/" + id + "/od6/public/values?alt=json";

  $.getJSON(url, function (data) {
    var entry = data.feed.entry;
    console.log(data);
    
    var im100Data = chartData(entry, "gsx$im100");
    // createChart("100 Individual Medley", "100 IM", im100Data);
    
    var free100Data = chartData(entry, "gsx$free100");
    createChart("100 Free", "100 Free", free100Data);

    var free50Data = chartData(entry, "gsx$free50");
    createChart("50 Free", "50 Free", free50Data);

    var free25Data = chartData(entry, "gsx$free25");
    createChart("25 Free", "25 Free", free25Data);
    
    var fly25Data = chartData(entry, "gsx$fly25");
    createChart("25 Fly", "25 Fly", fly25Data);
    
    var breast25Data = chartData(entry, "gsx$breast25");
    createChart("25 Breaststroke", "25 BreastStroke", breast25Data);
  
    var back25Data = chartData(entry, "gsx$back25");
    createChart("25 Backstroke", "25 BackStroke", back25Data);
  
  })
  
  function chartData(swim, event) {
    var dates = [];
    var times = [];
    swim.map(function (e, i) {
      let date = e.gsx$date.$t;
      let eventString = e[event].$t;
      let time1 = (eventString).split(":");
      let time = Number(time1[0]) * 60 + Number(time1[1]);
      // console.log(date, time)
      if (isNaN(time)) {} else {
        dates.push(moment(date));
        times.push(time)
      }
    })
    return {
      dates,
      times,
      event
    }
  }
  
  function createChart(title, labelTitle, times, el) {
    var bestTime = 1000000000;
    for (let t = 0; t < times.times.length; t++) {
      if (times.times[t] < bestTime) {
        bestTime = times.times[t]
      }
    }
    var bestTimeFormatted = epoch_to_hh_mm_ss(bestTime);
  
    var row = document.getElementById('swimtimes');
    var div = document.createElement("div");
    div.classList.add("col");
    div.classList.add("col-4");
    div.classList.add("swimtimes");
    var canvas = document.createElement("canvas");
    canvas.height = "280";
    canvas.width = "800";
    canvas.id = (times.event).substring(5)
    var heading = document.createElement("div");
    heading.classList.add("heading");
    var h = document.createElement("h2");
    h.innerText = title;
    heading.appendChild(h);
    var span = document.createElement("span");
    span.innerText = "Best Time: " + bestTimeFormatted;
    heading.appendChild(span);
    div.appendChild(heading);
    div.appendChild(canvas);
    row.appendChild(div);
  
    var bestTimeArray = new Array((times.times).length).fill(bestTime)
  
    var color = chroma.random()
    new Chart(canvas, {
      type: 'line',
      data: {
        labels: times.dates,
        datasets: [
          {
            data: times.times,
            label: labelTitle,
            borderColor: color,
            backgroundColor: chroma(color).alpha(0.3),
            fill: true
          },
          {
            data: bestTimeArray,
            label: labelTitle,
            borderColor: chroma('firebrick').alpha(0.6),
            borderDash: [5,2],
            borderWidth: 1,
            backgroundColor: chroma('firebrick').alpha(0.3),
            fill: false,
            pointRadius: 0
          }
        ]
      },
      options: {
        title: {
          display: false,
          text: title
        },
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            type: "time",
            time: {
              displayFormats: {
                day: "MMM YYYY"
              }
            },
            ticks: {
              fontSize: 12,
              fontFamily: "Quicksand"
            }
          }],
          yAxes: [{
            ticks: {
              userCallback: function (v) {
                return epoch_to_hh_mm_ss(v)
              },
              fontSize: 12,
              fontFamily: "Quicksand"
              // stepSize: 1 * 10
            }
          }]
        }
      }
    });
    }
}

function epoch_to_hh_mm_ss(epoch) {
  var newTime = new Date(epoch * 1000).toISOString();
  // console.log(newTime)
  return newTime.substr(14, 8)
}