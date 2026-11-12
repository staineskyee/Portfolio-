const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const contactForm = document.querySelector("#contact-form");
const formFeedback = document.querySelector("#form-feedback");

// Dark mode is the default, matching the preferred mode in the questionnaire.
const savedTheme = localStorage.getItem("kye-portfolio-theme");
if (savedTheme === "light") {
  root.dataset.theme = "light";
  updateThemeButton(true);
} else {
  root.dataset.theme = "dark";
  updateThemeButton(false);
}

function updateThemeButton(isLight) {
  if (!themeToggle || !themeIcon) return;
  themeIcon.textContent = isLight ? "☾" : "☼";
  themeToggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
}

themeToggle?.addEventListener("click", () => {
  const isLight = root.dataset.theme !== "light";
  root.dataset.theme = isLight ? "light" : "dark";
  localStorage.setItem("kye-portfolio-theme", isLight ? "light" : "dark");
  updateThemeButton(isLight);
});

menuToggle?.addEventListener("click", () => {
  const isOpen = navLinks?.classList.toggle("open") ?? false;
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Open navigation menu");
  });
});

// Highlight the navigation link for the section currently in view.
const sections = document.querySelectorAll("main section[id]");
const navigationItems = document.querySelectorAll(".nav-links a");
if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navigationItems.forEach((link) => {
        const isCurrent = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("active", isCurrent);
      });
    });
  }, { rootMargin: "-35% 0px -55% 0px" });
  sections.forEach((section) => sectionObserver.observe(section));
}

// Reveal sections gently as they enter the viewport.
const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

// The form prepares an email in the visitor's default email application.
// It does not send or store messages because this portfolio has no backend.
contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;

  const formData = new FormData(contactForm);
  const name = String(formData.get("name")).trim();
  const email = String(formData.get("email")).trim();
  const message = String(formData.get("message")).trim();

  if (!name || !email || !message) {
    formFeedback.textContent = "Please complete all fields before preparing your email.";
    return;
  }

  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
  const mailtoUrl = `mailto:kyletimothystaines08@gmail.com?subject=${subject}&body=${body}`;

  formFeedback.textContent = "Your email app should open with the message details filled in. Review and send it from your email app.";
  window.location.href = mailtoUrl;
});

// Keep the copyright year current while using 2026 as the displayed starting year.
const yearElement = document.querySelector("#copyright-year");
if (yearElement) yearElement.textContent = String(Math.max(2026, new Date().getFullYear()));
