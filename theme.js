(function () {
  const STORAGE_KEY = "theme";

  function getPreferredTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
    return "dark";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.content = theme === "dark" ? "#0b0b0f" : "#f8f6f0";
    }
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
})();
