export default class BottleCap {
  static ID = "bottlecap";

  static FLAG = "bottleCapList";

  constructor(data = {}) {
    // Here we set the default bottlecap options. See `createBottleCap` below.
    this.name = data.name || game.settings.get(BottleCap.ID, "defaultName");
    this.img = data.img || game.settings.get(BottleCap.ID, "defaultImg");
    this.context =
      data.context || game.settings.get(BottleCap.ID, "defaultContext");
    this.spent = false;
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

  /**
   *
   * @param {String} userId - ID of the user to create the cap on.
   * @param {Object} [data] - data with which to create the cap.
   * @param {String} [data.name] - name of the cap.
   * @param {String} [data.img] - icon for the cap.
   * @param {String} [data.context] - What earned the user this cap.
   * @param {String} [data.spent=false] - whether or not this cap has been spent.
   * @returns
   */
  static async createBottleCap(userId, data) {
    const baseObject = {
      ...data,
      id: foundry.utils.randomID(),
    };

    const newBottleCap = {
      [baseObject.id]: baseObject,
    };

    await BottleCap.setFlag(userId, newBottleCap);
    return baseObject;
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
