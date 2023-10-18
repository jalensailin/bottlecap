/* global game mergeObject Application Dialog */
import BottleCap from "./bottlecap.js";
import BottleCapConfig from "./bottlecap-config.js";

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
    const foundryData = super.getData();
    return {
      ...foundryData,
      bottleCapList: game.user.getFlag(BottleCap.ID, BottleCap.FLAG),
    };
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.on("click", ".bottlecap-create-cap", async () => {
      const newCap = new BottleCap();
      const config = new BottleCapConfig(newCap, { isCreationDialog: true });
      config.render(true);
    });

    html.on("click", ".bottlecap-edit-cap", async (event) => {
      const { capId } = event.currentTarget.dataset;
      const bottleCap = game.user.getFlag(BottleCap.ID, BottleCap.FLAG)[capId];
      const config = new BottleCapConfig(bottleCap, {
        isCreationDialog: false,
      });
      config.render(true);
    });

    html.on("click", ".bottlecap-delete-cap", async (event) => {
      const { capId } = event.currentTarget.dataset;
      const confirmed = await Dialog.confirm({
        title: game.i18n.localize("BC.confirmDelete.title"),
        content: game.i18n.localize("BC.confirmDelete.content"),
      });
      if (confirmed) {
        await BottleCap.deleteBottleCap(capId);
        this.render(true);
      }
    });
  }
}
