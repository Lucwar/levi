'use strict';

// Define module
module.exports = helper => {
  /**
   * Select
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} model - Model
   * @return {Promise}
   */
  return (filter, model) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await model.findOne(filter);

        if (!user) return reject({ message: 'ERROR.RP0: Usuario no existe' });

        const code = helper.lib.uuid.v4();

        user.recoverPasswordDateTime = helper.lib.moment().format();
        user.recoverPasswordID = helper.lib.bcrypt.hashSync(code, helper.settings.crypto.saltRounds);
        await user.save();

        const role = user.roles[0];

        const link = `${helper.settings.recoverPassword.host}/recover-password/${role}/${user._id}/${code}`;

        const transporter = helper.lib.nodemailer.createTransport(helper.settings.nodemailer.transporter);
        const mailOptions = {
          from: helper.settings.nodemailer.mailOptions.from,
          subject: process.env.PROJECT_NAME + ' ' + await global.helpers.translations.translate('recoverPassword', [], user.language),
          to: user.emailAddress,
          html: `<div>
            <h1>${await global.helpers.translations.translate('recoverPassword', [], user.language)}</h1>
            <p>${await global.helpers.translations.translate('recoverPasswordLink', [link], user.language)}</p>
          </div>`
        };

        transporter.sendMail(mailOptions, (error, info) => (error ? reject(error) : resolve({})));
      } catch (error) {
        console.error('Helper "database.recoveryPassword" response error');
        console.error(error);
        reject(error);
      }
    });
  };
};
