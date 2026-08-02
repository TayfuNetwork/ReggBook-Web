(function () {
  "use strict";

  var STORAGE_KEY = "reggbook_lang";

  var FLAG_TR =
    '<svg viewBox="0 0 30 20" width="20" height="14" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<rect width="30" height="20" fill="#e30a17"/>' +
    '<circle cx="12" cy="10" r="6" fill="#fff"/>' +
    '<circle cx="14" cy="10" r="5" fill="#e30a17"/>' +
    '<text x="15.2" y="13.4" font-size="6.4" fill="#fff">★</text>' +
    "</svg>";

  var FLAG_EN =
    '<svg viewBox="0 0 60 40" width="20" height="14" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<rect width="60" height="40" fill="#012169"/>' +
    '<path d="M0,0 L60,40 M60,0 L0,40" stroke="#fff" stroke-width="8"/>' +
    '<path d="M0,0 L27,18 M60,0 L33,18 M0,40 L27,22 M60,40 L33,22" stroke="#C8102E" stroke-width="4"/>' +
    '<path d="M30,0 V40 M0,20 H60" stroke="#fff" stroke-width="14"/>' +
    '<path d="M30,0 V40 M0,20 H60" stroke="#C8102E" stroke-width="8"/>' +
    "</svg>";

  function getLang() {
    try {
      return localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "tr";
    } catch (e) {
      return "tr";
    }
  }

  function saveLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}
  }

  function applyTranslations(lang) {
    document.documentElement.setAttribute("lang", lang === "en" ? "en" : "tr");

    var nodes = document.querySelectorAll("[data-tr]");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var val = lang === "en" ? el.getAttribute("data-en") : el.getAttribute("data-tr");
      if (val === null) continue;

      var attr = el.getAttribute("data-i18n-attr");
      if (attr) {
        el.setAttribute(attr, val);
      } else if (el.hasAttribute("data-i18n-html")) {
        el.innerHTML = val;
      } else {
        el.textContent = val;
      }
    }

    var hrefNodes = document.querySelectorAll("[data-href-tr]");
    for (var j = 0; j < hrefNodes.length; j++) {
      var hEl = hrefNodes[j];
      var hVal = lang === "en" ? hEl.getAttribute("data-href-en") : hEl.getAttribute("data-href-tr");
      if (hVal !== null) hEl.setAttribute("href", hVal);
    }

    updateSwitchUI(lang);

    try {
      window.dispatchEvent(new CustomEvent("reggbook:langchange", { detail: { lang: lang } }));
    } catch (e) {}
  }

  function updateSwitchUI(lang) {
    var trBtn = document.getElementById("rbLangTr");
    var enBtn = document.getElementById("rbLangEn");
    if (trBtn) trBtn.classList.toggle("rb-lang-active", lang !== "en");
    if (enBtn) enBtn.classList.toggle("rb-lang-active", lang === "en");
  }

  function stripSlash(p) {
    return (p || "").replace(/\/+$/, "");
  }

  function setLang(lang) {
    saveLang(lang);
    var pair = window.REGGBOOK_LANG_PAIR;
    if (pair && pair[lang] && stripSlash(pair[lang]) !== stripSlash(window.location.pathname)) {
      window.location.href = pair[lang];
      return;
    }
    applyTranslations(lang);
  }

  function injectStyles() {
    var style = document.createElement("style");
    style.textContent =
      ".rb-lang-switch{position:fixed;top:12px;right:12px;z-index:99999;display:flex;gap:4px;" +
      "background:rgba(255,255,255,.92);border:1px solid rgba(28,55,96,.14);border-radius:999px;" +
      "padding:4px;box-shadow:0 8px 22px rgba(28,55,96,.16);backdrop-filter:blur(6px);}" +
      ".rb-lang-switch button{display:flex;align-items:center;gap:5px;border:none;background:transparent;" +
      "cursor:pointer;font-family:Arial,sans-serif;font-size:11px;font-weight:bold;color:#14233b;" +
      "padding:6px 9px;border-radius:999px;line-height:1;transition:background .15s ease,color .15s ease;}" +
      ".rb-lang-switch button svg{border-radius:2px;flex-shrink:0;display:block;}" +
      ".rb-lang-switch button.rb-lang-active{background:#285ed8;color:#fff;}" +
      ".rb-lang-switch button:hover:not(.rb-lang-active){background:rgba(40,94,216,.1);}" +
      "@media (max-width:480px){.rb-lang-switch{top:8px;right:8px;padding:3px;}" +
      ".rb-lang-switch button{padding:5px 7px;font-size:10px;}}";
    document.head.appendChild(style);
  }

  function buildSwitcher() {
    var wrap = document.createElement("div");
    wrap.className = "rb-lang-switch";
    wrap.setAttribute("role", "group");
    wrap.setAttribute("aria-label", "Dil seçimi / Language");

    var trBtn = document.createElement("button");
    trBtn.type = "button";
    trBtn.id = "rbLangTr";
    trBtn.innerHTML = FLAG_TR + "<span>TR</span>";
    trBtn.addEventListener("click", function () {
      setLang("tr");
    });

    var enBtn = document.createElement("button");
    enBtn.type = "button";
    enBtn.id = "rbLangEn";
    enBtn.innerHTML = FLAG_EN + "<span>EN</span>";
    enBtn.addEventListener("click", function () {
      setLang("en");
    });

    wrap.appendChild(trBtn);
    wrap.appendChild(enBtn);
    document.body.appendChild(wrap);
  }

  document.addEventListener("DOMContentLoaded", function () {
    injectStyles();
    buildSwitcher();
    applyTranslations(getLang());
  });

  window.ReggbookI18n = { getLang: getLang, setLang: setLang, applyTranslations: applyTranslations };
})();
