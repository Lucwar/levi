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
    return new Promise((resolve, reject) => {
      try {

        if (!req.body.username) return reject(helper.lib.httpError(401, 'ERROR.L0: Por favor, introduzca un nombre de usuario'));

        model
          .findOne({ username: req.body.username.toLowerCase() })
          .then(result => {

            const ERROR = 'ERROR.L1: Usuario o contraseña incorrecta';

            if (!result) return reject(helper.lib.httpError(401, ERROR));

            if (!result.password && !req.body.loginSocial) return reject(helper.lib.httpError(401, 'ERROR.L2: El usuario aún no ha creado una contraseña'));

            if (!req.body.loginSocial && (!req.body.password || !helper.lib.bcrypt.compareSync(req.body.password, result.password))) return reject(helper.lib.httpError(401, ERROR));

            if (!result.enabled) return reject(helper.lib.httpError(401, 'ERROR.L3: Su usuario ha sido deshabilitado'));

            const user = result.toJSON();

            user.accessToken = helper.lib.jsonwebtoken.sign({ roles: user.roles, id: user.id }, helper.settings.token.access, { expiresIn: helper.settings.token.expiresIn.access });
            user.refreshToken = global.helpers.security.decrypt(user.id, 'refreshToken', user.refreshToken);

            helper.lib.bouncer.bruteForce.reset(req);

            resolve({ data: user });

          }).catch(e => reject(helper.lib.httpError(401, e.message || 'ERROR.0: Ocurrió un error inesperado')));

      } catch (error) {
        console.error('Helper "database.login" response error');
        console.error(error);
        reject(error);
      }
    });
  };
};
