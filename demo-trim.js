(function () {
  "use strict";

  const locale = document.documentElement.dataset.locale || "en";
  const label = "romanjo.art";

  function addPaidButton() {
    const header = document.querySelector("header");
    if (!header || header.querySelector(".paid-button")) return;
    const button = document.createElement("a");
    button.className = "paid-button";
    button.href = "mailto:hello@romanjo.art?subject=Romanjo%20Plans";
    button.textContent = label;
    header.appendChild(button);
  }

  function trimPage() {
    document.body.classList.add("demo-only");
    [".hero", ".manifesto", ".voices", ".pricing", "footer", ".side-nav"].forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
        element.style.display = "none";
      });
    });
  }

  addPaidButton();
  trimPage();

  window.addEventListener("load", () => {
    addPaidButton();
    trimPage();
  });

  const observer = new MutationObserver(() => {
    addPaidButton();
    trimPage();
  });
  observer.observe(document.body, { childList: true, subtree: true });
}());
