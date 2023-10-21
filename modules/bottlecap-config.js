/* global FormApplication game mergeObject ui */
import BottleCap from "./bottlecap.js";
import BCUtils from "./utils.js";

export default class BottleCapConfig extends FormApplication {
  constructor(object, currentUserId, options) {
    super(object, options);
    this.isCreationDialog = options.isCreationDialog;
    this.currentUserId = currentUserId;

    // Change title if this is a creation dialog.
    if (this.isCreationDialog)
      this.options.title = game.i18n.localize("BC.config.title.create");
  }

  static get defaultOptions() {
    const defaults = super.defaultOptions;

    // Get the number of already opened config windows so that we can give the new one a unique ID.
    // This way we can render multiple config windows at once.
    const num = Object.values(ui.windows).filter(
      (w) => w.template === "modules/bottlecap/templates/bottlecap-config.hbs",
    ).length;
    const overrides = {
      height: "auto",
      id: `bottlecap-config-form-app-${num}`,
      template: "modules/bottlecap/templates/bottlecap-config.hbs",
      title: game.i18n.localize("BC.config.title.edit"), // Default mode is edit.
      userId: game.userId,
      resizable: true,
    };

    const mergedOptions = mergeObject(defaults, overrides);
    return mergedOptions;
  }

  getData(options) {
    const foundryData = super.getData(options);
    const userData = game.users.contents.map((u) => ({
      name: u.name,
      id: u.id,
    }));
    const { isCreationDialog } = this; // The .hbs template displays different verbiage for a creation dialog vs. an edit dialog.
    const currentUser = game.users.get(this.currentUserId);
    return {
      ...foundryData,
      ...this.object,
      userData,
      currentUser,
      isCreationDialog,
    };
  }

  activateListeners(html) {
    super.activateListeners(html);

    // Select on focus in the input for quick deletion.
    html.on("focus", "input", (event) => {
      event.currentTarget.select();
    });
  }

  async _updateObject(event, formData) {
    const newData = mergeObject(this.object, formData);

    if (this.isCreationDialog) {
      const newCap = await BottleCap.createBottleCap(newData.user, newData);
      BCUtils.createChatMessage(newCap.user, newCap.id, false);
    } else {
      await BottleCap.updateBottleCap(newData.user, newData);
    }

    const bottleCapApp = Object.values(ui.windows).find(
      (w) => w.id === "bottlecap-list-app",
    );
    return bottleCapApp ? bottleCapApp.render(true) : this.close();
  }
}
