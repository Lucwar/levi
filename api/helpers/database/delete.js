'use strict';

module.exports = (helper) => {

  /**
   * Delete document
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} model - Model
   * @return {Promise}
   */
  return (req, res, model) => {
    return new Promise(async (resolve, reject) => {
      const data = await model.findOneAndRemove({ _id: req.params.id }, { useFindAndModify: false })
        .catch(error => reject(helper.lib.httpError(400, error.message || 'ERROR.0: Ocurrió un error inesperado')));

      if (!data) reject(helper.lib.httpError(404, 'ERROR.1: No se encontró la entidad'));

      resolve({ data });
    });
  };
};
