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

        const params = req.body;
        const _id = req.params.id || ''

        model.findOneAndUpdate({ _id }, params, { new: true, useFindAndModify: false, runValidators: true, context: 'query' })
          .then(data => {
            resolve({ data });
          })
          .catch(error => {
            reject(helper.lib.httpError(400, error.message || 'ERROR.0: Ocurrió un error inesperado'));
          });

      } catch (error) {
        console.error('Helper "database.update" response error');
        console.error(error);
        reject(error);
      }
    });
  };
};
