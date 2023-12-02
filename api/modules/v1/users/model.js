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
      fullName: { type: String, required: true },
      emailAddress: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      roles: [
        {
          type: String,
          allowNull: false,
          enum: ["user"],
        },
      ],
      enabled: { type: Boolean, default: true },
      recoverPasswordID: { type: String },
      recoverPasswordDateTime: { type: String },
      refreshToken: { type: String },
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

  });
};
