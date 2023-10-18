/* global Hooks game */

import BottleCap from "./modules/bottlecap.js";
import BottleCapList from "./modules/bottlecap-list.js";

Hooks.once("init", () => {
  game.bottlecap = BottleCap;
});

Hooks.on("renderPlayerList", (playerList) => {
  // All of this is jquery stuff.
  const playersHeader = playerList.element.find("h3");
  let bottleCapNumber = 0;
  try {
    bottleCapNumber = Object.keys(
      game.user.getFlag(BottleCap.ID, BottleCap.FLAG),
    ).length;
  } catch {
    // Do nothing
  }

  let buttonHTML = "";
  buttonHTML += `<button type='button' class='flex1 bottlecap-button'>`;
  buttonHTML += `  <div class="bottlecap-number">${bottleCapNumber}</div>`;
  buttonHTML += `  <img src="modules/bottlecap/assets/bottlecap-draft-3.svg">`;
  buttonHTML += `</button>`;
  playersHeader.addClass("flexrow");
  playersHeader.append(buttonHTML);

  playersHeader.on("click", "button", (event) => {
    event.stopPropagation();
    const window = new BottleCapList();
    window.render(true);
  });
});
