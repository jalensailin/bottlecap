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
      const name = user.name.replace(/"/g, "&quot;"); // Sanitize the user's name of double quotes so the html renders properly.
      toolTip += `${name}: x${user.bottleCapNumber}<br>`;
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
    const content = await foundry.applications.handlebars.renderTemplate(
      `modules/${BottleCap.ID}/templates/chat-message.hbs`,
      { cap, header },
    );

    return ChatMessage.create({
      content,
    });
  }

  /**
   * Wrapper around document.createElement to easily
   * create an HTML element with classes.
   *
   * Could be extended in the future with more options
   *
   * @param {Lowercase<HTMLElement.tagName>} tagName - The tag name to create
   * @param {Object} options - Optional settings
   * @param {string[]} [options.classes=[]] - List of classes to add to the element
   * @param {string} [options.innerHTML] - Inner html to add to the element
   * @returns
   */
  static createElement(tagName, { classes = [], innerHTML } = {}) {
    const element = document.createElement(tagName);
    element.classList.add(...classes);

    if (innerHTML) element.innerHTML = innerHTML;

    return element;
  }

  /**
   * Returns a string with the first letter capitalized.
   * @param {string} string - The string to capitalize
   * @returns {string} The capitalized string
   */
  static capFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
