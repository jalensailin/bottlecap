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

  static createBottleCap(data) {
    const baseObject = {
      ...data,
      id: randomID(),
    };

    const newBottleCap = {
      [baseObject.id]: baseObject,
    };

    return game.user.setFlag(BottleCap.ID, BottleCap.FLAG, newBottleCap);
  }

  static updateBottleCap(data = {}) {
    const { id } = data;
    const updatedCap = {
      [id]: data,
    };

    return game.user.setFlag(BottleCap.ID, BottleCap.FLAG, updatedCap);
  }

  static deleteBottleCap(id) {
    const deletedCap = {
      [`-=${id}`]: null,
    };

    return game.user.setFlag(BottleCap.ID, BottleCap.FLAG, deletedCap);
  }

  static spendBottleCap(id) {
    const updatedCap = {
      [id]: {
        spent: true,
      },
    };
    return game.user.setFlag(BottleCap.ID, BottleCap.FLAG, updatedCap);
  }
}
