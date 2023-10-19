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
  static createBottleCap(data) {
    const baseObject = {
      ...data,
      id: randomID(),
    };

    const newBottleCap = {
      [baseObject.id]: baseObject,
    };

    return BottleCap.setFlag(game.user.id, newBottleCap);
  }

  static updateBottleCap(data = {}) {
    const { id } = data;
    const updatedCap = {
      [id]: data,
    };

    return BottleCap.setFlag(game.user.id, updatedCap);
  }

  static deleteBottleCap(id) {
    const deletedCap = {
      [`-=${id}`]: null,
    };

    return BottleCap.setFlag(game.user.id, deletedCap);
  }

  static spendBottleCap(id) {
    const spentCap = {
      [id]: {
        spent: true,
      },
    };
    return BottleCap.setFlag(game.user.id, spentCap);
  }

  static revivifyBottleCap(id) {
    const revivedCap = {
      [id]: {
        spent: false,
      },
    };
    return BottleCap.setFlag(game.user.id, revivedCap);
  }
}
