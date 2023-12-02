'use strict';

// Define module
module.exports = (helper) => {

  /**
   * Find by id
   *
   * @param {Object} params - Parameters
   * @param {Object} model - Model
   * @return {Promise}
   */
  return (params, model) => {
    return new Promise((resolve, reject) => {
      try {

        model
          .findById(params.id, params.projection || [])
          .select(params.select || {})
          .populate(params.populates || [])
          .then(data => {
            if (data) {
              resolve({ data });
            } else {
              reject(helper.lib.dbError(error.code || -1001, error.message || 'ERROR.1: No se encuentra la entidad'));
            }
          })
          .catch(error => {
            reject(helper.lib.dbError(error.code || -1000, error.message || 'ERROR.0: Ocurrió un error inesperado'));
          });

      } catch (error) {
        console.error(error);
        console.error('Helper "databaseUtils.findById" response error');
        reject(error);
      }
    });
  };
};
