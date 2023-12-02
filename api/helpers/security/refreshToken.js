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

        const token = req.headers['x-refresh-token'];

        if (!token) return reject(helper.lib.httpError(401, 'ERROR.A0: No se encuentra token'));

        let user = null;

        try {
          user = helper.lib.jsonwebtoken.verify(token, helper.settings.token.refresh);
        } catch (error) {
          return reject(helper.lib.httpError(401, 'ERROR.A1: Token inválido'));
        }

        if (!user) return reject(helper.lib.httpError(401, 'ERROR.A1: Token inválido'));

        for (const Role of helper.settings.token.roles) {
          if (user.roles.some(role => Role.values.includes(role))) req.user = await global.modules.v1[Role.model].model.findOne({ _id: user.id });
        }

        if (!req.user) return reject(helper.lib.httpError(401, 'ERROR.A2: Su usuario no se encuentra registrado'));
        if (!req.user.enabled) return reject(helper.lib.httpError(401, 'ERROR.A3: Su usuario ha sido deshabilitado'));

        resolve(helper.lib.jsonwebtoken.sign({ roles: user.roles, id: user.id }, helper.settings.token.access, { expiresIn: helper.settings.token.expiresIn.access }));

      } catch (error) {
        console.error('Helper "security.refreshToken" response error');
        console.error(error);
        reject(error);
      }
    });
  };
};
