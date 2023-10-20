/* global game */

import BottleCap from "./bottlecap.js";

export default class BCUtils {
  /**
   * Generate a tooltip for display of all users' bottle cap totals.
   *
   * @param {Boolean} spent - whether or not to return a list of spent tokens
   * @returns {String} - the tooltip html string.
   */
  static generateToolTip(spent = false) {
    const userList = game.users.contents.map((u) => ({
      name: u.name,
      id: u.id,
      bottleCapNumber: Object.values(BottleCap.getFlag(u.id) || {}).filter(
        (bc) => (spent ? bc.spent : !bc.spent),
      ).length, // All user's bottle caps
    }));

    let toolTip = spent
      ? `${game.i18n.localize("BC.bottleCapList.tooltip.spent")}<hr/>`
      : `${game.i18n.localize("BC.bottleCapList.tooltip.current")}<hr/>`;
    userList.forEach((user) => {
      toolTip += `${user.name}: x${user.bottleCapNumber}<br>`;
    });

    return toolTip;
  }
}
