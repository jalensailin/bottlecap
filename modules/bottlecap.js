/* global game randomID */

export default class BottleCap {
  static ID = "bottlecap";

  static FLAG = "bottleCapList";

  constructor(data = {}) {
    this.name = data.name || `${game.i18n.localize("BC.bottleCap!")}`;
    this.img = data.img || `icons/commodities/tech/cog-large-steel-white.webp`;
    this.spent = false;
    this.context = "";
  }

  /* Helpers to set and get bottlecaps on specific users */
  static setFlag(userId, capData) {
    const user = game.users.get(userId);
    return user.setFlag(BottleCap.ID, BottleCap.FLAG, capData);
  }

  static getFlag(userId) {
    const user = game.users.get(userId);
    return user.getFlag(BottleCap.ID, BottleCap.FLAG);
  }

  /* CRUD Methods */
  static createBottleCap(userId, data) {
    const baseObject = {
      ...data,
      id: randomID(),
    };

    const newBottleCap = {
      [baseObject.id]: baseObject,
    };

    return BottleCap.setFlag(userId, newBottleCap);
  }

  static updateBottleCap(userId, data = {}) {
    const { id } = data;
    const updatedCap = {
      [id]: data,
    };

    return BottleCap.setFlag(userId, updatedCap);
  }

  static deleteBottleCap(userId, capId) {
    const deletedCap = {
      [`-=${capId}`]: null,
    };

    return BottleCap.setFlag(userId, deletedCap);
  }

  static spendBottleCap(userId, capId) {
    const spentCap = {
      [capId]: {
        spent: true,
      },
    };
    return BottleCap.setFlag(userId, spentCap);
  }

  static revivifyBottleCap(userId, capId) {
    const revivedCap = {
      [capId]: {
        spent: false,
      },
    };
    return BottleCap.setFlag(userId, revivedCap);
  }
}
