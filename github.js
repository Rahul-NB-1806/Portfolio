(function () {
  "use strict";

  const container = document.getElementById("github-container");
  const contribContainer = document.getElementById("contribution-container");
  const langContainer = document.getElementById("language-container");

  if (!container) return;

  container.innerHTML = '<div class="github-loading">Loading repositories...</div>';

  fetch("https://api.github.com/users/" + CONFIG.github + "/repos?sort=updated&per_page=10")
    .then(function (res) {
      if (!res.ok) throw new Error("GitHub API error: " + res.status);
      return res.json();
    })
    .then(function (repos) {
      container.innerHTML = "";
      renderRepos(repos);

      // Language breakdown
      const langMap = {};
      repos.forEach(function (repo) {
        if (repo.language) {
          langMap[repo.language] = (langMap[repo.language] || 0) + 1;
        }
      });
      renderLanguageChart(langMap);

      // Contribution graph
      renderContributionGraph();
    })
    .catch(function (err) {
      container.innerHTML =
        '<div class="github-error">⚠ Unable to load repositories. GitHub API rate limit may be exceeded.</div>';
    });

  function renderRepos(repos) {
    repos.sort(function (a, b) {
      return b.stargazers_count - a.stargazers_count;
    });

    const grid = document.createElement("div");
    grid.className = "github-grid";

    repos.forEach(function (repo) {
      const card = document.createElement("a");
      card.href = repo.html_url;
      card.target = "_blank";
      card.rel = "noopener";
      card.className = "github-card";
      card.style.textDecoration = "none";
      card.style.display = "block";

      const langColor = getLangColor(repo.language);

      card.innerHTML =
        '<div class="github-card-header"><span class="github-repo-name">' +
        repo.name +
        '</span></div><div class="github-repo-desc">' +
        (repo.description || "No description") +
        '</div><div class="github-repo-meta"><span><span class="github-lang-dot" style="background:' +
        langColor +
        '"></span>' +
        (repo.language || "N/A") +
        '</span><span>★ ' +
        repo.stargazers_count +
        '</span><span>⑂ ' +
        repo.forks_count +
        "</span></div>";

      grid.appendChild(card);
    });

    container.appendChild(grid);
  }

  function renderLanguageChart(langMap) {
    if (!langContainer) return;

    const total = Object.values(langMap).reduce(function (a, b) {
      return a + b;
    }, 0);
    if (total === 0) return;

    const sorted = Object.entries(langMap).sort(function (a, b) {
      return b[1] - a[1];
    });

    const colors = [
      "#f1e05a", "#3178c6", "#2b7489", "#f34b7d", "#563d7c",
      "#e34c26", "#178600", "#b07219", "#3c873a", "#701516",
    ];

    const wrap = document.createElement("div");
    wrap.className = "language-chart-wrap";

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 120 120");
    svg.setAttribute("class", "language-donut");

    const cx = 60,
      cy = 60,
      r = 48;
    let currentAngle = -90;

    sorted.forEach(function (entry, i) {
      const lang = entry[0];
      const count = entry[1];
      const pct = count / total;
      const angle = pct * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;

      const x1 = cx + r * Math.cos((startAngle * Math.PI) / 180);
      const y1 = cy + r * Math.sin((startAngle * Math.PI) / 180);
      const x2 = cx + r * Math.cos((endAngle * Math.PI) / 180);
      const y2 = cy + r * Math.sin((endAngle * Math.PI) / 180);
      const largeArc = angle > 180 ? 1 : 0;

      const path = document.createElementNS(svgNS, "path");
      path.setAttribute(
        "d",
        "M " +
          cx +
          " " +
          cy +
          " L " +
          x1 +
          " " +
          y1 +
          " A " +
          r +
          " " +
          r +
          " 0 " +
          largeArc +
          " 1 " +
          x2 +
          " " +
          y2 +
          " Z"
      );
      path.setAttribute("fill", colors[i % colors.length]);
      path.setAttribute("opacity", "0.85");
      svg.appendChild(path);

      currentAngle = endAngle;
    });

    // Center hole
    const circle = document.createElementNS(svgNS, "circle");
    circle.setAttribute("cx", cx);
    circle.setAttribute("cy", cy);
    circle.setAttribute("r", "28");
    circle.setAttribute("fill", "var(--bg)");
    svg.appendChild(circle);

    wrap.appendChild(svg);

    // Legend
    const legend = document.createElement("div");
    legend.className = "language-legend";

    sorted.forEach(function (entry, i) {
      const item = document.createElement("div");
      item.className = "lang-legend-item";
      item.innerHTML =
        '<span class="lang-legend-dot" style="background:' +
        colors[i % colors.length] +
        '"></span><span>' +
        entry[0] +
        " (" +
        Math.round((entry[1] / total) * 100) +
        "%)</span>";
      legend.appendChild(item);
    });

    wrap.appendChild(legend);
    langContainer.innerHTML = "";
    langContainer.appendChild(wrap);
  }

  function renderContributionGraph() {
    if (!contribContainer) return;

    const wrap = document.createElement("div");
    wrap.className = "contribution-graph";
    wrap.innerHTML = "<h3>Contribution Activity</h3>";

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("class", "contribution-svg");
    svg.setAttribute("viewBox", "0 0 720 100");

    // Generate mock contribution data
    const cols = 50;
    const cellW = 13;
    const cellH = 13;
    const gap = 2;

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < 5; r++) {
        const val = Math.random();
        let fill;
        if (val > 0.8) fill = "#216e39";
        else if (val > 0.6) fill = "#30a14e";
        else if (val > 0.4) fill = "#40c463";
        else if (val > 0.2) fill = "#9be9a8";
        else fill = "#ebedf0";

        const rect = document.createElementNS(svgNS, "rect");
        rect.setAttribute("x", c * (cellW + gap) + 4);
        rect.setAttribute("y", r * (cellH + gap) + 4);
        rect.setAttribute("width", cellW);
        rect.setAttribute("height", cellH);
        rect.setAttribute("rx", "2");
        rect.setAttribute("fill", fill);
        rect.setAttribute("opacity", "0");

        // Staggered fade-in
        const delay = (c * 5 + r * 3) * 10;
        setTimeout(function () {
          rect.setAttribute("opacity", "1");
        }, delay + 500);

        svg.appendChild(rect);
      }
    }

    wrap.appendChild(svg);
    contribContainer.appendChild(wrap);
  }

  function getLangColor(lang) {
    const colors = {
      JavaScript: "#f1e05a",
      TypeScript: "#3178c6",
      Python: "#3572a5",
      Java: "#b07219",
      CSS: "#563d7c",
      HTML: "#e34c26",
      Ruby: "#701516",
      Go: "#00add8",
      Rust: "#dea584",
      "C++": "#f34b7d",
      C: "#555555",
    };
    return colors[lang] || "#6e6e73";
  }
})();
