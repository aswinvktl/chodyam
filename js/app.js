/* =============================================================
   date-site — engine
   ============================================================= */

const state = { day: null, time: null, food: null, note: "" };
let currentScreen = "ask1";
let videoDone = false;

/* ---------- screen switching ---------- */
const screens = document.querySelectorAll(".screen");
function show(name) {
  currentScreen = name;

  screens.forEach(s => {
    if (s.dataset.screen === name) {
      s.classList.add("is-active");
    } else {
      s.classList.remove("is-active");
    }
  });
  window.scrollTo(0, 0);

  if (name === "ask1") runScreen1aSequence();
  if (name === "ask2") runScreen1bSequence();
  if (name === "afteryes") runYesSequence();
  
  updateNav();
}

/* ---------- Screen 1a Timing ---------- */
function runScreen1aSequence() {
  const arrow = document.getElementById("arrowReveal");
  arrow.classList.remove("show");
  setTimeout(() => {
    if (currentScreen === "ask1") arrow.classList.add("show");
  }, 1200);
}

/* ---------- Screen 1b Timed Sequence ---------- */
function runScreen1bSequence() {
  const punch = document.getElementById("seqPunch");
  const askText = document.getElementById("seqAsk");
  const buttons = document.getElementById("seqButtons");

  [punch, askText, buttons].forEach(el => el.classList.remove("show"));

  setTimeout(() => { if (currentScreen === "ask2") punch.classList.add("show"); }, 200);
  setTimeout(() => { if (currentScreen === "ask2") askText.classList.add("show"); }, 2200);
  setTimeout(() => { if (currentScreen === "ask2") buttons.classList.add("show"); }, 3800);
}

/* ---------- No Button Running Away + Pure Hover Cynthia Toggle ---------- */
const noBtn = document.getElementById("noBtn");
const cynthiaScare = document.getElementById("cynthiaScare");

function moveNoButton() {
  // Move the button securely away from the YES button grid path
  const moveX = (Math.random() * 120 + 60).toFixed(0); 
  const moveY = (Math.random() * 100 - 50).toFixed(0);
  noBtn.style.transform = `translate(${moveX}px, ${moveY}px)`;
}

noBtn.addEventListener("mouseenter", () => {
  cynthiaScare.classList.add("active"); // Show gif instantly on hover start
  moveNoButton();
});

noBtn.addEventListener("mouseleave", () => {
  cynthiaScare.classList.remove("active"); // Hide gif completely when cursor rolls off
});

// Touch fallback for mobile
noBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  cynthiaScare.classList.add("active");
  moveNoButton();
  setTimeout(() => { cynthiaScare.classList.remove("active"); }, 1000);
});

/* ---------- Yes Transition Trigger ---------- */
document.querySelector('[data-action="say-yes"]').addEventListener("click", () => {
  show("afteryes");
});

document.getElementById("startJourneyBtn").addEventListener("click", () => {
  show("ask2");
});

/* =============================================================
   CENTER EDGE NAVIGATION CONTROLLER
   ============================================================= */
const ORDER = ["ask1","ask2","afteryes","date","time","timeout","food","addask","reasons","summary"];
const NAV_HIDDEN_ON = ["ask1","summary","ask2"]; // Arrows stay hidden during initial jokes
const navBack = document.getElementById("navBack");
const navFwd  = document.getElementById("navFwd");

function forwardAllowed(screen) {
  switch (screen) {
    case "afteryes": return videoDone;   
    case "date": return !!state.day;     
    case "time": return !!state.time;
    case "food": return !!state.food;
    default:     return true;            
  }
}

function updateNav() {
  const hide = NAV_HIDDEN_ON.includes(currentScreen);
  navBack.hidden = hide;
  navFwd.hidden  = hide;
  if (hide) return;

  const i = ORDER.indexOf(currentScreen);
  navBack.disabled = (i <= 1);
  navFwd.disabled = !forwardAllowed(currentScreen);
}

navBack.addEventListener("click", () => {
  const i = ORDER.indexOf(currentScreen);
  if (i > 1) show(ORDER[i - 1]);
});
navFwd.addEventListener("click", () => {
  const i = ORDER.indexOf(currentScreen);
  if (i < ORDER.length - 1 && forwardAllowed(currentScreen)) {
    show(ORDER[i + 1]);
  }
});

// Kickoff
show("ask1");