/* Visuals */

const hero = document.querySelector(".hero");

window -
  addEventListener("scroll", () => {
    const scroll = window.scrollY;

    hero.style.transform = `translateY((${scroll * 0.3}px))`;
    hero.style.opacity = 1 - scroll / 600;
  });

/* Form */
const form = document.querySelector("form");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.querySelector("#name").value;
  const surname = document.querySelector("#surname").value;
  const email = document.querySelector("#email").value;
  const phone = document.querySelector("#phone").value;
  const message = document.querySelector("#message").value;

  const subject = `Kontakt - ${name} ${surname} `;

  const body = `
  Ime: ${name}
  Prezime: ${surname}
  Email: ${email}
  Phone: ${phone}
  
  Poruka:
  ${message}
  `;

  window.location.href = `mailto:admin@motofsb.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
