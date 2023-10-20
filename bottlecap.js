/* global Hooks game Handlebars */

import BottleCap from "./modules/bottlecap.js";
import BottleCapList from "./modules/bottlecap-list.js";
import registerSettings from "./modules/settings.js";
import BCUtils from "./modules/utils.js";

Hooks.once("init", () => {
  game.bottlecap = BottleCap;

  /**
   * Run a comparison given a stringified operator and 2 operands. Returns true or false.
   */
  Handlebars.registerHelper("bcCompare", (v1, operator, v2) => {
    switch (operator) {
      case "==":
        return v1 == v2; // eslint-disable-line eqeqeq
      case "===":
        return v1 === v2;
      case "!==":
        return v1 !== v2;
      case "<":
        return v1 < v2;
      case "<=":
        return v1 <= v2;
      case ">":
        return v1 > v2;
      case ">=":
        return v1 >= v2;
      case "&&":
        return v1 && v2;
      case "||":
        return v1 || v2;
      default:
        return false;
    }
  });
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
