/* global Hooks game randomID */

class BottleCap {
  static ID = "bottlecap";

  static FLAG = "bottleCapList";

  static createBottleCap(
    data = { name: "Bottle Cap!", img: "", spent: false },
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

Hooks.once("init", () => {
  game.bottlecap = BottleCap;
  console.log(BottleCap.ID);
});
