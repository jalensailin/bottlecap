/* global FormApplication game mergeObject ui */
import BottleCap from "./bottlecap.js";

export default class BottleCapConfig extends FormApplication {
  static get defaultOptions() {
    const defaults = super.defaultOptions;

    const overrides = {
      height: "auto",
      id: "bottlecap-config-form-app",
      template: "modules/bottlecap/templates/bottlecap-config.hbs",
      title: game.i18n.localize("BC.bottleCapConfig"),
      userId: game.userId,
    };

    const mergedOptions = mergeObject(defaults, overrides);

    return mergedOptions;
  }

  getData() {
    const foundryData = super.getData();
    const userData = game.users.contents.map((u) => ({
      name: u.name,
      id: u.id,
    }));
    const currentUserName = userData[0].name;
    return {
      ...foundryData,
      userData,
      currentUserName,
    };
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.on("change", ".bottlecap-select-user", () => {
      // this.render(true);
    });
  }

  async _updateObject(event, formData) {
    await BottleCap.createBottleCap(formData);
    const windows = Object.values(ui.windows);
    return windows.find((w) => w.id === "bottlecap-app").render(true);
  }
}
