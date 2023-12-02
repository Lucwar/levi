'use strict';

// Define cron
module.exports = (cron) => {


  cron.enabled = true;
  cron.period = '0 * * * * * *';


  return async () => {

    try {


      /**
       * 
       * - Buscar emergencias de hace más de 12 horas
       * - Filtrar usuarios con geolocalización activada y que estén enviando ubicación
       * - Frenar envío de ubicación
       * - Actualizar campo sendingGeolocation
       * 
       */

      console.log('Cron "emergencies.stopGeolocation"');

      const date = cron.lib.moment().subtract(cron.settings.businessRules.emergencies.geolocationHours, 'hours').format();

      const emergencies = await global.modules.v1.emergencies.model.find({
        createdAt: { $lte: date },
        sendingGeolocation: true
      }).populate('user');

      console.log(emergencies.map(e => e._id));

      for (const emergency of emergencies) {

        if (!emergency.user.geolocation || !emergency.user.sendingGeolocation) continue;

        emergency.sendingGeolocation = false;
        await emergency.save();

        const newEmergency = await global.modules.v1.emergencies.model.findOne({
          createdAt: { $gte: date },
          sendingGeolocation: true,
          user: emergency.user._id
        });

        if (newEmergency) continue;

        console.log('-----------');
        console.log(emergency._id);
        console.log('-----------');

        await global.modules.v1.actions.model.updateMany({
          name: 'backgroundGeolocationStart',
          type: 'socket',
          user: emergency.user._id,
          performRequired: true,
          performed: false
        }, { performed: true });

        await global.helpers.actions.notify({
          name: 'backgroundGeolocationStop',
          type: 'socket',
          user: emergency.user._id,
          performRequired: true
        });
      }


    } catch (error) {
      console.error('Cron "emergencies.stopGeolocation" response error:', error);
    }

  };


};
