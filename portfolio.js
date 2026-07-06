(function () {
  "use strict";

  // ===== Typing Effect =====
  const typingEl = document.getElementById("typing-text");
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingTimeout;

  function typeRole() {
    if (!typingEl) return;
    const currentRole = CONFIG.roles[roleIndex];

    if (!isDeleting) {
      typingEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === currentRole.length) {
        typingTimeout = setTimeout(function () {
          isDeleting = true;
          typeRole();
        }, 2000);
        return;
      }
      typingTimeout = setTimeout(typeRole, 80);
    } else {
      typingEl.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % CONFIG.roles.length;
        typingTimeout = setTimeout(typeRole, 400);
        return;
      }
      typingTimeout = setTimeout(typeRole, 30);
    }
  }

  if (typingEl) {
    typingTimeout = setTimeout(typeRole, 600);
  }

  // ===== Intersection Observer for Scroll Animations =====
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  function createObserver(elements, className, stagger) {
    stagger = stagger || 0;
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const delay =
            stagger > 0
              ? Array.from(elements).indexOf(entry.target) * stagger
              : 0;
          setTimeout(function () {
            entry.target.classList.add(className);
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ===== Scroll Progress =====
  const progressBar = document.getElementById("scroll-progress");

  window.addEventListener("scroll", function () {
    const totalHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = progress + "%";
  });

  // ===== Navbar Shrink =====
  const navbar = document.getElementById("navbar");

  window.addEventListener("scroll", function () {
    if (navbar) {
      if (window.scrollY > 80) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    }
  });

  // ===== Render About =====
  const aboutText = document.getElementById("about-text");
  if (aboutText) {
    aboutText.textContent =
      CONFIG.aboutMe ||
      "I'm a full-stack developer who loves building products at the intersection of thoughtful design and solid engineering.";
  }

  // ===== Render Skills =====
  const skillsContainer = document.getElementById("skills-container");
  if (skillsContainer) {
    const categories = {};
    CONFIG.skills.forEach(function (s) {
      if (!categories[s.category]) categories[s.category] = [];
      categories[s.category].push(s);
    });

    const categoryKeys = Object.keys(categories);
    const allCards = [];

    categoryKeys.forEach(function (cat) {
      const section = document.createElement("div");
      section.className = "skills-category";

      const label = document.createElement("div");
      label.className = "skills-category-label";
      label.textContent = cat;
      section.appendChild(label);

      const grid = document.createElement("div");
      grid.className = "skills-grid";

      categories[cat].forEach(function (skill) {
        const card = document.createElement("div");
        card.className = "skill-card";
        card.innerHTML =
          '<div class="skill-icon">' +
          skill.icon +
          '</div><div class="skill-name">' +
          skill.name +
          "</div>";
        grid.appendChild(card);
        allCards.push(card);
      });

      section.appendChild(grid);
      skillsContainer.appendChild(section);
    });

    if (allCards.length) createObserver(allCards, "visible", 40);
  }

  // ===== Render Projects =====
  const projectsGrid = document.getElementById("projects-grid");
  const projectModalOverlay = document.createElement("div");
  projectModalOverlay.className = "modal-overlay";
  projectModalOverlay.id = "project-modal";
  projectModalOverlay.innerHTML =
    '<div class="modal-content"><button class="modal-close" id="project-modal-close">✕</button><div id="project-modal-body"></div></div>';
  document.body.appendChild(projectModalOverlay);

  if (projectsGrid) {
    const colors = [
      "linear-gradient(135deg, #667eea, #764ba2)",
      "linear-gradient(135deg, #f093fb, #f5576c)",
      "linear-gradient(135deg, #4facfe, #00f2fe)",
      "linear-gradient(135deg, #43e97b, #38f9d7)",
      "linear-gradient(135deg, #fa709a, #fee140)",
    ];

    const allProjectCards = [];

    CONFIG.projects.forEach(function (proj, i) {
      const card = document.createElement("div");
      card.className = "project-card";
      card.style.transitionDelay = i * 0.08 + "s";
      card.innerHTML =
        '<div class="project-banner" style="background:' +
        colors[i % colors.length] +
        '">' +
        (proj.image
          ? '<img src="' + proj.image + '" alt="' + proj.title + '">'
          : "📁") +
        '</div><div class="project-body"><h3 class="project-title">' +
        proj.title +
        '</h3><p class="project-desc">' +
        proj.description +
        '</p><div class="project-tech">' +
        proj.tech
          .map(function (t) {
            return '<span class="project-tech-tag">' + t + "</span>";
          })
          .join("") +
        '</div><div class="project-actions"><a href="' +
        proj.github +
        '" target="_blank" rel="noopener">View Source →</a><a href="' +
        proj.live +
        '" target="_blank" rel="noopener">Live Demo →</a></div></div>';

      card.addEventListener("click", function () {
        openProjectModal(proj);
      });

      projectsGrid.appendChild(card);
      allProjectCards.push(card);
    });

    if (allProjectCards.length) createObserver(allProjectCards, "visible", 80);
  }

  function openProjectModal(proj) {
    const body = document.getElementById("project-modal-body");
    if (body) {
      body.innerHTML =
        '<h2 class="modal-title">' +
        proj.title +
        '</h2><div class="modal-body"><p>' +
        proj.description +
        '</p><h4>Features</h4><ul>' +
        (proj.features || [])
          .map(function (f) {
            return "<li>" + f + "</li>";
          })
          .join("") +
        '</ul><h4>Challenges</h4><ul>' +
        (proj.challenges || [])
          .map(function (c) {
            return "<li>" + c + "</li>";
          })
          .join("") +
        '</ul><h4>Tech Stack</h4><div class="project-tech" style="margin-top:8px">' +
        proj.tech
          .map(function (t) {
            return '<span class="project-tech-tag">' + t + "</span>";
          })
          .join("") +
        '</div><div class="project-actions" style="margin-top:16px"><a href="' +
        proj.github +
        '" target="_blank" rel="noopener">Source Code →</a><a href="' +
        proj.live +
        '" target="_blank" rel="noopener">Live Demo →</a></div></div>';
    }
    projectModalOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  document
    .getElementById("project-modal-close")
    .addEventListener("click", function () {
      projectModalOverlay.classList.remove("active");
      document.body.style.overflow = "";
    });

  projectModalOverlay.addEventListener("click", function (e) {
    if (e.target === projectModalOverlay) {
      projectModalOverlay.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  // ===== Render Experience =====
  const timeline = document.getElementById("timeline");
  const timelineItems = [];

  if (timeline && CONFIG.experience) {
    CONFIG.experience.forEach(function (exp, i) {
      const item = document.createElement("div");
      item.className = "timeline-item";
      item.innerHTML =
        '<div class="timeline-dot"></div><div class="timeline-period">' +
        exp.period +
        '</div><div class="timeline-role">' +
        exp.role +
        '</div><div class="timeline-company">' +
        exp.company +
        '</div><ul class="timeline-highlights">' +
        exp.highlights
          .map(function (h) {
            return "<li>" + h + "</li>";
          })
          .join("") +
        "</ul>";
      timeline.appendChild(item);
      timelineItems.push(item);
    });

    const timelineObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            timeline.classList.add("visible");
            timelineItems.forEach(function (item, i) {
              setTimeout(function () {
                item.classList.add("visible");
              }, i * 150);
            });
            timelineObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    timelineObserver.observe(timeline);
  }

  // ===== Render Education =====
  const eduGrid = document.getElementById("edu-grid");
  const eduCards = [];

  if (eduGrid && CONFIG.education) {
    CONFIG.education.forEach(function (edu, i) {
      const card = document.createElement("div");
      card.className = "edu-card";
      card.style.transitionDelay = i * 0.1 + "s";
      card.innerHTML =
        '<div class="edu-icon">🎓</div><div class="edu-info"><div class="edu-period">' +
        edu.period +
        '</div><div class="edu-degree">' +
        edu.degree +
        '</div><div class="edu-institution">' +
        edu.institution +
        (edu.gpa ? " • GPA: " + edu.gpa : "") +
        '</div><div class="edu-highlights">' +
        (edu.highlights || [])
          .map(function (h) {
            return '<span class="edu-highlight-tag">' + h + "</span>";
          })
          .join("") +
        "</div></div>";
      eduGrid.appendChild(card);
      eduCards.push(card);
    });

    if (eduCards.length) createObserver(eduCards, "visible", 100);
  }

  // ===== Render Certifications =====
  const certGrid = document.getElementById("cert-grid");
  const certCards = [];

  if (certGrid && CONFIG.certifications) {
    CONFIG.certifications.forEach(function (cert, i) {
      const card = document.createElement("div");
      card.className = "cert-card";
      card.style.transitionDelay = i * 0.08 + "s";
      card.innerHTML =
        '<div class="cert-icon">🏅</div><div class="cert-name">' +
        cert.name +
        '</div><div class="cert-issuer">' +
        cert.issuer +
        '</div><div class="cert-year">' +
        cert.year +
        "</div>";
      certGrid.appendChild(card);
      certCards.push(card);
    });

    if (certCards.length) createObserver(certCards, "visible", 60);
  }

  // ===== Render LinkedIn =====
  const liName = document.getElementById("li-name");
  const liTitle = document.getElementById("li-title");
  if (liName) liName.textContent = CONFIG.name;
  if (liTitle) liTitle.textContent = CONFIG.title;

  // ===== Render Contact Info =====
  const contactEmail = document.getElementById("contact-email");
  const contactPhone = document.getElementById("contact-phone");
  const contactLocation = document.getElementById("contact-location");
  if (contactEmail) contactEmail.textContent = CONFIG.email;
  if (contactPhone) contactPhone.textContent = CONFIG.phone;
  if (contactLocation) contactLocation.textContent = CONFIG.location;

  // ===== Contact Form =====
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("form-name");
      const email = document.getElementById("form-email");
      const subject = document.getElementById("form-subject");
      const message = document.getElementById("form-message");
      const submitBtn = document.getElementById("form-submit");

      let valid = true;

      [name, email, subject, message].forEach(function (field) {
        const errorEl = document.getElementById(
          "form-" + field.id.replace("form-", "") + "-error"
        );
        if (!field.value.trim()) {
          field.classList.add("error");
          if (errorEl) errorEl.classList.add("visible");
          valid = false;
        } else {
          field.classList.remove("error");
          if (errorEl) errorEl.classList.remove("visible");
        }
      });

      if (
        email.value.trim() &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
      ) {
        email.classList.add("error");
        document.getElementById("form-email-error").classList.add("visible");
        valid = false;
      }

      if (!valid) return;

      submitBtn.classList.add("loading");
      submitBtn.disabled = true;

      setTimeout(function () {
        submitBtn.classList.remove("loading");
        submitBtn.classList.add("success");
        submitBtn.querySelector(".btn-text").textContent = "Message Sent ✓";
        contactForm.reset();

        setTimeout(function () {
          submitBtn.classList.remove("success");
          submitBtn.querySelector(".btn-text").textContent = "Send Message";
          submitBtn.disabled = false;
        }, 3000);
      }, 1500);
    });
  }

  // ===== Mobile: skip desk scene, show portfolio directly =====
  if (window.innerWidth < 768) {
    const ds = document.getElementById("desk-scene");
    if (ds) ds.style.display = "none";
    const pf = document.getElementById("portfolio");
    if (pf) {
      pf.style.display = "block";
      pf.classList.add("visible");
    }
    document.body.style.overflow = "auto";
  }

  // ===== Theme toggle icon =====
  const themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) {
    function updateThemeIcon() {
      const theme = document.documentElement.getAttribute("data-theme");
      themeBtn.textContent = theme === "dark" ? "⊙" : "✦";
    }

    updateThemeIcon();

    const observer = new MutationObserver(function () {
      updateThemeIcon();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
  }
})();
