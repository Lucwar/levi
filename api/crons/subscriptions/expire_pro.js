'use strict';
const settings = require('../../config/settings')
// Define cron
module.exports = (cron) => {


  cron.enabled = false;
  // cron.period = '00 12 * * *';
  cron.period = '0 * * * * * *';

  /**
   * 
   * The license driver time expires 
   * 
  */
  return async () => {

    try {
      console.log("CRON EXPIRE")
      let filters = {
        status: settings.businessRules.subscriptionStatus.activate,
        periodTo: { "$lt": cron.lib.moment() }
      };

      let subscriptionPayments = JSON.parse(JSON.stringify(await global.modules.v1.subscriptionPayments.model.find(filters)))
      // console.log("?> ", subscriptionPayments);

      for (let subscription of subscriptionPayments) {
        await global.modules.v1.users.model.updateOne({ _id: subscription.user }, { subscriptionStatus: settings.businessRules.subscriptionStatus.inactive });
      }

      await global.modules.v1.subscriptionPayments.model.update(filters, { status: settings.businessRules.subscriptionStatus.inactive })

    } catch (error) {
      console.error('Cron "subscriptionPayments.expire_pro" response error:', error);
    }

  };
};
