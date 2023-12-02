"use strict";
const moment = require("moment/moment");

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
  module.router.get("/", (req, res, next) => {
    global.helpers.database
      .find(req, res, module.model)
      .then((result) => res.send(result))
      .catch(next);
  });

  /**
   * FindById
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.get("/:id", (req, res, next) => {
    global.helpers.database
      .findById(req, res, module.model)
      .then((result) => res.send(result))
      .catch(next);
  });

  /**
   * FindMessages
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.get(
    "/emergency/:emergencyId/:userId/:guardId",
    async (req, res, next) => {
      let emergencyId = req.params.emergencyId;
      let userId = req.params.userId;
      let guardId = req.params.guardId;
      let messages = [];

      let conversation = JSON.parse(
        JSON.stringify(
          await module.model
            .findOne({
              $or: [{ users: [userId, guardId] }, { users: [guardId, userId] }],
            })
            .catch(next)
        )
      );

      let emergencyMessage = await global.modules.v1.messages.model
        .findOne({ conversation: conversation.id, emergency: emergencyId })
        .catch(next);

      // todos los mensajes despues del horario de la emergencia
      await global.modules.v1.messages.model
        .find({
          conversation: conversation.id,
          $and: [
            { createdAt: { $gte: emergencyMessage.createdAt } },
            {
              createdAt: {
                $lte: moment(emergencyMessage.createdAt).add(24, "hours"),
              },
            },
          ],
        })
        .then((result) => {
          messages = messages.concat(result);
        })
        .catch(next);

      res.send({ data: messages });
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
      .create(req, res, module.model)
      .catch(next);
    res.send(response);
  });

  /**
   * Update
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.put("/:id", (req, res, next) => {
    global.helpers.database
      .update(req, res, module.model)
      .then((result) => res.send(result))
      .catch(next);
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
    global.helpers.security.auth(["administrator"]),
    (req, res, next) => {
      global.helpers.database
        .delete(req, res, module.model)
        .then((result) => res.send(result))
        .catch(next);
    }
  );
};
