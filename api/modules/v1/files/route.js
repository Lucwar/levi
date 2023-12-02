'use strict';

// Define module
module.exports = (module) => {

    /**
     * Upload
     *
     * @param {Object} req - Request
     * @param {Object} res - Response
     * @param {Object} next - Next
     * @return {void}
     */
    module.router.post('/upload', (req, res, next) => {
      global.helpers.files.upload(req, res, module.model)
        .then(result => {
          res.send(result);
        })
        .catch(next);
    });

    /**
     * Delete
     *
     * @param {Object} req - Request
     * @param {Object} res - Response
     * @param {Object} next - Next
     * @return {void}
     */
    module.router.delete('/delete', (req, res, next) => {
      global.helpers.files.delete(req, res, module.model)
        .then(result => {
          res.send(result);
        })
        .catch(next);
    });

};
