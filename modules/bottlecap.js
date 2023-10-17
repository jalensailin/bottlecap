/* global game randomID */

export default class BottleCap {
  static ID = "bottlecap";

  static FLAG = "bottleCapList";

  static createBottleCap(
    data = {
      name: "Bottle Cap!",
      img: `/icons/commodities/tech/cog-large-steel-white.webp`,
      spent: false,
    },
  ) {
    const baseObject = {
      ...data,
      id: randomID(),
    };

    const newBottleCap = {
      [baseObject.id]: baseObject,
    };

    return game.user.setFlag(BottleCap.ID, BottleCap.FLAG, newBottleCap);
  }

  static updateBottleCap(id, data = {}) {
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
}
