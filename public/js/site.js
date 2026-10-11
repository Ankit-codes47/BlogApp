document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("nav-toggle");
  const siteNav = document.getElementById("site-navigation");

  if (navToggle && siteNav) {
    const setNavigationOpen = (isOpen) => {
      siteNav.classList.toggle("is-open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    };

    navToggle.addEventListener("click", () => {
      setNavigationOpen(navToggle.getAttribute("aria-expanded") !== "true");
    });

    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        setNavigationOpen(false);
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setNavigationOpen(false);
    });
  }

  document.querySelectorAll("[data-password-toggle]").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const input = document.getElementById(toggle.dataset.passwordToggle);
      if (!input) return;

      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";
      toggle.textContent = isPassword ? "Hide" : "Show";
      toggle.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
    });
  });

  document.querySelectorAll(".post-card__image, .article-gallery img").forEach((image) => {
    image.addEventListener("error", () => {
      const fallback = document.createElement("div");
      fallback.className = "post-image-placeholder";
      fallback.setAttribute("role", "img");
      fallback.setAttribute("aria-label", "Image unavailable");
      fallback.innerHTML = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.6"/><circle cx="8.5" cy="9" r="1.5" fill="currentColor"/><path d="m4 17 5-5 3 3 2-2 6 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      if (image.closest(".article-gallery")) fallback.classList.add("article-image-fallback");
      image.replaceWith(fallback);
    }, { once: true });
  });

  document.querySelectorAll("img.profile-avatar").forEach((image) => {
    image.addEventListener("error", () => {
      const fallback = document.createElement("div");
      fallback.className = "profile-avatar";
      fallback.setAttribute("role", "img");
      fallback.setAttribute("aria-label", image.alt || "Profile picture unavailable");
      fallback.textContent = image.dataset.fallback || "?";
      image.replaceWith(fallback);
    }, { once: true });
  });
});
