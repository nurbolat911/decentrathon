// Landing: keep the reader's place when switching RU and EN, and remember the language for the demo.
// The page works in full without this script; the language links are plain links.
(function () {
  "use strict";
  const KEY = "redstring.landing.place";

  try {
    localStorage.setItem("redstring.lang", document.documentElement.lang);
  } catch (_) {}

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
