'use strict';

// Define module
module.exports = (helper) => {

  /**
   * Find
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
        let sort = {};
        let query = {};
        let queryExtra = {};
        let projection = {};
        let select = '';
        let populates = [];
        let page = queryParams._page || 0;
        let perPage = queryParams._perPage || 0;

        if (req._filtersExtra) {
          queryExtra = req._filtersExtra;
        }

        if (queryParams._sort) {
          sort = JSON.parse(queryParams._sort);
        }

        if (queryParams._projection) {
          projection = JSON.parse(queryParams._projection);
        }

        if (queryParams._filters) {
          query = JSON.parse(queryParams._filters);
        }

        if (queryParams._query) {
          query = JSON.parse(queryParams._query);
        }

        if (req.deleteFilters) {
          if (req.deleteFilters.fullName) delete query.fullName;
          if (req.deleteFilters.name) delete query.name;
        }

        if (req.addFilters) {
          query = {
            ...query,
            ...req.addFilters
          }
        }

        if (query.name) {
          query.name = new RegExp(query.name, 'i');
        }

        if (query.lastName) {
          query.lastName = new RegExp(query.lastName, 'i');
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
          query: Object.assign({}, query, queryExtra),
          projection,
          select,
          populates,
          sort,
          page,
          perPage
        };

        global.helpers.databaseUtils[findOne ? 'findOne' : 'find'](params, model)
          .then(result => {
            resolve(result);
          })
          .catch(error => {
            reject(helper.lib.httpError(404, error.message || 'ERROR.0: Ocurrio un error inesperado'));
          });

      } catch (error) {
        console.error('Helper "database.find" response error');
        reject(error);
      }
    });
  };
};
