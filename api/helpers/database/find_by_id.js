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

        const urlParts = helper.lib.url.parse(req.url, true);
        const queryParams = urlParts.query;

        let findOne = queryParams._findOne;
        let projection, query = {};
        let select = '';
        let populates = [];

        if (queryParams._filters) {
          query = JSON.parse(queryParams._filters);
        }

        if (queryParams._projection) {
          projection = JSON.parse(queryParams._projection);
        }

        if (queryParams._populates) {
          populates = JSON.parse(queryParams._populates);
        }

        if (queryParams._select) {
          select = JSON.parse(queryParams._select);
        }

        if (req.body.selectExtra) {
          select += " " + req.body.selectExtra;
        }

        const params = {
          id: req.params.id,
          projection,
          select,
          query,
          populates
        };

        global.helpers.databaseUtils[findOne ? 'findOne' : 'findById'](params, model)
          .then(result => resolve(result))
          .catch(error => reject(helper.lib.httpError(404, error.message || 'ERROR.0: Ocurrio un error inesperado')));

      } catch (error) {
        console.error('Helper "database.findById" response error');
        console.error(error);
        reject(error);
      }
    });
  };
};
