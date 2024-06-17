import BottleCap from "./bottlecap.js";

/* global game */

const registerSettings = () => {
  // Default Name
  game.settings.register(BottleCap.ID, "defaultName", {
    name: "BC.settings.defaultName.name", // can also be an i18n key
    hint: "BC.settings.defaultName.hint", // can also be an i18n key
    scope: "world", // "world" = sync to db, "client" = local storage
    config: true, // false if you dont want it to show in module config
    type: String, // Number, Boolean, String, or even a custom class or DataModel
    default: game.i18n.localize("BC.settings.defaultName.defaultValue"),
    requiresReload: false, // when changing the setting, prompt the user to reload
  });

  // Default Image
  game.settings.register(BottleCap.ID, "defaultImg", {
    name: "BC.settings.defaultImg.name", // can also be an i18n key
    hint: "BC.settings.defaultImg.hint", // can also be an i18n key
    scope: "world", // "world" = sync to db, "client" = local storage
    config: true, // false if you dont want it to show in module c  onfig
    type: String, // Number, Boolean, String, or even a custom class or DataModel
    default: "modules/bottlecap/assets/bottlecap-icon-log.webp",
    filePicker: true, // set true with a String `type` to use a file picker input,
    requiresReload: false, // when changing the setting, prompt the user to reload
  });

  // Default Context
  game.settings.register(BottleCap.ID, "defaultContext", {
    name: "BC.settings.defaultContext.name", // can also be an i18n key
    hint: "BC.settings.defaultContext.hint", // can also be an i18n key
    scope: "world", // "world" = sync to db, "client" = local storage
    config: true, // false if you dont want it to show in module config
    type: String, // Number, Boolean, String, or even a custom class or DataModel
    default: game.i18n.localize("BC.settings.defaultContext.defaultValue"),
    requiresReload: false, // when changing the setting, prompt the user to reload
  });

  // User Role Permissions
  const localizedRoleNames = {
    // Localize the role names. If this object already exists in Foundry, I coudln't find it.
    0: game.i18n.localize("USER.RoleNone"),
    1: game.i18n.localize("USER.RolePlayer"),
    2: game.i18n.localize("USER.RoleTrusted"),
    3: game.i18n.localize("USER.RoleAssistant"),
    4: game.i18n.localize("USER.RoleGamemaster"),
  };
  game.settings.register(BottleCap.ID, "manageOwnPermissions", {
    name: "BC.settings.manageOwnPermissions.name", // can also be an i18n key
    hint: "BC.settings.manageOwnPermissions.hint", // can also be an i18n key
    scope: "world", // "world" = sync to db, "client" = local storage
    config: true, // false if you dont want it to show in module config
    type: String, // Number, Boolean, String, or even a custom class or DataModel
    choices: localizedRoleNames,
    default: "1",
    requiresReload: false, // when changing the setting, prompt the user to reload
  });

  // Default Context
  game.settings.register(BottleCap.ID, "chatMessageCapName", {
    name: "BC.settings.chatMessageCapName.name", // can also be an i18n key
    hint: "BC.settings.chatMessageCapName.hint", // can also be an i18n key
    scope: "world", // "world" = sync to db, "client" = local storage
    config: true, // false if you dont want it to show in module config
    type: String, // Number, Boolean, String, or even a custom class or DataModel
    default: game.i18n.localize("BC.settings.chatMessageCapName.defaultValue"),
    requiresReload: false, // when changing the setting, prompt the user to reload
  });
};

export default registerSettings;
