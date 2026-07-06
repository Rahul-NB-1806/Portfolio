(function () {
  "use strict";

  var deskScene = document.getElementById("desk-scene");
  var portfolio = document.getElementById("portfolio");
  var particlesCanvas = document.getElementById("particles-canvas");
  var hotspotsContainer = document.getElementById("hotspots-container");
  var resumeViewer = document.getElementById("resume-viewer");

  var isTransitioning = false;
  var resumeAnimating = false;
  var activeHotspot = null;

  // ===== Four-corner positions =====
  // Resume: scaled from Paint coords (1533×772) to actual image (1535×1024)
  // Lapinset-block-start: estimated screen area
  var objects = [
    {
      name: "resume",
      action: "resume",
      corners: [
        { x: 19.0, y: 36.9 },
        { x: 40.6, y: 37.3 },
        { x: 14.0, y: 96.8 },
        { x: 42.0, y: 94.7 }
      ]
    },
    {
      name: "laptop screen",
      action: "laptop",
      corners: [
        { x: 57, y: 22 },
        { x: 85, y: 22 },
        { x: 85, y: 60 },
        { x: 57, y: 60 }
      ]
    }
  ];

  // ===== Point-in-polygon test (ray casting) =====
  function pointInPolygon(px, py, polygon) {
    var inside = false;
    var n = polygon.length;
    for (var i = 0, j = n - 1; i < n; j = i++) {
      var xi = polygon[i].x, yi = polygon[i].y;
      var xj = polygon[j].x, yj = polygon[j].y;
      if ((yi > py) !== (yj > py) &&
          px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) {
        inside = !inside;
      }
    }
    return inside;
  }

  // ===== Build bounding box from corners =====
  function getBounds(corners) {
    var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (var i = 0; i < corners.length; i++) {
      if (corners[i].x < minX) minX = corners[i].x;
      if (corners[i].y < minY) minY = corners[i].y;
      if (corners[i].x > maxX) maxX = corners[i].x;
      if (corners[i].y > maxY) maxY = corners[i].y;
    }
    return { minX: minX, minY: minY, maxX: maxX, maxY: maxY };
  }

  // ===== Create hotspot elements =====
  function createHotspots() {
    if (!hotspotsContainer) return;
    hotspotsContainer.innerHTML = "";

    for (var i = 0; i < objects.length; i++) {
      var obj = objects[i];
      var bounds = getBounds(obj.corners);

      var el = document.createElement("div");
      el.className = "hotspot hotspot--" + obj.action;
      el.dataset.action = obj.action;
      el.setAttribute("role", "button");
      el.setAttribute("tabindex", "0");
      el.setAttribute("aria-label", "Open " + obj.name);

      el.style.left = bounds.minX + "%";
      el.style.top = bounds.minY + "%";
      el.style.width = (bounds.maxX - bounds.minX) + "%";
      el.style.height = (bounds.maxY - bounds.minY) + "%";

      var polyPoints = obj.corners.map(function (c) {
        return (c.x - bounds.minX) + "% " + (c.y - bounds.minY) + "%";
      }).join(", ");
      el.style.clipPath = "polygon(" + polyPoints + ")";

      var label = document.createElement("span");
      label.className = "hotspot-label";
      label.textContent = obj.action === "laptop" ? "Open Portfolio →" : "View Resume →";
      el.appendChild(label);

      obj.el = el;
      el.objData = obj;
      hotspotsContainer.appendChild(el);
    }
  }

  // ===== Mouse position tracking (as percentages) =====
  var mousePctX = 0, mousePctY = 0;

  document.addEventListener("mousemove", function (e) {
    mousePctX = (e.clientX / window.innerWidth) * 100;
    mousePctY = (e.clientY / window.innerHeight) * 100;

    // Track parallax
    var x = (e.clientX / window.innerWidth - 0.5) * 2;
    var y = (e.clientY / window.innerHeight - 0.5) * 2;
    document.documentElement.style.setProperty("--mouse-x", x);
    document.documentElement.style.setProperty("--mouse-y", y);

    if (deskScene && !deskScene.classList.contains("transitioning")) {
      deskScene.style.backgroundPosition = (50 + x * 3) + "% " + (50 + y * 2) + "%";
    }

    // Check which hotspot the mouse is inside
    var found = null;
    for (var i = 0; i < objects.length; i++) {
      if (pointInPolygon(mousePctX, mousePctY, objects[i].corners)) {
        found = objects[i];
        break;
      }
    }

    if (found !== activeHotspot) {
      if (activeHotspot && activeHotspot.el) {
        activeHotspot.el.classList.remove("hotspot--active");
      }
      activeHotspot = found;
      if (activeHotspot && activeHotspot.el) {
        activeHotspot.el.classList.add("hotspot--active");
      }
    }
  });

  // ===== Click handler via event delegation =====
  document.addEventListener("click", function (e) {
    if (isTransitioning || resumeAnimating) return;
    var pctX = (e.clientX / window.innerWidth) * 100;
    var pctY = (e.clientY / window.innerHeight) * 100;

    for (var i = 0; i < objects.length; i++) {
      if (pointInPolygon(pctX, pctY, objects[i].corners)) {
        if (objects[i].action === "laptop") {
          triggerTransition();
        } else if (objects[i].action === "resume") {
          animateResumeToCenter(objects[i].el);
        }
        return;
      }
    }
  });

  // ===== Keyboard support =====
  document.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && activeHotspot) {
      if (activeHotspot.action === "laptop") {
        triggerTransition();
      } else if (activeHotspot.action === "resume") {
        animateResumeToCenter(activeHotspot.el);
      }
    }
  });

  // ===== Resume click → animate to center =====
  function animateResumeToCenter(el) {
    if (resumeAnimating) return;
    resumeAnimating = true;

    el.style.transition = "all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)";
    el.style.left = "50%";
    el.style.top = "50%";
    el.style.width = "50%";
    el.style.height = "80%";
    el.style.transform = "translate(-50%, -50%) scale(2.4)";
    el.style.zIndex = "100";
    el.style.clipPath = "none";
    el.style.borderStyle = "solid";
    el.style.borderColor = "rgba(201, 168, 76, 0.5)";
    el.style.background = "rgba(201, 168, 76, 0.08)";
    el.style.backdropFilter = "blur(4px)";
    el.style.boxShadow = "0 0 80px rgba(201, 168, 76, 0.2), 0 0 200px rgba(0,0,0,0.5)";
    el.classList.add("hotspot--expanded");

    el.querySelector(".hotspot-label").textContent = "Opening...";

    var overlay = document.createElement("div");
    overlay.className = "hotspot-overlay";
    document.body.appendChild(overlay);
    requestAnimationFrame(function () {
      overlay.classList.add("active");
    });

    setTimeout(function () {
      el.style.transition = "";
      el.style.left = "";
      el.style.top = "";
      el.style.width = "";
      el.style.height = "";
      el.style.transform = "";
      el.style.zIndex = "";
      el.style.clipPath = "";
      el.style.borderStyle = "";
      el.style.borderColor = "";
      el.style.background = "";
      el.style.backdropFilter = "";
      el.style.boxShadow = "";
      el.classList.remove("hotspot--expanded");
      el.querySelector(".hotspot-label").textContent = "View Resume →";

      overlay.remove();
      resumeAnimating = false;

      openResumeViewer();
    }, 900);
  }

  // ===== Laptop → Portfolio Transition =====
  function triggerTransition() {
    if (isTransitioning) return;
    isTransitioning = true;

    deskScene.classList.add("transitioning");
    deskScene.style.transition =
      "transform 1.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease";
    deskScene.style.transform =
      "perspective(1200px) rotateX(4deg) scale(7) translateY(-3%)";
    deskScene.style.opacity = "0";
    deskScene.style.filter = "brightness(0)";

    var overlay = document.createElement("div");
    overlay.className = "hotspot-overlay portfolio-overlay";
    overlay.style.background = "var(--bg, #0b0b0f)";
    overlay.style.backdropFilter = "none";
    overlay.style.zIndex = "20";
    document.body.appendChild(overlay);
    requestAnimationFrame(function () { overlay.classList.add("active"); });

    setTimeout(function () {
      deskScene.style.display = "none";
      overlay.remove();
      portfolio.style.display = "block";
      requestAnimationFrame(function () {
        portfolio.classList.add("visible", "portfolio-enter");
        document.body.style.overflow = "auto";
      });
    }, 1200);
  }

  // ===== Resume Viewer =====
  function openResumeViewer() {
    if (!resumeViewer) return;
    resumeViewer.classList.add("active");
    document.body.style.overflow = "hidden";

    var viewerFrame = resumeViewer.querySelector(".resume-frame");
    if (viewerFrame && !viewerFrame.querySelector("iframe")) {
      var loading = viewerFrame.querySelector(".resume-frame-loading");
      var iframe = document.createElement("iframe");
      iframe.src = CONFIG.resumeUrl;
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.border = "none";
      iframe.style.borderRadius = "4px";
      iframe.style.position = "absolute";
      iframe.style.inset = "0";
      iframe.style.zIndex = "1";
      iframe.onload = function () { if (loading) loading.style.display = "none"; };
      viewerFrame.appendChild(iframe);
    }
  }

  // ===== Close Resume Viewer =====
  document.addEventListener("click", function (e) {
    if (resumeViewer && resumeViewer.classList.contains("active")) {
      var closeBtn = resumeViewer.querySelector(".resume-viewer-close");
      var content = resumeViewer.querySelector(".resume-viewer-content");
      if ((closeBtn && closeBtn.contains(e.target)) || (content && !content.contains(e.target))) {
        resumeViewer.classList.remove("active");
        document.body.style.overflow = "";
      }
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && resumeViewer && resumeViewer.classList.contains("active")) {
      resumeViewer.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("resume-download-btn")) {
      var link = document.createElement("a");
      link.href = CONFIG.resumeUrl;
      link.download = "Rahul_Resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  });

  // ===== Particles =====
  (function initParticles() {
    if (!particlesCanvas) return;
    var ctx = particlesCanvas.getContext("2d");
    particlesCanvas.width = window.innerWidth;
    particlesCanvas.height = window.innerHeight;

    var count = Math.min(60, Math.floor((window.innerWidth * window.innerHeight) / 20000));
    var pts = [];
    for (var i = 0; i < count; i++) {
      pts.push({
        x: Math.random() * particlesCanvas.width,
        y: Math.random() * particlesCanvas.height,
        vx: (Math.random() - 0.5) * 0.1,
        vy: Math.random() * 0.08 + 0.03,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.1 + 0.04,
      });
    }

    var last = 0, fps = 30, interval = 1000 / fps;
    function draw(t) {
      if (t - last < interval) { requestAnimationFrame(draw); return; }
      last = t;
      ctx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
      for (var p = 0; p < pts.length; p++) {
        var pt = pts[p];
        pt.x += pt.vx;
        pt.y += pt.vy;
        if (pt.y > particlesCanvas.height) { pt.y = 0; pt.x = Math.random() * particlesCanvas.width; }
        if (pt.x < 0) pt.x = particlesCanvas.width;
        if (pt.x > particlesCanvas.width) pt.x = 0;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, " + pt.opacity + ")";
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);

    window.addEventListener("resize", function () {
      particlesCanvas.width = window.innerWidth;
      particlesCanvas.height = window.innerHeight;
    });
  })();

  // ===== Init =====
  createHotspots();

  // ===== Hero data =====
  document.getElementById("hero-name").textContent = CONFIG.name;
  document.getElementById("hero-desc").textContent = CONFIG.aboutMe;

  var resumeDownloadBtn = document.querySelector('.btn-primary[download]');
  if (resumeDownloadBtn) {
    resumeDownloadBtn.addEventListener("click", function (e) {
      var link = document.createElement("a");
      link.href = CONFIG.resumeUrl;
      link.download = "Rahul_Resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }
})();
