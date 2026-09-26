// EDITAR: número de WhatsApp (código país + número, sin + ni espacios) e Instagram.
const CONFIG = {
  whatsapp: "56948869995",
  instagram: "https://www.instagram.com/clubfamachicureo/",
};

// Horario: [apertura, cierre] en minutos desde medianoche; índice 0 = domingo.
const HOURS = [
  [540, 840], [390, 1320], [390, 1320], [390, 1320], [390, 1320], [390, 1260], [540, 960],
];

document.querySelectorAll(".js-wa").forEach((a) => {
  const msg = encodeURIComponent(a.dataset.msg || "Hola Club Fama!");
  a.href = `https://wa.me/${CONFIG.whatsapp}?text=${msg}`;
  a.target = "_blank";
  a.rel = "noopener";
});
document.querySelectorAll(".js-ig").forEach((a) => {
  a.href = CONFIG.instagram;
  a.target = "_blank";
  a.rel = "noopener";
});

document.getElementById("year").textContent = new Date().getFullYear();

const nav = document.querySelector(".nav");
const onScroll = () => nav.classList.toggle("is-solid", window.scrollY > 40);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

const toggle = document.querySelector(".nav__toggle");
const menu = document.getElementById("menu");
const setMenu = (open) => {
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  menu.classList.toggle("is-open", open);
};
toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
menu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

// Estado "abierto ahora" según hora de Chile.
(() => {
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Santiago" }));
  const day = now.getDay();
  const mins = now.getHours() * 60 + now.getMinutes();
  const [open, close] = HOURS[day];
  const fmt = (m) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`;
  const el = document.getElementById("today");
  document.querySelector(`.hours tr[data-day="${day}"]`)?.classList.add("is-today");
  if (mins >= open && mins < close) {
    el.textContent = `Abierto ahora · cierra a las ${fmt(close)}`;
  } else {
    el.style.setProperty("--dot", "#8a8f98");
    el.textContent = mins < open ? `Cerrado · abre hoy a las ${fmt(open)}` : "Cerrado · vuelve mañana";
  }
})();

// Carrusel de testimonios.
(() => {
  const quotes = [...document.querySelectorAll(".quote")];
  const dots = document.querySelector(".dots");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let i = 0;
  let timer;
  const show = (n) => {
    i = (n + quotes.length) % quotes.length;
    quotes.forEach((q, k) => q.classList.toggle("is-active", k === i));
    [...dots.children].forEach((d, k) => d.setAttribute("aria-selected", String(k === i)));
  };
  quotes.forEach((_, k) => {
    const b = document.createElement("button");
    b.setAttribute("role", "tab");
    b.setAttribute("aria-label", `Testimonio ${k + 1}`);
    b.addEventListener("click", () => { show(k); stop(); });
    dots.append(b);
  });
  document.querySelectorAll(".slider__btn").forEach((b) =>
    b.addEventListener("click", () => { show(i + Number(b.dataset.dir)); stop(); })
  );
  const stop = () => clearInterval(timer);
  if (!reduce) {
    timer = setInterval(() => show(i + 1), 6000);
    const slider = document.querySelector(".slider");
    slider.addEventListener("focusin", stop);
    slider.addEventListener("mouseenter", stop);
  }
  show(0);
})();

// Aparición suave al hacer scroll.
(() => {
  const els = document.querySelectorAll(".head, .step, .card, .plan, .coach, .gallery img, .ubi__grid > *");
  if (!("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
    });
  }, { rootMargin: "0px 0px -8% 0px" });
  els.forEach((el, k) => {
    el.classList.add("reveal");
    el.style.transitionDelay = `${(k % 3) * 60}ms`;
    io.observe(el);
  });
})();
