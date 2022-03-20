"use strict";

(() => {
  const backButtonNode = document.querySelector(".button[data-back]");

  if (!backButtonNode) {
    return;
  }

  backButtonNode.addEventListener("click", (evt) => {
    evt.preventDefault();
    history.back();
  });
})();
