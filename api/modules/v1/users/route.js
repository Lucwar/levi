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
    global.helpers.security.auth(["administrator", "user"]),
    (req, res, next) => {
      global.helpers.database
        .find(req, res, module.model)
        .then((result) => res.send(result))
        .catch(next);
    }
  );

  /**
   * Find
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.get(
    "/contacts",
    global.helpers.security.auth(["administrator", "user"]),
    (req, res, next) => {
      global.helpers.database
        .find(req, res, module.model)
        .then((result) => res.send(result))
        .catch(next);
    }
  );

  /**
   * infoUserAndGuars
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.get(
    "/infoUserAndGuars",
    global.helpers.security.auth(["administrator", "user"]),
    async (req, res, next) => {
      let user = await global.helpers.database
        .find(req, res, module.model)
        .catch(next);

      // console.log("?> ", JSON.parse(req.query._filters)._id, settings.businessRules.statusGuards.accepted)
      let guards = await global.modules.v1.guards.model
        .find({ user: JSON.parse(req.query._filters)._id, status: settings.businessRules.statusGuards.accepted })
        .catch((e) => console.log(e));

      user = JSON.parse(JSON.stringify(user.data));
      // console.log("?> ", guards)
      user.guards = guards.map(g => g._id);

      // console.log("?> ", user)

      res.send({ data: user })
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
    global.helpers.security.auth(["administrator", "user"]),
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

    const result = await global.helpers.database.createUser(req, res, module.model).catch(next);

    const phoneNumberValidationCode = global.helpers.security.decrypt(result.data.id, 'phoneNumberValidation', result.data.phoneNumberValidationCode);

    // await module.lib.twilioClient.messages.create({
    //   body: `Código de verificación de PRISUS: ${phoneNumberValidationCode}`,
    //   from: module.settings.twilio.phoneNumber,
    //   to: result.data.dialCountry + result.data.phoneNumber
    // }).catch(e => console.log(e));


    // await global.helpers.mail.send({
    //   email: result.data.emailAddress,
    //   subject: 'PRISUS - Código de Verificación',
    //   html: `<div>Código de verificación de PRISUS: ${phoneNumberValidationCode}</div>`
    // }).catch(e => console.log(e));


    const verification = await module.lib.twilioClient.verify.v2.services(module.settings.twilio.serviceSID).verifications.create({
      customCode: phoneNumberValidationCode,
      to: result.data.dialCountry + result.data.phoneNumber,
      channel: 'sms'
    }).catch(e => console.log(e));


    await module.model.updateOne({ _id: result.data.id }, { phoneNumberValidationID: verification.sid }).catch(e => console.log(e));


    res.send(result);
  });

  /**
   * Create
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.post('/resendPhoneNumberCode', global.helpers.security.auth(['user']), module.lib.bouncer.smsResend.block, async (req, res, next) => {

    const phoneNumberValidationCode = global.helpers.security.decrypt(req.user._id.toString(), 'phoneNumberValidation', req.user.phoneNumberValidationCode);

    // await module.lib.twilioClient.messages.create({
    //   body: `Código de verificación de PRISUS: ${phoneNumberValidationCode}`,
    //   from: module.settings.twilio.phoneNumber,
    //   to: req.user.dialCountry + req.user.phoneNumber
    // }).catch(next);

    // await global.helpers.mail.send({
    //   email: req.user.emailAddress,
    //   subject: 'PRISUS - Código de Verificación',
    //   html: `<div>Código de verificación de PRISUS: ${phoneNumberValidationCode}</div>`
    // }).catch(e => console.log(e));

    const verification = await module.lib.twilioClient.verify.v2.services(module.settings.twilio.serviceSID).verifications.create({
      customCode: phoneNumberValidationCode,
      to: req.user.dialCountry + req.user.phoneNumber,
      channel: 'sms'
    }).catch(e => console.log(e));


    await module.model.updateOne({ _id: req.user._id }, { phoneNumberValidationID: verification.sid }).catch(e => console.log(e));

    res.send({});
  });

  /**
   * Create
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.post('/validatePhoneNumberCode', global.helpers.security.auth(['user']), async (req, res, next) => {

    const phoneNumberValidationCode = global.helpers.security.decrypt(req.user._id.toString(), 'phoneNumberValidation', req.user.phoneNumberValidationCode);

    if (req.body.code !== phoneNumberValidationCode) return next({ message: 'Código de verificación incorrecto' });

    req.user.phoneNumberValidated = true;
    await req.user.save();

    res.send({ data: req.user });

    await module.lib.twilioClient.verify.v2.services(module.settings.twilio.serviceSID).verifications(req.user.phoneNumberValidationID).update({ status: 'approved' }).catch(e => console.log(e));
  });

  /**
   * VerificationUserDuplicated
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.post("/verificationUserDuplicated", async (req, res, next) => {
    const emailAddress = req.body.emailAddress;
    const dialCountry = req.body.dialCountry;
    const phoneNumber = req.body.phoneNumber;

    const repeatUser = await global.modules.v1.users.model
      .find({
        $or: [
          { emailAddress: emailAddress },
          { dialCountry: dialCountry, phoneNumber: phoneNumber },
        ],
      })
      .catch((e) => console.log(e));

    if (repeatUser.length > 0) {
      return next(
        module.lib.httpError(
          404,
          "Posees un email o un numero de telofono repetido"
        )
      );
    }

    // const result = await global.helpers.database
    //   .createUser(req, res, module.model)
    //   .catch(next);

    res.send({});
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

    if (result && result.data && result.data.status === "unsubscribed") return next({ message: "Su cuenta ha sido eliminada" });

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
   * Delete Account
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.put('/deleteAccount', global.helpers.security.auth(['user']), async (req, res, next) => {

    await global.modules.v1.guards.model.deleteMany({ $or: [{ user: req.user._id }, { guard: req.user._id }] }).catch(next);

    await module.model.updateOne({ _id: req.user._id }, {
      accountDeleted: true,
      emailAddress: 'USER_ACCOUNT_DELETED_' + req.user._id,
      username: 'USER_ACCOUNT_DELETED_' + req.user._id,
      phoneNumber: 'USER_ACCOUNT_DELETED_' + req.user._id,

      deletedAt: Date.now()
    }).catch(next);


    res.send({});
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
    global.helpers.security.auth(["administrator", "user"]),
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
    global.helpers.security.auth(["administrator", "user"]),
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

  module.router.delete("/allDeleted", global.helpers.security.auth(["administrator", "user"]), async (req, res, next) => {
    await global.modules.v1.users.model.deleteMany({});
    await global.modules.v1.subscriptionPayments.model.deleteMany({});
    await global.modules.v1.guards.model.deleteMany({});
    await global.modules.v1.emergencies.model.deleteMany({});
    await global.modules.v1.messages.model.deleteMany({});
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
    global.helpers.security.auth(["administrator", "user"]),
    (req, res, next) => {
      global.helpers.database
        .delete(req, res, module.model)
        .then((result) => res.send(result))
        .catch(next);
    }
  );

};
