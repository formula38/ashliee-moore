(() => {
  const header = document.querySelector("[data-header]");
  const nav = document.querySelector("[data-nav]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const year = document.querySelector("[data-year]");
  const form = document.querySelector("[data-booking-form]");

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (toggle && nav) {
    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
      document.body.style.overflow = open ? "hidden" : "";
    };

    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      setOpen(open);
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setOpen(false));
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setOpen(false);
    });
  }

  const revealItems = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const heroSlides = document.querySelectorAll("[data-hero-stage] .hero__image");
  const heroLook = document.querySelector("[data-hero-look]");
  if (heroSlides.length > 1 && !reduceMotion) {
    let index = 0;
    window.setInterval(() => {
      heroSlides[index].classList.remove("is-active");
      index = (index + 1) % heroSlides.length;
      heroSlides[index].classList.add("is-active");
      if (heroLook) {
        heroLook.textContent = heroSlides[index].dataset.look || "";
      }
    }, 5200);
  }

  const carousel = document.querySelector("[data-carousel]");
  if (carousel) {
    const track = carousel.querySelector("[data-carousel-track]");
    const prev = carousel.querySelector("[data-carousel-prev]");
    const next = carousel.querySelector("[data-carousel-next]");
    const step = () => {
      const card = track.querySelector(".film__card");
      return card ? card.getBoundingClientRect().width + 16 : track.clientWidth * 0.8;
    };
    const go = (dir) => {
      const max = track.scrollWidth - track.clientWidth;
      const nextLeft = track.scrollLeft + dir * step();
      if (dir > 0 && nextLeft >= max - 8) {
        track.scrollTo({ left: 0, behavior: "smooth" });
        return;
      }
      if (dir < 0 && track.scrollLeft <= 8) {
        track.scrollTo({ left: max, behavior: "smooth" });
        return;
      }
      track.scrollBy({ left: dir * step(), behavior: "smooth" });
    };
    prev?.addEventListener("click", () => go(-1));
    next?.addEventListener("click", () => go(1));

    let drag = null;
    track.addEventListener("dragstart", (event) => event.preventDefault());
    track.addEventListener("pointerdown", (event) => {
      drag = { x: event.clientX, left: track.scrollLeft };
      track.classList.add("is-dragging");
      track.setPointerCapture(event.pointerId);
    });
    track.addEventListener("pointermove", (event) => {
      if (!drag) return;
      track.scrollLeft = drag.left - (event.clientX - drag.x);
    });
    const endDrag = () => {
      drag = null;
      track.classList.remove("is-dragging");
    };
    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointercancel", endDrag);

    if (!reduceMotion) {
      let timer = window.setInterval(() => go(1), 4200);
      const pause = () => window.clearInterval(timer);
      const resume = () => {
        pause();
        timer = window.setInterval(() => go(1), 4200);
      };
      carousel.addEventListener("mouseenter", pause);
      carousel.addEventListener("mouseleave", resume);
      carousel.addEventListener("focusin", pause);
      carousel.addEventListener("focusout", resume);
    }
  }

  if (form) {
    const status = form.querySelector("[data-form-status]");
    const submit = form.querySelector('button[type="submit"]');
    const mailbox = "royaltymaxwin@gmail.com";

    const setStatus = (text, state) => {
      if (!status) return;
      status.textContent = text;
      status.dataset.state = state || "";
    };

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = new FormData(form);
      if (String(data.get("_gotcha") || "").trim()) return;

      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const phone = String(data.get("phone") || "").trim();
      const inquiry = String(data.get("inquiry") || "").trim();
      const date = String(data.get("date") || "").trim();
      const location = String(data.get("location") || "").trim();
      const socialPlatform = String(data.get("social_platform") || "").trim();
      const social = String(data.get("social") || "").trim();
      const message = String(data.get("message") || "").trim();

      if (!name || !email || !inquiry || !date || !location || !message) return;

      data.set("_subject", `Booking inquiry — ${inquiry}`);

      if (submit) submit.disabled = true;
      setStatus("Sending…", "pending");

      try {
        const response = await fetch(form.action, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: data,
        });
        const result = await response.json().catch(() => ({}));
        const messageText = String(result.message || "");
        const needsActivation = /activ/i.test(messageText);
        const ok =
          response.ok &&
          result.success !== false &&
          result.success !== "false";

        if (needsActivation) {
          setStatus(
            "Almost there — check the booking inbox for a FormSubmit activation link, then send again.",
            "err"
          );
          return;
        }

        if (!ok) {
          throw new Error(messageText || "Send failed");
        }

        form.reset();
        setStatus("Inquiry sent. Ashliee will get back to you.", "ok");
      } catch {
        const subject = encodeURIComponent(`Booking inquiry — ${inquiry}`);
        const body = encodeURIComponent(
          [
            `Name: ${name}`,
            `Email: ${email}`,
            phone && `Phone: ${phone}`,
            `Inquiry: ${inquiry}`,
            `Date: ${date}`,
            `Location: ${location}`,
            (socialPlatform || social) &&
              `Social: ${[socialPlatform, social].filter(Boolean).join(" — ")}`,
            "",
            message,
          ]
            .filter((line) => line !== false)
            .join("\n")
        );
        setStatus(
          "Could not send through the form. Opening your email client instead.",
          "err"
        );
        window.location.href = `mailto:${mailbox}?subject=${subject}&body=${body}`;
      } finally {
        if (submit) submit.disabled = false;
      }
    });
  }
})();
