'use strict';

// Define module
module.exports = (helper) => {

  /**
   * Select
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} model - Model
   * @return {Promise}
   */
  return (req, res, model) => {
    return new Promise(async (resolve, reject) => {
      try {

        const { token, resetPIN } = req.body;
        let user = null;

        if (!token) return reject(helper.lib.httpError(401, 'ERROR.A0: No se encuentra token'));

        try {
          user = helper.lib.jsonwebtoken.verify(token, helper.settings.token.magicLink);
        } catch (error) {
          return reject(helper.lib.httpError(401, 'ERROR.A1: Token inválido'));
        }

        if (!user) return reject(helper.lib.httpError(401, 'ERROR.A1: Token inválido'));

        for (const Role of helper.settings.token.roles) {
          if (user.roles.some(role => Role.values.includes(role))) user = await global.modules.v1[Role.model].model.findOne({ _id: user.id });
        }

        if (!user) return reject(helper.lib.httpError(401, 'ERROR.A2: Su usuario no se encuentra registrado'));
        if (!user.enabled) return reject(helper.lib.httpError(401, 'ERROR.A3: Su usuario ha sido deshabilitado'));

        if (resetPIN) {
          user.pin = null
          user.pinEnabled = false;
          await user.save();
        }

        user = user.toJSON();

        user.accessToken = helper.lib.jsonwebtoken.sign({ roles: user.roles, id: user.id }, helper.settings.token.access, { expiresIn: helper.settings.token.expiresIn.access });
        user.refreshToken = global.helpers.security.decrypt(user.id, 'refreshToken', user.refreshToken);

        helper.lib.bouncer.bruteForce.reset(req);

        resolve({ data: user });

      } catch (error) {
        console.error('Helper "database.login" response error');
        console.error(error);
        reject(error);
      }
    });
  };
};
