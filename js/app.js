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

  // Trigger setup for Screen 1a
  if (name === "ask1") {
    runScreen1aSequence();
  }

  // Trigger delayed timeline for Screen 1b
  if (name === "ask2") {
    runScreen1bSequence();
  }

  if (name === "afteryes") runYesSequence();
  updateNav();
}

/* ---------- Screen 1a Timing Setup ---------- */
function runScreen1aSequence() {
  const arrow = document.getElementById("arrowReveal");
  arrow.classList.remove("show");
  // The arrow button gracefully drops in after 1.2 seconds
  setTimeout(() => {
    if (currentScreen === "ask1") arrow.classList.add("show");
  }, 1200);
}

/* ---------- Screen 1b Timed Beats Sequence ---------- */
function runScreen1bSequence() {
  const punch = document.getElementById("seqPunch");
  const askText = document.getElementById("seqAsk");
  const buttons = document.getElementById("seqButtons");

  // Reset states
  [punch, askText, buttons].forEach(el => el.classList.remove("show"));

  // Beat 1: Drop the punchline immediately
  setTimeout(() => {
    if (currentScreen === "ask2") punch.classList.add("show");
  }, 200);

  // Beat 2: The structural pause, then drop "can i have one with you?"
  setTimeout(() => {
    if (currentScreen === "ask2") askText.classList.add("show");
  }, 2200);

  // Beat 3: The decision row drops in right after
  setTimeout(() => {
    if (currentScreen === "ask2") buttons.classList.add("show");
  }, 3800);
}

/* ---------- No Button Run Away Logic + Cynthia Scare Popup ---------- */
const noBtn = document.getElementById("noBtn");
const cynthiaScare = document.getElementById("cynthiaScare");

function handleNoInteraction(e) {
  // 1. Activate full screen borderless center Cynthia jump-scare pop-up
  cynthiaScare.classList.add("active");

  // 2. Safely translate button away without ever overlapping YES button lane
  // Confines movement vector strictly to the outer right/bottom zone
  const moveX = (Math.random() * 120 + 60).toFixed(0); 
  const moveY = (Math.random() * 100 - 50).toFixed(0);
  
  noBtn.style.transform = `translate(${moveX}px, ${moveY}px)`;
}

noBtn.addEventListener("mouseover", handleNoInteraction);
noBtn.addEventListener("click", (e) => {
  e.preventDefault();
  handleNoInteraction();
});

// Dismiss Cynthia popup overlay the millisecond she stops hovering away from the 'No' option
noBtn.addEventListener("mouseleave", () => {
  cynthiaScare.classList.remove("active");
});

/* ---------- Confetti Pop Handler ---------- */
function popConfetti() {
  if (window.confetti) {
    confetti({ particleCount: 120, spread: 75, origin: { y: 0.6 } });
  }
}

document.querySelector('[data-action="say-yes"]').addEventListener("click", () => {
  popConfetti();
  show("afteryes");
});

/* ---------- Screen Transition Listeners ---------- */
document.getElementById("startJourneyBtn").addEventListener("click", () => {
  show("ask2");
});

/* ---------- Navigation Array Flow Guards ---------- */
const ORDER = ["ask1","ask2","afteryes","date","time","timeout","food","addask","reasons","summary"];
const NAV_HIDDEN_ON = ["ask1","summary","ask2"]; // Keep bottom nav out of the main jokes
const navBack = document.getElementById("navBack");
const navFwd  = document.getElementById("navFwd");

function updateNav() {
  const hide = NAV_HIDDEN_ON.includes(currentScreen);
  navBack.hidden = hide;
  navFwd.hidden  = hide;
  if (hide) return;

  const i = ORDER.indexOf(currentScreen);
  navBack.disabled = (i <= 1);
  navFwd.disabled = !videoDone && currentScreen === "afteryes";
}

// Initial Kickoff
show("ask1");