import { EventEmitter } from "events";
import GSAP from "gsap";

export default class Lang extends EventEmitter {
  constructor() {
    super();

    this.lang = "fr";

    this.langButton = document.querySelector(".lang-toggle");

    this.setEventListeners();
    this.applyLang(this.lang);
  }

  applyLang(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-fr]").forEach((el) => {
      const text = lang === "fr" ? el.dataset.fr : el.dataset.en;
      const existingSpans = el.querySelectorAll("span.animatedis");
      if (existingSpans.length > 0) {
        const y = GSAP.getProperty(existingSpans[0], "y");
        const yPercent = GSAP.getProperty(existingSpans[0], "yPercent");
        el.style.overflow = "hidden";
        el.innerHTML = text
          .split("")
          .map((char) => {
            if (char === " ") return `<span>&nbsp;</span>`;
            return `<span class="animatedis">${char}</span>`;
          })
          .join("");
        GSAP.set(el.querySelectorAll("span.animatedis"), { y, yPercent });
      } else {
        el.innerHTML = text;
      }
    });
    document.querySelector(".lang-toggle").textContent =
      lang === "fr" ? "FR" : "EN";
  }

  setEventListeners() {
    this.langButton.addEventListener("click", () => {
      this.lang = this.lang === "fr" ? "en" : "fr";
      this.applyLang(this.lang);
      this.emit("switch", this.lang);
    });
  }
}
