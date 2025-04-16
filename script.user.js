// ==UserScript==
// @name        DailyCrosswordLinks Filtering
// @namespace   https://github.com/Inevitabby/DailyCrosswordLinks-Filtering/raw/script.user.js
// @match       https://dailycrosswordlinks.com/*
// @grant       none
// @version     1.0
// @author      Inevitabby
// @description Hides links from Daily Crossword Links (e.g., subscription-only, appstore only, etc.)
// ==/UserScript==
(function () {
  "use strict";
  const CONFIG = {
    hidePaid: {
      enabled: true,
      test: isPaid,
    },
    hideApp: {
      enabled: true,
      test: isApp,
    },
    hideCryptic: {
      enabled: true,
      test: isCryptic,
    },
  };
  // Returns if entry requires subscription / purchase
  function isPaid(elem) {
    const strong = elem.querySelector("strong");
    return strong && strong.textContent.includes(": ($)");
  }
  // Returns if entry requires appstore, exclusively
  function isApp(elem) {
    const links = elem.querySelectorAll("a");
    return links.length > 0 && Array.from(links).every(link =>
      link.href.startsWith("https://play.google.com") ||
      link.href.startsWith("https://apps.apple.com")
    );
  }
  // Returns if entry is a cryptic
  function isCryptic(elem) {
    const strong = elem.querySelector("strong");
    return strong && strong.textContent.includes("Cryptic");
  }
  // Delete an entry
  function remove(elem) {
    while (elem) {
      const next = elem.nextSibling;
      elem.remove();
      if (elem.nodeName === "BR") break;
      elem = next;
    }
  }
  // Scan through all entries
  const entries = document.querySelectorAll("span.fetched, span.unfetched");
  entries.forEach((entry) => {
    const match = Object.values(CONFIG).find(({ enabled, test }) => enabled && test(entry));
    if (match) remove(entry);
  });
})();
