"use strict";
const settings = require('../../../config/settings')
// Define module
module.exports = (module) => {
  /**
   * Find
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.get(
    "/",
    (req, res, next) => {
      global.helpers.database
        .find(req, res, module.model)
        .then((result) => res.send(result))
        .catch(next);
    }
  );

  /**
   * FindById
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.get(
    "/:id",
    (req, res, next) => {
      global.helpers.database
        .findById(req, res, module.model)
        .then((result) => res.send(result))
        .catch(next);
    }
  );

  /**
  * Create
  *
  * @param {Object} req - Request
  * @param {Object} res - Response
  * @param {Object} next - Next
  * @return {void}
  */
  module.router.post("/", async (req, res, next) => {
    const response = await global.helpers.database
      .createUser(req, res, module.model)
      .catch(next);

    res.send(response);
  });

  /**
   * RefreshToken
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.post("/refreshToken", async (req, res, next) => {
    const token = await global.helpers.security
      .refreshToken(req, res, module.model)
      .catch(next);
    res.send({ data: token });
  });

  /**
   * Login
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.post("/login", async (req, res, next) => {
    const result = await global.helpers.database
      .login(req, res, module.model)
      .catch(next);

    res.send(result);
  });

  /**
   * New Password
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.put("/newPassword", (req, res, next) => {
    global.helpers.database
      .newPassword(req, res, module.model)
      .then((result) => res.send(result))
      .catch(next);
  });

  /**
   * Update
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.put(
    "/:id",
    (req, res, next) => {
      global.helpers.database
        .updateUser(req, res, module.model)
        .then((result) => res.send(result))
        .catch(next);
    }
  );

  /**
   * Change password
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.put(
    "/:id/changePassword",
    (req, res, next) => {
      global.helpers.database
        .changePassword(req, res, module.model)
        .then((result) => res.send(result))
        .catch(next);
    }
  );

  /**
   * Recover Password
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.post("/recoverPassword", (req, res, next) => {
    global.helpers.database
      .recoverPassword(req.body, module.model)
      .then((result) => res.send(result))
      .catch(next);
  });

  module.router.delete("/allDeleted", async (req, res, next) => {
    await global.modules.v1.users.model.deleteMany({});
    res.send("exito!");
  });


  /**
   * Delete
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.delete(
    "/:id",
    (req, res, next) => {
      global.helpers.database
        .delete(req, res, module.model)
        .then((result) => res.send(result))
        .catch(next);
    }
  );

};
