(function () {
  if (window.__sangeetInviteInit) return;
  window.__sangeetInviteInit = true;

  const TARGET = new Date("2026-10-30T20:00:00+05:30").getTime();

  // Initialize your custom audio here.
  const backgroundPath = new Audio('audio/Path.mp3');
  backgroundPath.loop = true;

  function init() {
    makePetals();
    startCountdown();
    bindMusic();
    bindStartOver();
  }

  function makePetals() {
    const root = document.querySelector("[data-petals]");
    if (!root || root.childElementCount) return;
    for (let i = 0; i < 16; i += 1) {
      const el = document.createElement("span");
      el.className = "petal";
      el.style.left = `${(i * 19 + 7) % 94}%`;
      el.style.setProperty("--delay", `${(i * 0.85) % 11}s`);
      el.style.setProperty("--dur", `${10 + (i % 6)}s`);
      el.style.setProperty("--drift", `${i % 2 === 0 ? 28 : -22}px`);
      el.style.transform = `scale(${0.7 + (i % 5) * 0.12})`;
      root.appendChild(el);
    }
  }

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function renderCountdown() {
    const remain = Math.max(0, TARGET - Date.now());
    const days = Math.floor(remain / 86_400_000);
    const hours = Math.floor((remain % 86_400_000) / 3_600_000);
    const minutes = Math.floor((remain % 3_600_000) / 60_000);
    const seconds = Math.floor((remain % 60_000) / 1000);
    const set = (unit, value) => {
      const node = document.querySelector(`[data-unit="${unit}"]`);
      if (node) node.textContent = pad(value);
    };
    set("days", days);
    set("hours", hours);
    set("minutes", minutes);
    set("seconds", seconds);
  }

  function startCountdown() {
    renderCountdown();
    window.setInterval(renderCountdown, 1000);
  }

  function bindMusic() {
    const btn = document.querySelector("[data-music]");
    if (!btn) return;
    let on = false;

    // Helper function to handle playing and updating the button UI
    function playMusic() {
      backgroundPath.play().then(() => {
        on = true;
        btn.classList.add("is-on");
        btn.setAttribute("aria-pressed", "true");
        btn.setAttribute("aria-label", "Mute invitation music");
      }).catch((err) => {
        console.warn("Autoplay blocked by browser. Awaiting user interaction.", err);
      });
    }

    // Handle button clicks
    btn.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent the body click listener from immediately refiring
      if (on) {
        backgroundPath.pause();
        on = false;
        btn.classList.remove("is-on");
        btn.setAttribute("aria-pressed", "false");
        btn.setAttribute("aria-label", "Play invitation music");
      } else {
        playMusic();
      }
    });

    // 1. Attempt to autoplay immediately on load
    playMusic();

    // 2. Fallback: Start music on the very first user interaction (click/tap) anywhere on the page
    document.body.addEventListener("click", function startOnFirstInteraction() {
      if (!on) {
        playMusic();
      }
      // Remove this listener after the first click so it doesn't run again
      document.body.removeEventListener("click", startOnFirstInteraction);
    }, { once: true });
  }

  function bindStartOver() {
    const btn = document.querySelector("[data-start-over]");
    if (!btn) return;
    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();