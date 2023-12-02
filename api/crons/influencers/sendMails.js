'use strict';
const settings = require('../../config/settings')
// Define cron
module.exports = (cron) => {


  cron.enabled = true;
  // cron.period = '00 00 1 * *';
  // cron.period = '1 * * * * * *';
  cron.period = '*/30 * * * *';

  /**
   * 
   * The license driver time expires 
   * 
  */
  return async () => {

    try {
      console.log("CRON SEND MAIL", cron.lib.moment().format('HH:mm:ss'))
      let filters = {
        enabled: true
      };

      let influencers = JSON.parse(JSON.stringify(await global.modules.v1.influencers.model.find(filters)))
      // console.log("?> ", influencers);

      let config = await global.modules.v1.configs.model.findOne();
      let templates = await global.modules.v1.templates.model.findOne();

      // const actualDate = cron.lib.moment();
      // // Resta un mes al momento actual
      // const lastMonth = actualDate.subtract(1, 'months');
      // // Obtiene el primer día del mes anterior
      // const firstDayOfLastMonth = lastMonth.startOf('month');
      // // Obtiene el último día del mes anterior
      // const lastDayOfLastMonth = lastMonth.endOf('month');

      let subs;
      let title;
      let mail;
      for (let influencer of influencers) {
        // monthly subscriptions
        subs = await global.modules.v1.subscriptionPayments.model.find({
          $and: [
            {
              periodFrom: { "$gte": cron.lib.moment().subtract(1, 'months').startOf('month') },
            },
            {
              periodFrom: { "$lte": cron.lib.moment().subtract(1, 'months').endOf('month') },
            },
            {
              influencer: influencer.id

            }
          ]
        })

        if (subs.length) {
          title = templates.titlePositive;
          mail = templates.positiveMail;
        } else {
          title = templates.titleNegative;
          mail = templates.negativeMail;
        }
        mail = `<div style="width: 683px">${mail}</div>`;
        mail = mail.replace('(FULLNAME)', influencer.fullName);
        mail = mail.replace('(DATE)', cron.lib.moment().subtract(1, 'months').format('MM YYYY'));
        mail = mail.replace('(SUBS)', subs.length);
        mail = mail.replace('(REVENUE)', subs.length * config.commission);


        await global.helpers.mail.send({
          email: influencer.emailAddress,
          subject: title,
          html: mail
        })
      }


    } catch (error) {
      console.error('Cron "influencers.sendMails" response error:', error);
    }

  };
};
