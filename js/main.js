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
  let dragged = false;
  const heroSlides = document.querySelectorAll("[data-hero-stage] .hero__image");
  const heroLook = document.querySelector("[data-hero-look]");

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
      dragged = false;
      drag = { x: event.clientX, left: track.scrollLeft, id: event.pointerId };
    });
    track.addEventListener("pointermove", (event) => {
      if (!drag) return;
      if (Math.abs(event.clientX - drag.x) > 12) {
        dragged = true;
        track.classList.add("is-dragging");
        if (drag.id != null && !track.hasPointerCapture(drag.id)) {
          track.setPointerCapture(drag.id);
        }
      }
      if (!dragged) return;
      track.scrollLeft = drag.left - (event.clientX - drag.x);
    });
    const endDrag = () => {
      drag = null;
      track.classList.remove("is-dragging");
      window.setTimeout(() => {
        dragged = false;
      }, 80);
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

  const looks = window.AshlieeLooks || {};

  const shuffle = (items) => {
    const pool = items.slice();
    for (let i = pool.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const swap = pool[i];
      pool[i] = pool[j];
      pool[j] = swap;
    }
    return pool;
  };

  const uniqueBySrc = (items) => {
    const seen = new Set();
    return (items || []).filter((look) => {
      if (!look?.src || seen.has(look.src)) return false;
      seen.add(look.src);
      return true;
    });
  };

  const imgSrc = (img) => img?.getAttribute("src") || "";

  const visibleSrcs = (except) => {
    const skip = new Set((except || []).filter(Boolean));
    const srcs = new Set();
    document.querySelectorAll("main img").forEach((img) => {
      if (skip.has(img)) return;
      if (img.closest("[aria-hidden='true']") && !img.closest("[data-hero-stage]")) {
        return;
      }
      const src = imgSrc(img);
      if (src) srcs.add(src);
    });
    return srcs;
  };

  const pickLooks = (pool, count, reserved, start = 0) => {
    const out = [];
    const used = new Set(reserved);
    if (!pool.length || count < 1) return out;
    for (let step = 0; step < pool.length * 2 && out.length < count; step += 1) {
      const look = pool[(start + step) % pool.length];
      if (!look?.src || used.has(look.src)) continue;
      used.add(look.src);
      out.push(look);
    }
    return out;
  };

  const applyLook = (img, look, slot) => {
    if (!img || !look) return;
    img.src = look.src;
    img.alt = look.alt || img.alt || "";
    if (look.caption) img.dataset.look = look.caption;
    const figure = img.closest("figure");
    const cap = figure?.querySelector("figcaption");
    if (!cap || !look.caption) return;
    const index = cap.querySelector("span");
    if (index) {
      if (typeof slot === "number") {
        index.textContent = String(slot + 1).padStart(2, "0");
      }
      cap.replaceChildren(index, document.createTextNode(` ${look.caption}`));
      return;
    }
    cap.textContent = look.caption;
  };

  const swapLook = (img, look, slot, animate) => {
    if (!img || !look) return;
    const already = imgSrc(img) === look.src;
    if (!animate || reduceMotion || already) {
      applyLook(img, look, slot);
      return;
    }
    const cap = img.closest("figure")?.querySelector("figcaption");
    img.classList.add("is-swapping");
    cap?.classList.add("is-swapping");
    window.setTimeout(() => {
      applyLook(img, look, slot);
      const reveal = () => {
        img.classList.remove("is-swapping");
        cap?.classList.remove("is-swapping");
      };
      if (img.complete) {
        window.requestAnimationFrame(reveal);
        return;
      }
      img.addEventListener("load", reveal, { once: true });
      img.addEventListener("error", reveal, { once: true });
    }, 680);
  };

  const rotateLooks = (root, items, ms) => {
    const pool = uniqueBySrc(shuffle(items || []));
    if (!root || pool.length < 2) return;
    const imgs = [...root.querySelectorAll("img")];
    const live = imgs.filter((img) => !img.closest("[aria-hidden='true']"));
    const copies = imgs.filter((img) => img.closest("[aria-hidden='true']"));
    const slots = live.length ? live : imgs;
    let cursor = Math.floor(Math.random() * pool.length);
    const paint = (animate) => {
      const reserved = visibleSrcs(slots);
      const chosen = pickLooks(pool, slots.length, reserved, cursor);
      cursor = (cursor + Math.max(chosen.length, 1)) % pool.length;
      chosen.forEach((look, i) => {
        const apply = () => {
          swapLook(slots[i], look, i, animate);
          copies
            .filter((_, copyIndex) => copyIndex % slots.length === i)
            .forEach((img) => swapLook(img, look, i, animate));
        };
        if (!animate) {
          apply();
          return;
        }
        window.setTimeout(apply, Math.min(i * 50, 200));
      });
    };
    paint(false);
    if (reduceMotion) return;
    window.setInterval(() => paint(true), ms);
  };

  rotateLooks(document.querySelector('[data-looks="runway"]'), looks.runway, 6400);
  rotateLooks(document.querySelector('[data-looks="glam"]'), looks.glam, 7200);
  rotateLooks(document.querySelector('[data-looks="tasting"]'), looks.tasting, 7600);
  rotateLooks(document.querySelector('[data-looks="scene"]'), looks.scene, 8000);

  if (heroSlides.length && looks.hero?.length) {
    const heroPool = uniqueBySrc(shuffle(looks.hero));
    let heroIndex = 0;
    const seed = pickLooks(
      heroPool,
      heroSlides.length,
      visibleSrcs([...heroSlides]),
      Math.floor(Math.random() * heroPool.length)
    );
    heroSlides.forEach((img, i) => {
      applyLook(img, seed[i] || heroPool[i % heroPool.length], i);
    });
    const setHeroLook = (text) => {
      if (!heroLook) return;
      if (reduceMotion) {
        heroLook.textContent = text;
        return;
      }
      heroLook.classList.add("is-swapping");
      window.setTimeout(() => {
        heroLook.textContent = text;
        heroLook.classList.remove("is-swapping");
      }, 280);
    };

    if (heroLook) {
      heroLook.textContent = heroSlides[0].dataset.look || "";
    }
    if (!reduceMotion && heroSlides.length > 1 && heroPool.length > 1) {
      window.setInterval(() => {
        const nextIndex = (heroIndex + 1) % heroSlides.length;
        const incoming = heroSlides[nextIndex];
        const reserved = visibleSrcs([incoming, heroSlides[heroIndex]]);
        [...heroSlides].forEach((slide, i) => {
          if (i === nextIndex || i === heroIndex) return;
          const src = imgSrc(slide);
          if (src) reserved.add(src);
        });
        const nextLook =
          pickLooks(heroPool, 1, reserved, Math.floor(Math.random() * heroPool.length))[0] ||
          heroPool[(heroIndex + 1) % heroPool.length];
        applyLook(incoming, nextLook, nextIndex);
        const activate = () => {
          heroSlides[heroIndex].classList.remove("is-active");
          heroIndex = nextIndex;
          incoming.classList.add("is-active");
          setHeroLook(incoming.dataset.look || "");
        };
        if (incoming.complete) {
          activate();
          return;
        }
        incoming.addEventListener("load", activate, { once: true });
        incoming.addEventListener("error", activate, { once: true });
      }, 5200);
    }
  }

  const zoom = document.querySelector("[data-zoom]");
  const zoomImage = document.querySelector("[data-zoom-image]");
  const zoomCaption = document.querySelector("[data-zoom-caption]");
  const zoomClose = document.querySelector("[data-zoom-close]");

  const closeZoom = () => {
    if (!zoom || !zoom.open) return;
    zoom.close();
  };

  const openZoom = (img) => {
    if (!zoom || !zoomImage || !img) return;
    const figure = img.closest("figure");
    const caption = figure?.querySelector("figcaption");
    zoomImage.src = img.currentSrc || img.src;
    zoomImage.alt = img.alt || img.dataset.look || "";
    if (zoomCaption) {
      zoomCaption.textContent = (
        caption?.textContent ||
        img.dataset.look ||
        ""
      ).trim();
    }
    if (typeof zoom.showModal === "function") {
      zoom.showModal();
    }
  };

  const hero = document.querySelector(".hero");
  hero?.addEventListener("click", (event) => {
    if (event.target.closest("a, button")) return;
    openZoom(hero.querySelector(".hero__image.is-active"));
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-zoom]")) return;
    if (event.target.closest(".hero")) return;
    const img = event.target.closest("main img");
    if (!img) return;
    if (img.closest("[data-carousel]") && dragged) return;
    event.preventDefault();
    openZoom(img);
  });

  zoomClose?.addEventListener("click", closeZoom);
  zoom?.addEventListener("click", (event) => {
    if (event.target === zoom) closeZoom();
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeZoom();
  });

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
