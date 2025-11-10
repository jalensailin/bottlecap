import BottleCap from "./bottlecap.js";
import BCUtils from "./utils.js";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export default class BottleCapConfig extends HandlebarsApplicationMixin(
  ApplicationV2,
) {
  constructor(object, currentUserId, options) {
    super(object, options);
    this.object = object;
    this.isCreationDialog = options.isCreationDialog;
    this.currentUserId = currentUserId;
  }

  /** @inheritdoc */
  get title() {
    const actionString = this.isCreationDialog ? "create" : "edit";
    return game.i18n.localize(`BC.config.title.${actionString}`);
  }

  /** @inheritdoc */
  static DEFAULT_OPTIONS = /** @type {const} */ ({
    id: "bottlecap-config-form-app",
    classes: [BottleCap.ID, "bottlecap-dialog"],
    form: {
      handler: BottleCapConfig.onSubmit,
      closeOnSubmit: true,
    },
    tag: "form",
    position: { height: "auto" },
    window: {
      resizable: true,
    },
  });

  /** @inheritdoc */
  static PARTS = /** @type {const} */ ({
    main: {
      template: `modules/${BottleCap.ID}/templates/bottlecap-config.hbs`,
    },
    footer: {
      template: "templates/generic/form-footer.hbs",
    },
  });

  /** @inheritdoc */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const userData = game.users.contents.map((u) => ({
      name: u.name,
      id: u.id,
    }));
    const { isCreationDialog } = this; // The .hbs template displays different verbiage for a creation dialog vs. an edit dialog.
    const currentUser = game.users.get(this.currentUserId);

    const buttonLabelString = isCreationDialog ? "give" : "update";

    return {
      ...context,
      ...this.object,
      userData,
      currentUser,
      isCreationDialog,
      isGM: game.user.isGM,
      buttons: [
        {
          type: "submit",
          label: `BC.config.button.${buttonLabelString}`,
        },
      ],
    };
  }

  /** @inheritdoc */
  _onRender(context, options) {
    super._onRender(context, options);

    this.element.querySelectorAll("input").forEach((input) =>
      input.addEventListener("focus", (event) => {
        event.currentTarget.select();
      }),
    );
  }

  /** @inheritdoc */
  static async onSubmit(event, form, formData) {
    const newData = foundry.utils.mergeObject(this.object, formData.object);

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
