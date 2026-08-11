(() => {
  const nav = document.querySelector(".site-nav");
  const revealItems = document.querySelectorAll(".reveal");
  const tabs = document.querySelectorAll(".tab");
  const panels = document.querySelectorAll(".panel");
  const copyBtn = document.querySelector(".copy-btn");
  const bibtex = document.querySelector("#bibtex");

  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 }
    );
    revealItems.forEach((el) => io.observe(el));
  } else {
    revealItems.forEach((el) => el.classList.add("is-visible"));
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const id = tab.getAttribute("data-panel");
      tabs.forEach((t) => t.classList.toggle("is-active", t === tab));
      panels.forEach((panel) => {
        panel.hidden = panel.id !== id;
      });
    });
  });

  if (copyBtn && bibtex) {
    copyBtn.addEventListener("click", async () => {
      const text = bibtex.textContent.trim();
      try {
        await navigator.clipboard.writeText(text);
        copyBtn.textContent = "Copied";
        setTimeout(() => {
          copyBtn.textContent = "Copy";
        }, 1600);
      } catch {
        const range = document.createRange();
        range.selectNodeContents(bibtex);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        copyBtn.textContent = "Select & copy";
      }
    });
  }
})();
