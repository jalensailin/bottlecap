/* global game mergeObject Application */
import BottleCap from "./bottlecap.js";

export default class BottleCapList extends Application {
  static get defaultOptions() {
    const defaults = super.defaultOptions;

    const overrides = {
      height: "auto",
      id: "bottlecap-app",
      template: "modules/bottlecap/templates/bottlecap-list.hbs",
      title: game.i18n.localize("BC.bottleCapList"),
      userId: game.userId,
    };

    const mergedOptions = mergeObject(defaults, overrides);

    return mergedOptions;
  }

  getData() {
    const data = super.getData();
    return {
      ...data,
      bottleCapList: game.user.getFlag(BottleCap.ID, BottleCap.FLAG),
    };
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.on("click", ".bottlecap-create-cap", async () => {
      await BottleCap.createBottleCap();
      this.render(true);
    });

    html.on("click", ".bottlecap-delete-cap", async (event) => {
      const { capId } = event.currentTarget.dataset;
      await BottleCap.deleteBottleCap(capId);
      this.render(true);
    });
  }
}
