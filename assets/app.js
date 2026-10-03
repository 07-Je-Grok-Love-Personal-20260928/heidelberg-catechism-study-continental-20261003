/* Heidelberg Catechism Study — App Logic */
(function () {
  "use strict";

  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  const menuBtn = document.getElementById("menu-toggle");
  const appShell = document.getElementById("app-shell");
  const backTop = document.getElementById("back-top");
  const tocNav = document.getElementById("toc-nav");
  const tocSearch = document.getElementById("toc-search");
  const main = document.getElementById("main");

  const MQ_DESKTOP = window.matchMedia("(min-width: 901px)");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function scrollBehavior() {
    return reduceMotion ? "auto" : "smooth";
  }

  function buildToc() {
    if (!tocNav || !main) return;
    const headings = main.querySelectorAll("h2[id], h3[id]");
    const frag = document.createDocumentFragment();
    headings.forEach((h) => {
      const a = document.createElement("a");
      a.href = "#" + h.id;
      a.textContent = h.textContent.trim();
      a.dataset.target = h.id;
      if (h.tagName === "H3") a.classList.add("toc-h3");
      a.addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById(h.id)?.scrollIntoView({ behavior: scrollBehavior() });
        history.replaceState(null, "", "#" + h.id);
        if (!MQ_DESKTOP.matches) closeSidebar();
      });
      frag.appendChild(a);
    });
    tocNav.appendChild(frag);
  }

  function openSidebar() {
    sidebar?.classList.add("open");
    sidebar?.classList.remove("collapsed");
    overlay?.classList.add("show");
    overlay?.setAttribute("aria-hidden", "false");
    sidebar?.setAttribute("aria-hidden", "false");
    menuBtn?.setAttribute("aria-expanded", "true");
    if (MQ_DESKTOP.matches) {
      appShell?.classList.add("sidebar-visible");
      document.body.classList.remove("nav-open");
      document.body.style.overflow = "";
    } else {
      document.body.classList.add("nav-open");
      document.body.style.overflow = "hidden";
      try { document.getElementById("sidebar-close")?.focus({ preventScroll: true }); } catch (_) {}
    }
  }

  function closeSidebar() {
    sidebar?.classList.remove("open");
    overlay?.classList.remove("show");
    overlay?.setAttribute("aria-hidden", "true");
    menuBtn?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
    document.body.style.overflow = "";
    if (MQ_DESKTOP.matches) {
      sidebar?.classList.add("collapsed");
      appShell?.classList.remove("sidebar-visible");
    } else {
      sidebar?.setAttribute("aria-hidden", "true");
      try { menuBtn?.focus({ preventScroll: true }); } catch (_) {}
    }
  }

  function toggleSidebar() {
    if (MQ_DESKTOP.matches) {
      if (appShell?.classList.contains("sidebar-visible") && !sidebar?.classList.contains("collapsed")) {
        closeSidebar();
      } else {
        openSidebar();
      }
    } else {
      if (sidebar?.classList.contains("open")) closeSidebar();
      else openSidebar();
    }
  }

  function initSidebarState() {
    document.body.style.overflow = "";
    document.body.classList.remove("nav-open");
    if (MQ_DESKTOP.matches) {
      sidebar?.classList.add("open");
      sidebar?.classList.remove("collapsed");
      appShell?.classList.add("sidebar-visible");
      overlay?.classList.remove("show");
      menuBtn?.setAttribute("aria-expanded", "true");
    } else {
      sidebar?.classList.remove("open");
      sidebar?.setAttribute("aria-hidden", "true");
      appShell?.classList.remove("sidebar-visible");
      overlay?.classList.remove("show");
      overlay?.setAttribute("aria-hidden", "true");
      menuBtn?.setAttribute("aria-expanded", "false");
    }
  }

  menuBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSidebar();
  });
  overlay?.addEventListener("click", (e) => {
    e.preventDefault();
    closeSidebar();
  });
  document.getElementById("sidebar-close")?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeSidebar();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSidebar();
  });

  MQ_DESKTOP.addEventListener("change", initSidebarState);

  let touchStartX = 0;
  let touchStartY = 0;
  sidebar?.addEventListener("touchstart", (e) => {
    const t = e.changedTouches[0];
    touchStartX = t.screenX;
    touchStartY = t.screenY;
  }, { passive: true });
  sidebar?.addEventListener("touchend", (e) => {
    if (MQ_DESKTOP.matches || !sidebar.classList.contains("open")) return;
    const t = e.changedTouches[0];
    const dx = t.screenX - touchStartX;
    const dy = Math.abs(t.screenY - touchStartY);
    if (dx < -60 && dy < 80) closeSidebar();
  }, { passive: true });

  tocSearch?.addEventListener("input", () => {
    const q = tocSearch.value.trim().toLowerCase();
    tocNav?.querySelectorAll("a").forEach((a) => {
      const show = !q || a.textContent.toLowerCase().includes(q);
      a.style.display = show ? "" : "none";
    });
  });

  const headingEls = [];

  function onScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docH > 0 ? Math.min(100, (scrollTop / docH) * 100) : 0;
    document.documentElement.style.setProperty("--progress", pct + "%");

    if (backTop) {
      backTop.classList.toggle("show", scrollTop > 400);
    }

    if (!headingEls.length) return;
    const offset = (parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-h"), 10) || 64) + 24;
    let current = headingEls[0];
    for (const h of headingEls) {
      if (h.getBoundingClientRect().top <= offset) current = h;
      else break;
    }
    const id = current?.id;
    tocNav?.querySelectorAll("a").forEach((a) => {
      a.classList.toggle("active", a.dataset.target === id);
    });
  }

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });

  backTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: scrollBehavior() });
  });

  function setAllFolds(open) {
    document.querySelectorAll("details.fold").forEach((d) => { d.open = open; });
  }
  ["expand-all", "expand-all-hero"].forEach((id) => {
    document.getElementById(id)?.addEventListener("click", () => setAllFolds(true));
  });
  ["collapse-all", "collapse-all-hero"].forEach((id) => {
    document.getElementById(id)?.addEventListener("click", () => setAllFolds(false));
  });

  function scrollToHash() {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) setTimeout(() => el.scrollIntoView({ behavior: scrollBehavior() }), 120);
    }
  }

  function boot() {
    buildToc();
    headingEls.push(...main.querySelectorAll("h2[id], h3[id]"));
    initSidebarState();
    onScroll();
    scrollToHash();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
