/* global game ChatMessage renderTemplate */

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

  /**
   * Get data to log a chat message when a cap is received/spent.
   *
   * @param {String} userId
   * @param {String} capId
   * @param {Boolean} spent - whether or not this message is for a spent cap or not
   * @return {ChatMessage}
   */
  static async createChatMessage(userId, capId, spent = true) {
    const cap = BottleCap.getFlag(userId)[capId];
    const user = game.users.get(userId).name;

    // Prepare header string
    const spentOrReceived = spent ? "spent" : "received";
    const bottleCapString = game.settings.get(
      BottleCap.ID,
      "chatMessageCapName",
    );
    const header = game.i18n.format(
      `BC.chatMessage.header.${spentOrReceived}`,
      {
        user,
        aBottleCap: bottleCapString,
      },
    );
    const content = await renderTemplate(
      `modules/${BottleCap.ID}/templates/chat-message.hbs`,
      { cap, header },
    );

    return ChatMessage.create({
      content,
    });
  }
}
