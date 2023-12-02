'use strict';

// Define cron
module.exports = (cron) => {


  cron.enabled = false;
  cron.period = '0 * * * * * *';


  return async () => {

    try {


    } catch (error) {
      console.error('Cron "emergencies.stopGeolocation" response error:', error);
    }

  };


};
