(() => {
  "use strict";

  const root = document.documentElement;
  const header = document.querySelector(".site-header");
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  const themeButton = document.querySelector(".theme-toggle");
  const form = document.querySelector("#contact-form");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }

  /* Theme */
  function storedTheme() {
    try { return localStorage.getItem("hash-tech-theme"); }
    catch { return null; }
  }
  function saveTheme(value) {
    try { localStorage.setItem("hash-tech-theme", value); }
    catch { /* Storage can be unavailable. */ }
  }
  function applyTheme(value) {
    root.dataset.theme = value;
    if (themeButton) {
      const isDark = value === "dark";
      themeButton.setAttribute("aria-pressed", String(isDark));
      themeButton.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} mode`);
    }
  }
  applyTheme(storedTheme() === "dark" ? "dark" : "light");
  themeButton?.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(next);
    saveTheme(next);
  });

  /* Mobile menu */
  function setMenu(open) {
    if (!header || !menuButton) return;
    header.classList.toggle("menu-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
  }
  menuButton?.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    setMenu(open);
    if (open) nav?.querySelector("a")?.focus();
  });
  nav?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      const href = link.getAttribute("href");
      const destination = href?.startsWith("#") ? document.querySelector(href) : null;
      setMenu(false);
      if (destination && window.matchMedia("(max-width: 1029px)").matches) {
        destination.setAttribute("tabindex", "-1");
        destination.focus({ preventScroll: true });
      }
    });
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && header?.classList.contains("menu-open")) {
      setMenu(false);
      menuButton?.focus();
    }
  });
  document.addEventListener("click", event => {
    if (header?.classList.contains("menu-open") && !header.contains(event.target)) setMenu(false);
  });
  window.matchMedia("(min-width: 1030px)").addEventListener("change", event => {
    if (event.matches) setMenu(false);
  });

  /* Reveal animations */
  if ("IntersectionObserver" in window && !reduceMotion.matches) {
    root.classList.add("js-ready");
    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          activeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -22px 0px" });
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
  }

  /* Scroll progress */
  const progress = document.querySelector(".scroll-progress");
  const navLinks = [...document.querySelectorAll(".main-nav a[href^='#']")];
  let scrollFrame = false;
  function updateProgress() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const percentage = scrollable > 0 ? Math.min(100, window.scrollY / scrollable * 100) : 0;
    if (progress) progress.style.width = `${percentage}%`;
    scrollFrame = false;
  }
  window.addEventListener("scroll", () => {
    if (!scrollFrame) {
      scrollFrame = true;
      requestAnimationFrame(updateProgress);
    }
  }, { passive: true });
  window.addEventListener("resize", updateProgress, { passive: true });
  updateProgress();

  if ("IntersectionObserver" in window) {
    const currentSection = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          const active = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("active", active);
          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-20% 0px -65% 0px" });
    document.querySelectorAll("section[id]").forEach(section => currentSection.observe(section));
  }

  /* Custom cursor */
  const desktopPointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const dot = document.querySelector(".custom-cursor");
  const ring = document.querySelector(".custom-cursor-ring");
  if (desktopPointer.matches && !reduceMotion.matches && dot && ring) {
    let x = -100, y = -100, ringX = -100, ringY = -100;
    let pointerSeen = false;
    document.addEventListener("pointermove", event => {
      if (event.pointerType !== "mouse") return;
      x = event.clientX;
      y = event.clientY;
      if (!pointerSeen) {
        pointerSeen = true;
        ringX = x;
        ringY = y;
        document.body.classList.add("cursor-on");
      }
      dot.style.left = `${x}px`;
      dot.style.top = `${y}px`;
    }, { passive: true });
    function animateRing() {
      ringX += (x - ringX) * 0.2;
      ringY += (y - ringY) * 0.2;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
      requestAnimationFrame(animateRing);
    }
    animateRing();
    document.querySelectorAll("a, button, summary, input, select, textarea").forEach(el => {
      el.addEventListener("pointerenter", () => document.body.classList.add("cursor-hover"));
      el.addEventListener("pointerleave", () => document.body.classList.remove("cursor-hover"));
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Tab") document.body.classList.remove("cursor-on");
    });
    document.addEventListener("pointermove", event => {
      if (event.pointerType === "mouse" && pointerSeen) document.body.classList.add("cursor-on");
    }, { passive: true });
    document.addEventListener("mouseout", event => {
      if (!event.relatedTarget) document.body.classList.remove("cursor-on");
    });
  }

  /* Contact form: sends JSON to Vercel /api/contact.
     Set FORMSPREE_FORM_ID in Vercel environment variables; never put the ID here. */
  if (form) {
    const status = document.querySelector("#form-status");
    const submit = form.querySelector("button[type='submit']");
    const label = submit?.querySelector(".submit-label");

    function showStatus(message, state = "error") {
      if (!status) return;
      status.textContent = message;
      status.dataset.state = state;
    }

    form.addEventListener("submit", async event => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      if (submit) submit.disabled = true;
      if (label) label.textContent = "Sending...";
      showStatus("Sending your enquiry...", "sending");

      try {
        const payload = Object.fromEntries(new FormData(form).entries());
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(payload)
        });

        let result = {};
        try { result = await response.json(); } catch { /* Non-JSON error response. */ }

        if (!response.ok) {
          throw new Error(
            typeof result.error === "string"
              ? result.error
              : "The message could not be sent. Please try again or use WhatsApp."
          );
        }

        form.reset();
        showStatus(
          result.message || "Your enquiry has been sent. Thank you — I'll get back to you by email.",
          "success"
        );
      } catch (error) {
        console.error("Contact form submission failed:", error);
        showStatus(error.message || "The message could not be sent. Please use WhatsApp or email.");
      } finally {
        if (submit) submit.disabled = false;
        if (label) label.textContent = "Send enquiry";
      }
    });
  }

  const year = document.querySelector("#copyright-year");
  if (year) year.textContent = String(new Date().getFullYear());
})();