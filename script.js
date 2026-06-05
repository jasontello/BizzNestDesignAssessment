const menuButton = document.querySelector(".menu-button");
const siteNav = document.querySelector(".site-nav");
const modal = document.querySelector(".project-modal");
const modalTitle = document.querySelector("#modal-title");
const modalClose = document.querySelector(".modal-close");
const codeRainCanvas = document.querySelector(".code-rain-canvas");

menuButton?.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll("[data-project]").forEach((button) => {
  button.addEventListener("click", () => {
    modalTitle.textContent = button.dataset.project;
    modal.showModal();
  });
});

modalClose?.addEventListener("click", () => modal.close());

const mobileNavQuery = window.matchMedia("(max-width: 559px)");

function closeDropdown(dropdown) {
  dropdown.classList.remove("is-open");
  dropdown.querySelector(".nav-trigger")?.setAttribute("aria-expanded", "false");
}

function closeOtherDropdowns(activeDropdown) {
  document.querySelectorAll(".nav-dropdown.is-open").forEach((openDropdown) => {
    if (openDropdown !== activeDropdown) {
      closeDropdown(openDropdown);
    }
  });
}

document.querySelectorAll(".nav-dropdown").forEach((dropdown) => {
  const trigger = dropdown.querySelector(".nav-trigger");

  dropdown.addEventListener("mouseenter", () => {
    if (!mobileNavQuery.matches) {
      closeOtherDropdowns(dropdown);
      trigger?.setAttribute("aria-expanded", "true");
    }
  });

  dropdown.addEventListener("mouseleave", () => {
    if (!mobileNavQuery.matches) {
      trigger?.setAttribute("aria-expanded", "false");
    }
  });

  dropdown.addEventListener("focusin", () => {
    closeOtherDropdowns(dropdown);
    trigger?.setAttribute("aria-expanded", "true");
  });

  dropdown.addEventListener("focusout", (event) => {
    if (!dropdown.contains(event.relatedTarget)) {
      trigger?.setAttribute("aria-expanded", "false");
    }
  });
});

document.querySelectorAll(".nav-trigger").forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    if (!mobileNavQuery.matches) {
      return;
    }

    const dropdown = trigger.closest(".nav-dropdown");
    const isOpen = dropdown.classList.contains("is-open");

    closeOtherDropdowns(dropdown);

    dropdown.classList.toggle("is-open", !isOpen);
    trigger.setAttribute("aria-expanded", String(!isOpen));
    event.stopPropagation();
  });
});

document.addEventListener("click", () => {
  document.querySelectorAll(".nav-dropdown.is-open").forEach((dropdown) => {
    closeDropdown(dropdown);
  });
});

function initCodeRain(canvas) {
  const context = canvas.getContext("2d");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const characters = "01{}<>/\\[]#+=_OSJSANJOSETECHCIVICDATA".split("");
  const columnWidth = 22;
  let columns = [];
  let animationFrame = null;
  let frame = 0;

  function resize() {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * pixelRatio);
    canvas.height = Math.floor(window.innerHeight * pixelRatio);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const columnCount = Math.ceil(window.innerWidth / columnWidth);
    columns = Array.from({ length: columnCount }, (_, index) => ({
      x: index * columnWidth,
      y: Math.random() * -window.innerHeight,
      speed: 0.8 + Math.random() * 1.8,
      length: 7 + Math.floor(Math.random() * 15),
      alpha: 0.08 + Math.random() * 0.14,
    }));
  }

  function drawColumn(column) {
    for (let i = 0; i < column.length; i += 1) {
      const character = characters[Math.floor(Math.random() * characters.length)];
      const y = column.y - i * 22;
      const fade = 1 - i / column.length;
      const isLead = i === 0;

      context.fillStyle = isLead
        ? `rgba(245, 252, 255, ${column.alpha * 1.2})`
        : `rgba(57, 159, 211, ${column.alpha * fade})`;
      context.fillText(character, column.x, y);
    }
  }

  function draw({ animate }) {
    context.fillStyle = "rgba(34, 34, 34, 0.22)";
    context.fillRect(0, 0, window.innerWidth, window.innerHeight);
    context.font = "16px 'Roboto Mono', monospace";
    context.textAlign = "center";
    context.textBaseline = "top";

    columns.forEach((column) => {
      drawColumn(column);

      if (animate) {
        column.y += column.speed;
        if (column.y - column.length * 22 > window.innerHeight) {
          column.y = Math.random() * -260;
          column.speed = 0.8 + Math.random() * 1.8;
          column.length = 7 + Math.floor(Math.random() * 15);
          column.alpha = 0.08 + Math.random() * 0.14;
        }
      }
    });
  }

  function tick() {
    frame += 1;
    if (frame % 2 === 0) {
      draw({ animate: true });
    }
    animationFrame = window.requestAnimationFrame(tick);
  }

  function start() {
    window.cancelAnimationFrame(animationFrame);
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    resize();

    if (prefersReducedMotion.matches) {
      draw({ animate: false });
      return;
    }

    tick();
  }

  window.addEventListener("resize", start);
  prefersReducedMotion.addEventListener("change", start);
  start();
}

if (codeRainCanvas) {
  initCodeRain(codeRainCanvas);
}
