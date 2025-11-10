import BottleCap from "./bottlecap.js";
import BottleCapConfig from "./bottlecap-config.js";
import BCUtils from "./utils.js";

const { ApplicationV2, Dialog, HandlebarsApplicationMixin } =
  foundry.applications.api;

export default class BottleCapList extends HandlebarsApplicationMixin(
  ApplicationV2,
) {
  constructor(options) {
    super(options);
    this.currentUserId = game.user.id;
  }

  /** @inheritdoc */
  static DEFAULT_OPTIONS = /** @type {const} */ ({
    id: "bottlecap-list-app",
    classes: [BottleCap.ID, "bottlecap-list"],
    position: { height: "auto", width: 285 },
    window: {
      title: "BC.bottleCapList.title",
      resizable: true,
    },
    actions: {
      bottlecapAction: BottleCapList.bottlecapAction,
      resetUser: BottleCapList.resetUser,
    },
  });

  /** @inheritdoc */
  static PARTS = /** @type {const} */ ({
    main: {
      template: `modules/${BottleCap.ID}/templates/bottlecap-list.hbs`,
    },
  });

  /** @inheritdoc */
  static TABS = /** @type {const} */ ({
    primary: {
      tabs: [{ id: "trove" }, { id: "graveyard" }],
      initial: "trove",
    },
  });

  /** @inheritdoc */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    const userId = this.currentUserId;
    const userData = game.users.contents.map((u) => ({
      name: u.name,
      id: u.id,
    }));

    // Figure out permissions based on user roles.
    const manageOwnSetting = parseInt(
      game.settings.get(BottleCap.ID, "manageOwnPermissions"),
    );

    const userIsCurrent = game.user.id === this.currentUserId; // Is the user currently viewing their own caps?
    const userRole = game.user.role;
    const userCanManageOwn = userRole >= manageOwnSetting;
    // Can the user manage the currently displayed list of bottle caps?
    const userCanManageCurrent =
      game.user.isGM || (userCanManageOwn && userIsCurrent);

    // Prepare list of bottle caps for display.
    const bottleCapFlag = Object.values(BottleCap.getFlag(userId) || {});
    const bottleCapList = { trove: [], graveyard: [] };
    bottleCapFlag.forEach((bc) => {
      if (!bc.spent) {
        bottleCapList.trove.push(bc);
      } else {
        bottleCapList.graveyard.push(bc);
      }
    });

    const toolTipCurrent = BCUtils.generateToolTip();
    const toolTipSpent = BCUtils.generateToolTip(true);
    return {
      ...context,
      bottleCapList,
      userData,
      currentUserId: userId,
      userIsCurrent,
      userCanManageCurrent,
      toolTipCurrent,
      toolTipSpent,
    };
  }

  /** @inheritdoc */
  async _onRender(context, options) {
    await super._onRender(context, options);

    const select = this.element.querySelector(".select-player");
    select.addEventListener("change", (event) => {
      this.currentUserId = event.currentTarget.value;
      this.render(true);
    });
  }

  /**
   * Handle opening create/edit dialogs.
   *
   * @param {Event} event
   * @param {HTMLElement} target
   * @returns
   */
  static bottlecapAction(event, target) {
    const { actionType, capId } = target.dataset;
    const actionTypeCap = BCUtils.capFirstLetter(actionType);
    this[`open${actionTypeCap}Dialog`](capId);
  }

  /**
   * Resets the currently displayed bottle cap list to the current user's list.
   */
  static resetUser() {
    this.currentUserId = game.user.id;
    this.render(true);
  }

  /**
   * Opens the Bottle Cap config dialog in creation mode.
   *
   * This will create a new bottle cap and prompt the user to configure it.
   */
  openCreateDialog() {
    const newCap = new BottleCap();
    const config = new BottleCapConfig(newCap, this.currentUserId, {
      isCreationDialog: true,
    });
    config.render(true);
  }

  /**
   * Opens the Bottle Cap config dialog in edit mode.
   *
   * This will open the config dialog with the given bottle cap data pre-populated.
   *
   * @param {string} capId - ID of the bottle cap to edit.
   */
  openEditDialog(capId) {
    const bottleCap = BottleCap.getFlag(this.currentUserId)[capId];
    const config = new BottleCapConfig(bottleCap, this.currentUserId, {
      isCreationDialog: false,
    });
    config.render(true);
  }

  static openConfirmDialog(actionType) {
    let content = "";
    content += `<div class="bottlecap-confirm-content">`;
    content += `  ${game.i18n.localize(`BC.confirm${actionType}.content`)}`;
    content += `</div>`;

    return Dialog.confirm({
      classes: ["dialog", BottleCap.ID, "bottlecap-dialog"],
      position: {
        height: "auto",
        width: 285,
      },
      window: { title: `BC.confirm${actionType}.title` },
      content,
    });
  }

  async openDeleteDialog(capId) {
    const confirmed = await BottleCapList.openConfirmDialog("Delete");
    if (confirmed) {
      await BottleCap.deleteBottleCap(this.currentUserId, capId);
      this.render(true);
    }
  }

  async openSpendDialog(capId) {
    const confirmed = await BottleCapList.openConfirmDialog("Spend");
    if (confirmed) {
      BCUtils.createChatMessage(this.currentUserId, capId);

      await BottleCap.spendBottleCap(this.currentUserId, capId);
      this.render(true);
    }
  }

  async openRevivifyDialog(capId) {
    const confirmed = await BottleCapList.openConfirmDialog("Revivify");
    if (confirmed) {
      await BottleCap.revivifyBottleCap(this.currentUserId, capId);
      this.render(true);
    }
  }
}
