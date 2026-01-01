// Inject shared header/footer into every page.
// Uses relative paths so it works on:
// - Custom domain root (harvyncommerce.com)
// - GitHub project pages (username.github.io/repo)
// - Local preview via VS Code Live Server

async function injectPartial(targetId, relativeUrl) {
  const el = document.getElementById(targetId);
  if (!el) return;

  // Build a URL relative to the current page location
  const url = new URL(relativeUrl, window.location.href);
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${relativeUrl}`);
  el.innerHTML = await res.text();
}

(async () => {
  try {
    await injectPartial("site-header", "partials/header.html");
    await injectPartial("site-footer", "partials/footer.html");

    // Highlight active nav link
    const current = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
    document.querySelectorAll("[data-nav]").forEach(a => {
      const href = (a.getAttribute("href") || "").toLowerCase();
      if (href === current) a.setAttribute("aria-current", "page");
    });

    // Mobile menu
    const menuBtn = document.querySelector("[data-menu-btn]");
    const navWrap = document.querySelector("[data-nav-wrap]");
    if (menuBtn && navWrap) {
      menuBtn.addEventListener("click", () => {
        navWrap.classList.toggle("open");
        menuBtn.setAttribute("aria-expanded", String(navWrap.classList.contains("open")));
      });
    }
  } catch (e) {
    console.error(e);
  }
})();
