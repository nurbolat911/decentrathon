// Landing: replays the agent run when "How it works" scrolls into view, keeps the reader's place
// when switching RU and EN, and remembers the language for the demo.
// The page reads in full without this script: the run log is hidden only once the script is running.
(function () {
  "use strict";
  const KEY = "redstring.landing.place";
  const root = document.documentElement;

  try {
    localStorage.setItem("redstring.lang", root.lang);
  } catch (_) {}

  // Agent run: number the calls in order, then show them one by one the first time the block is seen.
  const run = document.querySelector(".run");
  if (run && "IntersectionObserver" in window) {
    run.querySelectorAll(".calls li").forEach((li, i) => li.style.setProperty("--i", i));
    root.classList.add("js");
    const seen = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        run.classList.add("is-in");
        seen.disconnect();
      },
      { threshold: 0.35 }
    );
    seen.observe(run);
  }

  document.querySelectorAll(".lang a[hreflang]").forEach((a) => {
    a.addEventListener("click", () => {
      if (a.getAttribute("aria-current")) return;
      const marks = [...document.querySelectorAll("main > section")];
      let at = marks[0];
      for (const s of marks) if (s.getBoundingClientRect().top <= 80) at = s;
      const id = at.id || "";
      const dy = id ? -at.getBoundingClientRect().top : window.scrollY;
      try {
        sessionStorage.setItem(KEY, JSON.stringify({ id, dy }));
      } catch (_) {}
    });
  });

  let place = null;
  try {
    place = JSON.parse(sessionStorage.getItem(KEY) || "null");
    sessionStorage.removeItem(KEY);
  } catch (_) {}
  if (place) {
    const el = place.id && document.getElementById(place.id);
    const top = el ? el.getBoundingClientRect().top + window.scrollY + place.dy : place.dy;
    window.scrollTo(0, Math.max(0, top));
  }
})();
