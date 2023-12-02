'use strict';

// Define module
module.exports = (helper) => {

  /**
   * Select
   *
   * @param {Object} req - Request
   * @return {Promise}
   */
  return (params) => {
    return new Promise((resolve, reject) => {
      try {
        console.log(params);
        let notification = {
          app: helper.settings.push.appId,
          forAll: true,
          title: params.title,
          message: params.message,
          type: "1",
          usersApp: params.usersApp
        };

        if (params.usersApp) {
          notification.usersApp = params.usersApp;
          notification.forAll = false;
        }

        if (params.sound) notification.sound = params.sound;

        if (params.channel) notification.channel = params.channel;

        if (params.action) {
          notification.action = params.action;
          notification.payload = params.payload;
        }

        helper.lib.trae.post(helper.settings.push.url, notification)
          .then(async response => {

            if (params.action && params.usersApp) for (const user of params.usersApp) await global.helpers.actions.notify({
              name: params.payload.action,
              type: 'push',
              user,
              performRequired: params.performRequired,
              payload: params.payload
            });

            // if (notification.usersApp[0]) await global.modules.v1.notifications.model.create({
            //   title: notification.title,
            //   body: notification.message,
            //   user: notification.usersApp[0],
            // });

            resolve({ response });

          }).catch(err => reject(helper.lib.httpError(404, err.message || 'ERROR.PN0: No se pudo enviar la notificación')))

      } catch (error) {
        console.error('Helper "push.notify" response error');
        console.error(error);
        reject(error);
      }
    });
  };
};
