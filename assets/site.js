// Mobile nav toggle — present on every page
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => nav.classList.toggle("open"));
  }

  // ---- Copy-to-clipboard for any [data-copy] button (e.g. the support email chip) ----
  document.querySelectorAll(".copy-btn[data-copy]").forEach((btn) => {
    const original = btn.textContent;
    btn.addEventListener("click", async () => {
      const text = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
      } catch (e) {
        // Clipboard API blocked (older browser, insecure context) — select the
        // text next to the button so the person can still copy it manually.
        const range = document.createRange();
        range.selectNodeContents(btn.previousSibling || btn.parentElement);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
      btn.textContent = "Copied!";
      btn.classList.add("copied");
      setTimeout(() => { btn.textContent = original; btn.classList.remove("copied"); }, 1500);
    });
  });

  // ---- Hero mock-form animation (only present on index.html) ----
  const mockForm = document.querySelector(".mock-form");
  if (!mockForm) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fields = [...mockForm.querySelectorAll(".mock-field")];
  const badge = mockForm.querySelector(".mock-badge");

  function setFilled(field) {
    const textEl = field.querySelector(".mock-input-text");
    textEl.textContent = field.dataset.value;
    field.classList.add("filled");
  }

  if (reduceMotion) {
    fields.forEach(setFilled);
    if (badge) badge.textContent = `✓ Filled ${fields.length} fields`;
    return;
  }

  async function playOnce() {
    fields.forEach(f => { f.classList.remove("filled"); f.querySelector(".mock-input-text").textContent = ""; });
    if (badge) badge.textContent = `⚡ Autofill (${fields.length})`;
    await wait(700);
    for (const field of fields) {
      await wait(420);
      setFilled(field);
    }
    await wait(300);
    if (badge) badge.textContent = `✓ Filled ${fields.length} fields`;
    await wait(2600);
  }
  function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

  async function loop() {
    // eslint-disable-next-line no-constant-condition
    while (true) await playOnce();
  }
  loop();
});