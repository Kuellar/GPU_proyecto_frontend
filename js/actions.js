import { skyRequest } from "./request.js";

/**
 * Action taken by pressing "Search".
 */
const fetch_data = () => {
    // Set base data empty
    window.points = [];
    window.drawing_points = [];
    window.starfieldLoaded = false;
    window.pointsLoaded = false;
    window.triangulationLoaded = false;
    window.voidLoaded = false;
    window.edgesLoaded = false;
    window.edges = [];
    window.edgesInner = [];
    window.voidSets = [];
    window.voidSetsIdx = [];
    window.triangEdge = [];
    window.setArea = [];
    document.getElementById("est-points").textContent = 0;
    document.getElementById("est-triang").textContent = 0;
    document.getElementById("est-edges").textContent = 0;
    document.getElementById("est-edges-inner").textContent = 0;

    // Disable void
    document.getElementById("vis-void").setAttribute("disabled", "");
    document.getElementById("vis-void").checked = false;

    console.log("Fetching data");
    // Set waiting gif
    let waiting = document.getElementById("waiting");
    if (waiting.classList.contains("waiting-dots-hidden")) {
        waiting.classList.remove("waiting-dots-hidden");
        waiting.classList.add("waiting-dots-not-hidden");
    }
    const ra = Number(document.getElementById("ra").value);
    const dec = Number(document.getElementById("dec").value);
    const amp = Number(document.getElementById("amp").value) / 60;
    const type = document.getElementById("type-search-rec").checked; // True -> rectangular

    if (isNaN(ra) || ra < 0 || ra > 360) {
        alert("ERROR: RA " + ra);
        return;
    }

    if (isNaN(dec) || dec < -90 || dec > 90) {
        alert("ERROR: DEC " + dec);
        return;
    }

    if (isNaN(amp) || amp <= 0 || amp > 180) {
        alert("ERROR: Amplitud " + amp);
        return;
    }

    window.data = false;
    window.ra = ra;
    window.dec = dec;
    window.amp = amp;

    var query;
    if (type) {
        query = {
            min_ra: Math.max(ra - amp / 2, 0),
            max_ra: Math.min(ra + amp / 2, 360),
            min_dec: Math.max(dec - amp / 2, -90),
            max_dec: Math.min(dec + amp / 2, 90),
        };
    } else {
        query = {
            ra: Math.max(ra, 0),
            dec: Math.max(dec, -90),
            radius: (amp * 60) / 2,
        };
    }

    skyRequest(query, ra, dec, amp, type);
};
document.getElementById("search").addEventListener("click", fetch_data);

/**
 * Action taken by pressing toggler button.
 */
const change_menu = () => {
    const menu = document.getElementById("menu-section");
    const alternatorButton = document.getElementById("alternator");
    const alternatorIcon = document.getElementById("alternator-icon");
    if (menu.classList.contains("menu-section-init")) {
        menu.classList.remove("menu-section-init");
        menu.classList.add("menu-section-close");
        alternatorIcon.classList.add("alternator-icon-left");
        alternatorButton.classList.add("alternator-left");
    } else {
        menu.classList.toggle("menu-section-open");
        menu.classList.toggle("menu-section-close");
        alternatorIcon.classList.toggle("alternator-icon-right");
        alternatorIcon.classList.toggle("alternator-icon-left");
        alternatorButton.classList.toggle("alternator-right");
        alternatorButton.classList.toggle("alternator-left");
    }
};
document.getElementById("alternator").addEventListener("click", change_menu);
