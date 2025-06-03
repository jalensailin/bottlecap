import BottleCap from "./modules/bottlecap.js";
import BottleCapList from "./modules/bottlecap-list.js";
import registerSettings from "./modules/settings.js";
import BCUtils from "./modules/utils.js";

Hooks.once("init", () => {
  // CONFIG.debug.hooks = true;

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

Hooks.on("renderPlayers", async (app, html) => {
  // All of this is jquery stuff.
  const firstPlayerLI = html.querySelector(
    "#players-active ol.players-list li:first-child",
  );
  const allBottleCaps = Object.values(BottleCap.getFlag(game.user.id) || {});
  const bottleCapNumber = allBottleCaps.filter((bc) => !bc.spent).length;

  const toolTip = BCUtils.generateToolTip();

  const buttonHTML = await foundry.applications.handlebars.renderTemplate(
    `modules/${BottleCap.ID}/templates/bottlecap-button.hbs`,
    { bottleCapNumber, toolTip },
  );

  const buttonElement = BCUtils.createElement("div", {
    classes: ["bottlecap-button-container"],
    innerHTML: buttonHTML,
  }).querySelector("button");

  firstPlayerLI.appendChild(buttonElement);

  buttonElement.addEventListener("click", (event) => {
    event.stopPropagation();
    const window = new BottleCapList();
    window.render(true);
  });
});
