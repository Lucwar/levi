'use strict';

// Define module
module.exports = (helper) => {

  /**
   * Select
   *
   * @param {Object} req - Request
   * @return {Promise}
   */
  return (action) => {
    return new Promise( async (resolve, reject) => {
      try {
        
        const Action = await global.modules.v1.actions.model.create(action);

        helper.lib.eventEmitter.emit('send-actions', Action.user.toString());

        resolve(Action);
        
      } catch(error) {
        console.error('Helper "actions.notify" response error');
        console.error(error);
        reject(error);
      }
    });
  };
};
