/* global game mergeObject Application Dialog */
import BottleCap from "./bottlecap.js";
import BottleCapConfig from "./bottlecap-config.js";

export default class BottleCapList extends Application {
  constructor(options) {
    super(options);
    this.currentUserId = game.user.id;
  }

  static get defaultOptions() {
    const defaults = super.defaultOptions;

    const overrides = {
      height: "auto",
      width: 265,
      id: "bottlecap-list-app",
      template: "modules/bottlecap/templates/bottlecap-list.hbs",
      title: game.i18n.localize("BC.bottleCapList.title"),
      userId: game.userId,
      resizable: true,
      tabs: [
        {
          navSelector: ".bottlecap-tabs",
          contentSelector: ".bottlecap-list-container",
          initial: "trove",
        },
      ],
    };

    const mergedOptions = mergeObject(defaults, overrides);

    return mergedOptions;
  }

  getData(options) {
    const foundryData = super.getData(options);
    const userId = this.currentUserId;
    const userData = game.users.contents.map((u) => ({
      name: u.name,
      id: u.id,
    }));

    // Figure out permissions based on user roles.
    const manageAllSetting = parseInt(
      game.settings.get(BottleCap.ID, "manageAllPermissions"),
    );
    const manageOwnSetting = parseInt(
      game.settings.get(BottleCap.ID, "manageOwnPermissions"),
    );
    const userRole = game.user.role;
    const userCanManageAll = userRole >= manageAllSetting;
    const userCanManageOwn = userRole >= manageOwnSetting;
    // Can the user manage the currently displayed list of bottle caps?
    const userCanManageCurrent =
      userCanManageAll ||
      (userCanManageOwn && game.user.id === this.currentUserId);

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
    return {
      ...foundryData,
      bottleCapList,
      userData,
      currentUserId: userId,
      userCanManageCurrent,
    };
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.on("click", ".bottlecap-action", (event) => {
      const { action, capId } = event.currentTarget.dataset;
      const Action = action.charAt(0).toUpperCase() + action.slice(1); // Make first letter upperCase
      this[`open${Action}Dialog`](capId);
    });

    html.on("change", ".bottlecap-select-player", (event) => {
      this.currentUserId = event.currentTarget.value;
      this.render(true);
    });
  }

  openCreateDialog() {
    const newCap = new BottleCap();
    const config = new BottleCapConfig(newCap, this.currentUserId, {
      isCreationDialog: true,
    });
    config.render(true);
  }

  openEditDialog(capId) {
    const bottleCap = BottleCap.getFlag(this.currentUserId)[capId];
    const config = new BottleCapConfig(bottleCap, this.currentUserId, {
      isCreationDialog: false,
    });
    config.render(true);
  }

  static openConfirmDialog(Action) {
    let content = "";
    content += `<div class="bottlecap-confirm-content">`;
    content += `  ${game.i18n.localize(`BC.confirm${Action}.content`)}`;
    content += `</div>`;

    return Dialog.confirm({
      options: {
        height: "auto",
        width: 285,
        classes: ["dialog", "bottlecap-confirm"],
      },
      title: game.i18n.localize(`BC.confirm${Action}.title`),
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
