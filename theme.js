(function () {
  const STORAGE_KEY = "theme";

  function getPreferredTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);

    const btn = document.getElementById("theme-toggle");
    if (btn) {
      btn.setAttribute("aria-label", `Switch to ${next === "dark" ? "light" : "dark"} mode`);
    }
  }

  applyTheme(getPreferredTheme());

  window.addEventListener("DOMContentLoaded", function () {
    const btn = document.getElementById("theme-toggle");
    if (btn) {
      btn.addEventListener("click", toggleTheme);
    }
  });

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? "dark" : "light");
    }
  });
})();
