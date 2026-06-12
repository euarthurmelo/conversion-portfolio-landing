const body = document.body;
const progress = document.querySelector("[data-scroll-progress]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const reelFrame = document.querySelector("[data-reel-frame]");
const reelToggles = Array.from(document.querySelectorAll("[data-reel-toggle]"));
const projectPreview = document.querySelector("[data-project-preview]");
const projectRows = Array.from(document.querySelectorAll("[data-project-row]"));
const form = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");
const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const canAnimate = () => !reduceMotionQuery.matches;

const previewClasses = ["preview-a", "preview-b", "preview-c", "preview-d", "preview-e", "preview-f"];
const previewData = {
  aura: {
    count: "01/06",
    title: "Clinica Aura",
    copy: "LP premium para transformar trafego frio em agendamento com narrativa, prova e formulario curto.",
    tag: "Saude",
    stack: ["LP", "Copy", "Ads-ready"],
    tone: "preview-a",
  },
  forma: {
    count: "02/06",
    title: "Studio Forma",
    copy: "Website visual para servico local parecer maior, mais confiavel e mais facil de escolher.",
    tag: "Fitness",
    stack: ["Website", "Mobile", "CTA"],
    tone: "preview-b",
  },
  atlas: {
    count: "03/06",
    title: "Atlas Mentoria",
    copy: "Pagina de oferta com conteudo, autoridade e objecoes tratadas antes da conversa comercial.",
    tag: "Info",
    stack: ["Oferta", "Funil", "Copy"],
    tone: "preview-c",
  },
  pulse: {
    count: "04/06",
    title: "Pulse SaaS",
    copy: "Site de produto com demo visual, beneficios claros e caminho direto para qualificacao.",
    tag: "SaaS",
    stack: ["Produto", "Demo", "Lead"],
    tone: "preview-d",
  },
  bastos: {
    count: "05/06",
    title: "Bastos Advocacia",
    copy: "Presenca digital seria, humana e objetiva para gerar contato sem parecer template juridico.",
    tag: "Juridico",
    stack: ["Institucional", "SEO", "Contato"],
    tone: "preview-e",
  },
  traffic: {
    count: "06/06",
    title: "Trafego Ready Kit",
    copy: "Pagina ja preparada para campanha, pixel, eventos, UTM, criativos e leitura de conversao.",
    tag: "Performance",
    stack: ["Pixel", "UTM", "CRO"],
    tone: "preview-f",
  },
};

function updateScrollProgress() {
  if (!progress) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const value = max > 0 ? window.scrollY / max : 0;
  progress.style.transform = `scaleX(${Math.min(Math.max(value, 0), 1)})`;
}

function setupScrollReveal() {
  const revealItems = Array.from(
    document.querySelectorAll(
      ".section-head, .proof-card, .work-board, .project-row, .manifesto h2, .manifesto-aside, .services-sticky, .service-item, .timeline-step, .ai-card, .faq-item, .contact-copy, .contact-form, .showreel-frame"
    )
  );

  revealItems.forEach((item, index) => {
    item.classList.add("reveal");
    item.style.setProperty("--reveal-delay", `${(index % 6) * 65}ms`);

    if (item.matches(".section-head, .manifesto h2, .services-sticky, .contact-copy")) {
      item.classList.add("reveal-left");
    }

    if (item.matches(".work-board, .contact-form, .showreel-frame")) {
      item.classList.add("reveal-scale");
    }
  });

  if (!canAnimate() || location.hash || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  body.classList.add("motion-ready");

  const revealVisibleNow = () => {
    revealItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.96 && rect.bottom > 0;
      if (inView) item.classList.add("is-visible");
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.14,
    }
  );

  revealItems.forEach((item) => observer.observe(item));
  revealVisibleNow();
  window.addEventListener("load", revealVisibleNow, { once: true });
  window.addEventListener("hashchange", revealVisibleNow);
  setTimeout(revealVisibleNow, 250);
  setTimeout(revealVisibleNow, 900);
}

const floatItems = Array.from(
  document.querySelectorAll(".panel-preview, .showreel-frame, .project-preview, .service-note, .ai-card")
).map((element, index) => ({
  element,
  speed: [-0.055, 0.035, -0.045, 0.028, -0.025][index] || 0.03,
}));

function updateScrollFloat() {
  if (!canAnimate()) return;

  floatItems.forEach(({ element, speed }) => {
    const rect = element.getBoundingClientRect();
    const centerOffset = window.innerHeight / 2 - (rect.top + rect.height / 2);
    const y = Math.max(Math.min(centerOffset * speed, 38), -38);
    element.classList.add("scroll-float");
    element.style.setProperty("--float-y", `${y.toFixed(2)}px`);
  });
}

function setMenu(open) {
  body.classList.toggle("menu-open", open);
  mobileMenu?.classList.toggle("is-open", open);
  menuToggle?.setAttribute("aria-expanded", String(open));
}

function setProject(slug) {
  const data = previewData[slug];
  if (!data || !projectPreview) return;

  previewClasses.forEach((className) => projectPreview.classList.remove(className));
  projectPreview.classList.add(data.tone);

  const count = projectPreview.querySelector("[data-preview-count]");
  const title = projectPreview.querySelector("[data-preview-title]");
  const copy = projectPreview.querySelector("[data-preview-copy]");
  const tag = projectPreview.querySelector("[data-preview-tag]");
  const stack = projectPreview.querySelector("[data-preview-stack]");

  if (count) count.textContent = data.count;
  if (title) title.textContent = data.title;
  if (copy) copy.textContent = data.copy;
  if (tag) tag.textContent = data.tag;
  if (stack) {
    stack.innerHTML = data.stack.map((item) => `<span>${item}</span>`).join("");
  }

  projectRows.forEach((row) => {
    const active = row.dataset.projectRow === slug;
    row.classList.toggle("is-active", active);
    row.setAttribute("aria-pressed", String(active));
  });
}

function setupAccordion(selector) {
  const items = Array.from(document.querySelectorAll(selector));

  const setPanel = (item, open, immediate = false) => {
    const trigger = item.querySelector("button");
    const content = item.querySelector(".service-content, .faq-content");
    if (!trigger || !content) return;

    trigger.setAttribute("aria-expanded", String(open));
    content.setAttribute("aria-hidden", String(!open));

    if (open) {
      item.classList.add("is-open");
      content.style.height = content.style.height === "auto" ? `${content.scrollHeight}px` : content.style.height;
      const targetHeight = content.scrollHeight;

      if (immediate) {
        content.style.height = "auto";
        return;
      }

      requestAnimationFrame(() => {
        content.style.height = `${targetHeight}px`;
      });

      content.addEventListener(
        "transitionend",
        (event) => {
          if (event.propertyName === "height" && item.classList.contains("is-open")) {
            content.style.height = "auto";
          }
        },
        { once: true }
      );
      return;
    }

    const currentHeight = content.scrollHeight;
    content.style.height = `${currentHeight}px`;
    content.offsetHeight;
    item.classList.remove("is-open");

    if (immediate) {
      content.style.height = "0px";
      return;
    }

    requestAnimationFrame(() => {
      content.style.height = "0px";
    });
  };

  items.forEach((item, index) => {
    const trigger = item.querySelector("button");
    if (!trigger) return;

    setPanel(item, item.classList.contains("is-open"), true);

    trigger.addEventListener("click", () => {
      const group = items.filter((candidate) => candidate.parentElement === item.parentElement);
      const shouldOpen = !item.classList.contains("is-open");

      group.forEach((candidate) => {
        if (candidate !== item) setPanel(candidate, false);
      });

      if (!shouldOpen) {
        setPanel(item, false);
        return;
      }

      setPanel(item, true);
    });
  });
}

function updateClocks() {
  const clocks = Array.from(document.querySelectorAll("[data-clock]"));
  if (!clocks.length) return;

  clocks.forEach((clock) => {
    const zone = clock.dataset.clock;
    try {
      clock.textContent = new Intl.DateTimeFormat("pt-BR", {
        timeZone: zone,
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date());
    } catch {
      clock.textContent = "--:--";
    }
  });
}

let scrollTicking = false;

function updateScrollMotion() {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(() => {
    updateScrollProgress();
    updateScrollFloat();
    scrollTicking = false;
  });
}

window.addEventListener("scroll", updateScrollMotion, { passive: true });
window.addEventListener("resize", updateScrollMotion);
updateScrollMotion();
setupScrollReveal();

menuToggle?.addEventListener("click", () => {
  setMenu(!body.classList.contains("menu-open"));
});

mobileMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});

reelToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    if (!reelFrame) return;
    const paused = reelFrame.classList.toggle("is-reel-paused");
    reelToggles.forEach((item) => {
      item.setAttribute("aria-pressed", String(!paused));
      item.setAttribute("aria-label", paused ? "Retomar showreel" : "Pausar showreel");
    });
  });
});

projectRows.forEach((row) => {
  const activate = () => setProject(row.dataset.projectRow);
  row.addEventListener("click", activate);
  row.addEventListener("mouseenter", activate);
  row.addEventListener("focus", activate);
});

setupAccordion("[data-service-item]");
setupAccordion("[data-faq-item]");

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!formStatus) return;
  const name = new FormData(form).get("name");
  const greeting = name ? `${name}, briefing recebido.` : "Briefing recebido.";
  formStatus.textContent = `${greeting} No deploy, esse formulario pode ir para WhatsApp, email ou CRM.`;
  form.reset();
});

updateClocks();
setInterval(updateClocks, 30_000);
