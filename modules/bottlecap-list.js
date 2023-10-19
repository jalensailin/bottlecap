/* global game mergeObject Application Dialog */
import BottleCap from "./bottlecap.js";
import BottleCapConfig from "./bottlecap-config.js";

export default class BottleCapList extends Application {
  static get defaultOptions() {
    const defaults = super.defaultOptions;

    const overrides = {
      height: "auto",
      width: 285,
      id: "bottlecap-list-app",
      template: "modules/bottlecap/templates/bottlecap-list.hbs",
      title: game.i18n.localize("BC.bottleCapList.title"),
      userId: game.userId,
      resizable: true,
      tabs: [
        {
          navSelector: ".bottlecap-tabs",
          contentSelector: ".bottlecap-list-container",
          initial: "active",
        },
      ],
    };

    const mergedOptions = mergeObject(defaults, overrides);

    return mergedOptions;
  }

  getData() {
    const foundryData = super.getData();
    const bottleCapFlag = Object.values(BottleCap.getFlag(game.user.id));
    const bottleCapList = { active: [], graveyard: [] };
    bottleCapFlag.forEach((bc) => {
      if (!bc.spent) {
        bottleCapList.active.push(bc);
      } else {
        bottleCapList.graveyard.push(bc);
      }
    });
    return {
      ...foundryData,
      bottleCapList,
    };
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.on("click", ".bottlecap-action", (event) => {
      const { action, capId } = event.currentTarget.dataset;
      const Action = action.charAt(0).toUpperCase() + action.slice(1); // Make first letter upperCase
      this[`open${Action}Dialog`](capId);
    });
  }

  openCreateDialog() {
    const newCap = new BottleCap();
    const config = new BottleCapConfig(newCap, { isCreationDialog: true });
    config.render(true);
  }

  openEditDialog(capId) {
    const bottleCap = game.user.getFlag(BottleCap.ID, BottleCap.FLAG)[capId];
    const config = new BottleCapConfig(bottleCap, {
      isCreationDialog: false,
    });
    config.render(true);
  }

  async openDeleteDialog(capId) {
    const confirmed = await Dialog.confirm({
      title: game.i18n.localize("BC.confirmDelete.title"),
      content: game.i18n.localize("BC.confirmDelete.content"),
    });
    if (confirmed) {
      await BottleCap.deleteBottleCap(capId);
      this.render(true);
    }
  }

  async openSpendDialog(capId) {
    const confirmed = await Dialog.confirm({
      title: game.i18n.localize("BC.confirmSpend.title"),
      content: game.i18n.localize("BC.confirmSpend.content"),
    });
    if (confirmed) {
      await BottleCap.spendBottleCap(capId);
      this.render(true);
    }
  }

  async openRevivifyDialog(capId) {
    const confirmed = await Dialog.confirm({
      title: game.i18n.localize("BC.confirmRevivify.title"),
      content: game.i18n.localize("BC.confirmRevivify.content"),
    });
    if (confirmed) {
      await BottleCap.revivifyBottleCap(capId);
      this.render(true);
    }
  }
}
