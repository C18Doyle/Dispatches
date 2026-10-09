// One-off: writes tests/adviser-tenures.json, the reviewed table the adviser-dates check reads.
// until: last month the person can be shown giving advice (death, suicide, execution, capture, removal). titlePeriods: the months in which the
// title shown beside the name (ADVISOR_TITLE) is true. An empty entry means: reviewed, alive and in a relevant post throughout 1940 to 1945.
// Facts below are from memory of the standard histories and are to be confirmed with sources in the fact-check pass.
const fs = require("fs");
const t = {};
const set = (name, o) => (t[name] = o);
const reviewed = "Acheson Arnold Attlee Biddle Blamey Compton Davies Doolittle Eichelberger Fletcher Ghormley Grew Groves Halsey Holland-Smith Hull Hurley Iida Imamura Inoue Kawabe Kenney Kido King Kistiakowsky Franck Krueger Kurita Kusaka Layton LeMay Lockwood MacArthur Marshall McCloy Mitscher Nimitz Nomura Ozawa Porter Pye Sakurai Sato Slim Spruance Stilwell Stimson Suzuki Tanaka Terauchi Toyoda Truman Webb Yonai Yoshida Kawane".split(" ");
for (const n of reviewed) set(n.replace("-", " "), {});
// Died, killed, executed, imprisoned or removed: the last month they can speak in a node.
set("Yamamoto", { until: "1943-04", note: "shot down over Bougainville, 18 April 1943" });
set("Koga", { until: "1944-03", note: "lost in an aircraft, 31 March 1944" });
set("Konoe", { until: "1945-12", note: "suicide, 16 December 1945", titlePeriods: [["1940-07", "1941-10"]] });
set("Anami", { until: "1945-08", note: "suicide, 15 August 1945" });
set("Kuribayashi", { until: "1945-03", note: "killed on Iwo Jima, about 26 March 1945" });
set("Roosevelt", { until: "1945-04", note: "died 12 April 1945" });
set("Onishi", { until: "1945-08", note: "suicide, 16 August 1945" });
set("Ugaki", { until: "1945-08", note: "killed on a last sortie, 15 August 1945" });
set("Sugiyama", { until: "1945-09", note: "suicide, 12 September 1945" });
set("Nagumo", { until: "1944-07", note: "suicide on Saipan, July 1944" });
set("Knox", { until: "1944-04", note: "died 28 April 1944" });
set("Curtin", { until: "1945-07", note: "died 5 July 1945", titlePeriods: [["1941-10", "1945-07"]] });
set("Horii", { until: "1942-11", note: "drowned crossing the Kumusi River, 18 November 1942" });
set("Homma", { until: "1946-04", note: "executed 3 April 1946" });
set("Ariizumi", { until: "1945-08", note: "suicide, 27 August 1945" });
set("Nagano", { until: "1947-01", note: "died in custody, 5 January 1947" });
set("Tojo", { until: "1948-12", note: "executed 23 December 1948" });
set("Umezu", { until: "1949-01", note: "died in prison, January 1949" });
set("Togo", { until: "1950-07", note: "died in prison, 1950", titlePeriods: [["1941-10", "1942-09"], ["1945-04", "1945-08"]] });
// Titles that depend on a post.
set("Matsuoka", { titlePeriods: [["1940-07", "1941-07"]], note: "Foreign Minister July 1940 to July 1941" });
set("Churchill", { titlePeriods: [["1940-05", "1945-07"]], note: "Prime Minister until the July 1945 election" });
set("Attlee", { titlePeriods: [["1945-07", "1951-10"]] });
set("Truman", { titlePeriods: [["1945-04", "1953-01"]] });
set("Suzuki", { titlePeriods: [["1945-04", "1945-08"]] });
set("Osmeña", { titlePeriods: [["1944-08", "1946-05"]], note: "President of the Commonwealth from Quezon's death, 1 August 1944" });
set("Hull", { titlePeriods: [["1933-03", "1944-11"]] });
set("Knox", { titlePeriods: [["1940-07", "1944-04"]], until: "1944-04", note: "Secretary of the Navy, died 28 April 1944" });
set("Biddle", { titlePeriods: [["1941-09", "1945-06"]] });
set("Grew", { titlePeriods: [["1932-06", "1941-12"], ["1944-12", "1945-08"]], note: "Ambassador to Japan until Pearl Harbor; Under Secretary of State from December 1944" });
set("Hurley", { titlePeriods: [["1940-01", "1945-11"]], note: "General, then Ambassador to China from November 1944" });
set("Sato", { titlePeriods: [["1942-03", "1945-08"]], note: "Ambassador to the USSR" });
set("Kawane", { note: "identity to confirm in the fact-check pass" });
set("Wainwright", {});
set("Yoshida", { note: "Ambassador to Britain 1936 to 1938; Prime Minister from 1946; no title is shown" });
set("Terauchi", { note: "General, Field Marshal from June 1943 (dated title in the game)" });
set("Stimson", { titlePeriods: [["1940-07", "1945-09"]] });
set("McCloy", { note: "Assistant Secretary of War: the title shown ('Sec.') is imprecise" });
fs.writeFileSync("tests/adviser-tenures.json", JSON.stringify({ _note: "Reviewed adviser tenures for tools/check-advisor-dates.mjs. Dates are year-month. Facts from memory of standard histories; confirm with sources (docs/WRITING.md, claims register).", anonymous: ["Bureau of Ordnance", "Sixth Army staff"], tenures: t }, null, 2) + "\n");
console.log(Object.keys(t).length + " entries");
