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

        if (!req.body.recoverPasswordID) return reject(helper.lib.httpError(404, 'ERROR.NP0: El código para restablecer su contraseña es incorrecto'));
        if (req.body.password !== req.body.passwordVerify) return reject(helper.lib.httpError(404, 'ERROR.CP0: El password nuevo y la verfificación deben coincidir'));


        const user = await model.findOne({ _id: req.body.id });

        if (!user) return reject(helper.lib.httpError(404, 'ERROR.RP0: No se encontró su usuario'));

        if (!user.recoverPasswordID) return reject(helper.lib.httpError(404, 'ERROR.NP1: El código para restablecer su contraseña ha expirado'));

        if (!helper.lib.bcrypt.compareSync(req.body.recoverPasswordID, user.recoverPasswordID)) return reject(helper.lib.httpError(404, 'ERROR.NP0: El código para restablecer su contraseña es incorrecto'));


        user.recoverPasswordID = null;
        user.recoverPasswordDateTime = null;
        user.password = helper.lib.bcrypt.hashSync(req.body.password, helper.settings.crypto.saltRounds);
        await user.save();

        resolve({});

      } catch (error) {
        console.error('Helper "database.newPassword" response error');
        console.error(error);
        reject(error);
      }
    });
  };
};
