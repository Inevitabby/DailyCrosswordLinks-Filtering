// ==UserScript==
// @name        DailyCrosswordLinks Filtering
// @namespace   https://github.com/Inevitabby/DailyCrosswordLinks-Filtering/raw/refs/heads/main/script.user.js
// @match       https://dailycrosswordlinks.com/*
// @grant       none
// @version     1.1
// @author      Inevitabby
// @description Hides links from Daily Crossword Links (e.g., subscription-only, appstore only, etc.)
// ==/UserScript==
(function () {
  "use strict";
  const CONFIG = {
    hidePaid: {
      action: "remove", // valid actions: "remove", "mark", "none"
    },
    hideApp: {
      action: "remove",
    },
    hideCryptic: {
      action: "remove",
    },
    hideFiletype: {
      action: "mark",
      whitelist: [ ".puz" ]
    },
  };

  // ===============================
  // === Entry Testing Functions ===
  // ===============================

  // Returns if entry requires subscription or purchase
  function hidePaid(elem) {
    const strong = elem.querySelector("strong");
    return strong && strong.textContent.includes(": ($)");
  }
  // Returns if entry requires appstore (exclusively)
  function hideApp(elem) {
    const links = elem.querySelectorAll("a");
    return links.length > 0 && Array.from(links).every(link =>
      link.href.startsWith("https://play.google.com") ||
      link.href.startsWith("https://apps.apple.com")
    );
  }
  // Returns if entry is a cryptic
  function hideCryptic(elem) {
    const strong = elem.querySelector("strong");
    return strong && strong.textContent.includes("Cryptic");
  }
  // Returns if entry lacks wanted filetypes
  function hideFiletype(elem) {
    const em = elem.querySelector("em");
    if (em === null) return true;
    return !CONFIG.hideFiletype.whitelist.some((ft) => em.textContent.includes(ft));
  }
  // Local function map
  const MAP = {
    hidePaid,
    hideApp,
    hideCryptic,
    hideFiletype,
  };

  // ====================================
  // === Entry Modification Functions ===
  // ====================================

  // Delete an entry
  function remove(elem) {
    while (elem) {
      const next = elem.nextSibling;
      elem.remove();
      if (elem.nodeName === "BR") break;
      elem = next;
    }
  }
  // Mark an entry
  function mark(elem) {
    while (elem) {
      const next = elem.nextSibling;
      if (elem.style) elem.style.opacity = "0.5";
      if (elem.nodeName === "BR") break;
      elem = next;
    }
  }

  // ============================
  // === Iterate over Entries ===
  // ============================

  // Scan through all entries
  const entries = document.querySelectorAll("span.fetched, span.unfetched");
  entries.forEach((entry) => {
    const matchKey = Object.keys(CONFIG).find((key) => {
      return MAP[key](entry);
    });
    if (!matchKey) return;
    const { action } = CONFIG[matchKey];
    if (action === "remove") remove(entry);
    if (action === "mark") mark(entry);
  });

})();
