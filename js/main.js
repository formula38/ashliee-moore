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

  if (form) {
    const status = form.querySelector("[data-form-status]");
    const submit = form.querySelector('button[type="submit"]');
    const mailbox = "hello@ashliee-moore.com";

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
      const inquiry = String(data.get("inquiry") || "").trim();
      const message = String(data.get("message") || "").trim();

      if (!name || !email || !inquiry || !message) return;

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
        const ok =
          response.ok &&
          result.success !== false &&
          result.success !== "false";

        if (!ok) {
          throw new Error(result.message || "Send failed");
        }

        form.reset();
        setStatus("Inquiry sent. Ashliee will get back to you.", "ok");
      } catch {
        const subject = encodeURIComponent(`Booking inquiry — ${inquiry}`);
        const body = encodeURIComponent(
          `Name: ${name}\nEmail: ${email}\nInquiry: ${inquiry}\n\n${message}`
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
