'use strict';

// Define module
module.exports = (helper) => {

  /**
   * Create conversation
   *
   * @param {Object} params - Parameters
   * @return {Promise}
   */
  return (params, model) => {
    return new Promise((resolve, reject) => {
      try {
        global.modules.v1.messages.model.create(params)
          .then(async data => {

            data = await data.populate('reply').execPopulate();

            global.modules.v1.conversations.model.findOneAndUpdate({ _id: data.conversation }, { lastMessage: data._id, deletedBy: [] })
              .then(result => resolve(data))
              .catch(error => reject(helper.lib.httpError(400, error.message || 'ERROR.0: Ocurrió un error inesperado')));

          }).catch(error => reject(helper.lib.dbError(404, error.message || 'ERROR.0: Ocurrió un error inesperado')));

      } catch (error) {
        console.error('Helper "chat.createMessage" response error');
        console.error(error);
        reject(error);
      }
    });
  };
};
