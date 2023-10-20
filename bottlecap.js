/* global Hooks game */

import BottleCap from "./modules/bottlecap.js";
import BottleCapList from "./modules/bottlecap-list.js";
import registerSettings from "./modules/settings.js";
import BCUtils from "./modules/utils.js";

Hooks.once("init", () => {
  game.bottlecap = BottleCap;
});

Hooks.once("i18nInit", () => {
  registerSettings();
});

Hooks.on("renderPlayerList", (playerList) => {
  // All of this is jquery stuff.
  const playersHeader = playerList.element.find("h3");
  const allBottleCaps = Object.values(BottleCap.getFlag(game.user.id) || {});
  const bottleCapNumber = allBottleCaps.filter((bc) => !bc.spent).length;

  const toolTip = BCUtils.generateToolTip();

  let buttonHTML = "";
  buttonHTML += `<button type="button" class="flex1 bottlecap-button" data-tooltip="${toolTip}" data-tooltip-direction="UP">`;
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
