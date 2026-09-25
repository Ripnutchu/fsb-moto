document.addEventListener("DOMContentLoaded", () => {
  /* =========================================
     ELEMENTS
  ========================================== */

  const scrollContainer = document.querySelector(".page-scroll");

  const cards = Array.from(document.querySelectorAll(".scroll-card"));

  const header = document.querySelector("header");

  const hero = document.querySelector(".hero");

  const form = document.querySelector("form");

  /* =========================================
     SAFETY CHECK
  ========================================== */

  if (!scrollContainer || cards.length === 0) {
    return;
  }

  /* =========================================
     CARD INDEX
  ========================================== */

  cards.forEach((card, index) => {
    card.dataset.index = index;
  });

  /* =========================================
     SNAP CONFIGURATION
  ========================================== */

  /*
    Ovdje određujemo kako se svaka kartica
    ponaša kod snap scrolla.

    Normalne kartice:
      -> centriraju se u viewportu.

    Previsoke kartice:
      -> snapaju na početak.
  */

  function updateSnapBehavior() {
    const viewportHeight = scrollContainer.clientHeight;

    cards.forEach((card) => {
      /*
        Hero uvijek ostaje full-screen.
      */

      if (card === hero) {
        card.classList.remove("is-tall");

        card.style.scrollMarginTop = "0px";

        card.style.scrollMarginBottom = "0px";

        return;
      }

      const cardHeight = card.offsetHeight;

      /*
        Ako je kartica veća od viewporta,
        ne možemo je centrirati jer bi
        dio sadržaja mogao biti nedostupan.
      */

      if (cardHeight >= viewportHeight) {
        card.classList.add("is-tall");

        card.style.scrollMarginTop = "0px";

        card.style.scrollMarginBottom = "0px";

        return;
      }

      /*
        Kartica je kraća od viewporta.

        Želimo da bude u sredini.

        scroll-margin daje browseru
        dovoljno prostora da centriranje
        izgleda prirodno.
      */

      card.classList.remove("is-tall");

      const freeSpace = viewportHeight - cardHeight;

      /*
        Pola praznog prostora ide gore,
        pola dolje.

        Tako se kartica centrira.
      */

      const margin = Math.max(0, freeSpace / 2);

      card.style.scrollMarginTop = `${margin}px`;

      card.style.scrollMarginBottom = `${margin}px`;
    });
  }

  /* =========================================
     ACTIVE CARD
  ========================================== */

  function updateCards() {
    const containerRect = scrollContainer.getBoundingClientRect();

    const containerCenter = containerRect.top + containerRect.height / 2;

    let closestCard = null;

    let closestDistance = Infinity;

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();

      const cardCenter = rect.top + rect.height / 2;

      /*
        Za normalne kartice gledamo
        udaljenost centra.

        Za tall kartice također koristimo
        centar za određivanje aktivne kartice,
        ali snap ponašanje ostaje start.
      */

      const distance = Math.abs(containerCenter - cardCenter);

      if (distance < closestDistance) {
        closestDistance = distance;

        closestCard = card;
      }
    });

    if (!closestCard) {
      return;
    }

    const activeIndex = Number(closestCard.dataset.index);

    /* -----------------------------------------
       CARD CLASSES
    ----------------------------------------- */

    cards.forEach((card, index) => {
      card.classList.remove("is-active", "is-before", "is-after");

      /*
          HERO
        */

      if (card === hero) {
        card.classList.add(
          index === activeIndex
            ? "is-active"
            : index < activeIndex
              ? "is-before"
              : "is-after",
        );

        return;
      }

      /*
          FOOTER
        */

      if (card.tagName === "FOOTER") {
        card.classList.add(
          index === activeIndex
            ? "is-active"
            : index < activeIndex
              ? "is-before"
              : "is-after",
        );

        return;
      }

      /*
          NORMAL CARDS
        */

      if (index === activeIndex) {
        card.classList.add("is-active");
      } else if (index < activeIndex) {
        card.classList.add("is-before");
      } else {
        card.classList.add("is-after");
      }
    });
  }

  /* =========================================
     HEADER
  ========================================== */

  function updateHeader() {
    if (!header || !hero) {
      return;
    }

    const heroRect = hero.getBoundingClientRect();

    if (heroRect.bottom < 100) {
      header.style.transform = "translateY(-100%)";

      header.style.opacity = "0";
    } else {
      header.style.transform = "translateY(0)";

      header.style.opacity = "1";
    }
  }

  /* =========================================
     SCROLL PERFORMANCE
  ========================================== */

  let ticking = false;

  function requestUpdate() {
    if (ticking) {
      return;
    }

    ticking = true;

    window.requestAnimationFrame(() => {
      updateCards();

      updateHeader();

      ticking = false;
    });
  }

  /* =========================================
     SCROLL EVENT
  ========================================== */

  scrollContainer.addEventListener("scroll", requestUpdate, {
    passive: true,
  });

  /* =========================================
     RESIZE
  ========================================== */

  window.addEventListener(
    "resize",
    () => {
      updateSnapBehavior();

      requestUpdate();
    },
    {
      passive: true,
    },
  );

  /* =========================================
     KEYBOARD NAVIGATION
  ========================================== */

  document.addEventListener("keydown", (event) => {
    const activeElement = document.activeElement;

    const isTyping =
      activeElement &&
      (activeElement.tagName === "INPUT" ||
        activeElement.tagName === "TEXTAREA");

    if (isTyping) {
      return;
    }

    const activeCard = document.querySelector(".scroll-card.is-active");

    if (!activeCard) {
      return;
    }

    const currentIndex = Number(activeCard.dataset.index);

    /* ---------------------------------------
         DOWN
      --------------------------------------- */

    if (event.key === "ArrowDown" || event.key === "PageDown") {
      event.preventDefault();

      const nextCard = cards[currentIndex + 1];

      if (nextCard) {
        nextCard.scrollIntoView({
          behavior: "smooth",
          block: nextCard.classList.contains("is-tall") ? "start" : "center",
        });
      }
    }

    /* ---------------------------------------
         UP
      --------------------------------------- */

    if (event.key === "ArrowUp" || event.key === "PageUp") {
      event.preventDefault();

      const previousCard = cards[currentIndex - 1];

      if (previousCard) {
        previousCard.scrollIntoView({
          behavior: "smooth",
          block: previousCard.classList.contains("is-tall")
            ? "start"
            : "center",
        });
      }
    }
  });

  /* =========================================
     FORM
  ========================================== */

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document.querySelector("#name").value;

      const surname = document.querySelector("#surname").value;

      const email = document.querySelector("#email").value;

      const phone = document.querySelector("#phone").value;

      const message = document.querySelector("#message").value;

      const subject = `Kontakt - ${name} ${surname}`;

      const body = `
Ime: ${name}
Prezime: ${surname}
Email: ${email}
Phone: ${phone}

Poruka:
${message}
`;

      window.location.href =
        `mailto:admin@motofsb.com` +
        `?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(body)}`;
    });
  }

  /* =========================================
     INITIALIZATION
  ========================================== */

  updateSnapBehavior();

  updateCards();

  updateHeader();
});
