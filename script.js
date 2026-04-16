const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const langToggle = document.getElementById("langToggle");
const themeToggle = document.getElementById("themeToggle");
const progressBar = document.getElementById("progressBar");
const body = document.body;

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });
}

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => navLinks.classList.remove("show"));
});

const revealElements = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
    }
  });
}, { threshold: 0.15 });

revealElements.forEach(el => observer.observe(el));

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  progressBar.style.width = progress + "%";
});

let currentLang = "en";

function switchLanguage(lang) {
  document.documentElement.lang = lang === "hi" ? "hi" : "en";
  document.querySelectorAll("[data-en]").forEach(el => {
    const value = el.getAttribute(`data-${lang}`);
    if (value !== null) el.textContent = value;
  });
  langToggle.textContent = lang === "en" ? "हिंदी" : "English";
  currentLang = lang;
  const activeTheme = body.getAttribute("data-theme") || "light";
  setTheme(activeTheme);
}

langToggle.addEventListener("click", () => {
  const nextLang = currentLang === "en" ? "hi" : "en";
  switchLanguage(nextLang);
});

function setTheme(theme) {
  body.setAttribute("data-theme", theme);
  const lang = currentLang || "en";
  const label = theme === "light"
    ? themeToggle.getAttribute(`data-light-${lang}`) || "🌙 Dark"
    : themeToggle.getAttribute(`data-dark-${lang}`) || "☀️ Light";
  themeToggle.textContent = label;
}

setTheme("light");

themeToggle.addEventListener("click", () => {
  const nextTheme = body.getAttribute("data-theme") === "light" ? "dark" : "light";
  setTheme(nextTheme);
});


document.querySelectorAll("[data-placeholder-en]").forEach(el => {
  const placeholderValue = el.getAttribute(`data-placeholder-${currentLang}`) || el.getAttribute("data-placeholder-en");
  if (placeholderValue) el.placeholder = placeholderValue;
});

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

function updatePlaceholders() {
  document.querySelectorAll("[data-placeholder-en]").forEach(el => {
    const placeholderValue = el.getAttribute(`data-placeholder-${currentLang}`) || el.getAttribute("data-placeholder-en");
    if (placeholderValue) el.placeholder = placeholderValue;
  });
}

const originalSwitchLanguage = switchLanguage;
switchLanguage = function(lang) {
  originalSwitchLanguage(lang);
  updatePlaceholders();
  if (formStatus && !formStatus.dataset.locked) {
    formStatus.textContent = "";
    formStatus.className = "form-status";
  }
};


if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !subject || !message) {
      formStatus.textContent = "Please fill all fields";
      formStatus.className = "form-status error";
      return;
    }

    formStatus.textContent = "Message sent successfully!";
    formStatus.className = "form-status success";

    contactForm.reset();
  });
}

updatePlaceholders();
