/* OBA-003 A&K HVAC preview v2 — GSAP motion
   CDN: gsap@3.12.5 + ScrollTrigger from jsDelivr */
(function () {
  "use strict";

  var form = document.getElementById("demo-contact-form");
  var note = document.getElementById("demo-form-note");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (note) {
        note.hidden = false;
      }
    });
  }

  var obaCta = document.getElementById("oba-cta");
  if (obaCta) {
    obaCta.addEventListener("click", function (e) {
      e.preventDefault();
    });
  }

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  var params = new URLSearchParams(window.location.search);
  var forceStatic = params.has("capture") || params.has("nomotion");

  var mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: reduce)", function () {
    gsap.set("[data-hero-el], [data-reveal], [data-reveal-child]", {
      clearProps: "all",
      autoAlpha: 1,
      y: 0,
      x: 0,
      scale: 1
    });
    gsap.set(".hero-glow, .hero-blob", { clearProps: "transform,opacity" });
    return function () {};
  });

  mm.add("(prefers-reduced-motion: no-preference)", function () {
    if (forceStatic) {
      gsap.set("[data-hero-el], [data-reveal], [data-reveal-child]", {
        autoAlpha: 1,
        y: 0,
        x: 0,
        clearProps: "transform"
      });
      return function () {};
    }

    gsap.defaults({ ease: "power3.out", duration: 0.85 });

    var heroEls = gsap.utils.toArray("[data-hero-el]");
    if (heroEls.length) {
      gsap.set(heroEls, { autoAlpha: 0, y: 28 });
      var heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
      heroTl.to(heroEls, {
        autoAlpha: 1,
        y: 0,
        duration: 0.75,
        stagger: 0.11
      });
      // Safety: never leave hero invisible if timeline is interrupted
      window.setTimeout(function () {
        gsap.set(heroEls, { autoAlpha: 1, y: 0 });
      }, 2500);
    }

    var heatGlow = document.querySelector(".hero-glow-heat");
    var coolGlow = document.querySelector(".hero-glow-cool");
    var blobA = document.querySelector(".hero-blob-a");
    var blobB = document.querySelector(".hero-blob-b");

    if (heatGlow) {
      gsap.to(heatGlow, {
        y: 36,
        x: 18,
        opacity: 0.78,
        duration: 8,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      });
    }
    if (coolGlow) {
      gsap.to(coolGlow, {
        y: -28,
        x: -14,
        opacity: 0.72,
        duration: 9.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      });
    }
    if (blobA) {
      gsap.to(blobA, {
        y: 20,
        rotation: 8,
        duration: 11,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      });
    }
    if (blobB) {
      gsap.to(blobB, {
        y: -16,
        rotation: -6,
        duration: 10,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      });
    }

    if (heatGlow || coolGlow) {
      gsap.to(".hero-layers", {
        y: 48,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 0.6
        }
      });
    }

    function revealSection(selector, childSelector) {
      var sections = gsap.utils.toArray(selector);
      sections.forEach(function (section) {
        var heads = section.querySelectorAll("[data-reveal]");
        var children = childSelector
          ? section.querySelectorAll(childSelector)
          : [];

        if (heads.length) {
          gsap.set(heads, { autoAlpha: 0, y: 32 });
          gsap.to(heads, {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            scrollTrigger: {
              trigger: section,
              start: "top 82%",
              toggleActions: "play none none none"
            }
          });
        }

        if (children.length) {
          gsap.set(children, { autoAlpha: 0, y: 40 });
          gsap.to(children, {
            autoAlpha: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: {
              trigger: children[0],
              start: "top 88%",
              toggleActions: "play none none none"
            }
          });
        }
      });
    }

    revealSection(".services", "[data-reveal-child]");
    revealSection(".trust", null);
    revealSection(".contact", null);

    var obaPanel = document.querySelector(".oba-panel");
    if (obaPanel) {
      var obaReveal = obaPanel.querySelectorAll("[data-reveal]");
      var obaChildren = obaPanel.querySelectorAll("[data-reveal-child]");
      if (obaReveal.length) {
        gsap.set(obaReveal, { autoAlpha: 0, y: 28 });
        gsap.to(obaReveal, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: obaPanel,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        });
      }
      if (obaChildren.length) {
        gsap.set(obaChildren, { autoAlpha: 0, y: 24 });
        gsap.to(obaChildren, {
          autoAlpha: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.1,
          scrollTrigger: {
            trigger: obaChildren[0],
            start: "top 90%",
            toggleActions: "play none none none"
          }
        });
      }
    }

    return function () {
      ScrollTrigger.getAll().forEach(function (st) {
        st.kill();
      });
    };
  });
})();
