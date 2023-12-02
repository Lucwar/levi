"use strict";

// Define schema
module.exports = (module) => {
  /**
   * Schema
   */
  module.schema = new global.database.mongodb.mongoose.Schema(
    {
      id: { type: String },
      username: { type: String, required: true, unique: true },
      picture: { type: String },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      fullName: { type: String, required: true },
      emailAddress: { type: String, required: true, unique: true },
      country: { type: String },
      codeCountry: { type: String },
      dialCountry: { type: String },
      phoneNumber: { type: String, unique: true, required: true },
      password: { type: String, required: true },

      geolocation: { type: Boolean, default: false },
      sendingGeolocation: { type: Boolean, default: false },
      geolocationTime: { type: Number, default: 1 },
      lastGeolocation: { type: Date },
      language: { type: String, enum: ["es", "en"], default: "es" },

      address: { type: String },
      addressGoogle: { type: String },
      location: {
        type: {
          type: String,
          default: "Point",
        },
        coordinates: {
          type: [Number], //coordinates: [-104.9903, 39.7392] longitude first and then latitude
        },
      },
      roles: [
        {
          type: String,
          allowNull: false,
          enum: ["user"],
        },
      ],
      enabled: { type: Boolean, default: true },

      subscriptionStatus: {
        type: String,
        allowNull: false,
        enum: ["activate", "initial", "inactive"],
        default: "initial",
      },
      recoverPasswordID: { type: String },
      recoverPasswordDateTime: { type: String },
      refreshToken: { type: String },
      gmt: { type: String, default: "-3:00" },

      phoneNumberValidated: { type: Boolean, default: false },
      phoneNumberValidationCode: { type: String },
      phoneNumberValidationID: { type: String },
      accountDeleted: { type: Boolean, default: false },

    },
    { timestamps: true }
  );

  module.schema.post("validate", (doc) => {
    const role = "user";
    if (!doc.roles.includes(role)) doc.roles.push(role);

    const token = module.lib.jsonwebtoken.sign(
      { roles: doc.roles, id: doc._id },
      module.settings.token.refresh
    );
    doc.refreshToken = global.helpers.security.encrypt(
      doc._id,
      "refreshToken",
      token
    );

    doc.phoneNumberValidationCode = global.helpers.security.encrypt(doc._id, 'phoneNumberValidation', (Math.floor(Math.random() * 90000) + 10000).toString());
  });
};
