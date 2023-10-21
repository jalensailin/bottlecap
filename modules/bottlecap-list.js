/* global game mergeObject Application Dialog */
import BottleCap from "./bottlecap.js";
import BottleCapConfig from "./bottlecap-config.js";
import BCUtils from "./utils.js";

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
      ...foundryData,
      bottleCapList,
      userData,
      currentUserId: userId,
      userIsCurrent,
      userCanManageCurrent,
      toolTipCurrent,
      toolTipSpent,
    };
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.on("click", ".bottlecap-action", (event) => {
      const { action, capId } = event.currentTarget.dataset;
      const Action = action.charAt(0).toUpperCase() + action.slice(1); // Make first letter upperCase
      this[`open${Action}Dialog`](capId);
    });

    html.on("click", ".bottlecap-reset-user", () => {
      this.currentUserId = game.user.id;
      this.render(true);
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
