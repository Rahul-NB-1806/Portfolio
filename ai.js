(function () {
  "use strict";

  let analysis = null;

  function readImageAsBase64(url) {
    return fetch(url)
      .then((r) => r.blob())
      .then((blob) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const b64 = reader.result.split(",")[1];
            resolve(b64);
          };
          reader.readAsDataURL(blob);
        });
      });
  }

  function applyAnalysis(data) {
    analysis = data;

    const root = document.documentElement;
    const colors = data.colors || ["#c9a84c", "#dbb95c", "#a08030", "#0b0b0f", "#14141f"];
    const mood = data.mood || "calm";
    const anim = data.animation || {};
    const intensity = anim.intensity || 0.5;
    const speed = anim.speed || "medium";
    const particleCount = anim.particle_count || 60;
    const bgDir = anim.bg_gradient_direction || "to bottom";

    colors.forEach((c, i) => {
      root.style.setProperty(`--ai-color-${i + 1}`, c);
    });
    root.style.setProperty("--ai-mood", `"${mood}"`);
    root.style.setProperty("--ai-intensity", intensity);
    root.style.setProperty("--ai-particle-count", particleCount);
    root.style.setProperty("--ai-bg-direction", bgDir);

    const bgGrad = `linear-gradient(${bgDir}, ${colors.slice(0, 3).join(", ")})`;
    root.style.setProperty("--ai-bg-gradient", bgGrad);

    const speedMap = { slow: 60, medium: 30, fast: 15 };
    const interval = speedMap[speed] || 30;
    const amp = 0.3 + intensity * 0.7;

    const style = document.createElement("style");
    style.textContent = `
      .ai-ambient-bg {
        position: fixed;
        inset: 0;
        z-index: -1;
        background: var(--ai-bg-gradient, linear-gradient(135deg, #0a1628, #1a2a4a));
        opacity: ${0.15 + intensity * 0.25};
        animation: aiBreath ${interval}s ease-in-out infinite alternate;
      }
      @keyframes aiBreath {
        0% { filter: brightness(1) saturate(0.8); }
        100% { filter: brightness(${1 + amp * 0.3}) saturate(${0.8 + amp * 0.4}); }
      }
      .ai-glow {
        box-shadow: 0 0 ${10 + intensity * 30}px var(--ai-color-1, #c9a84c),
                    0 0 ${20 + intensity * 40}px var(--ai-color-2, #dbb95c);
        transition: box-shadow 2s ease-in-out;
        animation: aiPulse ${interval * 0.5}s ease-in-out infinite alternate;
      }
      @keyframes aiPulse {
        0% { box-shadow: 0 0 ${10 + intensity * 15}px var(--ai-color-1); }
        100% { box-shadow: 0 0 ${20 + intensity * 35}px var(--ai-color-2); }
      }
      .hero-title .highlight {
        background: linear-gradient(135deg, var(--ai-color-1), var(--ai-color-2));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      .hero-title .highlight::after {
        content: "";
        display: block;
        height: 3px;
        width: 0;
        background: linear-gradient(90deg, var(--ai-color-1), var(--ai-color-2));
        transition: width 1.5s ease;
        margin-top: 4px;
      }
      .hero-title .highlight.revealed::after {
        width: 100%;
      }
    `;
    document.head.appendChild(style);

    const ambient = document.createElement("div");
    ambient.className = "ai-ambient-bg";
    document.body.prepend(ambient);

    const sections = document.querySelectorAll(".section");
    sections.forEach((s) => {
      s.classList.add("ai-glow");
    });

    const hl = document.querySelector(".hero-title .highlight");
    if (hl) {
      setTimeout(() => hl.classList.add("revealed"), 300);
    }

    upgradeParticles(colors, particleCount, intensity, speed);
  }

  function upgradeParticles(colors, count, intensity, speed) {
    const canvas = document.getElementById("particles-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const speedFactor = { slow: 0.3, medium: 1, fast: 2 }[speed] || 1;

    let pts = [];
    const n = Math.min(count, 80);

    for (let i = 0; i < n; i++) {
      pts.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.15 * speedFactor * intensity,
        vy: (Math.random() * 0.12 + 0.04) * speedFactor * intensity,
        size: Math.random() * 3 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.15 + 0.05,
        phase: Math.random() * Math.PI * 2,
      });
    }

    function hexToRgba(hex, a) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r},${g},${b},${a})`;
    }

    let frame;
    let last = 0;
    const fps = 30;
    const interval = 1000 / fps;

    function draw(t) {
      if (t - last < interval) { frame = requestAnimationFrame(draw); return; }
      last = t;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of pts) {
        p.x += p.vx + Math.sin(t * 0.001 + p.phase) * 0.02 * intensity;
        p.y += p.vy;
        if (p.y > canvas.height) { p.y = 0; p.x = Math.random() * canvas.width; }
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba(p.color, p.alpha);
        ctx.fill();
      }

      frame = requestAnimationFrame(draw);
    }

    if (window.__aiParticleFrame) cancelAnimationFrame(window.__aiParticleFrame);
    frame = requestAnimationFrame(draw);
    window.__aiParticleFrame = frame;
    window.__aiParticles = pts;
  }

  function init() {
    const imgPath = "./image1.jpeg";
    readImageAsBase64(imgPath)
      .then((b64) => {
        return fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: b64 }),
        });
      })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        applyAnalysis(data);
      })
      .catch((err) => {
        console.warn("AI analysis unavailable, using defaults:", err.message);
        applyAnalysis({
          colors: ["#c9a84c", "#dbb95c", "#a08030", "#0b0b0f", "#14141f"],
          mood: "warm",
          style_adjectives: ["editorial", "refined", "luxe"],
          objects: ["person", "desk"],
          animation: { intensity: 0.4, speed: "medium", particle_count: 60, bg_gradient_direction: "to bottom" },
        });
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
