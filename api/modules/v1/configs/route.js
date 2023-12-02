'use strict';

// Define module
module.exports = (module) => {

  /**
   * Find
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.get('/', global.helpers.security.auth(['administrator', 'user']), async (req, res, next) => {
    const result = await global.helpers.database.find(req, res, module.model).catch(next);

    res.send(result);
  });


  /**
   * FindById
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.get('/:id', global.helpers.security.auth(['administrator']), async (req, res, next) => {
    const result = await global.helpers.database.findById(req, res, module.model).catch(next);

    res.send(result);
  });

  /**
   * Create
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.post('/', global.helpers.security.auth(['administrator']), async (req, res, next) => {
    const result = await global.helpers.database.create(req, res, module.model).catch(next);

    res.send(result);
  });

  /**
   * CreateOrUpdate
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.post('/createOrUpdateConfig', global.helpers.security.auth(['administrator']), async (req, res, next) => {

    let configs = await global.modules.v1.configs.model.find().catch(e => console.log(e));
    let result
    if (configs.length === 0) {
      result = await global.helpers.database.create(req, res, module.model).catch(next);
    } else {
      result = await global.modules.v1.configs.model.findOneAndUpdate(configs[0].id, req.body).catch(e => console.log(e));
    }

    res.send(result);
  });

  /**
   * Update
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.put('/:id', global.helpers.security.auth(['administrator']), async (req, res, next) => {
    const result = await global.helpers.database.update(req, res, module.model).catch(next);

    res.send(result);
  });

  /**
   * Delete
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.delete('/:id', global.helpers.security.auth(['administrator']), async (req, res, next) => {
    const result = await global.helpers.database.delete(req, res, module.model).catch(next);

    res.send(result);
  });

};
