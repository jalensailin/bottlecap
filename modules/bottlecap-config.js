/* global FormApplication game mergeObject ui */
import BottleCap from "./bottlecap.js";

export default class BottleCapConfig extends FormApplication {
  constructor(object, options) {
    super(object, options);
    this.isCreationDialog = options.isCreationDialog;

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

  getData() {
    const foundryData = super.getData();
    const userData = game.users.contents.map((u) => ({
      name: u.name,
      id: u.id,
    }));
    const { isCreationDialog } = this; // The .hbs template displays different verbiage for a creation dialog vs. an edit dialog.
    return {
      ...foundryData,
      ...this.object,
      userData,
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
      await BottleCap.createBottleCap(newData);
    } else {
      await BottleCap.updateBottleCap(newData);
    }

    const bottleCapApp = Object.values(ui.windows).find(
      (w) => w.id === "bottlecap-list-app",
    );
    return bottleCapApp ? bottleCapApp.render(true) : this.close();
  }
}
