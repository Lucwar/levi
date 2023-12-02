'use strict';

module.exports = helper => {

  /**
   * Create document
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} model - Model
   * @return {Promise}
   */
  return (req, res, model) => {
    return new Promise(async (resolve, reject) => {
      const data = await model.create(req.body)
        .catch(error => {
          const errors = error.name === 'ValidationError'
            ? Object.entries(error.errors).reduce((prev, [key, value]) => {
              prev[key] = value.message;
              return prev;
            }, {})
            : error.errors;

          reject({ status: 400, error: { errors, message: error.message || 'ERROR.0: Ocurrió un error inesperado' } });
        });

      helper.lib.bouncer.duplicates.reset(req);

      resolve({ data });
    });
  };
};