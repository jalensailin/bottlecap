/* global Hooks game randomID FormApplication mergeObject */

// eslint-disable-next-line max-classes-per-file
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

Hooks.on("renderPlayerList", (playerList) => {
  // All of this is jquery stuff.
  const playersHeader = playerList.element.find("h3");
  const bottleCapNumber = Object.keys(
    game.user.getFlag(BottleCap.ID, BottleCap.FLAG),
  ).length;

  const button = `<button type='button' class='flexrow flex0 bottlecap-button'>${bottleCapNumber}<i class='fas fa-tasks'></i></button>`;
  playersHeader.addClass("flexrow");
  playersHeader.append(button);

  playersHeader.on("click", "button", (event) => {
    event.stopPropagation();
  });
});
