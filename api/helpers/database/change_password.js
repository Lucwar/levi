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

        if (req.body.passwordNew != req.body.passwordNewVerify) {
          return reject(helper.lib.httpError(404, 'ERROR.CP0: La contraseña nueva y la verificación deben coincidir'));
        }

        model
          .findById(req.params.id)
          .then(async (result) => {
            if (result) {

              if (!req.body.password || !helper.lib.bcrypt.compareSync(req.body.password, result.password)) {
                return reject(helper.lib.httpError(404, 'ERROR.CP1: Contraseña incorrecta'));
              } else {
                result.password = helper.lib.bcrypt.hashSync(req.body.passwordNew, helper.settings.crypto.saltRounds);
                result = await result.save();
                resolve(result.toJSON());
              }

            } else {
              reject(helper.lib.httpError(404, 'ERROR.1: No se encontró la entidad'));
            }
          })
          .catch(error => {
            reject(helper.lib.httpError(404, error.message || 'ERROR.0: Ocurrió un error inesperado'));
          });

      } catch (error) {
        console.error('Helper "database.changePassword" response error');
        console.error(error);
        reject(error);
      }
    });
  };
};
