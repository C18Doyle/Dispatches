// The front through time, the place of each report, what the other commands were doing, and the ground a run has taken or given up against the record.
//
// FRONT_SERIES: for each theatre, the front as a list of entries; an entry holds from the day it begins until the next one (null lines end the theatre).
// A line is a list of [longitude, latitude] points, west to east or north to south, drawn from the course of the fighting and not surveyed: the map says so.
// A front is drawn on a node's day only if the regions it runs through (`watch`) stand as the record had them, or are still being fought over: a run that has
// departed from the record there gets the record's line drawn dashed in red, and none at all if no fighting is left. tools/check-map-front.mjs checks the data.
//
// MAP_PLACES: where each report is set, by campaign and report, as [longitude, latitude]. The map marks the report's place and the last few places before it.
// MAP_MEANWHILE: what each command was doing on a date in the record, shown as a pin on the other commands' maps and listed under the map.
// MAP_GROUND: a place held or taken (gained) or given up or never taken (lost) against the record, read from one flag that an order sets.

const FRONT_WATCH_EAST = ["ussrLeningrad", "ussrBelarus", "ussrMoscow", "ussrUkraine", "ussrDon", "ussrCaucasus"];
const FRONT_WATCH_EAST_LATE = ["baltics", "poland", "romania", "hungary", "bulgaria", "czechia", "germany"];

const FRONT_SERIES = [
  {
    id: "east",
    watch: FRONT_WATCH_EAST,
    entries: [
      { from: "1941-06-22", lines: [[[21.1, 55.7], [21.9, 55.1], [22.9, 54.1], [23.8, 53.7], [23.2, 53.1], [23.7, 52.1], [24.7, 51.2], [24.0, 50.3], [22.8, 49.8], [23.0, 48.5], [26.6, 48.2], [28.2, 45.4]]] },
      { from: "1941-07-10", lines: [[[24.0, 57.1], [27.0, 57.9], [28.3, 57.8], [29.8, 56.6], [30.2, 55.2], [30.9, 54.4], [30.4, 53.3], [30.1, 52.0], [29.9, 51.0], [29.0, 50.2], [28.6, 49.2], [29.5, 48.2], [29.9, 47.0], [30.4, 46.2]]] },
      { from: "1941-08-20", lines: [[[28.2, 59.4], [29.8, 58.7], [31.3, 58.5], [31.4, 57.9], [30.5, 56.4], [31.9, 55.4], [33.0, 54.6], [33.1, 53.5], [31.4, 52.6], [31.3, 51.5], [30.6, 50.4], [31.8, 49.1], [33.4, 48.5], [32.9, 47.5], [32.3, 46.6]]] },
      { from: "1941-09-25", lines: [[[29.7, 59.8], [30.9, 59.9], [32.2, 59.7], [32.3, 58.7], [33.2, 58.0], [32.5, 57.0], [33.3, 56.0], [34.0, 54.6], [33.6, 53.2], [32.6, 52.2], [32.9, 51.0], [33.3, 50.35], [34.4, 49.6], [35.0, 48.5], [35.2, 47.8], [34.6, 47.2], [33.7, 46.2]]] },
      { from: "1941-11-25", lines: [[[30.0, 59.8], [31.0, 59.9], [33.5, 59.65], [32.8, 58.4], [33.7, 57.4], [35.9, 56.9], [36.9, 56.4], [37.2, 56.0], [37.0, 55.6], [37.3, 55.3], [37.6, 54.2], [38.2, 53.9], [38.0, 52.7], [37.5, 52.0], [37.4, 50.8], [37.5, 49.5], [37.8, 48.0], [38.9, 47.1], [39.7, 47.2]], [[33.2, 44.55], [33.7, 44.75], [33.9, 44.55]]] },
      { from: "1941-12-20", lines: [[[30.0, 59.8], [31.0, 59.9], [32.3, 59.4], [32.1, 58.4], [32.5, 57.5], [34.2, 57.0], [34.9, 56.7], [34.6, 56.0], [35.5, 55.5], [35.9, 55.3], [36.5, 54.4], [36.6, 53.6], [37.4, 52.3], [37.5, 51.0], [37.4, 49.6], [37.8, 48.0], [38.5, 47.3], [38.9, 47.2]], [[33.2, 44.55], [33.7, 44.75], [33.9, 44.55]]] },
      { from: "1942-03-15", lines: [[[30.0, 59.8], [31.0, 59.9], [32.8, 59.2], [32.2, 58.2], [32.5, 57.4], [31.1, 57.15], [30.5, 56.4], [34.3, 57.0], [34.1, 56.3], [34.6, 55.3], [35.3, 54.8], [34.8, 54.0], [35.5, 53.6], [36.8, 52.2], [37.5, 51.0], [37.5, 49.4], [37.8, 48.0], [38.5, 47.3]], [[33.2, 44.55], [33.7, 44.75], [33.9, 44.55]]] },
      { from: "1942-07-25", lines: [[[30.0, 59.8], [31.0, 59.9], [32.8, 59.2], [32.2, 58.2], [32.5, 57.4], [31.1, 57.15], [30.5, 56.4], [34.3, 57.0], [34.1, 56.3], [34.6, 55.3], [35.3, 54.8], [34.8, 54.0], [35.5, 53.6], [36.8, 52.2], [38.0, 52.0], [39.2, 51.7], [40.1, 50.45], [40.6, 49.95], [42.0, 49.7], [43.1, 49.3], [43.5, 48.7], [43.0, 47.8], [41.0, 47.5], [39.7, 47.2]]] },
      { from: "1942-09-20", lines: [[[30.0, 59.8], [31.0, 59.9], [32.8, 59.2], [32.2, 58.2], [32.5, 57.4], [31.1, 57.15], [30.5, 56.4], [34.3, 57.0], [34.1, 56.3], [34.6, 55.3], [35.3, 54.8], [34.8, 54.0], [35.5, 53.6], [36.8, 52.2], [38.0, 52.0], [39.2, 51.7], [40.1, 50.45], [40.6, 49.95], [42.0, 49.7], [43.1, 49.3], [44.1, 48.9], [44.5, 48.5], [44.4, 47.6], [44.3, 46.3], [44.7, 45.0], [44.65, 43.75], [42.8, 43.5], [41.0, 43.7], [39.3, 44.2], [37.8, 44.7]]] },
      { from: "1942-11-23", lines: [[[30.0, 59.8], [31.0, 59.9], [32.8, 59.2], [32.2, 58.2], [32.5, 57.4], [31.1, 57.15], [30.5, 56.4], [34.3, 57.0], [34.1, 56.3], [34.6, 55.3], [35.3, 54.8], [34.8, 54.0], [35.5, 53.6], [36.8, 52.2], [38.0, 52.0], [39.2, 51.7], [40.1, 50.45], [40.6, 49.95], [42.7, 49.6]], [[42.7, 48.9], [43.5, 49.3], [44.5, 49.3], [44.7, 48.4], [44.2, 47.9], [43.2, 48.0], [42.7, 48.9]], [[44.3, 46.3], [44.7, 45.0], [44.65, 43.75], [42.8, 43.5], [41.0, 43.7], [39.3, 44.2], [37.8, 44.7]]] },
      { from: "1943-02-20", lines: [[[29.9, 59.8], [30.9, 59.9], [31.1, 59.95], [32.3, 59.4], [32.5, 58.5], [32.4, 57.5], [30.9, 56.4], [32.0, 55.8], [34.3, 56.25], [34.6, 55.3], [35.3, 54.8], [34.8, 54.0], [35.5, 53.6], [36.8, 52.2], [37.5, 51.2], [37.0, 50.2], [37.6, 49.0], [38.0, 48.0], [38.9, 47.2], [39.7, 47.2]], [[37.8, 44.7], [38.4, 45.2]]] },
      { from: "1943-03-25", lines: [[[29.9, 59.8], [30.9, 59.9], [31.1, 59.95], [32.3, 59.4], [32.5, 58.5], [32.4, 57.5], [30.9, 56.4], [32.0, 55.8], [33.2, 54.6], [34.5, 53.9], [35.3, 53.0], [36.07, 52.97], [36.5, 52.4], [36.9, 51.8], [36.6, 50.6], [36.3, 50.0], [37.3, 49.0], [38.2, 47.8], [38.9, 47.2]], [[37.8, 44.7], [38.4, 45.2]]] },
      { from: "1943-07-04", lines: [[[29.9, 59.8], [30.9, 59.9], [31.1, 59.95], [32.3, 59.4], [32.5, 58.5], [32.4, 57.5], [30.9, 56.4], [32.0, 55.8], [33.2, 54.6], [34.5, 53.9], [35.3, 53.0], [36.07, 52.97], [35.8, 52.2], [36.2, 51.2], [36.6, 50.6], [36.3, 50.0], [37.3, 49.0], [38.2, 47.8], [38.9, 47.2]], [[37.8, 44.7], [38.4, 45.2]]] },
      { from: "1943-10-15", lines: [[[28.2, 59.4], [28.0, 58.0], [29.9, 56.0], [30.2, 55.2], [30.9, 54.5], [30.9, 53.4], [31.0, 52.4], [30.6, 51.5], [30.5, 50.4], [31.2, 49.5], [33.4, 49.1], [34.6, 48.5], [35.15, 47.85], [35.3, 47.2], [34.8, 46.8]]] },
      { from: "1943-12-31", lines: [[[28.2, 59.4], [28.0, 58.0], [29.9, 56.0], [30.2, 55.2], [30.9, 54.5], [30.9, 53.4], [29.2, 52.5], [28.6, 51.4], [28.7, 50.25], [30.2, 49.5], [31.9, 48.7], [33.4, 47.9], [33.7, 47.3], [34.0, 46.8]]] },
      { from: "1944-04-01", lines: [[[28.2, 59.4], [28.0, 58.0], [29.9, 56.0], [30.2, 55.2], [30.9, 54.5], [30.9, 53.4], [29.2, 52.5], [26.6, 52.0], [24.7, 51.2], [25.6, 49.55], [25.9, 48.3], [27.8, 48.4], [29.2, 47.3], [30.0, 46.6]]] },
      { from: "1944-06-20", watch: FRONT_WATCH_EAST_LATE, lines: [[[28.2, 59.4], [27.9, 58.0], [28.3, 57.2], [29.9, 56.0], [30.2, 55.2], [30.9, 54.5], [29.2, 53.15], [26.6, 52.0], [24.7, 51.2], [25.15, 50.1], [25.6, 49.55], [25.0, 48.5], [26.5, 48.1], [29.15, 47.3], [30.0, 46.6]]] },
      { from: "1944-08-15", watch: FRONT_WATCH_EAST_LATE, lines: [[[28.2, 59.4], [27.5, 58.5], [28.3, 57.8], [26.5, 55.9], [23.15, 56.97]], [[23.3, 55.9], [23.9, 54.9], [22.9, 54.1], [21.5, 52.9], [21.05, 52.25], [21.4, 51.7], [21.5, 50.5], [22.8, 49.8], [24.0, 49.2], [25.5, 48.3], [27.5, 47.0], [29.0, 46.0]]] },
      { from: "1944-10-31", watch: FRONT_WATCH_EAST_LATE, lines: [[[21.0, 57.4], [23.0, 57.1], [23.1, 56.45], [22.0, 56.0], [21.1, 56.4], [21.0, 57.4]], [[21.1, 55.7], [22.3, 54.3], [22.9, 53.9], [21.5, 52.9], [21.05, 52.25], [21.4, 51.7], [21.7, 49.4], [22.5, 48.3], [21.6, 47.5], [20.5, 46.5], [20.5, 44.8]]] },
      { from: "1945-01-12", watch: FRONT_WATCH_EAST_LATE, lines: [[[21.0, 57.4], [23.0, 57.1], [23.1, 56.45], [22.0, 56.0], [21.1, 56.4], [21.0, 57.4]], [[21.1, 55.7], [22.3, 54.3], [22.9, 53.9], [21.5, 52.9], [21.05, 52.25], [21.4, 51.7], [21.7, 50.7], [21.7, 49.4], [22.3, 48.5]], [[19.04, 47.5], [18.0, 47.3], [17.8, 46.8], [18.9, 46.2], [19.0, 45.0]]] },
      { from: "1945-02-15", watch: FRONT_WATCH_EAST_LATE, lines: [[[21.0, 57.4], [23.0, 57.1], [23.1, 56.45], [22.0, 56.0], [21.1, 56.4], [21.0, 57.4]], [[20.0, 54.4], [20.5, 54.7], [20.0, 54.9], [20.0, 54.4]], [[18.65, 54.35], [16.9, 54.0], [15.55, 54.2], [14.9, 53.6], [14.65, 52.6], [14.6, 52.0], [15.0, 51.3], [17.0, 51.1], [17.9, 50.7], [18.25, 49.8]], [[18.0, 47.3], [17.8, 46.8], [17.5, 46.2]]] },
      { from: "1945-04-16", watch: FRONT_WATCH_EAST_LATE, lines: [[[14.55, 53.4], [14.65, 52.6], [14.4, 52.55], [14.55, 52.35], [14.75, 51.55], [14.99, 51.15], [14.8, 50.9], [15.8, 50.2], [17.0, 49.6], [18.25, 49.8], [17.2, 48.8], [16.6, 48.2], [16.6, 47.7]]] },
      { from: "1945-05-09", lines: null },
    ],
  },
  {
    id: "finland",
    watch: ["finland"],
    entries: [
      { from: "1939-11-30", lines: [[[29.4, 68.3], [30.0, 66.0], [31.6, 64.5], [30.5, 63.5], [30.1, 62.5], [29.6, 61.5], [28.9, 60.55]]] },
      { from: "1940-02-15", lines: [[[28.5, 60.5], [28.8, 60.8], [29.3, 61.3], [29.8, 62.2]]] },
      { from: "1940-03-13", lines: null },
      { from: "1941-06-25", watch: ["finland", "ussrLeningrad"], lines: [[[29.9, 69.5], [29.0, 67.5], [29.5, 65.5], [30.0, 63.5], [30.6, 62.5], [29.6, 61.4], [28.8, 60.55]]] },
      { from: "1941-09-05", watch: ["finland", "ussrLeningrad"], lines: [[[29.8, 69.3], [32.4, 67.2], [33.4, 65.5], [34.4, 63.0], [33.3, 61.55], [32.9, 60.95]], [[29.2, 60.7], [29.4, 60.2]]] },
      { from: "1944-06-20", watch: ["finland", "ussrLeningrad"], lines: [[[29.8, 69.3], [32.4, 67.2], [33.4, 65.5], [34.4, 63.0], [33.3, 61.55], [32.9, 60.95]], [[28.4, 60.5], [28.8, 60.9]]] },
      { from: "1944-09-19", lines: null },
    ],
  },
  {
    id: "norway",
    watch: ["norway"],
    entries: [
      { from: "1940-04-14", lines: [[[10.4, 60.8], [9.8, 62.3]], [[16.7, 68.3], [18.0, 68.55]]] },
      { from: "1940-05-06", lines: [[[12.0, 64.8], [14.5, 65.6]], [[16.7, 68.3], [18.0, 68.55]]] },
      { from: "1940-06-09", lines: null },
    ],
  },
  {
    id: "west",
    watch: ["france", "benelux"],
    entries: [
      { from: "1940-05-10", lines: [[[7.2, 53.3], [7.0, 52.4], [6.75, 51.75], [6.1, 51.0], [6.1, 50.1], [6.4, 49.5], [7.0, 49.1], [8.2, 48.98], [7.6, 47.6]]] },
      { from: "1940-05-15", lines: [[[4.55, 52.4], [4.4, 51.9], [4.35, 51.25], [4.7, 50.9], [4.65, 50.5], [4.9, 50.25], [4.95, 49.7], [5.4, 49.4], [6.3, 49.2], [7.0, 49.05], [8.2, 48.98], [7.6, 47.6]]] },
      { from: "1940-05-24", lines: [[[4.6, 51.9], [4.35, 51.25], [3.6, 50.85], [3.1, 50.65], [2.7, 50.3], [1.85, 50.1], [2.3, 49.9], [2.95, 49.9], [3.6, 49.4], [4.4, 49.5], [4.95, 49.7], [5.4, 49.4], [6.3, 49.2], [7.0, 49.05], [8.2, 48.98], [7.6, 47.6]]] },
      { from: "1940-06-05", lines: [[[1.5, 50.2], [2.3, 49.88], [2.95, 49.9], [3.35, 49.65], [3.75, 49.4], [4.4, 49.5], [5.3, 49.45], [6.3, 49.2], [7.0, 49.05], [8.2, 48.98], [7.6, 47.6]]] },
      { from: "1940-06-15", lines: [[[0.1, 49.5], [0.6, 48.8], [1.6, 48.5], [2.5, 48.2], [3.4, 48.3], [4.6, 48.0], [5.6, 47.6], [6.8, 47.4]]] },
      { from: "1940-06-22", lines: null },
      { from: "1944-06-06", watch: ["france", "benelux"], lines: [[[-1.35, 49.45], [-1.15, 49.35], [-0.9, 49.28], [-0.6, 49.27], [-0.4, 49.2]]] },
      { from: "1944-06-30", lines: [[[-1.4, 49.55], [-1.3, 49.2], [-1.0, 49.15], [-0.6, 49.15], [-0.35, 49.2], [-0.1, 49.2]]] },
      { from: "1944-07-25", lines: [[[-1.55, 49.25], [-1.1, 49.05], [-0.6, 49.05], [-0.15, 49.1], [0.15, 49.2]]] },
      { from: "1944-08-25", lines: [[[0.1, 49.5], [1.1, 49.4], [1.8, 49.1], [2.4, 48.9], [3.3, 48.3], [4.1, 48.25], [5.3, 47.7]]] },
      { from: "1944-09-20", watch: ["france", "benelux", "germany"], lines: [[[4.0, 51.35], [5.1, 51.3], [5.9, 51.7], [6.17, 51.37], [6.1, 50.97], [6.08, 50.78], [6.4, 50.4], [6.13, 49.6], [6.17, 49.12], [6.2, 48.7], [6.9, 48.1], [6.8, 47.6]]] },
      { from: "1944-12-20", watch: ["france", "benelux", "germany"], lines: [[[5.9, 51.7], [6.2, 51.3], [6.1, 50.8], [6.35, 50.4], [5.95, 50.38], [5.2, 50.2], [4.95, 50.2], [5.1, 49.95], [5.7, 49.9], [5.9, 49.6], [6.4, 49.5], [6.9, 49.2], [7.6, 48.9], [7.6, 47.6]]] },
      { from: "1945-02-25", watch: ["france", "benelux", "germany"], lines: [[[5.9, 51.85], [6.1, 51.75], [6.2, 51.5], [6.35, 51.2], [6.5, 50.8], [6.4, 50.4], [6.5, 49.9], [6.8, 49.5], [7.6, 49.0], [7.6, 47.6]]] },
      { from: "1945-03-10", watch: ["france", "benelux", "germany"], lines: [[[6.2, 51.8], [6.62, 51.65], [6.77, 51.43], [6.77, 51.23], [6.96, 50.94], [7.1, 50.7], [7.35, 50.55], [7.6, 50.35], [8.27, 50.0], [8.47, 49.49], [8.4, 49.0], [7.75, 48.58], [7.6, 47.6]]] },
      { from: "1945-03-31", watch: ["france", "benelux", "germany"], lines: [[[6.2, 52.2], [7.0, 52.1], [7.7, 51.7], [7.7, 51.3], [8.2, 51.0], [8.9, 50.5], [9.4, 50.0], [9.5, 49.5], [9.2, 49.1], [8.5, 48.9], [7.75, 48.58], [7.6, 47.6]]] },
      { from: "1945-04-15", watch: ["france", "benelux", "germany"], lines: [[[6.5, 53.35], [7.4, 52.7], [8.8, 52.9], [10.0, 53.0], [11.0, 53.0], [11.63, 52.12], [12.3, 51.9], [12.4, 51.3], [12.2, 50.5], [11.1, 49.6], [11.0, 48.9], [11.9, 48.4], [13.0, 47.8]]] },
      { from: "1945-05-08", lines: null },
    ],
  },
  {
    id: "demarcation",
    kind: "zone",
    watch: ["france"],
    entries: [
      { from: "1940-06-24", lines: [VICHY_LINE] },
      { from: "1942-11-11", lines: null },
    ],
  },
  {
    id: "balkans",
    watch: ["greece", "yugoslavia", "albania"],
    entries: [
      { from: "1940-10-28", lines: [[[20.15, 39.7], [20.6, 39.8], [20.9, 40.2], [21.1, 40.8]]] },
      { from: "1940-12-08", lines: [[[19.85, 40.3], [20.3, 40.4], [20.7, 40.9], [20.85, 41.0]]] },
      { from: "1941-04-06", lines: [[[15.0, 46.6], [16.6, 46.5], [18.9, 45.9], [20.3, 45.1], [22.5, 44.4], [22.4, 42.2], [22.9, 41.35], [23.5, 41.4]]] },
      { from: "1941-04-20", lines: [[[21.3, 40.3], [22.35, 40.1], [22.55, 38.8]]] },
      { from: "1941-04-27", lines: null },
    ],
  },
  {
    id: "africa",
    watch: ["libya", "egypt", "nwAfrica"],
    entries: [
      { from: "1940-09-13", lines: [[[25.92, 31.62], [25.8, 30.9], [25.2, 29.9]]] },
      { from: "1940-12-11", lines: [[[25.2, 31.55], [25.0, 30.5], [24.7, 29.5]]] },
      { from: "1941-01-05", lines: [[[24.0, 32.05], [23.9, 30.9], [23.6, 29.8]]] },
      { from: "1941-02-07", lines: [[[19.2, 30.25], [19.0, 29.0], [18.8, 28.0]]] },
      { from: "1941-04-12", lines: [[[25.2, 31.55], [25.0, 30.5], [24.7, 29.5]], [[23.5, 32.15], [23.7, 31.7], [24.1, 31.65], [24.5, 31.9], [24.55, 32.15]]] },
      { from: "1941-12-10", lines: [[[22.6, 32.2], [22.45, 31.6], [22.3, 30.8]]] },
      { from: "1941-12-30", lines: [[[19.2, 30.25], [19.0, 29.0], [18.8, 28.0]]] },
      { from: "1942-01-29", lines: [[[22.55, 32.15], [22.45, 31.6], [22.3, 30.8]]] },
      { from: "1942-06-21", lines: [[[28.9, 30.83], [28.5, 30.3], [28.3, 29.5]]] },
      { from: "1942-11-04", lines: [[[28.0, 30.95], [27.7, 30.0]]] },
      { from: "1942-11-13", lines: [[[24.0, 32.08], [23.8, 31.0]], [[9.2, 37.25], [9.6, 36.65], [9.9, 36.1], [9.5, 35.0], [8.8, 34.4]]] },
      { from: "1942-12-13", lines: [[[19.2, 30.25], [19.0, 29.0]], [[9.2, 37.25], [9.6, 36.65], [9.9, 36.1], [9.5, 35.0], [8.8, 34.4]]] },
      { from: "1943-01-23", lines: [[[13.5, 32.8], [13.3, 32.0]], [[9.2, 37.25], [9.6, 36.65], [9.9, 36.1], [9.5, 35.0], [8.8, 34.4]]] },
      { from: "1943-03-20", lines: [[[10.5, 33.45], [10.0, 33.2], [9.9, 32.6]], [[9.2, 37.25], [9.6, 36.65], [9.9, 36.1], [9.0, 35.2]]] },
      { from: "1943-04-06", lines: [[[10.1, 34.0], [9.9, 33.4], [9.5, 33.4]], [[9.2, 37.25], [9.6, 36.65], [9.9, 36.1], [9.0, 35.2]]] },
      { from: "1943-04-20", lines: [[[10.5, 36.1], [10.2, 35.8], [9.8, 35.5]], [[9.5, 37.3], [9.6, 36.65], [9.9, 36.3]]] },
      { from: "1943-05-13", lines: null },
    ],
  },
  {
    id: "italy",
    watch: ["italy"],
    entries: [
      { from: "1943-07-10", lines: [[[13.95, 37.1], [14.5, 37.1], [15.3, 37.1]]] },
      { from: "1943-07-30", lines: [[[14.05, 38.05], [14.6, 37.8], [15.1, 37.5]]] },
      { from: "1943-08-17", lines: null },
      { from: "1943-09-09", lines: [[[14.45, 40.55], [15.0, 40.7], [15.3, 40.5]]] },
      { from: "1943-10-06", lines: [[[13.93, 41.03], [14.2, 41.1], [14.8, 41.15], [15.5, 41.5], [14.99, 42.0]]] },
      { from: "1943-12-15", lines: [[[13.75, 41.25], [13.83, 41.49], [14.0, 41.7], [14.4, 42.0], [14.5, 42.2]]] },
      { from: "1944-01-22", lines: [[[13.75, 41.25], [13.83, 41.49], [14.0, 41.7], [14.4, 42.0], [14.5, 42.2]], [[12.4, 41.5], [12.65, 41.65], [12.9, 41.55]]] },
      { from: "1944-05-23", lines: [[[13.0, 41.25], [13.6, 41.6], [14.0, 41.9], [14.45, 42.2]]] },
      { from: "1944-06-05", lines: [[[11.75, 42.1], [12.3, 42.3], [12.9, 42.6], [13.4, 42.7], [14.2, 42.45]]] },
      { from: "1944-07-20", lines: [[[10.3, 43.55], [10.9, 43.5], [11.9, 43.55], [12.6, 43.7], [13.5, 43.6]]] },
      { from: "1944-09-10", lines: [[[10.25, 44.0], [10.7, 44.15], [11.3, 44.1], [11.9, 44.1], [12.55, 44.06]]] },
      { from: "1944-12-31", lines: [[[10.1, 44.0], [10.55, 44.0], [11.1, 44.2], [11.95, 44.45], [12.27, 44.42]]] },
      { from: "1945-04-22", lines: [[[10.2, 44.2], [11.1, 44.5], [11.9, 44.7], [12.3, 44.7]]] },
      { from: "1945-05-02", lines: null },
    ],
  },
];

// ---- where each report is set ----
const MAP_PLACES = {
  german: {
    norway40: [10.75, 59.9], caseYellow40: [4.95, 49.7], caseYellowOriginal40: [2.3, 49.9], compressedInvasionWindow40: [1.5, 50.9], dunkirk: [2.37, 51.03], channel: [1.5, 50.9], tannenbaum40: [8.0, 47.4],
    balkans: [20.5, 44.8], hessFlight41: [-4.3, 55.75], crete41: [25.1, 35.4], bismarckBreakout41: [5.3, 60.4], sealionDisaster40: [1.2, 51.0], sealionAftermath40: [1.2, 51.0],
    barbarossa41: [21.5, 54.08], suezFirst41: [32.3, 30.0], barbarossaAutumn41: [21.5, 54.08], japanDirection41: [13.4, 52.5], moscowFalls41: [37.6, 55.75], volgaOverreach42: [44.0, 56.3],
    sovietFracture42: [60.6, 56.8], fractureResolution42: [44.0, 56.3], volgaAftermath42: [44.0, 56.3], east42Launch: [21.5, 54.08], armedTruce41: [13.4, 52.5], mediterranean41: [14.5, 36.0],
    gibraltarStalled42: [-5.35, 36.14], iberianQuestion42: [-3.7, 40.4], suezHorizon42: [32.3, 30.0], bomberWar43: [13.4, 52.5], uranverein43: [13.28, 52.45], invasionQuestion44: [-0.5, 49.3],
    lodgmentReduction44: [-0.85, 49.37], easternQuestion44: [21.0, 52.2], atomicReckoning45: [13.4, 52.5], moscowKiev: [32.05, 54.78], doubleEnvelopment: [30.5, 50.45], exposedFlank: [32.05, 54.78],
    moscowRace41: [34.3, 55.2], rostov41: [39.7, 47.2], typhoon: [37.6, 55.75], pearlHarbor: [13.4, 52.5], staticEast: [34.3, 56.25], atlanticWall43: [1.85, 50.95], herkules42: [14.5, 35.9],
    suezOpening42: [29.9, 31.2], heydrichReprisals42: [14.19, 50.15], caseBlue: [39.2, 51.7], torch42: [5.93, 43.12], maltaAftermath: [14.5, 35.9], britishCrisis42: [-0.13, 51.5],
    crisisResolution42: [-0.13, 51.5], westArmisticeAftermath42: [-0.13, 51.5], elAlamein: [28.9, 30.83], stalingradPocket: [44.5, 48.7], easternCollapse1943: [36.25, 50.0], backhandBlow43: [36.25, 50.0],
    blackMay: [-3.37, 47.75], atlanticAttrition43: [-3.37, 47.75], reconstituted: [35.0, 48.5], vlasov43: [32.05, 54.78], kursk: [36.2, 51.7], kurskBreach43: [36.2, 51.7],
    kurskAftermath43: [36.2, 51.7], expandedOffensive43: [36.2, 51.7], twoFires1943: [12.5, 41.9], mussoliniRescue43: [13.57, 42.47], italyPartisans: [11.25, 43.77], dnieperStabilized: [35.0, 48.5],
    italianLine43: [13.8, 41.5], stockholmFeelers43: [18.07, 59.33], firmestLine43: [31.0, 49.5], vWeaponsProduction44: [13.8, 54.15], normandy: [-0.9, 49.35], normandyCounterattack44: [-0.6, 49.28],
    normandyConsolidation44: [-0.6, 49.28], bagration44: [27.55, 53.9], eastStand44: [21.0, 52.2], collapse1944: [27.55, 53.9], centerArmyPreserved44: [27.55, 53.9], romaniaDefects44: [26.1, 44.43],
    july20Plot44: [21.5, 54.08], july20PlotFails44: [21.5, 54.08], rommelFate44: [9.87, 48.43], hitlerDead44: [13.4, 52.5], valkyrieGovernment44: [13.4, 52.5], gestapoInquiry44: [13.4, 52.5],
    caenAttrition: [-0.37, 49.18], falaiseGerman: [-0.2, 48.9], arnhem44: [5.9, 51.98], ardennes: [5.9, 50.2], hungaryGamble45: [17.8, 47.0], rhineDefense45: [7.23, 50.57],
    reichStand45: [13.4, 52.5], westWall45: [6.5, 50.2], fortressNorth45: [10.4, 63.4], oderDefense45: [14.4, 52.55], berlinDefense45: [13.4, 52.5], finalWeek45: [13.4, 52.5],
    flensburg45: [9.43, 54.78], alpineRedoubt45: [13.0, 47.6],
  },
  soviet: {
    finnishPrep39: [37.6, 55.75], winterStall40: [28.65, 60.6], summaBreak40: [28.65, 60.6], moscowPeace40: [37.6, 55.75], plan40: [37.6, 55.75], games41: [37.6, 55.75],
    prep41: [37.6, 55.75], memo41: [37.6, 55.75], border41: [23.7, 52.1], brodyCounterstroke41: [25.15, 50.1], yelnya41: [33.2, 54.6], smolensk41: [32.05, 54.78],
    industrialShortfall42: [60.6, 56.8], leningrad41: [30.3, 59.94], evacuateIndustry41: [61.4, 55.15], moscowVyazma41: [34.3, 55.2], moscowPanic41: [37.6, 55.75], specialSection41: [37.6, 55.75],
    lendLease42: [33.1, 68.97], winterGeneral42: [37.6, 55.75], rzhevVyazma42: [34.3, 55.2], smolenskThaw42: [32.05, 54.78], kharkov42: [37.25, 49.2], westernOffensive42: [34.3, 56.25],
    rzhevSummer42: [34.3, 56.25], order227_42: [37.6, 55.75], stalingradStreets42: [44.5, 48.7], escapedRemnants43: [43.5, 48.7], southernPursuit43: [39.7, 47.2], partisans43: [34.4, 53.25],
    eastPrussia45: [20.5, 54.7], berlinRivalryIncident45: [13.4, 52.5], berlinAssault45: [14.4, 52.55], moscowDefense41: [37.6, 55.75], autumnWeight42: [44.5, 48.7], caucasusDefense42: [44.65, 43.75],
    rzhev42: [34.3, 56.25], stalingradCounter42: [43.5, 48.7], southernVacuum43: [36.25, 50.0], vacuumOverreach43: [36.25, 50.0], rostovAftermath43: [39.7, 47.2], kharkov43: [36.25, 50.0],
    quietSector43: [36.2, 51.7], katynRevelation43: [31.8, 54.78], katynBreak43: [21.0, 52.2], kurskDefense43: [36.2, 51.7], preemptResult43: [36.2, 51.7], axis43: [36.25, 50.0],
    smolenskGates43: [32.05, 54.78], dnieperRace43: [30.5, 50.45], easternWallBreach43: [30.5, 50.45], bagrationSoviet44: [30.2, 55.2], leningrad44: [30.3, 59.94], rightBank44: [31.25, 49.42],
    crimea44: [33.53, 44.6], iasiKishinev44: [28.86, 47.0], budapest44: [19.04, 47.5], balatonVienna45: [17.8, 46.9], prague45: [14.4, 50.1], warsawUprising44: [21.0, 52.23],
    warsawRelief44: [21.0, 52.23], balkans44: [20.46, 44.82], athensRace44: [23.73, 37.98], athensStandoff44: [23.73, 37.98], polishQuestion45: [22.57, 51.25], finnishArmistice44: [24.94, 60.17],
    finlandOccupationCost44: [24.94, 60.17], vistulaOder45: [14.65, 52.6], berlinFeb45: [14.65, 52.6], maskingForceQuestion45: [14.65, 52.6], berlinRace45: [14.4, 52.55],
  },
  allied: {
    narvik40: [17.43, 68.44], dunkirk40: [2.37, 51.03], halifaxCrisis40: [-0.13, 51.5], battleOfBritain40: [-0.48, 51.55], compassGreece41: [19.2, 30.25], greeceFalls41: [22.55, 38.8],
    crete41: [25.1, 35.4], aidRussia41: [37.6, 55.75], malaya41: [103.8, 1.3], forceZ41: [103.8, 1.3], crusader41: [23.97, 32.08], europeFirst42: [-77.04, 38.9],
    atlanticConvoys42: [-2.99, 53.4], pq17_1942: [33.1, 68.97], australiaLifeline42: [151.2, -33.9], secondFront42: [-0.13, 51.5], untestedDoctrine44: [-0.13, 51.5], darlanDeal42: [3.06, 36.75],
    casablanca43: [-7.6, 33.6], resistanceContact44: [2.35, 48.86], sicilyHusky43: [14.25, 37.07], tehran43: [51.4, 35.7], italyOrOverlord43: [14.27, 40.85], normandy44: [-0.2, 48.9],
    marketGarden44: [5.9, 51.98], arnhemPerimeter44: [5.85, 51.98], anvilDragoon44: [6.7, 43.2], ljubljanaGap44: [14.5, 46.05], gapStalled44: [11.34, 44.5], viennaStandoff44: [16.37, 48.21],
    ardennesResponse44: [5.72, 50.0], bulgeExploited44: [5.72, 50.0], yaltaFeb45: [34.17, 44.5], berlinDecision45: [11.63, 52.12], westernCollapse45: [7.23, 50.57], berlinRace45: [11.63, 52.12],
    pacificPressure42: [-77.04, 38.9], dieppe42: [1.08, 49.93], bomberDirective43: [-0.8, 51.64], dodecanese43: [26.85, 37.2], aegeanReckoning43: [26.85, 37.2], turkishQuestion44: [32.85, 39.93],
    turkishBelligerence44: [32.85, 39.93], anzio44: [12.63, 41.45], anzioSiege44: [12.63, 41.45], romeDividend44: [12.5, 41.9], gothicLineEarly44: [11.25, 43.77], overlordPrep44: [-1.1, 50.8],
    omahaCrisis44: [-0.85, 49.37], omahaIsolated44: [-0.85, 49.37], omahaBreakthroughLate44: [-0.9, 49.35], omahaToehold44: [-0.9, 49.35], falaise44: [-0.2, 48.9], eisenhowerIntervenes44: [2.35, 48.86],
    scheldt44: [4.4, 51.22], stalinTestsTheFront45: [13.4, 52.5], strategicBombing45: [13.74, 51.05], germanyOccupation45: [13.4, 52.5],
  },
  italy: {
    nonBelligerence40: [12.5, 41.9], extendedHoldout40: [12.5, 41.9], britainAloneQuestion40: [12.5, 41.9], enduringNeutrality40: [12.5, 41.9], germanPressure41: [11.5, 47.0], neutralItalyOccupied42: [11.5, 47.0],
    neutralItalyEnd45: [12.5, 41.9], alpsFront40: [7.5, 43.78], medStrategy40: [12.5, 41.9], gibraltarGambit40: [-5.35, 36.14], gibraltarResolution40: [-1.77, 43.37], greeceDecision40: [12.5, 41.9],
    tarantoDoctrine40: [17.24, 40.47], greeceWinter40: [20.78, 40.62], compass40: [25.92, 31.62], germanRescue41: [12.5, 41.9], matapan41: [21.5, 35.8], yugoslaviaBalkans41: [15.98, 45.8],
    eastAfrica41: [39.2, 12.9], convoyWarMalta41: [14.5, 35.9], herculesExecution41: [14.5, 35.9], maltaRetake41: [14.5, 35.9], rommelAdvance41: [19.2, 30.25], tobruk42: [23.97, 32.08],
    alamein42: [28.9, 30.83], torchTunisia42: [10.18, 36.8], tunisiaCollapse43: [10.18, 36.8], homeFrontBombing43: [9.19, 45.46], sicilyHusky43: [14.25, 37.07], mussoliniCoup43: [12.5, 41.9],
    romeStandoff43: [12.5, 41.9], factionSplit43: [12.5, 41.9], germanExploitation43: [12.5, 41.9], civilConflictEnd43: [12.5, 41.9], armisticeNegotiation43: [15.19, 36.98], armisticeAnnounce43: [12.5, 41.9],
    twoItalies43: [17.94, 40.63], salernoAvalanche43: [14.78, 40.68], imiCrisis43: [26.85, 37.2], vaticanChannel44: [12.45, 41.9], imiOutcome44: [12.5, 41.9], monteCassino44: [13.83, 41.49],
    romeLiberation44: [12.5, 41.9], clnLiaison44: [9.19, 45.46], gothicLine44: [11.3, 44.1], monteLungo43: [13.95, 41.43], adriaticRoad44: [13.5, 43.6], combatGroups44: [11.3, 44.1],
    partisanWinter44: [11.35, 44.5], groupsCommand45: [11.88, 44.28], springOffensive45: [12.03, 44.5], coBelligerentEnding45: [9.19, 45.46], saloRepublic43: [10.52, 45.61], alpenvorlandQuestion43: [11.35, 46.5],
    civilWarPartisans44: [9.19, 45.46], gothicLineRSI44: [11.3, 44.1], rsiCollapse45: [9.19, 45.46],
  },
};

// ---- what the commands were doing on a date in the record ----
const mapNow = (on, at, text) => ({ on, at, text });
const MAP_MEANWHILE = {
  german: [
    mapNow("1940-04-09", [10.75, 59.9], "German landings begin at ports from Oslo to Narvik."),
    mapNow("1940-05-10", [5.7, 50.1], "The offensive in the west opens through the Ardennes."),
    mapNow("1940-05-26", [2.37, 51.03], "The evacuation from Dunkirk begins under the halt order."),
    mapNow("1940-06-14", [2.35, 48.86], "German troops enter Paris."),
    mapNow("1940-08-13", [1.0, 51.1], "The air offensive against Britain opens."),
    mapNow("1941-04-06", [20.5, 44.8], "German armies invade Yugoslavia and Greece."),
    mapNow("1941-05-20", [25.1, 35.4], "Airborne landings begin on Crete."),
    mapNow("1941-06-22", [23.7, 52.1], "Three army groups cross the Soviet frontier."),
    mapNow("1941-10-02", [34.3, 55.2], "The drive on Moscow resumes."),
    mapNow("1942-06-28", [39.2, 51.7], "The summer offensive opens on the southern front."),
    mapNow("1942-11-23", [44.5, 48.7], "The Sixth Army is encircled at Stalingrad."),
    mapNow("1943-07-05", [36.2, 51.7], "The attack on the Kursk salient begins."),
    mapNow("1944-06-06", [-0.9, 49.37], "Allied armies land in Normandy."),
    mapNow("1944-12-16", [5.9, 50.2], "The last offensive in the west opens in the Ardennes."),
    mapNow("1945-04-16", [14.4, 52.55], "The Red Army attacks across the Oder towards Berlin."),
    mapNow("1945-05-08", [13.4, 52.5], "Germany surrenders."),
  ],
  soviet: [
    mapNow("1939-11-30", [28.9, 60.55], "The Red Army attacks Finland."),
    mapNow("1940-03-12", [28.75, 60.7], "Peace is signed with Finland in Moscow."),
    mapNow("1941-06-22", [23.7, 52.1], "German forces attack along the whole frontier."),
    mapNow("1941-07-16", [32.05, 54.78], "Smolensk falls to the German centre."),
    mapNow("1941-09-19", [30.5, 50.45], "Kiev falls after the southwest front is encircled."),
    mapNow("1941-12-05", [36.7, 56.3], "The counteroffensive before Moscow opens."),
    mapNow("1942-07-17", [44.5, 48.7], "The battle for Stalingrad begins."),
    mapNow("1942-11-19", [43.5, 48.7], "The counteroffensive at Stalingrad opens."),
    mapNow("1943-02-02", [44.5, 48.7], "The Sixth Army surrenders at Stalingrad."),
    mapNow("1943-07-05", [36.2, 51.7], "The Germans attack the Kursk salient."),
    mapNow("1943-11-06", [30.5, 50.45], "Kiev is retaken."),
    mapNow("1944-01-27", [30.3, 59.9], "The siege of Leningrad is lifted."),
    mapNow("1944-06-22", [30.2, 55.2], "The summer offensive opens in Belorussia."),
    mapNow("1944-08-20", [28.86, 47.0], "The offensive in Romania opens."),
    mapNow("1945-01-12", [21.7, 50.7], "The winter offensive opens from the Vistula."),
    mapNow("1945-04-16", [14.4, 52.55], "The battle for Berlin begins."),
    mapNow("1945-05-09", [14.4, 50.1], "Prague is relieved."),
  ],
  allied: [
    mapNow("1940-04-14", [17.43, 68.44], "British troops land near Narvik."),
    mapNow("1940-05-26", [2.37, 51.03], "The evacuation from Dunkirk begins."),
    mapNow("1940-07-10", [1.0, 51.1], "The air battle over the Channel convoys begins."),
    mapNow("1940-12-09", [25.9, 31.6], "The offensive in the Western Desert opens."),
    mapNow("1941-04-06", [23.7, 38.0], "Germany invades Greece and British forces are committed."),
    mapNow("1941-05-20", [25.1, 35.4], "German airborne forces land on Crete."),
    mapNow("1942-06-21", [23.97, 32.08], "Tobruk falls to Rommel."),
    mapNow("1942-10-23", [28.9, 30.83], "The Eighth Army attacks at El Alamein."),
    mapNow("1942-11-08", [3.06, 36.75], "Allied landings begin in Algeria and Morocco."),
    mapNow("1943-07-10", [14.25, 37.07], "Allied landings begin in Sicily."),
    mapNow("1943-09-09", [14.78, 40.68], "Allied landings begin at Salerno."),
    mapNow("1944-01-22", [12.63, 41.45], "Allied troops land at Anzio."),
    mapNow("1944-06-06", [-0.85, 49.37], "Allied armies land in Normandy."),
    mapNow("1944-08-15", [6.7, 43.2], "Allied landings begin in southern France."),
    mapNow("1944-09-17", [5.9, 51.98], "Airborne forces land at Arnhem and Nijmegen."),
    mapNow("1945-03-07", [7.23, 50.57], "American troops cross the Rhine at Remagen."),
    mapNow("1945-04-25", [13.0, 51.56], "American and Soviet troops meet on the Elbe."),
  ],
  italy: [
    mapNow("1940-06-10", [12.5, 41.9], "Italy declares war on Britain and France."),
    mapNow("1940-06-21", [7.5, 43.78], "The offensive in the Alps opens."),
    mapNow("1940-09-13", [25.2, 31.55], "Italian troops cross the frontier into Egypt."),
    mapNow("1940-10-28", [20.78, 40.62], "Italy invades Greece from Albania."),
    mapNow("1940-11-11", [17.24, 40.47], "British aircraft strike the fleet at Taranto."),
    mapNow("1941-01-22", [23.97, 32.08], "Tobruk falls to the British."),
    mapNow("1941-03-28", [21.5, 35.8], "The fleet is beaten off Cape Matapan."),
    mapNow("1941-05-19", [39.2, 12.9], "The last Italian force in East Africa surrenders at Amba Alagi."),
    mapNow("1942-06-21", [23.97, 32.08], "Tobruk falls to Rommel."),
    mapNow("1942-10-23", [28.9, 30.83], "The British attack at El Alamein."),
    mapNow("1943-05-13", [10.18, 36.8], "The Axis forces in Tunisia surrender."),
    mapNow("1943-07-10", [14.25, 37.07], "Allied landings begin in Sicily."),
    mapNow("1943-07-25", [12.5, 41.9], "The Grand Council deposes Mussolini."),
    mapNow("1943-09-08", [12.5, 41.9], "The armistice is announced."),
    mapNow("1944-06-04", [12.5, 41.9], "Rome falls to the Allies."),
    mapNow("1945-04-21", [11.34, 44.5], "Bologna falls."),
    mapNow("1945-04-29", [14.2, 41.1], "The German surrender in Italy is signed at Caserta."),
  ],
};

// ---- ground taken or given up against the record ----
const mapGround = (id, campaign, flag, values, at, name, kind, text) => ({ id, campaign, flag, values, at, name, kind, text });
const MAP_GROUND = [
  mapGround("g-dunkirk", "german", "dunkirk", ["push"], [2.37, 51.03], "Dunkirk", "gained", "The armour goes into the pocket at once and Dunkirk falls before the evacuation is finished."),
  mapGround("g-crete", "german", "crete41", ["pass"], [25.13, 35.34], "Crete", "lost", "No landing is made and Crete stays in British hands."),
  mapGround("g-athens", "german", "balkans", ["skip"], [23.73, 37.98], "Athens", "lost", "Nothing is sent south and Greece is not invaded in April."),
  mapGround("g-smolensk", "german", "barbarossa", ["postponed", "cancelled"], [32.05, 54.78], "Smolensk", "lost", "There is no invasion in 1941 and the army does not reach Smolensk."),
  mapGround("g-kiev", "german", "eastFront", ["moscow"], [30.52, 50.45], "Kiev", "lost", "The weight goes straight at Moscow and the Kiev pocket is never closed."),
  mapGround("g-moscow", "german", "moscowCaptured", [true], [37.62, 55.75], "Moscow", "gained", "Moscow falls in December and the government leaves the city for the east."),
  mapGround("g-maikop", "german", "caseBlue", ["stalingrad"], [40.1, 44.6], "Maikop", "lost", "Everything goes to the Volga and the army does not reach the oilfields at Maikop."),
  mapGround("g-grozny", "german", "caseBlue", ["caucasus"], [45.7, 43.3], "Grozny", "gained", "Everything goes south and the army fights its way to the oilfields at Grozny."),
  mapGround("g-malta", "german", "med42", ["malta"], [14.51, 35.9], "Malta", "gained", "Herkules is launched and Malta is taken before Rommel moves."),
  mapGround("g-alexandria", "german", "suezOpening42", ["drive"], [29.92, 31.2], "Alexandria", "gained", "The drive for Suez goes on without a pause and reaches Alexandria."),
  mapGround("g-gibraltar", "german", "med41", ["gibraltar"], [-5.35, 36.14], "Gibraltar", "gained", "Spain is brought into the war and the Rock is taken."),
  mapGround("g-alamein", "german", "alamein", ["withdraw"], [28.9, 30.83], "El Alamein", "lost", "The army falls back into Libya and the Alamein line is given up."),
  mapGround("g-rome", "german", "italianLine43", ["apennines"], [12.5, 41.9], "Rome", "lost", "The south is given up and Rome is not defended."),
  mapGround("g-balaton", "german", "lastReserve", ["oder"], [17.8, 46.9], "Lake Balaton", "lost", "The Sixth SS Panzer Army stays on the Oder and the Hungarian oilfields are conceded."),
  mapGround("g-seelow", "german", "seelow", ["berlinRing"], [14.4, 52.55], "Seelow Heights", "lost", "The Heights are given up and the line falls back to Berlin's outer ring."),
  mapGround("s-kiev", "soviet", "kiev41", ["withdraw"], [30.52, 50.45], "Kiev", "lost", "The Southwestern Front pulls back in August and Kiev is given up without a siege."),
  mapGround("s-warsaw", "soviet", "warsaw44", ["relieve"], [21.0, 52.23], "Warsaw", "gained", "The advance goes on to the city and the uprising is relieved."),
  mapGround("s-athens", "soviet", "athensRace44", ["push"], [23.73, 37.98], "Athens", "gained", "A Soviet column crosses the mountains and enters Athens."),
  mapGround("s-berlin", "soviet", "vistulaOder45", ["pushed"], [13.4, 52.5], "Berlin", "gained", "The drive goes straight on in February and Berlin is attacked two months early."),
  mapGround("s-sevastopol", "soviet", "crimea44", ["mask"], [33.53, 44.6], "Sevastopol", "lost", "The peninsula is masked and Sevastopol is not stormed in May."),
  mapGround("s-ploesti", "soviet", "iasiKishinev44", ["oilfields"], [26.03, 44.94], "Ploesti", "gained", "Armour breaks out and drives for the oilfields, leaving the German pocket behind."),
  mapGround("a-narvik", "allied", "narvik40", ["hold"], [17.43, 68.44], "Narvik", "gained", "Narvik is held and reinforced, and the ore port stays in Allied hands."),
  mapGround("a-tripoli", "allied", "mediterranean41", ["tripoli"], [13.19, 32.89], "Tripoli", "gained", "The Western Desert Force goes on to Tripoli."),
  mapGround("a-messina", "allied", "messina43", ["sealed"], [15.55, 38.19], "Messina", "gained", "The Strait is sealed and the German evacuation is cut off."),
  mapGround("a-vienna", "allied", "anvil44", ["balkans"], [16.37, 48.21], "Vienna", "gained", "Western forces are positioned to reach Vienna ahead of the Red Army."),
  mapGround("a-berlin", "allied", "berlin45allied", ["push"], [13.4, 52.5], "Berlin", "gained", "The Elbe is crossed and the Western armies race for Berlin."),
  mapGround("a-anzio", "allied", "anzio44", ["cancel"], [12.63, 41.45], "Anzio", "lost", "Shingle is cancelled and there is no landing at Anzio."),
  mapGround("a-leros", "allied", "dodecanese43", ["decline"], [26.85, 37.2], "Leros", "lost", "The Aegean is declined and the islands are left to the Germans."),
  mapGround("a-cherbourg", "allied", "secondFront42", ["sledgehammer"], [-1.62, 49.65], "Cherbourg", "gained", "An early cross-Channel landing in 1942 puts a force ashore in Normandy."),
  mapGround("i-malta", "italy", "herculesExecution41", ["launch"], [14.51, 35.9], "Malta", "gained", "A scaled-down assault goes in on Malta with Italian forces alone."),
  mapGround("i-menton", "italy", "alpsFront40", ["limited"], [7.5, 43.78], "Menton", "lost", "Only a symbolic advance is made and Menton is not taken."),
  mapGround("i-tunis", "italy", "tunisiaBuildup", ["evacuate"], [10.18, 36.8], "Tunis", "lost", "Tunisia gets a smaller commitment and no defensible bridgehead is built."),
  mapGround("i-alamein", "italy", "alamein42", ["withdraw"], [28.9, 30.83], "El Alamein", "lost", "The army withdraws before the battle and the Alamein line is given up."),
  mapGround("i-bardia", "italy", "compass40", ["withdraw"], [25.1, 31.76], "Bardia", "lost", "The army falls back to a shorter line and Bardia is given up without a siege."),
];

const MAP_COMMAND_SHORT = { german: "OKW", soviet: "STAVKA", allied: "SHAEF", italy: "CS" };
const MAP_MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** An ISO date as it is read in the game: 9 April 1940. */
function mapIsoLabel(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MAP_MONTH_NAMES[m - 1]} ${y}`;
}
const mapIsoKey = (iso) => Number(iso.replace(/-/g, ""));

/**
 * The fronts drawn on a node's day: each theatre's latest entry that began before the day. A theatre whose regions stand as the record had them draws the
 * record's line; one that has departed from the record draws it dashed in red if some fighting is still going on there, and nothing if there is none.
 */
function frontsOn(dayKey, statuses) {
  if (dayKey == null || !statuses) return [];
  const base = baselineStatuses(dayKey);
  const out = [];
  for (const theatre of FRONT_SERIES) {
    let hit = null;
    for (const e of theatre.entries) {
      if (mapIsoKey(e.from) < dayKey) hit = e;
      else break;
    }
    if (!hit || !hit.lines) continue;
    const watch = hit.watch || theatre.watch;
    const moved = watch.some((r) => statuses[r] !== base[r]);
    if (moved && !watch.some((r) => statuses[r] === "contested")) continue;
    out.push({ id: theatre.id, kind: theatre.kind || "front", lines: hit.lines, projection: moved && theatre.kind !== "zone" });
  }
  return out;
}

/** What the other commands were doing, as of a node's day: each one's latest entry before it, newest first. */
function meanwhileOn(campaignId, dayKey) {
  if (dayKey == null) return [];
  const out = [];
  for (const cid of Object.keys(MAP_MEANWHILE)) {
    if (cid === campaignId) continue;
    let hit = null;
    for (const e of MAP_MEANWHILE[cid]) {
      if (mapIsoKey(e.on) < dayKey) hit = e;
      else break;
    }
    if (hit) out.push({ campaignId: cid, short: MAP_COMMAND_SHORT[cid], ...hit });
  }
  return out.sort((a, b) => (a.on < b.on ? 1 : a.on > b.on ? -1 : 0));
}

/** The ground marks a run has earned: those whose flag stands at one of the values that depart from the record. */
function groundMarks(campaignId, flags) {
  return MAP_GROUND.filter((g) => g.campaign === campaignId && flags && g.values.includes(flags[g.flag]));
}

/** The frame of a zoomed map in overlay units around some places, at the shape of the card, as { k, x, y }: scale and the top left corner. */
function mapFrame(points, bbox) {
  const ps = points.filter(Boolean).map(([lo, la]) => projectLonLat(lo, la, bbox)).filter(([x, y]) => x > -30 && x < MAP_OVERLAY_W + 30 && y > -30 && y < MAP_OVERLAY_H + 30);
  if (!ps.length) return null;
  const xs = ps.map((p) => p[0]);
  const ys = ps.map((p) => p[1]);
  let w = Math.max(Math.max(...xs) - Math.min(...xs) + 230, 300);
  let h = w * 0.75;
  const need = Math.max(Math.max(...ys) - Math.min(...ys) + 230, 225);
  if (h < need) {
    h = need;
    w = h / 0.75;
  }
  w = Math.min(w, MAP_OVERLAY_W);
  h = w * 0.75;
  const x = Math.max(0, Math.min(MAP_OVERLAY_W - w, (Math.min(...xs) + Math.max(...xs)) / 2 - w / 2));
  const y = Math.max(0, Math.min(MAP_OVERLAY_H - h, (Math.min(...ys) + Math.max(...ys)) / 2 - h / 2));
  return { k: MAP_OVERLAY_W / w, x, y };
}

const mapPoints = (pts, bbox) => pts.map(([lo, la]) => projectLonLat(lo, la, bbox).map((n) => n.toFixed(1)).join(",")).join(" ");

/** The fronts, drawn under the names: a pale halo and an ink line (red and dashed where the run has departed from the record), and the demarcation line dotted. */
function MapFrontLines({ fronts, bbox }) {
  if (!fronts || !fronts.length) return null;
  return (
    <g style={{ pointerEvents: "none" }} aria-hidden="true">
      {fronts.flatMap((f) =>
        f.lines.map((line, i) =>
          f.kind === "zone" ? (
            <polyline key={f.id + i} points={mapPoints(line, bbox)} fill="none" stroke="#3a2f1d" strokeWidth={1.6} strokeDasharray="5,4" strokeOpacity={0.8} />
          ) : (
            <g key={f.id + i}>
              <polyline points={mapPoints(line, bbox)} fill="none" stroke="#f2ead9" strokeWidth={5.4} strokeOpacity={0.85} strokeLinejoin="round" strokeLinecap="round" />
              <polyline points={mapPoints(line, bbox)} fill="none" stroke={f.projection ? "#7a2e2e" : "#1a1410"} strokeWidth={2.4} strokeDasharray={f.projection ? "7,4" : undefined} strokeLinejoin="round" strokeLinecap="round" />
            </g>
          )
        )
      )}
    </g>
  );
}

/** The report's place and the places before it, the other commands' pins, and the ground a run has taken or given up. */
function MapFrontMarks({ bbox, here, trail, pins, ground, accent, seal }) {
  const P = (p) => projectLonLat(p[0], p[1], bbox);
  const inFrame = ([x, y]) => x > 4 && x < MAP_OVERLAY_W - 4 && y > 4 && y < MAP_OVERLAY_H - 4;
  const font = { fontFamily: "'IBM Plex Mono', monospace" };
  const label = { fill: "#241d12", stroke: "#f2ead9", strokeWidth: 2.4, paintOrder: "stroke", style: { ...font, fontWeight: 600 } };
  const route = (trail || []).filter(Boolean);
  const at = here ? P(here) : null;
  return (
    <g style={{ pointerEvents: "none" }} aria-hidden="true">
      {route.length > 1 && (
        <g>
          <polyline points={mapPoints(route, bbox)} fill="none" stroke="#f2ead9" strokeWidth={4.2} strokeOpacity={0.8} strokeLinejoin="round" />
          <polyline points={mapPoints(route, bbox)} fill="none" stroke={accent || "#7a2e2e"} strokeWidth={1.8} strokeDasharray="2,4" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
      {route.slice(0, -1).map((p, i) => {
        const [x, y] = P(p);
        return inFrame([x, y]) ? <circle key={"v" + i} cx={x} cy={y} r={3} fill="#f2ead9" stroke={accent || "#7a2e2e"} strokeWidth={1.4} /> : null;
      })}
      {(pins || []).map((p) => {
        const [x, y] = P(p.at);
        if (!inFrame([x, y])) return null;
        const colour = (CAMPAIGNS[p.campaignId] && CAMPAIGNS[p.campaignId].accent) || "#241d12";
        return (
          <g key={p.campaignId} transform={`translate(${x} ${y})`}>
            <rect x={-4.6} y={-4.6} width={9.2} height={9.2} transform="rotate(45)" fill={colour} stroke="#f2ead9" strokeWidth={1.6} />
            <text x={8} y={3} fontSize={8} {...label}>{p.short}</text>
          </g>
        );
      })}
      {(ground || []).map((g) => {
        const [x, y] = P(g.at);
        if (!inFrame([x, y])) return null;
        const gained = g.kind === "gained";
        const colour = gained ? "#2f5233" : "#7a2e2e";
        return (
          <g key={g.id} transform={`translate(${x} ${y})`}>
            {gained ? <circle r={7.5} fill="#f2ead9" stroke={colour} strokeWidth={2} /> : <rect x={-7} y={-7} width={14} height={14} fill="#f2ead9" stroke={colour} strokeWidth={2} />}
            <path d={gained ? "M-3.4 0H3.4M0 -3.4V3.4" : "M-3.4 -3.4L3.4 3.4M-3.4 3.4L3.4 -3.4"} stroke={colour} strokeWidth={2} fill="none" />
            <text x={11} y={3.5} fontSize={8.5} {...label}>{g.name}</text>
          </g>
        );
      })}
      {at && inFrame(at) && (
        <g transform={`translate(${at[0]} ${at[1]})`}>
          <circle r={12} fill="none" stroke="#f2ead9" strokeWidth={6} />
          <circle r={12} fill="none" stroke={accent || "#7a2e2e"} strokeWidth={2.6}>
            <animate attributeName="r" values="12;19;12" dur="1.4s" repeatCount="3" />
            <animate attributeName="stroke-opacity" values="1;0.2;1" dur="1.4s" repeatCount="3" />
          </circle>
          <rect x={-4.4} y={-4.4} width={8.8} height={8.8} fill={accent || "#7a2e2e"} stroke="#f2ead9" strokeWidth={1.4} />
          {seal && <text x={16} y={3.5} fontSize={9} {...label}>{seal}</text>}
        </g>
      )}
    </g>
  );
}
